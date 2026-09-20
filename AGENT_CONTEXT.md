# Cloud agent context

## Goal

Continue developing `kushtaneja.com` from Cursor Cloud Agents, including from
mobile. Ask Kush what change to make before choosing an implementation.

## Current state

- This is the public GitHub repository `kushxtaneja/kushtaneja.com`.
- The new site is dependency-free HTML, CSS, and JavaScript.
- `index.html` contains the personal homepage and writing index.
- `app.js` contains a Web Audio API nature-sound mixer. It synthesizes rain,
  ocean, wind, and birds locally; there are no copyrighted audio assets.
- Existing articles still live on Posthaven and are linked from the writing
  index. They must be migrated before moving the domain away from Posthaven.
- The former local website path was
  `/Users/kushtaneja/Desktop/Moxie Assets/Cursor/website`, but that directory no
  longer exists.
- A likely earlier sound-player workspace existed at
  `/Users/kushtaneja/Documents/feelgood`, but the folder is empty. The current
  mixer was rebuilt from the idea rather than recovered source.

## Related repositories

- `https://github.com/kushxtaneja/pretext` contains the text-layout engine
  previously associated with the personal site. It is an independent library,
  not the missing website source.
- `https://github.com/kushxtaneja/yoyo` is a private memory repository with an
  Obsidian vault. Treat it as personal data; do not copy or expose its contents
  without explicit instruction.

## Working rules

- Work directly on `main` unless Kush requests a feature branch.
- Never push unless Kush explicitly asks.
- Do not invent or overwrite the site architecture before confirming the next
  task and deployment target.
- Keep personal data and credentials out of this public repository.
