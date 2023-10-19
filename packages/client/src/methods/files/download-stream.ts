import { BaseTelegramClient } from '@mtcute/core'

import { FileDownloadParameters, FileLocation } from '../../types/index.js'
import { bufferToStream } from '../../utils/stream-utils.js'
import { downloadAsIterable } from './download-iterable.js'

/**
 * Download a file and return it as a readable stream,
 * streaming file contents.
 *
 * @param params  File download parameters
 */
export function downloadAsStream(
    client: BaseTelegramClient,
    params: FileDownloadParameters,
): ReadableStream<Uint8Array> {
    if (params.location instanceof FileLocation && ArrayBuffer.isView(params.location.location)) {
        return bufferToStream(params.location.location)
    }

    const cancel = new AbortController()

    if (params.abortSignal) {
        params.abortSignal.addEventListener('abort', () => {
            cancel.abort()
        })
    }

    return new ReadableStream<Uint8Array>({
        start(controller) {
            (async () => {
                for await (const chunk of downloadAsIterable(client, params)) {
                    controller.enqueue(chunk)
                }

                controller.close()
            })().catch((e) => controller.error(e))
        },
        cancel() {
            cancel.abort()
        },
    })
}
