import { json } from '@remix-run/react'

export async function loader() {
  return json(null, { status: 404 })
}
const NotFoundPage = () => {
  return (
    <div>
      <h1>Not found</h1>
    </div>
  )
}

export default NotFoundPage
