import { IApp, saveConfig } from '../global/global-app'
import { query } from '../utils/query'

export const activateID = async (app: IApp) => {
  app.status = 'Initializing'
  app.render()
  const res = await query(gql`
    mutation activate {
      insert_activation_one(object: {}) {
        id
      }
    }
  `)
  await saveConfig(app)
}
