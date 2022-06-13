import { tempdir } from '@tauri-apps/api/os'
import { join } from '@tauri-apps/api/path'
import { Command } from '@tauri-apps/api/shell'

export type AppStatus =
  | 'Initializing'
  | 'Ready'
  | 'Finding port'
  | 'Port in use'
  | 'Restarting'

export type Project = {
  name: string
  path: string
  color: string
  icon: string
}

export type Config = {
  id: string
  port: number
  project: null | Project
  projects: Project[]
}

export const GlobalApp = {
  status: 'Finding port' as AppStatus,
  port: 0,
  id: '-',
  path: './',
  cmd: null as null | Command,
  project: null as null | Project,
  projects: [] as Project[],
}

export type IApp = typeof GlobalApp & { render: () => void }

export const saveConfig = async (app: IApp) => {
  const configPath = await join(await tempdir(), 'sproutz.json')

  try {
    await tauri.fs.writeFile({
      path: configPath,
      contents: JSON.stringify(
        {
          id: app.id,
          port: app.port,
          project: app.project,
          projects: app.projects,
        } as Config,
        null,
        2
      ),
    })
  } catch (e) {
    console.log(`Write config failed`, e)
    alert('Failed to write config file:\n' + configPath)
  }
}
