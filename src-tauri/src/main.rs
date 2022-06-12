#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// #[cfg(debug_assertions)]
// use tauri::Manager;

fn main() {
    let app = tauri::Builder::default()
        // .setup(|_app| {
        //     #[cfg(debug_assertions)]
        //     {
        //         let window = _app.get_window("main").unwrap();
        //         window.open_devtools();
        //     }
        //     Ok(())
        // })
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|_app_handle, event| match event {
        _ => {}
    })
}
