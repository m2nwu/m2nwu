/*
  Portfolio content. Every fact comes from the owner's source files
  (2023 portfolio pages, .ai boards, project folders). Nothing invented.
  Media spans: full (12) · wide (8) · half (6) · third (4) · quarter (3) · bleed (edge to edge).
  bg = well color behind transparent or white-ground artwork.
*/
window.WORK = {
  /* Contact: the owner's address as printed on their own business card (businesscardM2NWU.ai, back).
     Change or remove it here only; header and footer read from this. */
  email: 'from2nwu@gmail.com',
  live: [
    { label: 'Médongaule identity site', href: 'https://m2nwu.github.io/imagearchive/identity/' },
    { label: 'The Workshop, web game', href: 'https://workshop-game.conceptrotation.workers.dev' }
  ],
  order: ['punch', 'medongaule', 'lumix-plus', 'the-workshop', 'diablo-iv', 'caustic-light'],
  featured: [
    {
      slug: 'punch',
      title: 'PUNCH',
      year: '2026',
      accent: '#C4161C',
      tags: ['Editorial', 'Color system', '3D motion'],
      purpose: 'A shelf of bar guides that reads like a palette, gathered into one red box.',
      role: 'Editorial system, color and icon system, logo, 3D film (scripted Blender)',
      tile: { src: 'motion/punch/punch-thumb.mp4', poster: 'motion/punch/punch-thumb-poster.webp', alt: 'PUNCH film, shortened: eight guide books ring and riffle, fly into a red binder and the binder becomes the logo box', ar: '16 / 9', col: '1 / 13' },
      hero: { src: 'motion/punch/punch-film.mp4', poster: 'motion/punch/punch-film-poster.webp', alt: 'PUNCH 3D film: eight guide books tumble in, riffle in a ring, fly into a red box binder, glass bar icons swirl around it, and the binder flattens into the PUNCH logo', video: true, ar: '16 / 9' },
      idea: 'A drinking guide to Manhattan in two series of four books, one per kind of bar. Each bar type owns one color and one icon, so a shelf of guides reads like a palette. In 2026 the color, icon and logo sheets were reworked and the whole guide was built in 3D.',
      chapters: [
        { label: 'Eight books', text: 'Two series of four, each on its own dark ground. Eerie carries craft beer, historic, hotel and dive bars; Metal carries wine, restaurant, cocktail and unlikely bars.',
          media: [
            { src: 'punch/covers/cover-craft-beer.svg', alt: 'Cover, Craft Beer, on the Eerie ground', span: 'quarter', ar: '576 / 792' },
            { src: 'punch/covers/cover-historic.svg', alt: 'Cover, Historic Bar, on the Eerie ground', span: 'quarter', ar: '576 / 792' },
            { src: 'punch/covers/cover-hotel.svg', alt: 'Cover, Hotel Bar, on the Eerie ground', span: 'quarter', ar: '576 / 792' },
            { src: 'punch/covers/cover-dive.svg', alt: 'Cover, Dive Bar, on the Eerie ground', span: 'quarter', ar: '576 / 792' },
            { src: 'punch/covers/cover-wine.svg', alt: 'Cover, Wine Bar, on the Metal ground', span: 'quarter', ar: '576 / 792' },
            { src: 'punch/covers/cover-restaurant.svg', alt: 'Cover, Restaurant Bar, on the Metal ground', span: 'quarter', ar: '576 / 792' },
            { src: 'punch/covers/cover-cocktail.svg', alt: 'Cover, Cocktail, on the Metal ground', span: 'quarter', ar: '576 / 792' },
            { src: 'punch/covers/cover-unlikely.svg', alt: 'Cover, Unlikely Bar, on the Metal ground', span: 'quarter', ar: '576 / 792' },
            { src: 'motion/punch/punch-still-01-ring.webp', alt: 'Film still: the open books in a ring, map spreads facing the camera', span: 'half' },
            { src: 'motion/punch/punch-still-02-riffle.webp', alt: 'Film still: pages riffling in a wave around the ring', span: 'half' }
          ] },
        { label: 'Color and icon', text: 'One accent per book. It sets the vertical title on the cover, the line icon in the corner, the numbered pins on the Manhattan map and the tear-off coupons. The ground tells the series; the accent tells the bar type.',
          swatches: [['Craft beer', '#E99401'], ['Historic', '#E95835'], ['Hotel', '#00873B'], ['Dive', '#007481'], ['Wine', '#5D4B9B'], ['Restaurant', '#CD4D70'], ['Cocktail', '#BB1A18'], ['Unlikely', '#ECDCCB']],
          media: [
            { src: 'punch-drinking-guide/03-series1-inside.webp', alt: 'Inside spread, series 1', span: 'half' },
            { src: 'punch-drinking-guide/05-series2-inside.webp', alt: 'Inside spread, series 2', span: 'half' },
            { src: 'punch-drinking-guide/01-table-of-content-poster.webp', alt: 'Table of Content poster', span: 'half' },
            { src: 'punch/icons.svg', alt: 'Bar icon set, dark and color grounds: mug, barrel, coupe, tumbler, bottle, wine glass, martini, sparkle', span: 'half', ar: '1333 / 2000', alpha: true, pad: true }
          ] },
        { label: 'The binder is the logo', text: 'The PUNCH logo is a wordmark inside a thin red rectangle. The film treats that rectangle as a real object: a red box binder that holds the whole guide. The eight books fly in and the lid closes, the glass icons swirl around it, then the binder lies down until its front rim matches the logo box exactly. Seen head-on, the binder is the logo. The film is built in Blender from one Python script; only the page artwork is image texture.',
          media: [
            { src: 'motion/punch/punch-still-03-binder-load.webp', alt: 'Film still: the books flying into the red binder', span: 'third', ar: '16 / 9' },
            { src: 'motion/punch/punch-still-04-icons-swirl.webp', alt: 'Film still: colored glass bar icons swirling around the binder', span: 'third', ar: '16 / 9' },
            { src: 'motion/punch/punch-still-05-binder-lies-down.webp', alt: 'Film still: the binder seen head-on, in the proportion of the logo box', span: 'third', ar: '16 / 9' },
            { src: 'punch/logo.webp', alt: 'PUNCH logo, 2026 rework: the wordmark inside a red box', span: 'full', blend: true, pad: true, cap: 'The mark is the box that holds the guide.' }
          ] }
      ]
    },
    {
      slug: 'medongaule',
      title: 'Médongaule',
      year: '2026',
      accent: '#CD2F09',
      tags: ['Brand identity', 'Typography', 'Pattern', 'Web'],
      purpose: 'A garden where Korean landscape meets French architecture, and the garden writes the name.',
      role: 'Brand identity: wordmark, typography, color, pattern system, print, social, website, 3D garden map',
      live: [{ label: 'Identity site', href: 'https://m2nwu.github.io/imagearchive/identity/' }],
      cover: { src: 'medongaule/aerial.webp', alt: 'Aerial view of the Médongaule pavilion among autumn maples', pos: '50% 45%' },
      second: { src: 'medongaule/social-feed-persimmon.webp', alt: 'Social post with persimmons on a branch in the Médongaule frame' },
      home: { layout: 'full', media: [{ src: 'medongaule/aerial.webp', alt: 'Aerial view of the Médongaule pavilion among autumn maples', pos: '50% 45%' }] },
      tile: { src: 'motion/medongaule/medongaule-thumb.mp4', poster: 'motion/medongaule/medongaule-thumb-poster.webp', alt: 'Médongaule loop: the wordmark writes itself above the visiting hours, the 3D print set turns, and the camera descends into the 3D garden', ar: '3 / 2', col: '1 / 7' },
      hero: { src: 'motion/medongaule/medongaule-thumb.mp4', poster: 'motion/medongaule/medongaule-thumb-poster.webp', alt: 'The Médongaule wordmark writing itself, the printed set in 3D, then a walk through the 3D garden', video: true, ar: '3 / 2' },
      idea: 'Médongaule is a humanities-architecture garden in Yangpyeong, Gyeonggi-do, where the beauty of the Korean garden meets French architecture, with a garden-to-table restaurant, Fati. The idea: let the garden write the name.',
      chapters: [
        { label: 'Wordmark', text: 'In the wordmark the terminals of c, f, g, r and t end in leaves, set on The Seasons in bold and regular.',
          media: [
            { src: 'medongaule/aerial.webp', alt: 'Aerial view of the Médongaule pavilion among autumn maples', span: 'full' },
            { src: 'medongaule/hero.webp', alt: 'Médongaule wordmark in cream over a dark forest path', span: 'full' },
            { src: 'medongaule/wordmark.webp', alt: 'Médongaule wordmark in cream on a maple orange field', span: 'full' },
            { src: 'medongaule/letterforms.webp', alt: 'Comparison of standard and leaf-tipped letterforms c, f, g, r and t', span: 'full', cap: 'Leaf terminals: c, f, g, r, t, standard against custom.' }
          ] },
        { label: 'Color & type', text: 'Three colors drawn from the place: Maple Orange, Mugwort Olive and Mugwort Beige, with orange as the loudest note.',
          swatches: [['Maple Orange', '#CD2F09'], ['Mugwort Olive', '#41452D'], ['Mugwort Beige', '#BEBF91']],
          media: [
            { src: 'medongaule/fati-palette.webp', alt: 'Fati garden-to-table covers in olive, orange and beige, set in the garden', span: 'full' },
            { src: 'medongaule/typeface.webp', alt: 'Brand typeface board: The Seasons Bold and Regular with a short description, alphabets and figures', span: 'full' }
          ] },
        { label: 'Pattern', text: 'Korean window lattices and round medallions give a modular pattern set, square and circular, in every color combination.',
          media: [
            { src: 'medongaule/patterns.webp', alt: 'Grid of lattice and medallion pattern tiles in the three brand colors', span: 'full', blend: true, pad: true },
            { src: 'medongaule/courtyard-lockup.webp', alt: 'Médongaule wordmark over an aerial view of a tiled courtyard roof', span: 'full' }
          ] },
        { label: 'Applications', text: 'Business cards, chopstick sleeves, welcome brochures, menus, social feeds and a website carry the stacked serif voice: Discover Fati, Timeless Moments, Gather around the table.',
          media: [
            { src: 'motion/medongaule/medongaule-paper-thumb.mp4', poster: 'motion/medongaule/medongaule-paper-thumb-poster.webp', alt: 'Médongaule leaflets, menus, business cards and chopstick sleeves in 3D, lifting out of a grid and settling back', span: 'full', video: true, ar: '3 / 2' },
            { src: 'motion/medongaule/medongaule-paper-3d-float.webp', alt: 'The printed set in 3D, floating, the leaflets half folded', span: 'half' },
            { src: 'motion/medongaule/medongaule-paper-3d-detail.webp', alt: 'Low close-up in 3D of the menus, business cards and a leaflet edge', span: 'half' },
            { src: 'medongaule/business-cards.webp', alt: 'Médongaule business cards in orange and olive', span: 'half', blend: true, pad: true },
            { src: 'medongaule/chopstick-sleeves.webp', alt: 'Patterned chopstick sleeves', span: 'half', blend: true, pad: true },
            { src: 'medongaule/brochure-orange.webp', alt: 'Welcome brochure in Maple Orange, full spread: stream garden photograph, welcome text, a row of medallions, garden notes and a Collects panel with a maple pavilion', span: 'full' },
            { src: 'medongaule/brochure-olive.webp', alt: 'Welcome brochure in Mugwort Olive, full spread: a Digital panel with a QR code, garden notes, a lone tree at dusk and a row of medallions', span: 'wide', cap: 'Welcome brochures, both spreads, in Korean and English.' },
            { src: 'medongaule/menu.webp', alt: 'Fati menu in light and dark editions', span: 'wide', cap: 'Fati menu, light and dark editions.' }
          ] },
        { label: 'Social & web', text: 'A feed built from the pattern system, a vertical reel, the website and a navigable 3D map of the garden.',
          media: [
            { src: 'medongaule/social-feed-medallion.webp', alt: 'Social post with a medallion pattern', span: 'quarter' },
            { src: 'medongaule/video-reel.mp4', poster: 'medongaule/video-reel-poster.webp', alt: 'Vertical social reel for Médongaule', span: 'quarter', video: true, bg: '#C0BE8F', cap: 'Reel, 9:16.' },
            { src: 'medongaule/social-feed-persimmon.webp', alt: 'Social post with persimmons on a branch', span: 'quarter' },
            { src: 'medongaule/social-feed-mist.webp', alt: 'Social post with a misty garden view', span: 'quarter' },
            { src: 'medongaule/website-home.webp', alt: 'Médongaule website home page', span: 'wide', ar: '16 / 10', fit: 'cover', pos: '50% 0%' },
            { src: 'medongaule/garden-3d.webp', alt: 'The whole garden from above in the 3D map: ring path, pavilions and autumn woods', span: 'third', ar: '1 / 1', fit: 'cover', pos: '50% 60%', cap: '3D garden map.' }
          ] }
      ]
    },
    {
      slug: 'lumix-plus',
      title: 'LUMIX+',
      year: '2026',
      accent: '#EE596A',
      tags: ['Product branding', '3D', 'Packaging', 'Web'],
      purpose: 'One travel flashlight, seven silicone add‑ons, one collectible system.',
      role: 'Product concept, brand identity, 3D modeling and rendering (scripted Blender), packaging, website',
      live: [{ label: 'Brand site', href: 'https://m2nwu.github.io/lumix/' }],
      cover: { src: 'lumix-plus/addons-cluster.webp', alt: 'The seven silicone add‑ons clustered around the LUMIX+ light', bg: '#08080A' },
      second: { src: 'lumix-plus/poster-02.webp', alt: 'LUMIX+ poster with the main light on black' },
      home: { layout: 'half', media: [
        { src: 'lumix-plus/addons-cluster.webp', alt: 'The seven silicone add‑ons clustered around the LUMIX+ light', bg: '#08080A', ar: '1 / 1' },
        { src: 'lumix-plus/poster-02.webp', alt: 'LUMIX+ poster with the main light on black', ar: '1 / 1' }] },
      tile: { src: 'motion/lumix-plus/lumix-plus-thumb.mp4', poster: 'motion/lumix-plus/lumix-plus-thumb-poster.webp', alt: 'The seven add-ons joining the LUMIX+ light in turn', ar: '3 / 2', col: '7 / 13' },
      hero: { src: 'lumix-plus/film-teardown.webm', hevc: 'lumix-plus/film-teardown-hevc.mp4', poster: 'lumix-plus/film-teardown-poster.webp', alt: 'Product teardown: the light separating into its parts and closing again', video: true, alpha: true, ar: '16 / 9', pad: true },
      idea: 'A flashlight for people who travel consistently: one light that has to work in a hotel room, on a beach, in a tent. Three principles set the brief: modular and integrated, collectible and essential, adaptable and specialised.',
      chapters: [
        { label: 'First models', text: 'Week one: eight add-on concepts modeled on gray, before the set settled on seven and its color key.',
          media: [
            { src: 'lumix-plus/first-01.webp', alt: 'Early model: angled stand, orange', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '01' },
            { src: 'lumix-plus/first-02.webp', alt: 'Early model: strap holder, lilac', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '02' },
            { src: 'lumix-plus/first-03.webp', alt: 'Early model: screw anchor, yellow', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '03' },
            { src: 'lumix-plus/first-04.webp', alt: 'Early model: dome cap, red', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '04' },
            { src: 'lumix-plus/first-05.webp', alt: 'Early model: wrist mount, blue', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '05' },
            { src: 'lumix-plus/first-06.webp', alt: 'Early model: tripod stand, pink', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '06' },
            { src: 'lumix-plus/first-07.webp', alt: 'Early model: pebble orb, white', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '07' },
            { src: 'lumix-plus/first-08.webp', alt: 'Early model: gooseneck, green', span: 'quarter', ar: '1 / 1', fit: 'cover', idx: '08' }
          ] },
        { label: 'The system', text: 'Seven silicone add‑ons across three mount zones. Each joins by a bayonet twist, rail slide or press-in pin, and each is color-keyed.',
          media: [],
          strip: {
            items: [
              ['lumix-plus/addon-head01.webp', 'Diffuser Orb', 'Head · twist'],
              ['lumix-plus/addon-head02.webp', 'Gooseneck', 'Head · twist'],
              ['lumix-plus/addon-head03.webp', 'Cone Shade', 'Head · twist'],
              ['lumix-plus/addon-neck01.webp', 'Screw Anchor', 'Neck · rail'],
              ['lumix-plus/addon-neck02.webp', 'Wrist Band', 'Neck · rail'],
              ['lumix-plus/addon-feet01.webp', 'Octopus Stand', 'Feet · pin'],
              ['lumix-plus/addon-feet02.webp', 'Shackle Lock', 'Feet · pin']
            ],
            legend: [['Head', 'Twist', '3'], ['Neck', 'Rail', '2'], ['Feet', 'Pin', '2']]
          } },
        { label: 'Color', text: 'The stage stays black; every add-on owns one color.',
          swatches: [['Milky', '#F0E7D5', 'Diffuser Orb'], ['Sage', '#7EA47A', 'Gooseneck'], ['Mango', '#FDB770', 'Cone Shade'], ['Butter', '#F7E6A0', 'Screw Anchor'], ['Blue', '#688AF7', 'Wrist Band'], ['Coral', '#EE596A', 'Octopus Stand'], ['Lilac', '#DBD2F5', 'Shackle Lock']],
          media: [
            { src: 'lumix-plus/finish-metal.webp', alt: 'Main light in profile, metal finish', span: 'third', ar: '16 / 9', alpha: true },
            { src: 'lumix-plus/finish-matte-black.webp', alt: 'Main light in profile, matte black finish', span: 'third', ar: '16 / 9', alpha: true },
            { src: 'lumix-plus/finish-satin-white.webp', alt: 'Main light in profile, satin white finish', span: 'third', ar: '16 / 9', alpha: true }
          ] },
        { label: 'Object', text: 'Modeled and rendered in Blender through scripts. The display and power wheel sit opposite the neck rail.',
          media: [
            { src: 'lumix-plus/hero.webp', alt: 'The LUMIX+ main light rendered in brushed metal', span: 'full', alpha: true },
            { src: 'lumix-plus/main-light.webp', alt: 'Main light opened at the neck rail, head and handle apart', span: 'half', ar: '4 / 5', alpha: true, pad: true },
            { src: 'lumix-plus/film-screen.webm', hevc: 'lumix-plus/film-screen-hevc.mp4', poster: 'lumix-plus/film-screen-poster.webp', alt: 'The power wheel turning the display from 0 to 100 and back', span: 'half', video: true, alpha: true, pad: true, ar: '4 / 5' }
          ] },
        { label: 'Applications', text: 'Two posters, color-keyed boxes and a scroll-driven website where the set assembles frame by frame.',
          media: [
            { src: 'lumix-plus/poster-01.webp', alt: 'Poster 01, the add-on collection', span: 'half' },
            { src: 'lumix-plus/poster-02.webp', alt: 'Poster 02, the main light', span: 'half' },
            { src: 'lumix-plus/packaging-marbled.webp', alt: 'Marbled add-on boxes scattered with the add-ons', span: 'full', ar: '16 / 9', fit: 'cover', alpha: true }
          ] },
        { label: 'In use', text: 'Visualisations built from the Blender renders.',
          media: [
            { src: 'lumix-plus/scene-hotel.webp', alt: 'Diffuser Orb glowing on a hotel bedside table (visualisation)', span: 'third', ar: '4 / 5', fit: 'cover', cap: 'Hotel, Diffuser Orb.' },
            { src: 'lumix-plus/scene-beach.webp', alt: 'Light anchored in sand at dusk (visualisation)', span: 'third', ar: '4 / 5', fit: 'cover', cap: 'Beach, Screw Anchor.' },
            { src: 'lumix-plus/scene-tent.webp', alt: 'Light hanging inside a tent (visualisation)', span: 'third', ar: '4 / 5', fit: 'cover', cap: 'Tent, Cone Shade and Shackle Lock.' }
          ] }
      ]
    },
    {
      slug: 'the-workshop',
      title: 'The Workshop',
      year: '2026',
      accent: '#0165CC',
      tags: ['Game design', 'Packaging', 'Web'],
      purpose: 'A six-player survival card game, boxed and playable online.',
      role: 'Game design, card and packaging design, web game design and build',
      live: [{ label: 'Play the game', href: 'https://workshop-game.conceptrotation.workers.dev' }],
      cover: { src: 'motion/the-workshop/the-workshop-3d-box.webp', alt: 'The Workshop box in 3D, a black lid with red, blue and purple shards and the title' },
      second: { src: 'the-workshop/box-net-lid.webp', alt: 'Lid net: black field with red, blue and purple shards and The Workshop title' },
      home: { layout: 'half', media: [
        { src: 'motion/the-workshop/the-workshop-3d-box.webp', alt: 'The Workshop box in 3D, a black lid with red, blue and purple shards and the title', ar: '1 / 1', fit: 'cover' },
        { src: 'the-workshop/game-table.webp', alt: 'Round table of the web game with gem cards in hand', ar: '1 / 1', fit: 'cover' }] },
      tile: { src: 'motion/the-workshop/the-workshop-thumb.mp4', poster: 'motion/the-workshop/the-workshop-thumb-poster.webp', alt: 'The Workshop box in 3D: the lid lifts and the gem and FORGED decks are dealt from the tray into six face-up piles', ar: '3 / 2', col: '1 / 7' },
      hero: { src: 'motion/the-workshop/the-workshop-thumb.mp4', poster: 'motion/the-workshop/the-workshop-thumb-poster.webp', alt: 'The Workshop box in 3D: the lid lifts and the gem and FORGED decks are dealt from the tray into six face-up piles', video: true, ar: '3 / 2' },
      idea: 'Gather, forge and be the last one standing. Six seats, one life each, 60 gem cards, 20 in each color. Three gems make a weapon.',
      chapters: [
        { label: 'Rules as identity', text: 'Three red make a Dagger, which strikes one player. Three blue make a Shield, which blocks one dagger. Three purple make a Hammer, which breaks a shield. One color per gem and per tool.',
          swatches: [['Red', '#F73130'], ['Blue', '#0165CC'], ['Purple', '#7B22B0'], ['Cream', '#F6F0EB'], ['Ink', '#1C1C1C']],
          media: [
            { src: 'motion/the-workshop/the-workshop-3d-cards.webp', alt: 'Close-up in 3D of the six dealt piles: red, blue and purple gems above dagger, shield and hammer', span: 'full' }
          ] },
        { label: 'Decks', text: 'A 60-card gem deck, 20 each of red, blue and purple, and a 30-card FORGED deck, 10 each of dagger, shield and hammer. One back per deck.',
          media: [
            { src: 'the-workshop/card-gem-red.webp', alt: 'Gem deck front: red gem', span: 'quarter', ar: '692 / 902', blend: true },
            { src: 'the-workshop/card-gem-blue.webp', alt: 'Gem deck front: blue gem', span: 'quarter', ar: '692 / 902', blend: true },
            { src: 'the-workshop/card-gem-purple.webp', alt: 'Gem deck front: purple gem', span: 'quarter', ar: '692 / 902', blend: true },
            { src: 'the-workshop/card-gem-forged.webp', alt: 'Gem deck back: a three-color gem', span: 'quarter', ar: '692 / 902', blend: true },
            { src: 'the-workshop/card-tool-dagger.webp', alt: 'FORGED deck front: dagger on red', span: 'quarter', ar: '817 / 1065', blend: true },
            { src: 'the-workshop/card-tool-shield.webp', alt: 'FORGED deck front: shield on blue', span: 'quarter', ar: '817 / 1065', blend: true },
            { src: 'the-workshop/card-tool-hammer.webp', alt: 'FORGED deck front: hammer on purple', span: 'quarter', ar: '817 / 1065', blend: true },
            { src: 'the-workshop/card-tool-forged.webp', alt: 'FORGED deck back: the word Forged over an anvil', span: 'quarter', ar: '817 / 1065', blend: true }
          ] },
        { label: 'Packaging', text: 'A black lid and a cream base, folded from two nets of the same angular shards.',
          media: [
            { src: 'motion/the-workshop/the-workshop-3d-box.webp', alt: 'The closed Workshop box in 3D, low three-quarter view', span: 'half' },
            { src: 'motion/the-workshop/the-workshop-3d-fan.webp', alt: 'The box open in 3D, lid aside, the two decks dealt into six face-up piles', span: 'half' },
            { src: 'the-workshop/box-net-lid.webp', alt: 'Lid net: black field with red, blue and purple shards and The Workshop title', span: 'half', blend: true },
            { src: 'the-workshop/box-net-base.webp', alt: 'Base net: cream field with red, blue and purple shards', span: 'half', blend: true }
          ] },
        { label: 'Web game', text: 'A round table, AI opponents in three difficulties, accounts, a collection and friendly battles for two to six players, in four languages.',
          media: [
            { src: 'the-workshop/hero-lobby.webp', alt: 'Web game lobby: the box art on black with red, blue and purple shards', span: 'full' },
            { src: 'the-workshop/game-table.webp', alt: 'Game in play with six seats around a round table', span: 'full' }
          ] }
      ]
    },
    {
      slug: 'diablo-iv',
      title: 'Diababy',
      year: '2023',
      accent: '#FE0000',
      tags: ['Concept', 'Typeface', 'Packaging', '3D'],
      purpose: 'Diablo IV reimagined through a plush baby devil, a spiked typeface and a heap of red-and-black packaging.',
      role: 'Self-directed rebrand concept for the Young Ones Brief: mascot, custom typeface, packaging and print, 3D',
      tile: { src: 'motion/diablo-iv/diababy-thumb.mp4', poster: 'motion/diablo-iv/diababy-thumb-poster.webp', alt: 'Diababy boxes, bags, guide books, cards and Baby Dia figures pouring onto the page, piling up and falling away', ar: '3 / 2', col: '7 / 13' },
      hero: { live: 'pour', src: 'motion/diablo-iv/diababy-pour-still.webp', alt: 'A heap of Diababy packaging on the page: Give ’Em Hell and Baby Dia boxes, shopping bags, guide books, cards and Baby Dia figures, all printed with the real dielines', ar: '16 / 9' },
      idea: 'Made for the Young Ones Brief, which asks entrants to reinterpret newly introduced brands and products in their own visual language. Diababy is a self-directed rebrand of Diablo IV around a plush baby devil, with a custom typeface, two boxes, a shopping bag, a guide book and cards in signal red and black. Every element was made for the project, from concept to final artwork. At the top of this page the packaging falls in live, every face printed from its own dieline.',
      chapters: [
        { label: 'Baby Dia', text: 'The mascot, as the guide book introduces it: Level 5, habitat Demon Dungeon, weapon Baby Fork. The same drawing is cut out as a standing figure.',
          media: [
            { src: 'diablo-iv/mascot-spread.webp', alt: 'Guide book spread presenting the new mascot character, Baby Dia, with a speech bubble and his level, habitat and weapon', span: 'wide' },
            { src: 'diablo-iv/die-cut.webp', alt: 'Baby Dia with his trident, on a die-cut outline', span: 'third', bg: '#FFFFFF' }
          ] },
        { label: 'SPIKETALK', text: 'A custom typeface drawn for the project, every letter grown into spikes. It sets the DIABLO IV wordmark on the boxes, bag, book and cards.',
          media: [
            { src: 'diablo-iv/spiketalk.webp', alt: 'SPIKETALK alphabet, A to Z, in red on black', span: 'full' }
          ] },
        { label: 'Flat to form', text: 'Both boxes share one net with tuck flaps: the special edition box says GIVE ’EM HELL over a star base, the Baby Dia box carries the mascot. The shopping bag puts the wordmark on the front and the illustration on the back. The film folds the special edition net along its own fold lines.',
          media: [
            { src: 'motion/diablo-iv/diababy-box-fold.mp4', poster: 'motion/diablo-iv/diababy-box-fold-poster.webp', alt: 'The special edition box net folding in 3D: walls and liners fold down, the star lid swings under and tucks in, and the closed box settles', span: 'full', video: true, ar: '16 / 9' },
            { src: 'diablo-iv/box1-net.webp', alt: 'Special edition box net: GIVE ’EM HELL lid, star base, DIABLO IV walls and rounded tuck flaps', span: 'half', bg: '#FFFFFF' },
            { src: 'diablo-iv/box2-net.webp', alt: 'Baby Dia box net: BABY DIA lid and walls on the same net', span: 'half', bg: '#FFFFFF' },
            { src: 'diablo-iv/bag-net.webp', alt: 'Shopping bag net: DIABLO IV front, two-color illustration back, gussets and base', span: 'full', bg: '#FFFFFF' }
          ] },
        { label: 'Guide book and cards', text: 'The guide book cover carries MARCH 16 and EARLY ACCESS; inside, the city illustration runs across a spread and GIVE ’EM HELL gets a spread of its own. Four cards: Baby Dia, the DIABLO IV wordmark, a random item gift card with a scratch panel, and a Blizzard card.',
          media: [
            { src: 'diablo-iv/book-spread-1.webp', alt: 'Guide book cover spread: MARCH 16, IV and EARLY ACCESS on black, DIABLO IV GUIDE BOOK and the demon mark on red', span: 'half' },
            { src: 'diablo-iv/book-spread-2.webp', alt: 'Guide book spread: a two-color city illustration', span: 'half' },
            { src: 'diablo-iv/book-spread-3.webp', alt: 'Guide book spread: GIVE ’EM HELL in SPIKETALK with a short text and platform icons', span: 'full' },
            { src: 'diablo-iv/card-1.webp', alt: 'Card: Baby Dia, level 5, Demon Dungeon, Baby Fork', span: 'quarter' },
            { src: 'diablo-iv/card-2.webp', alt: 'Card: the DIABLO IV wordmark on red', span: 'quarter' },
            { src: 'diablo-iv/card-3.webp', alt: 'Card: open beta early access random item gift card with a scratch panel', span: 'quarter' },
            { src: 'diablo-iv/card-4.webp', alt: 'Card: the Blizzard wordmark in red on black', span: 'quarter' }
          ] },
        { label: 'The set', text: 'The 2023 renders of the whole set: two shopping bags, both boxes, the guide book and cards, the standing Baby Dia, and the plush with the wordmark in 3D.',
          media: [
            { src: 'diablo-iv/set-2023-a.webp', alt: '2023 render: the two shopping bags, the standing Baby Dia, both boxes, the guide book and two stacks of cards', span: 'half' },
            { src: 'diablo-iv/set-2023-b.webp', alt: '2023 render: the set with the plush Baby Dia holding his trident and the DIABLO IV wordmark in 3D', span: 'half' }
          ] }
      ]
    },
    {
      slug: 'caustic-light',
      title: 'Caustic Light',
      year: '2026',
      accent: '#B8A6F0',
      tags: ['Interactive', 'Type', 'WebGL'],
      purpose: 'Light refracted through a computed diamond-glass surface and cast into drawings, words and letters.',
      role: 'Concept, design and code (WebGL)',
      live: [{ label: 'Try it', href: 'https://m2nwu.github.io/experiementstudies/caustic/' }],
      tile: { src: 'motion/caustic-light/caustic-light-thumb.mp4', poster: 'motion/caustic-light/caustic-light-thumb-poster.webp', alt: 'Drawing with light in Caustic Light: a mirrored stroke grows into a glowing six-fold form, then the words Caustic Type bend as the light moves', ar: '3 / 2', col: '1 / 13' },
      hero: { src: 'motion/caustic-light/caustic-light-thumb.mp4', poster: 'motion/caustic-light/caustic-light-thumb-poster.webp', alt: 'Drawing with light in Caustic Light, then the words Caustic Type cast through the glass', video: true, ar: '3 / 2' },
      idea: 'A standalone light piece built from the Caustic type experiment. For every shape the page computes a glass surface whose refraction gathers light into it on a floor below, then sends rays through that surface on the GPU in three spectral bands. The pointer steers the glass and the sun: draw with light, write a word, or open the whole character set cast in light.',
      chapters: [
        { label: 'Word and glyphs', text: 'Type a word and it is cast through the glass; the specimen casts every glyph of the set the same way.',
          media: [
            { src: 'motion/caustic-light/caustic-light-word.webp', alt: 'The words Caustic Type cast in light through diamond glass, with weight and pane controls', span: 'half' },
            { src: 'motion/caustic-light/caustic-light-glyphs.webp', alt: 'The glyph specimen: 214 characters, each cast in light', span: 'half' }
          ] }
      ]
    },
  ],

  archive: [
    { slug: 'm2nwu-departments', title: 'Departments', sub: 'Personal stationery system', line: 'Running daily life like a company, in four departments', year: '2025', accent: '#3B6551', disc: 'Identity',
      tags: ['Identity system', 'Stationery'],
      note: 'A self-initiated identity that runs daily life like a company in four departments: Health & Care, Administration & Information, Finance & Logistics, Research & Development. One stroke logic for the monograms, one color each, one strict template for covers, letters, cards and report forms.',
      thumb: 'm2nwu-departments/01-system-overview.webp', tile: { src: 'motion/m2nwu-departments/m2nwu-departments-thumb.mp4', poster: 'motion/m2nwu-departments/m2nwu-departments-thumb-poster.webp' },
      media: [
        { src: 'motion/m2nwu-departments/m2nwu-departments-thumb.mp4', poster: 'motion/m2nwu-departments/m2nwu-departments-thumb-poster.webp', alt: 'The stationery in 3D: covers, letters and cards land in a strict flat-lay grid, one row per department, and the cards turn over', span: 'half', video: true, ar: '4 / 5' },
        { src: 'm2nwu-departments/13-mark-sheet.webp', alt: 'The four department monograms under the M2NWU series mark', span: 'half', blend: true },
        { src: 'm2nwu-departments/01-system-overview.webp', alt: 'Overview of the four-department stationery system', span: 'full' },
        { src: 'm2nwu-departments/02-cover-health-care.webp', alt: 'Cover, Health & Care, forest green', span: 'quarter' },
        { src: 'm2nwu-departments/04-cover-admin-information.webp', alt: 'Cover, Administration & Information, petrol teal', span: 'quarter' },
        { src: 'm2nwu-departments/05-cover-finance-logistics.webp', alt: 'Cover, Finance & Logistics, saffron', span: 'quarter' },
        { src: 'm2nwu-departments/06-cover-research-development.webp', alt: 'Cover, Research & Development, vermilion', span: 'quarter' },
        { src: 'm2nwu-departments/03-letter-health-care.webp', alt: 'Letterhead, Health & Care', span: 'quarter' },
        { src: 'm2nwu-departments/14-letter-admin-information.webp', alt: 'Letterhead, Administration & Information', span: 'quarter' },
        { src: 'm2nwu-departments/15-letter-finance-logistics.webp', alt: 'Letterhead, Finance & Logistics', span: 'quarter' },
        { src: 'm2nwu-departments/07-letter-research-development.webp', alt: 'Letterhead, Research & Development', span: 'quarter' },
        { src: 'm2nwu-departments/08-card-health-care.webp', alt: 'Business card, Health & Care monogram', span: 'quarter' },
        { src: 'm2nwu-departments/09-card-admin-information.webp', alt: 'Business card, Administration & Information monogram', span: 'quarter' },
        { src: 'm2nwu-departments/10-card-finance-logistics.webp', alt: 'Business card, Finance & Logistics monogram', span: 'quarter' },
        { src: 'm2nwu-departments/11-card-research-development.webp', alt: 'Business card, Research & Development monogram', span: 'quarter' },
        { src: 'm2nwu-departments/16-card-back-health-care.webp', alt: 'Business card back, Health & Care', span: 'quarter' },
        { src: 'm2nwu-departments/17-card-back-admin-information.webp', alt: 'Business card back, Administration & Information', span: 'quarter' },
        { src: 'm2nwu-departments/18-card-back-finance-logistics.webp', alt: 'Business card back, Finance & Logistics', span: 'quarter' },
        { src: 'm2nwu-departments/19-card-back-research-development.webp', alt: 'Business card back, Research & Development', span: 'quarter' }
      ] },
    { slug: 'the-jacksons-live', title: 'The Jacksons Live', sub: '2022 Remastered', line: 'Reissuing a 1981 live album in one ultramarine violet', year: '2022', rank: 1, accent: '#5D2CE3', disc: 'Packaging',
      tags: ['Packaging', 'Lettering'],
      note: 'A present-day reissue of the 1981 live album. Ball-terminal display lettering, a brush script and a dense contour portrait of the five brothers, set in one ultramarine violet on lilac, with an alternate green-on-black edition.',
      thumb: 'the-jacksons-live/02-sleeve-front.webp', tile: { src: 'motion/the-jacksons-live/the-jacksons-live-thumb.mp4', poster: 'motion/the-jacksons-live/the-jacksons-live-thumb-poster.webp' },
      media: [
        { src: 'motion/the-jacksons-live/the-jacksons-live-thumb.mp4', poster: 'motion/the-jacksons-live/the-jacksons-live-thumb-poster.webp', alt: 'The LP sleeve in 3D turns from the tracklist to the front, and the record slides out sideways, label turning, then back in', span: 'full', video: true, ar: '3 / 2' },
        { src: 'motion/the-jacksons-live/the-jacksons-live-scarf.mp4', poster: 'motion/the-jacksons-live/the-jacksons-live-scarf-poster.webp', alt: 'Merchandise silk scarf in 3D with the script lettering, resting on the floor in soft folds', span: 'full', video: true, ar: '3 / 2' },
        { src: 'motion/the-jacksons-live/the-jacksons-live-scarf-still.webp', alt: 'Merchandise silk scarf in 3D: script lettering over the contour portrait, one corner folded', span: 'full' },
        { src: 'the-jacksons-live/02-sleeve-front.webp', alt: 'LP sleeve front in violet on lilac', span: 'half' },
        { src: 'the-jacksons-live/03-sleeve-back-tracklist.webp', alt: 'Sleeve back with tracklist', span: 'half' },
        { src: 'the-jacksons-live/05-gatefold-lettering.webp', alt: 'Banner artwork: script lettering over a contour portrait', span: 'full' },
        { src: 'the-jacksons-live/01-cover-epic-black.webp', alt: 'Night edition, violet on black', span: 'half' },
        { src: 'the-jacksons-live/06-epic-wordmark-green.webp', alt: 'EPIC wordmark, green edition', span: 'half' },
        { src: 'the-jacksons-live/07-medallion-5.webp', alt: 'Medallion with the five brothers in contour line', span: 'half' },
        { src: 'the-jacksons-live/04-vinyl.webp', alt: 'Vinyl record and label', span: 'half' }
      ] },
    { slug: "crafting-pinocchio", title: "Crafting Pinocchio", sub: "Exhibition identity", line: "A speculative exhibition identity: one condensed headline, one vermilion, cut-out photography.", year: "2023", accent: "#E85E37", disc: "Print", tags: ["Exhibition identity", "Poster", "Print"], note: "An imagined collaboration with the Museum of Modern Art for its Guillermo del Toro exhibition. The brief: translate the experience of the show, not an existing aesthetic, into a visual identity that puts clear information first.", thumb: "crafting-pinocchio/01-poster-through-april.webp", tile: {"src": "motion/crafting-pinocchio/crafting-pinocchio-thumb.mp4", "poster": "motion/crafting-pinocchio/crafting-pinocchio-thumb-poster.webp"},
      media: [
        {"src": "motion/crafting-pinocchio/crafting-pinocchio-thumb.mp4", "poster": "motion/crafting-pinocchio/crafting-pinocchio-thumb-poster.webp", "alt": "The Crafting Pinocchio guide opening in 3D as the three posters slide in above and two tickets slide out below", "span": "full", "video": true, "ar": "3 / 2"},
        {"src": "crafting-pinocchio/01-poster-through-april.webp", "alt": "Poster I, Through April 15", "span": "third"},
        {"src": "crafting-pinocchio/02-poster-nose.webp", "alt": "Poster II, the nose bridging the series", "span": "third"},
        {"src": "crafting-pinocchio/03-poster-del-toro.webp", "alt": "Poster III, Guillermo del Toro", "span": "third"},
        {"src": "motion/crafting-pinocchio/crafting-pinocchio-3d-closed.webp", "alt": "The closed guidebook in 3D, vermilion cover with the condensed wordmark", "span": "half"},
        {"src": "motion/crafting-pinocchio/crafting-pinocchio-3d-open.webp", "alt": "The guidebook open in 3D, the three posters above and two tickets below", "span": "half"},
        {"src": "crafting-pinocchio/04-guide-cover.webp", "alt": "Guidebook spread with large dates in vermilion", "span": "full", "bg": "#CCCCCC"},
        {"src": "crafting-pinocchio/05-guide-floor.webp", "alt": "Guidebook floor page, Floor T2 and T1", "span": "full"},
        {"src": "motion/crafting-pinocchio/crafting-pinocchio-3d-detail.webp", "alt": "Low close-up in 3D of the MoMA band on the guide and an admission ticket", "span": "full"},
        {"src": "crafting-pinocchio/06-tickets.webp", "alt": "Admission tickets with an asterisk-shaped window", "span": "wide", "cap": "Adult one-day pass, 15.04.23. The asterisk is cut as a window."}
      ] },
    { slug: 'the-vegetarian', title: 'The Vegetarian', sub: 'Book jacket', line: 'An American jacket for Han Kang’s novel, with a leaf in the G', year: '2023', accent: '#2F4A3A', disc: 'Editorial',
      tags: ['Book cover', 'Typography'],
      note: 'A jacket for Han Kang’s novel that imagines an American edition while keeping its Korean sensibility: a portrait dissolving into leaves, and a serif title with a leaf in the G.',
      thumb: 'the-vegetarian/02-book-mockup.webp', tile: { src: 'motion/the-vegetarian/the-vegetarian-thumb.mp4', poster: 'motion/the-vegetarian/the-vegetarian-thumb-poster.webp' },
      media: [
        { src: 'motion/the-vegetarian/the-vegetarian-thumb.mp4', poster: 'motion/the-vegetarian/the-vegetarian-thumb-poster.webp', alt: 'The hardcover in 3D wearing the jacket: it turns and the front board opens a little', span: 'half', video: true, ar: '4 / 5' },
        { src: 'motion/the-vegetarian/the-vegetarian-3d-open.webp', alt: 'The hardcover in 3D with the front board open', span: 'half' },
        { src: 'the-vegetarian/01-jacket-spread.webp', alt: 'Full jacket spread with flaps and spine', span: 'full' },
        { src: 'the-vegetarian/02-book-mockup.webp', alt: 'Book mockup, front and back', span: 'full' }
      ] },
  ]
};
