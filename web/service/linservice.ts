import { getAction, getUrl } from './share'

export const fetchSharedChatListLin = async (conversationId: string, installedAppId = '') => {
  const isInstalledApp = false
  return getAction('get', isInstalledApp)(getUrl('shared_messages', isInstalledApp, installedAppId), { params: { conversation_id: conversationId, limit: 100, last_id: '' } }) as any
}
