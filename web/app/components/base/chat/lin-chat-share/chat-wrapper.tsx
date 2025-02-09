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

const ChatWidth = 1200
const ChatWrapper = () => {
  const {
    appParams,
    appPrevChatList,
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
  } = useChat(
    appConfig,
    {
      inputs: (currentConversationId ? currentConversationItem?.inputs : newConversationInputs) as any,
      inputsForm: inputsForms,
    },
    appPrevChatList,
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
    <div className='h-full bg-chatbot-bg overflow-hidden' >
      <Chat
        chatList={chatList}
        chatContainerInnerClassName={`mx-auto pt-6 w-full max-w-[${ChatWidth}px] ${isMobile && 'px-4'}`}
        chatFooterClassName='pb-4'
        chatFooterInnerClassName={`mx-auto w-full max-w-[${ChatWidth}px] ${isMobile && 'px-4'}`}
        allToolIcons={appMeta?.tool_icons || {}}
        answerIcon={answerIcon}
        hideProcessDetail
        themeBuilder={themeBuilder}
        noChatInput
      />
    </div>
  )
}

export default ChatWrapper
