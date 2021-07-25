import { TelegramClient } from '../../client'
import { tl } from '@mtqt/tl'
import { Dialog, MtqtTypeAssertionError } from '../../types'
import { createUsersChatsIndex } from '../../utils/peer-utils'
import { getMarkedPeerId } from '@mtqt/core'

/** @internal */
export function _parseDialogs(
    this: TelegramClient,
    res: tl.messages.TypeDialogs | tl.messages.TypePeerDialogs
): Dialog[] {
    if (res._ === 'messages.dialogsNotModified')
        throw new MtqtTypeAssertionError(
            'messages.getPeerDialogs',
            '!messages.dialogsNotModified',
            'messages.dialogsNotModified'
        )

    const { users, chats } = createUsersChatsIndex(res)

    const messages: Record<number, tl.TypeMessage> = {}
    res.messages.forEach((msg) => {
        if (!msg.peerId) return

        messages[getMarkedPeerId(msg.peerId)] = msg
    })

    return res.dialogs
        .filter((it) => it._ === 'dialog')
        .map(
            (it) => new Dialog(this, it as tl.RawDialog, users, chats, messages)
        )
}
