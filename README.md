## Description
ionic mobile app for Majlis Khuddam-ul-Ahmadiyya Mauritius's National Ijtema

## Features
- View programme
- Register for competitions
- View Leaderboard
- Receive news notifications (push notifications)
- Social media links

## TODO
- Improve backend signup process
- Add ability to register for blood donation

## Getting started with Development
```bash
$ sudo npm install -g ionic cordova
$ git clone https://github.com/shaan1337/ijtemaApp.git
$ cd ijtemaApp
$ npm install
$ cp ./src/providers/api/apiconfig.ts.example ./src/providers/api/apiconfig.ts #Edit apiconfig.ts to put the backend url
$ ionic serve
```

For push notifications, you also need to add `google-services.json` downloaded from your firebase project to the root directory.

## Deploying/Testing on Android
```bash
$ ionic cordova run android --device
```

## Creating a release build for Android
Follow the steps from this URL: https://ionicframework.com/docs/v1/guide/publishing.html

## All ijtemaApp projects
[ijtemaApp](https://github.com/shaan1337/ijtemaApp) - ionic mobile app  
[ijtemaApp-backend](https://github.com/shaan1337/ijtemaApp-backend) - backend to ijtemaApp  
[ijtemaApp-awsdeploy](https://github.com/shaan1337/ijtemaApp-awsdeploy) - deployment script to deploy ijtemaApp-backend AWS  