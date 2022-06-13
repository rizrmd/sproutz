import { render } from 'react-dom'
import { IApp, Project, saveConfig } from '../global/global-app'

export const changeProject = async (app: IApp, project: Project) => {
  app.project = project

  if (app.project) {
    if (!app.projects.find((e) => app.project && e.name === app.project.name)) {
      app.projects.push(app.project)
    }
  }
  await saveConfig(app)

  app.render()
}
