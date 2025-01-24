'use client'
import type { FC } from 'react'
import React, { memo, useState } from 'react'
import { RiShareBoxFill, RiShareFill } from '@remixicon/react'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import { useChatWithHistoryContext } from '../chat-with-history/context'
import Modal from '@/app/components/base/modal'

import QrcodeStyle from '@/app/components/base/qrcode/style.module.css'
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
        <QRCode size={160} value={fullUrl} className={QrcodeStyle.qrcodeimage} />
      </div>
      <div className="flex mt-4 ">
        {/* <input type='text' value={fullUrl} className='px-2 py-1 border-gray-200 rounded-lg border-[0.5px] flex-1' /> */}
        <textarea value={fullUrl} className='px-2 py-1 border-gray-200 rounded-lg border-[0.5px] flex-1' />
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
  const { appId, currentConversationId } = useChatWithHistoryContext()
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  return (
    <div className='absolute right-4 cursor-pointer'>
      <ShareModal
        isShow={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        appId={appId as string}
        conversationId={currentConversationId}
      />
      <RiShareFill className='w-4 h-4 text-text-tertiary' onClick={() => {
        setShowCustomizeModal(true)
      }} />
    </div>
  )
}

export default memo(Share)
