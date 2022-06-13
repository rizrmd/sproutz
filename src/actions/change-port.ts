import { ResponseType } from '@tauri-apps/api/http'
import { IApp, saveConfig } from '../global/global-app'

export const changePort = async (newPort: number, app: IApp) => {
  if (newPort === app.port) return
  app.status = 'Restarting'
  app.render()

  app.port = newPort
  await saveConfig(app)

  try {
    const res = await tauri.http.fetch(`http://localhost:${app.port}`, {
      method: 'GET',
      responseType: ResponseType.Text,
    })
    if (res) {
      app.status = 'Ready'
    }
  } catch (e) {
    console.log(e)
    app.status = 'Port in use'
  }

  app.render()
}
