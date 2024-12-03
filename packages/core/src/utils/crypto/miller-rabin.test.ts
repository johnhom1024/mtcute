import { defaultCryptoProvider } from '@mtcute/test'
import { describe, expect, it } from 'vitest'

import { millerRabin } from './miller-rabin.js'

describe(
    'miller-rabin test',
    () => {
        // miller-rabin factorization relies on RNG, so we should use a real random number generator
        const c = defaultCryptoProvider

        const testMillerRabin = (n: number | string | bigint, isPrime: boolean) => {
            expect(millerRabin(c, BigInt(n))).eq(isPrime)
        }

        it('should correctly label small primes as probable primes', () => {
            const smallOddPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]

            for (const prime of smallOddPrimes) {
                testMillerRabin(prime, true)
            }
        })

        it('should correctly label small odd composite numbers as composite', () => {
            const smallOddPrimes = [9, 15, 21, 25, 27, 33, 35]

            for (const prime of smallOddPrimes) {
                testMillerRabin(prime, false)
            }
        })

        // primes are generated using `openssl prime -generate -bits <bits>`

        it('should work for 512-bit numbers', () => {
            testMillerRabin(
                '8411445470921866378538628788380866906358949375899610911537071281076627385046125382763689993349183284546479522400013151510610266158235924343045768103605519',
                true,
            )
            testMillerRabin(
                '11167561990563990242158096122232207092938761092751537312016255867850441858086589598418467012717458858604863547175649456433632887622140170743409535470973399',
                true,
            )
            testMillerRabin(
                '11006717791910450367418249787526506184731090161438431250022510598653874155081488487035840577645711578911087148186160668569071839053453201592321650008610329',
                true,
            )
            testMillerRabin(
                '12224330340162812215033324917156282302617911690617664923428569636370785775561435789211091021550357876767050350997458404009005800772805534351607294516706177',
                true,
            )

            // above numbers but -2 (not prime)
            testMillerRabin(
                '8411445470921866378538628788380866906358949375899610911537071281076627385046125382763689993349183284546479522400013151510610266158235924343045768103605517',
                false,
            )
            testMillerRabin(
                '11167561990563990242158096122232207092938761092751537312016255867850441858086589598418467012717458858604863547175649456433632887622140170743409535470973397',
                false,
            )
            testMillerRabin(
                '11006717791910450367418249787526506184731090161438431250022510598653874155081488487035840577645711578911087148186160668569071839053453201592321650008610327',
                false,
            )
            testMillerRabin(
                '12224330340162812215033324917156282302617911690617664923428569636370785775561435789211091021550357876767050350997458404009005800772805534351607294516706175',
                false,
            )
        })

        it('should work for 1024-bit numbers', () => {
            testMillerRabin(
                '94163180970530844245052892199633535954736903357996153321496979115367320260897793334681106861766748541439161886270777106456088209508872459550450259737267142959061663564218457086654112219462515165219295402175541003899136060178102898376369981338103600856012709228116661479275753497725541132207243717937379815409',
                true,
            )
            testMillerRabin(
                '97324962433497727515811278760066576725849776656602017497363465683978397629803148191267105308901733336070351381654371470561376353774017284623969415330564867697353080030917333974193741719718950105404732792050882127213356260415251087867407489400712288570880407613514781891914135956778687719588061176455381937003',
                true,
            )
            testMillerRabin(
                '92511311413226091818378551616231701579277597795073142338527410334932345968554993390789667936819230228388142960299649466238701015865565141753710450319875546944139442823075990348978746055937500467483161699883905850192191164043687791185635729923497381849380102040768674652775240505782671289535260164547714030567',
                true,
            )
            testMillerRabin(
                '98801756216479639848708157708947504990501845258427605711852570166662700681215707617225664134994147912417941920327932092748574265476658124536672887141144222716123085451749764522435906007567360583062117498919471220566974634924384147341592903939264267901029640119196259026154529723870788246284629644039137378253',
                true,
            )

            // above numbers but -2 (not prime)
            testMillerRabin(
                '94163180970530844245052892199633535954736903357996153321496979115367320260897793334681106861766748541439161886270777106456088209508872459550450259737267142959061663564218457086654112219462515165219295402175541003899136060178102898376369981338103600856012709228116661479275753497725541132207243717937379815407',
                false,
            )
            testMillerRabin(
                '97324962433497727515811278760066576725849776656602017497363465683978397629803148191267105308901733336070351381654371470561376353774017284623969415330564867697353080030917333974193741719718950105404732792050882127213356260415251087867407489400712288570880407613514781891914135956778687719588061176455381937001',
                false,
            )
            testMillerRabin(
                '92511311413226091818378551616231701579277597795073142338527410334932345968554993390789667936819230228388142960299649466238701015865565141753710450319875546944139442823075990348978746055937500467483161699883905850192191164043687791185635729923497381849380102040768674652775240505782671289535260164547714030565',
                false,
            )
            testMillerRabin(
                '98801756216479639848708157708947504990501845258427605711852570166662700681215707617225664134994147912417941920327932092748574265476658124536672887141144222716123085451749764522435906007567360583062117498919471220566974634924384147341592903939264267901029640119196259026154529723870788246284629644039137378251',
                false,
            )
        })

        it('should work for 2048-bit numbers', () => {
            testMillerRabin(
                '28608382334358769588283288249494859626901014972463291352091976543138105382282108662849885913053034513852843449409838151123568984617793641641937583673207501643041336002587032201383537626393235736734494131431069043382068545865505150651648610506542819001961332454611129372758714288168807328523359776577571626967649079147416191592855529888846889532625386469236278694936872628305052827422772792103722178298844645210242389265273407924858034431614414896134561928996888883994953322861399988094086562513898527391555490352156627307769278185444897960555995383228897584818577375695810423475039211516849716140051437120083274285367',
                true,
            )
            testMillerRabin(
                '30244022694659482453371920976249272809817388822378671144866806600284132009663832003348737406289715119965835410140834733465553787513841966120831322372642881643693711233087233983267648392814127424201572290931937482043046169402667397610783447368703776842799852222745601531140231486417855517072392416789672922529566643118973930252809010605519948446055538976582290902060054788109497630796585770940656002892943575479533099350429655210881833493066716819282707441553612603960556051122162329171373373251909387401572866056121964608595895425640834764028568120995397759283490218181167000161310959711677055741632674632758727382743',
                true,
            )
            testMillerRabin(
                '30560953105766401423987964658775999222308579908395527900931049506803845883459894704297458477118152899910620180302473409631442956208933061650967001020981432894530064472547770442696756724169958362395601360296775798187903794894866967342028337982275745956538015473621792510615113531964380246815875830970404687926061637030085629909804357717955251735074071072456074274947993921828878633638119117086342305530526661796817095624933200483138188878398983149622639425550360394901699701985050966685840649129419227936413574227792077082510807968104733387734970009620450108276446659342203263759999068046251645984039420643003580284779',
                true,
            )

            // above numbers but -2 (not prime)
            testMillerRabin(
                '28608382334358769588283288249494859626901014972463291352091976543138105382282108662849885913053034513852843449409838151123568984617793641641937583673207501643041336002587032201383537626393235736734494131431069043382068545865505150651648610506542819001961332454611129372758714288168807328523359776577571626967649079147416191592855529888846889532625386469236278694936872628305052827422772792103722178298844645210242389265273407924858034431614414896134561928996888883994953322861399988094086562513898527391555490352156627307769278185444897960555995383228897584818577375695810423475039211516849716140051437120083274285365',
                false,
            )
            testMillerRabin(
                '30244022694659482453371920976249272809817388822378671144866806600284132009663832003348737406289715119965835410140834733465553787513841966120831322372642881643693711233087233983267648392814127424201572290931937482043046169402667397610783447368703776842799852222745601531140231486417855517072392416789672922529566643118973930252809010605519948446055538976582290902060054788109497630796585770940656002892943575479533099350429655210881833493066716819282707441553612603960556051122162329171373373251909387401572866056121964608595895425640834764028568120995397759283490218181167000161310959711677055741632674632758727382741',
                false,
            )
            testMillerRabin(
                '30560953105766401423987964658775999222308579908395527900931049506803845883459894704297458477118152899910620180302473409631442956208933061650967001020981432894530064472547770442696756724169958362395601360296775798187903794894866967342028337982275745956538015473621792510615113531964380246815875830970404687926061637030085629909804357717955251735074071072456074274947993921828878633638119117086342305530526661796817095624933200483138188878398983149622639425550360394901699701985050966685840649129419227936413574227792077082510807968104733387734970009620450108276446659342203263759999068046251645984039420643003580284777',
                false,
            )

            // dh_prime used by telegram, as seen in https://core.telegram.org/mtproto/security_guidelines
            const telegramDhPrime
                = 'C7 1C AE B9 C6 B1 C9 04 8E 6C 52 2F 70 F1 3F 73 98 0D 40 23 8E 3E 21 C1 49 34 D0 37 56 3D 93 0F 48 19 8A 0A A7 C1 40 58 22 94 93 D2 25 30 F4 DB FA 33 6F 6E 0A C9 25 13 95 43 AE D4 4C CE 7C 37 20 FD 51 F6 94 58 70 5A C6 8C D4 FE 6B 6B 13 AB DC 97 46 51 29 69 32 84 54 F1 8F AF 8C 59 5F 64 24 77 FE 96 BB 2A 94 1D 5B CD 1D 4A C8 CC 49 88 07 08 FA 9B 37 8E 3C 4F 3A 90 60 BE E6 7C F9 A4 A4 A6 95 81 10 51 90 7E 16 27 53 B5 6B 0F 6B 41 0D BA 74 D8 A8 4B 2A 14 B3 14 4E 0E F1 28 47 54 FD 17 ED 95 0D 59 65 B4 B9 DD 46 58 2D B1 17 8D 16 9C 6B C4 65 B0 D6 FF 9C A3 92 8F EF 5B 9A E4 E4 18 FC 15 E8 3E BE A0 F8 7F A9 FF 5E ED 70 05 0D ED 28 49 F4 7B F9 59 D9 56 85 0C E9 29 85 1F 0D 81 15 F6 35 B1 05 EE 2E 4E 15 D0 4B 24 54 BF 6F 4F AD F0 34 B1 04 03 11 9C D8 E3 B9 2F CC 5B'
            testMillerRabin(BigInt(`0x${telegramDhPrime.replace(/ /g, '')}`), true)
        })
    },
    { timeout: 10000 },
) // since miller-rabin factorization relies on RNG, it may take a while (or may not!)
