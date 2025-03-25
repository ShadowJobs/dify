import { FC } from "react"
import ActionButton from "../../action-button"
import Toast from "../../toast"
import copy from "copy-to-clipboard"
import { RiBracesLine, RiClipboardLine } from "@remixicon/react"
import { t } from "i18next"

const CopyBtn = ({ content }: { content: string }) => {
  return <ActionButton onClick={() => {
    copy(content)
    Toast.notify({ type: 'success', message: t('common.actionMsg.copySuccessfully') })
  }}>
    <RiClipboardLine className='w-4 h-4' />
  </ActionButton>
}

export const ShowSourceBtn = ({ setShowSource }: { setShowSource: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return <ActionButton onClick={() => setShowSource((pre: boolean) => !pre)}>
    <RiBracesLine className='w-4 h-4' />
  </ActionButton>
}

const QuestionBtns: FC<{
  content: string
  setShowSource: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ content, setShowSource }) => {
  return <div className={'absolute flex justify-start gap-1 left-[-65px] top-1 p-1'}>
    <div className='hidden group-hover:flex ml-1 items-center gap-0.5 p-0.5 rounded-[10px] border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg shadow-md backdrop-blur-sm'>
      <CopyBtn content={content} />
      <ShowSourceBtn setShowSource={setShowSource} />
    </div>
  </div>
}

export { QuestionBtns }