#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(debug_assertions)]
use tauri::Manager;
use tauri::{Menu, MenuItem, Submenu};

#[tauri::command]
fn find_port() -> u16 {
    let port = portpicker::pick_unused_port().expect("failed to find unused port");
    port
}

fn main() {
    let menu = Menu::new();

    #[cfg(target_os = "macos")]
    let menu = menu.add_submenu(Submenu::new(
        "Sproutz",
        Menu::new()
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::ShowAll)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    ));

    let menu = menu.add_submenu(Submenu::new("Edit", {
        let mut menu = Menu::new();
        menu = menu.add_native_item(MenuItem::Undo);
        menu = menu.add_native_item(MenuItem::Redo);
        menu = menu.add_native_item(MenuItem::Separator);
        menu = menu.add_native_item(MenuItem::Cut);
        menu = menu.add_native_item(MenuItem::Copy);
        menu = menu.add_native_item(MenuItem::Paste);
        #[cfg(not(target_os = "macos"))]
        {
            menu = menu.add_native_item(MenuItem::Separator);
        }
        menu = menu.add_native_item(MenuItem::SelectAll);
        menu
    }));

    let app = tauri::Builder::default();
    let app = app.menu(menu);
    let app = app.setup(|_app| {
        #[cfg(debug_assertions)]
        {
            let window = _app.get_window("main").unwrap();
            window.open_devtools();
        }
        Ok(())
    });
    let app = app.plugin(tauri_plugin_window_state::Builder::default().build());
    let app = app.invoke_handler(tauri::generate_handler![find_port]);
    let app = app.build(tauri::generate_context!());
    let app = app.expect("error while running tauri application");
    app.run(|_app_handle, event| match event {
        _ => {}
    })
}
