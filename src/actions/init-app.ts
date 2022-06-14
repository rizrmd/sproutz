import { ResponseType } from '@tauri-apps/api/http'
import { tempdir } from '@tauri-apps/api/os'
import { join } from '@tauri-apps/api/path'
import { Command } from '@tauri-apps/api/shell'
import { Config, IApp, saveConfig } from '../global/global-app'

export const initApp = (app: IApp) => {
  return new Promise<string>(async (resolve) => {
    const configPath = await join(await tempdir(), 'sproutz.json')
    let config = {} as Config

    try {
      const res = await tauri.fs.readTextFile(configPath)
      config = JSON.parse(res)

      app.id = config.id
      app.port = config.port
      app.project = config.project
      app.projects = config.projects || []

      if (app.project) {
        if (
          !app.projects.find((e) => app.project && e.name === app.project.name)
        ) {
          app.projects.push(app.project)
        }
      }

      app.status = 'Initializing'

      app.render()
    } catch (e) {
      console.log(`Read config failed`, e)

      await saveConfig(app)
    }

    if (!app.cmd) {
      app.cmd = Command.sidecar('go/main')
      app.cmd.stdout.on('data', async (data: string) => {
        if (data.startsWith('listening on')) {
          app.status = 'Ready'
          app.render()
        } else if (app.status !== 'Ready') {
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
      })
      app.cmd.execute()
    }

    resolve('ok')
  })
}
