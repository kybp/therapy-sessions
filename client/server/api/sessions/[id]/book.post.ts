export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const authHeader = getHeader(event, 'authorization')!

  return $fetch<any>(`http://localhost:3001/api/sessions/${id}/book`, {
    method: 'POST',
    headers: {
      authorization: authHeader,
    },
  })
})
