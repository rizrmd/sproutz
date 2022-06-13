import { IApp } from '../global/global-app'
import { query } from '../utils/query'

export const verifyID = async (app: IApp) => {
  const res = await query(gql`
    query MyQuery {
      activation(where: { id: { _eq: "${app.id}" } }) {
        port
      }
    }
  `)
  if (res.length === 0) {
    return false
  }
  return true
}
