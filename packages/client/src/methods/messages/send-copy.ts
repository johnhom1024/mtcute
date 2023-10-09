import { BaseTelegramClient, getMarkedPeerId, MtArgumentError, tl } from '@mtcute/core'

import { FormattedString, InputPeerLike, Message, MtMessageNotFoundError, ReplyMarkup } from '../../types'
import { resolvePeer } from '../users/resolve-peer'
import { getMessages } from './get-messages'
import { sendMedia } from './send-media'
import { sendText } from './send-text'

/**
 * Copy a message (i.e. send the same message,
 * but do not forward it).
 *
 * Note that if the message contains a webpage,
 * it will be copied simply as a text message,
 * and if the message contains an invoice,
 * it can't be copied.
 *
 * @param params
 */
export async function sendCopy(
    client: BaseTelegramClient,
    params: {
        /** Source chat ID */
        fromChatId: InputPeerLike
        /** Target chat ID */
        toChatId: InputPeerLike
        /** Message ID to forward */
        message: number
        /**
         * Whether to send this message silently.
         */
        silent?: boolean

        /**
         * If set, the message will be scheduled to this date.
         * When passing a number, a UNIX time in ms is expected.
         *
         * You can also pass `0x7FFFFFFE`, this will send the message
         * once the peer is online
         */
        schedule?: Date | number

        /**
         * New message caption (only used for media)
         */
        caption?: string | FormattedString<string>

        /**
         * Parse mode to use to parse `text` entities before sending
         * the message. Defaults to current default parse mode (if any).
         *
         * Passing `null` will explicitly disable formatting.
         */
        parseMode?: string | null

        /**
         * Message to reply to. Either a message object or message ID.
         *
         * For forums - can also be an ID of the topic (i.e. its top message ID)
         */
        replyTo?: number | Message

        /**
         * Whether to throw an error if {@link replyTo}
         * message does not exist.
         *
         * If that message was not found, `NotFoundError` is thrown,
         * with `text` set to `MESSAGE_NOT_FOUND`.
         *
         * Incurs an additional request, so only use when really needed.
         *
         * Defaults to `false`
         */
        mustReply?: boolean

        /**
         * List of formatting entities to use instead of parsing via a
         * parse mode.
         *
         * **Note:** Passing this makes the method ignore {@link parseMode}
         */
        entities?: tl.TypeMessageEntity[]

        /**
         * For bots: inline or reply markup or an instruction
         * to hide a reply keyboard or to force a reply.
         */
        replyMarkup?: ReplyMarkup

        /**
         * Whether to clear draft after sending this message.
         *
         * Defaults to `false`
         */
        clearDraft?: boolean
    },
): Promise<Message> {
    const { fromChatId, toChatId, message, ...rest } = params

    const fromPeer = await resolvePeer(client, fromChatId)

    const msg = await getMessages(client, fromPeer, message)

    if (!msg) {
        throw new MtMessageNotFoundError(getMarkedPeerId(fromPeer), message, 'to copy')
    }

    if (msg.raw._ === 'messageService') {
        throw new MtArgumentError("Service messages can't be copied")
    }

    if (msg.media && msg.media.type !== 'web_page' && msg.media.type !== 'invoice') {
        return sendMedia(
            client,
            toChatId,
            {
                type: 'auto',
                file: msg.media.inputMedia,
                caption: params.caption ?? msg.raw.message,
                // we shouldn't use original entities if the user wants custom text
                entities: params.entities ?? params.caption ? undefined : msg.raw.entities,
            },
            rest,
        )
    }

    return sendText(client, toChatId, msg.raw.message, rest)
}
