import { Button } from '@/components/ui/button'

type Props = {
  onClickSaveTemp: () => void
  onClickSubmit: () => void
}

export const BottomActionBar = ({ onClickSaveTemp, onClickSubmit }: Props) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-end gap-2 border-t bg-white px-6 py-3 md:left-[220px] lg:left-[240px]">
      <Button variant="ghost" onClick={onClickSaveTemp}>
        임시저장
      </Button>
      <Button variant="default" onClick={onClickSubmit}>
        등록하기
      </Button>
      <Button variant="outline">취소</Button>
    </div>
  )
}
