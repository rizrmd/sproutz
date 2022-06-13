import { basename } from '@tauri-apps/api/path'
import { IApp, saveConfig } from '../global/global-app'
import * as Icons from '../components/App/IconProject'

export const newProject = async (app: IApp, dir: string) => {
  const keys = Object.keys(Icons)
  const newProject = {
    name: await basename(dir),
    path: dir,
    color: '',
    icon: keys[randomBetween(0, keys.length)],
  }

  if (!app.projects.find((e) => newProject.path === e.path)) {
    app.projects.push(newProject)
  }
  
  app.project = newProject

  saveConfig(app)
  app.render()
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
