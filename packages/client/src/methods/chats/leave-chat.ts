import { InputPeerLike, MtCuteInvalidPeerTypeError } from '../../types'
import { TelegramClient } from '../../client'
import {
    normalizeToInputChannel,
    normalizeToInputPeer,
} from '../../utils/peer-utils'

/**
 * Leave a group chat, supergroup or channel
 *
 * @param chatId  Chat ID or username
 * @param clear  Whether to clear history after leaving (only for legacy group chats)
 * @internal
 */
export async function leaveChat(
    this: TelegramClient,
    chatId: InputPeerLike,
    clear = false
): Promise<void> {
    const chat = await this.resolvePeer(chatId)
    const input = normalizeToInputPeer(chat)

    if (input._ === 'inputPeerChannel') {
        const res = await this.call({
            _: 'channels.leaveChannel',
            channel: normalizeToInputChannel(chat)!,
        })
        this._handleUpdate(res)
    } else if (input._ === 'inputPeerChat') {
        const res = await this.call({
            _: 'messages.deleteChatUser',
            chatId: input.chatId,
            userId: { _: 'inputUserSelf' },
        })
        this._handleUpdate(res)

        if (clear) {
            await this.deleteHistory(input)
        }
    } else throw new MtCuteInvalidPeerTypeError(chatId, 'chat or channel')
}
