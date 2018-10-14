## TODO for MKA Ijtema 2018
- When seeding Competitions table in database, do upserts instead of creating new items each time (otherwise, the IDs change every time on startup and mapping gets messed up)
- Sort data by ID when outputting CSVs /api/registrations/[literary|sport]
- Trace the logo and make it a transparent PNG (Push notifications logo currently appears as a square white box)
- Improve backend signup process
- Add ability to register for blood donation
- Test news notifications again (there was a bug where message was not appearing)

## Getting started with Development
```bash
$ sudo npm install -g ionic cordova
$ git clone https://github.com/shaan1337/ijtemaApp.git
$ cd ijtemaApp
$ npm install
$ cp ./src/providers/api/apiconfig.ts.example ./src/providers/api/apiconfig.ts #Edit apiconfig.ts to put the backend url
$ ionic serve
```