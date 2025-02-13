import type { FC } from 'react'
import {
  useEffect,
} from 'react'
import {
  ChatWithHistoryContext,
  useChatWithHistoryContext,
} from '../chat-with-history/context'
import { useConversationWithoutAuth } from './hooks'
import ChatWrapper from './chat-wrapper'
import type { InstalledApp } from '@/models/explore'
import Loading from '@/app/components/base/loading'
import AppUnavailable from '@/app/components/base/app-unavailable'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'

type ChatWithHistoryProps = {
  className?: string
}
const ChatWithHistory: FC<ChatWithHistoryProps> = ({
  className,
}) => {
  const {
    appInfoError,
    appData,
    appInfoLoading,
    appPrevChatTree,
    showConfigPanelBeforeChat,
    appChatListDataLoading,
    chatShouldReloadKey,
    isMobile,
    themeBuilder,
  } = useChatWithHistoryContext()

  // const chatReady = (!showConfigPanelBeforeChat || !!appPrevChatList.length)
  const chatReady = appPrevChatTree.length
  const customConfig = appData?.custom_config
  const site = appData?.site

  useEffect(() => {
    themeBuilder?.buildTheme(site?.chat_color_theme, site?.chat_color_theme_inverted)
    if (site) {
      if (customConfig)
        document.title = `${site.title}`
      else
        document.title = `${site.title} - Powered by Dify`
    }
  }, [site, customConfig, themeBuilder])

  if (appInfoLoading)
    return <Loading type='app' />
  if (appInfoError)
    return <AppUnavailable />
  return (
    <div className={`h-full flex bg-white ${className} ${isMobile && 'flex-col'}`}>
      <div className={`grow overflow-hidden ${showConfigPanelBeforeChat && !appPrevChatTree.length && 'flex items-center justify-center'}`}>
        {
          appChatListDataLoading && chatReady && (
            <Loading type='app' />
          )
        }
        {
          chatReady && !appChatListDataLoading && (
            <ChatWrapper key={chatShouldReloadKey} />
          )
        }
      </div>
    </div>
  )
}

export type ChatWithHistoryWrapProps = {
  installedAppInfo?: InstalledApp
  className?: string
}
const ChatWithHistoryWrap: FC<ChatWithHistoryWrapProps> = ({
  className,
}) => {
  const {
    appPrevChatTree,
  } = useConversationWithoutAuth()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  return (
    <ChatWithHistoryContext.Provider value={{ appPrevChatTree, isMobile } as any}>
      <ChatWithHistory className={className} />
    </ChatWithHistoryContext.Provider>
  )
}

const ChatWithHistoryWrapWithCheckToken: FC<ChatWithHistoryWrapProps> = ({
  className,
}) => {
  return (
    <ChatWithHistoryWrap className={className} />
  )
}

export default ChatWithHistoryWrapWithCheckToken
