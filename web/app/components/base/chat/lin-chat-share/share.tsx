'use client'
import type { FC } from 'react'
import React, { memo, useMemo, useState } from 'react'
import { RiDownload2Line, RiHome3Line, RiShareBoxFill, RiShareFill } from '@remixicon/react'
import copy from 'copy-to-clipboard'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import { useParams } from 'next/navigation'
import { useChatWithHistoryContext } from '../chat-with-history/context'
import { useChat } from '../chat/hooks'
import type { ChatConfig } from '../types'
import {
  stopChatMessageResponding,
} from '@/service/share'
import Modal from '@/app/components/base/modal'
import TooltipPlus from '@/app/components/base/tooltip'

import {
  Clipboard,
  ClipboardCheck,
} from '@/app/components/base/icons/src/vender/line/files'

type IShareLinkProps = {
  isShow: boolean
  onClose: () => void
  appId: string
  conversationId: string
}

const ShareModal: FC<IShareLinkProps> = ({
  isShow,
  onClose,
  appId,
  conversationId,
}) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const url = `/lin-share/${appId}?conversationid=${conversationId}`
  const fullUrl = window.location.origin + url
  return (<Modal
    title={'Share'}
    isShow={isShow}
    onClose={onClose}
    className='!max-w-3xl w-[1040px]'
    closable={true}
  >
    <div className='w-full mt-4 px-6 py-5 border-gray-200 rounded-lg border-[0.5px]'>
      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
        <QRCode size={160} value={fullUrl} />
      </div>
      <div className="flex mt-4 ">
        <textarea value={fullUrl} className='px-2 py-1 border-gray-200 rounded-lg border-[0.5px] flex-1' onChange={()=>{}} />
        <div className="w-5 mt-1 ml-2">
          {!isCopied
            ? <Clipboard className='h-6 w-6 p-1 text-gray-500 cursor-pointer' onClick={() => {
              copy(fullUrl)
              setIsCopied(true)
            }} />
            : <ClipboardCheck className='h-6 w-6 p-1 text-gray-500' />
          }
        </div>
        <a className="w-5 mt-1" href={url} target="_blank">
          <RiShareBoxFill className='h-6 w-6 p-1 text-gray-500 cursor-pointer' />
        </a>
      </div>
    </div>
  </Modal>)
}

const Share: FC<{}> = () => {
  let { appId, currentConversationId, appPrevChatTree, appParams, currentConversationItem, inputsForms, newConversationInputs, isInstalledApp } = useChatWithHistoryContext()
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const params = useParams()
  if (!appId || !currentConversationId) {
    appId = params?.appid as string
    currentConversationId = new URLSearchParams(window.location.search).get('conversationid') as string
  }

  const appConfig = useMemo(() => {
    const config = appParams || {}

    return {
      ...config,
      file_upload: {
        ...(config as any).file_upload,
        fileUploadConfig: (config as any).system_parameters,
      },
      supportFeedback: true,
      opening_statement: currentConversationId ? currentConversationItem?.introduction : (config as any).opening_statement,
    } as ChatConfig
  }, [appParams, currentConversationItem?.introduction, currentConversationId])
  const {
    chatList,
  } = useChat(
    appConfig,
    {
      inputs: (currentConversationId ? currentConversationItem?.inputs : newConversationInputs) as any,
      inputsForm: inputsForms,
    },
    appPrevChatTree,
    taskId => stopChatMessageResponding('', taskId, isInstalledApp, appId),
  )

  // 下载对话内容为txt文件
  const downloadChatAsTxt = () => {
    if (!chatList || chatList.length === 0) {
      console.log('No chat messages to download')
      return
    }

    let txtContent = ''

    // 按照一问一答的格式整理聊天记录
    for (let i = 0; i < chatList.length; i += 2) {
      if (chatList[i].isOpeningStatement && i === 0) {
        i = -1 // 配合后面的+2，就能从1开始
        continue
      }
      const question = chatList[i]
      const answer = chatList[i + 1]

      if (question && !question.isAnswer) {
        txtContent += `Question: \n${question.content}\n`

        if (answer && answer.isAnswer) {
          txtContent += `Answer: \n${answer.content}\n`
          if (i !== chatList.length - 2)
            txtContent += '--------------------------------\n\n'
        }
      }
    }

    // 创建一个Blob对象
    const blob = new Blob([txtContent], { type: 'text/plain' })

    // 创建一个下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat_${new Date().toISOString().slice(0, 10)}.txt`

    // 模拟点击下载
    document.body.appendChild(a)
    a.click()

    // 清理
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className='cursor-pointer'>
      <ShareModal
        isShow={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        appId={appId as string}
        conversationId={currentConversationId}
      />
      <div className='flex space-x-2'>
        <TooltipPlus popupContent={'Download'} >
          <a className="w-5" onClick={downloadChatAsTxt}>
            <RiDownload2Line className='w-4 h-4' />
          </a>
        </TooltipPlus>
        <TooltipPlus popupContent={'Share'} >
          <span>
            <RiShareFill className='w-4 h-4 text-text-tertiary' onClick={() => {
              setShowCustomizeModal(true)
            }} />
          </span>
        </TooltipPlus>
      </div>
    </div>
  )
}

export default memo(Share)
