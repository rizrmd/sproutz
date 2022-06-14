GOOS=windows GOARCH=amd64 go build -o ../src-tauri/go/main-x86_64-pc-windows-msvc.exe

GOOS=darwin GOARCH=amd64 go build -o ../src-tauri/go/main-x86_64-apple-darwin

GOOS=darwin GOARCH=arm64 go build -o ../src-tauri/go/main-aarch64-apple-darwin

GOOS=linux GOARCH=amd64 go build -o ../src-tauri/go/main-x86_64-unknown-linux-gnu
