import { Command } from '@tauri-apps/api/shell'
import { IApp } from '../global/global-app'

export const findPort = async (app: IApp) => {
  app.status = 'Finding port'
  app.render()

  app.port = await tauri.invoke('find_port')
  localStorage.port = app.port

  app.status = 'Initializing'
  return app.port
}
