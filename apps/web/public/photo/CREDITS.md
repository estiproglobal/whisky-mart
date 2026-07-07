# Photography credits

Source and licence for every atmosphere photograph used by the storefront.
The registry of slots lives in `apps/web/lib/photo/manifest.ts`; binaries are
fetched into this directory by `apps/web/scripts/fetch-photos.mjs` and served
through the `<Photo>` treatment (slight desaturation + copper overlay).

Status note: the sandbox that built Increment 12B could not reach the image
CDNs, so the images below were curated from Unsplash by description and had
not yet been downloaded when this file was written. When the fetch script has
run, eyeball each image against its brief, replace any that miss, and update
this table. The Unsplash License permits commercial use without attribution;
we credit anyway.

| Slot | Used for | Source | Photographer | Licence |
|---|---|---|---|---|
| `hero-dram` | Homepage hero | <https://unsplash.com/photos/a-glass-of-whiskey-sitting-on-top-of-a-wooden-table-vt1HMqYxSuU> | Karolina Grabowska | Unsplash License |
| `casks` | Speyside header, guide covers | <https://unsplash.com/photos/k_mLEqWmZug> | André Carvalho | Unsplash License |
| `still` | Highland + Irish headers, About | not curated yet: pick from <https://unsplash.com/s/photos/whisky-distillery> | TBD | Unsplash License |
| `islay-coast` | Islay/Islands/Peated headers, Islay guide cover | not curated yet: pick from <https://unsplash.com/s/photos/islay> | TBD | Unsplash License |
| `pour` | Japan header, journal cover | <https://unsplash.com/photos/a-person-pouring-a-liquid-into-a-glass-dCg2EpvbkzY> | SJ | Unsplash License |
| `shelf` | Shop/best-sellers/under-50 headers, guide cover | <https://unsplash.com/photos/a-blurry-photo-of-a-bar-with-bottles-on-the-shelves-QFJuhlfgHwc> | Panos Katsigiannis | Unsplash License |
| `tasting-table` | Samples header, tasting guide cover | <https://unsplash.com/photos/a-glass-of-whiskey-and-nuts-on-a-table-iZ7iji2voN4> | Natalie Behn | Unsplash License |
| `cork` | Gifts header, journal header | <https://unsplash.com/photos/a-bottle-of-whiskey-next-to-a-glass-on-a-wooden-table-0c4vcpyhEWs> | Brett Jordan | Unsplash License |
| `barley` | Highland header, guide covers | <https://unsplash.com/photos/a-field-of-wheat-with-birds-flying-stIVDzkkBfE> | TBD (verify on fetch) | Unsplash License |
| `glass-pair` | Taste quiz header, beginners header | <https://unsplash.com/photos/two-glasses-of-whiskey-on-a-wooden-table-9qcAjKIQ6Zg> | Monika Grabkowska | Unsplash License |

Avoid Unsplash+ images (a paid licence): every entry above must carry the
standard Unsplash License. Where genuinely free-licensed photos of real
bottles exist they may be preferred for product niches, credited here, and
run through the same treatment. No producer pack shots.
