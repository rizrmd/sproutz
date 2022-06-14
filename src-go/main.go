package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/fsnotify/fsnotify"
	"github.com/tidwall/gjson"
)

// Serve from a public directory with specific index
type spaHandler struct {
	publicDir     string // The directory from which to serve
	indexFile     string // The fallback/default file to serve
	indexNotFound string
}

func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	p := filepath.Join(h.publicDir, filepath.Clean(r.URL.Path))

	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	if info, err := os.Stat(p); err != nil {
		if h.indexNotFound == "" {
			if !strings.Contains(r.Header.Get("accept"), "*") && !strings.Contains(r.Header.Get("accept"), "html") {
				w.WriteHeader(http.StatusNotFound)
				w.Write([]byte(h.indexNotFound))
				return
			}

			http.ServeFile(w, r, filepath.Join(h.publicDir, h.indexFile))
		} else {
			w.Header().Set("Content-Type", "text/html")
			w.Write([]byte(h.indexNotFound))
		}
		return
	} else if info.IsDir() {
		dirIndex := filepath.Join(filepath.Dir(p), "index.html")

		if _, err := os.Stat(dirIndex); err == nil {
			http.ServeFile(w, r, p)
			return
		}

		if h.indexNotFound == "" {
			http.ServeFile(w, r, filepath.Join(h.publicDir, h.indexFile))
		} else {
			w.Header().Set("Content-Type", "text/html")
			w.Write([]byte(h.indexNotFound))
		}
		return
	}

	http.ServeFile(w, r, p)
}

// Returns a request handler (http.Handler) that serves a single
// page application from a given public directory (publicDir).
func SpaHandler(publicDir string, indexFile string) *spaHandler {
	p := filepath.Join(publicDir, indexFile)
	indexNotFound := ""
	if _, err := os.Stat(p); err != nil {
		indexNotFound = WELCOME_SPROUTZ
	}
	return &spaHandler{publicDir: publicDir, indexFile: indexFile, indexNotFound: indexNotFound}
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
