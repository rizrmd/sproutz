package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
	"github.com/tidwall/gjson"
)

// Serve from a public directory with specific index
type spaHandler struct {
	publicDir string // The directory from which to serve
	indexFile string // The fallback/default file to serve
	srv       *http.Server
}

// Falls back to a supplied index (indexFile) when either condition is true:
// (1) Request (file) path is not found
// (2) Request path is a directory
// Otherwise serves the requested file.
func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	p := filepath.Join(h.publicDir, filepath.Clean(r.URL.Path))

	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1, and no-cache for IE6
	w.Header().Set("Pragma", "no-cache")                                   // HTTP 1.0 released 1997, for IE6, some robots, wget, maybe some old mobile
	w.Header().Set("Expires", "0")
	if info, err := os.Stat(p); err != nil {
		http.ServeFile(w, r, filepath.Join(h.publicDir, h.indexFile))
		return
	} else if info.IsDir() {
		http.ServeFile(w, r, filepath.Join(h.publicDir, h.indexFile))
		return
	}

	http.ServeFile(w, r, p)
}

// Returns a request handler (http.Handler) that serves a single
// page application from a given public directory (publicDir).
func SpaHandler(publicDir string, indexFile string) *spaHandler {
	return &spaHandler{publicDir: publicDir, indexFile: indexFile}
}

func main() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	srv := startServer()
	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}

				if event.Op&fsnotify.Write == fsnotify.Write {
					if srv != nil {
						err := srv.Close()
						if err == nil {
							srv = startServer()
						} else {
							fmt.Println(err)
						}
					} else {
						srv = startServer()

					}
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	err = watcher.Add(path.Join(os.TempDir(), "sproutz.json"))
	if err != nil {
		log.Fatal(err)
	}

	<-done
}

func startServer() *http.Server {
	jsonBytes, err := os.ReadFile(path.Join(os.TempDir(), "sproutz.json"))
	if err != nil {
		return nil
	}
	json := string(jsonBytes)
	dir := gjson.Get(json, "project.path")
	port := gjson.Get(json, "port")

	handler := SpaHandler(dir.String(), "index.html")
	srv := http.Server{
		Addr:    ":" + port.String(),
		Handler: handler,
	}
	srv.Handler = handler
	ln, err := net.Listen("tcp", srv.Addr)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("listening on http://localhost" + srv.Addr)
		go srv.Serve(ln)
	}
	return &srv
}
