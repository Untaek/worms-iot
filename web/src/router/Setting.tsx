import { api } from '@/api'
import { ContentView } from '@/components/layout/ContentView'
import { useQuery } from '@tanstack/react-query'

export const Setting = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api().users.내정보가져오기(),
  })

  return (
    <ContentView title="내 정보">
      <div>닉네임: {profile?.nickname}</div>
      <div>권한: {profile?.role}</div>
    </ContentView>
  )
}
