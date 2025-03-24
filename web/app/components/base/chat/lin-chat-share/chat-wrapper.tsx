import { useMemo } from 'react'
import Chat from '../chat'
import type {
  ChatConfig,
} from '../types'
import { useChat } from '../chat/hooks'
import { useChatWithHistoryContext } from '../chat-with-history/context'
import {
  stopChatMessageResponding,
} from '@/service/share'
import AnswerIcon from '@/app/components/base/answer-icon'
import Share from './share'

const ChatWidth = 1200
const ChatWrapper = () => {
  const {
    appParams,
    appPrevChatTree,
    currentConversationId,
    currentConversationItem,
    inputsForms,
    newConversationInputs,
    isMobile,
    isInstalledApp,
    appId,
    appMeta,
    appData,
    themeBuilder,
  } = useChatWithHistoryContext()
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
    setTargetMessageId,
  } = useChat(
    appConfig,
    {
      inputs: (currentConversationId ? currentConversationItem?.inputs : newConversationInputs) as any,
      inputsForm: inputsForms,
    },
    appPrevChatTree,
    taskId => stopChatMessageResponding('', taskId, isInstalledApp, appId),
  )
  const answerIcon = (appData?.site && appData.site.use_icon_as_answer_icon)
    ? <AnswerIcon
      iconType={appData.site.icon_type}
      icon={appData.site.icon}
      background={appData.site.icon_background}
      imageUrl={appData.site.icon_url}
    />
    : null

  return (
    <div className="flex flex-col h-full bg-chatbot-bg">
      <div className="shrink-0 absolute right-10 top-1 z-10">
        <Share />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Chat
          chatList={chatList}
          chatContainerInnerClassName={`mx-auto pt-6 w-full max-w-[${ChatWidth}px] ${isMobile && 'px-4'} h-full`}
          chatFooterClassName='pb-4'
          chatFooterInnerClassName={`mx-auto w-full max-w-[${ChatWidth}px] ${isMobile && 'px-4'}`}
          allToolIcons={appMeta?.tool_icons || {}}
          answerIcon={answerIcon}
          hideProcessDetail
          themeBuilder={themeBuilder}
          noChatInput
          switchSibling={siblingMessageId => setTargetMessageId(siblingMessageId)}
        />
      </div>
    </div>
  )
}

export default ChatWrapper
