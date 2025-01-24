import useSWR from 'swr'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPrevChatList } from '../utils'
import {
  fetchSharedChatListLin,
} from '@/service/linservice'

export const useConversationWithoutAuth = () => {
  const params = useParams()
  const app_id = params?.appid as string
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  useEffect(() => {
    setCurrentConversationId(new URLSearchParams(window.location.search).get('conversationid'))
  }, [])

  const { data: linSharedData } = useSWR(
    currentConversationId ? [true, currentConversationId, app_id] : null,
    () => fetchSharedChatListLin(currentConversationId as string, app_id),
  )

  const appPrevChatList = useMemo(
    () => (currentConversationId && linSharedData?.data.length)
      ? getPrevChatList(linSharedData.data)
      : [],
    [linSharedData, currentConversationId],
  )

  return { appPrevChatList }
}
