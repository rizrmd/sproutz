import { IApp, Project, saveConfig } from '../global/global-app'

export const delProject = async (app: IApp, project: Project) => {
  app.projects = app.projects.filter((e) => e.path !== project.path)
  if (app.project && app.project.path === project.path) {
    if (app.projects.length > 0) {
      app.project = app.projects[0]
    } else {
      app.project = null
    }
  }
  saveConfig(app)
  app.render()
}
