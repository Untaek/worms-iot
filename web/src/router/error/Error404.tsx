import { Link, Navigate, useRouteError } from 'react-router-dom'
import { useUser } from '../../providers/user.provider'
import { Button } from '../../components/ui/button'

export const Error404 = () => {
  const user = useUser()
  const error = useRouteError()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-bold">404 Not Found</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <Link to="/">
        <Button variant="outline">메인으로</Button>
      </Link>
    </div>
  )
}
