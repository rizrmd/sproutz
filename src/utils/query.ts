export const query = async (q: string) => {
  const res = await tauri.http.fetch(`https://sproutz.hasura.app/v1/graphql`, {
    method: 'POST',
    body: {
      type: 'Json',
      payload: {
        query: q,
        variables: null,
      },
    },
  })

  let data: any = await res.data

  if (data.data) data = data.data

  const keys = Object.keys(data)
  if (keys.length === 1) {
    return data[keys[0]]
  }

  return data
}
