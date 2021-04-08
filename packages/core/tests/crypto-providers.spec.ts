import { describe, it } from 'mocha'
import { expect } from 'chai'
import { NodeCryptoProvider } from '../src/utils/crypto/node-crypto'
import { ForgeCryptoProvider } from '../src/utils/crypto/forge-crypto'
import { ICryptoProvider } from '../src/utils/crypto/abstract'

export function testCryptoProvider(c: ICryptoProvider): void {
    it('should calculate sha1', async () => {
        expect((await c.sha1(Buffer.from(''))).toString('hex')).to.eq(
            'da39a3ee5e6b4b0d3255bfef95601890afd80709'
        )
        expect((await c.sha1(Buffer.from('hello'))).toString('hex')).to.eq(
            'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d'
        )
        expect(
            (await c.sha1(Buffer.from('aebb1f', 'hex'))).toString('hex')
        ).to.eq('62849d15c5dea495916c5eea8dba5f9551288850')
    })

    it('should calculate sha256', async () => {
        expect((await c.sha256(Buffer.from(''))).toString('hex')).to.eq(
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        )
        expect((await c.sha256(Buffer.from('hello'))).toString('hex')).to.eq(
            '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
        )
        expect(
            (await c.sha256(Buffer.from('aebb1f', 'hex'))).toString('hex')
        ).to.eq(
            '2d29658aba48f2b286fe8bbddb931b7ad297e5adb5b9a6fc3aab67ef7fbf4e80'
        )
    })

    it('should derive pbkdf2 key', async () => {
        expect(
            (
                await c.pbkdf2(
                    Buffer.from('pbkdf2 test'),
                    Buffer.from('some salt'),
                    10
                )
            ).toString('hex')
        ).to.eq(
            'e43276cfa27f135f261cec8ddcf593fd74ec251038e459c165461f2308f3a7235e0744ee1aed9710b00db28d1a2112e20fea3601c60e770ac57ffe6b33ca8be1'
        )
    })

    it('should encrypt and decrypt aes-ctr', async () => {
        const aes = c.createAesCtr(
            Buffer.from('8ddcf593fd74ec251038e459c165461f', 'hex'),
            Buffer.from('0fea3601c60e770ac57ffe6b33ca8be1', 'hex')
        )
        expect((await aes.encrypt(Buffer.from('hello'))).toString('hex')).to.eq(
            '4f6d702526'
        )
        expect(
            (await aes.decrypt(Buffer.from('4f6d702526', 'hex'))).toString()
        ).to.eq('hello')
    })

    it('should encrypt and decrypt aes-ige', async () => {
        const aes = c.createAesIge(
            Buffer.from('5468697320697320616E20696D706C65', 'hex'),
            Buffer.from(
                '6D656E746174696F6E206F6620494745206D6F646520666F72204F70656E5353',
                'hex'
            )
        )
        expect(
            (
                await aes.encrypt(
                    Buffer.from(
                        '99706487a1cde613bc6de0b6f24b1c7aa448c8b9c3403e3467a8cad89340f53b',
                        'hex'
                    )
                )
            ).toString('hex')
        ).to.eq(
            '4c2e204c6574277320686f70652042656e20676f74206974207269676874210a'
        )
        expect(
            (
                await aes.decrypt(
                    Buffer.from(
                        '4c2e204c6574277320686f70652042656e20676f74206974207269676874210a',
                        'hex'
                    )
                )
            ).toString('hex')
        ).to.eq(
            '99706487a1cde613bc6de0b6f24b1c7aa448c8b9c3403e3467a8cad89340f53b'
        )
    })

    it('should calculate md5', async () => {
        const test = async (...parts: string[]): Promise<Buffer> => {
            const md5 = c.createMd5()
            for (const p of parts) await md5.update(Buffer.from(p, 'hex'))
            return md5.digest()
        }

        expect((await test()).toString('hex')).eq(
            'd41d8cd98f00b204e9800998ecf8427e'
        )
        expect((await test('aaeeff')).toString('hex')).eq(
            '9c20ec5e212b4fcfa4666a8b165c6d5d'
        )
        expect((await test('aaeeffffeeaa')).toString('hex')).eq(
            'cf216071768a7b610d079e5eb7b68b74'
        )
        expect((await test('aaeeff', 'ffeeaa')).toString('hex')).eq(
            'cf216071768a7b610d079e5eb7b68b74'
        )
        expect((await test('aa', 'ee', 'ff', 'ffeeaa')).toString('hex')).eq(
            'cf216071768a7b610d079e5eb7b68b74'
        )
    })
}

describe('NodeCryptoProvider', () => {
    if (typeof process === 'undefined') {
        console.warn('Skipping NodeCryptoProvider tests')
        return
    }

    testCryptoProvider(new NodeCryptoProvider())
})

describe('ForgeCryptoProvider', () => {
    try {
        require('node-forge')
    } catch (e) {
        console.warn('Skipping ForgeCryptoProvider tests')
        return
    }

    testCryptoProvider(new ForgeCryptoProvider())
})
