# Framework7 implementation
Visit [Framework7](https://framework7.io/)

##Introduction

Framework7 - is a free and open source mobile HTML framework to develop hybrid mobile apps or web apps with iOS & Android native look and feel. It is also an indispensable prototyping apps tool to show working app prototype as soon as possible in case you need to.

The main approach of the Framework7 is to give you an opportunity to create iOS & Android apps with HTML, CSS and JavaScript easily and clear. Framework7 is full of freedom. It doesn't limit your imagination or offer ways of any solutions somehow. Framework7 gives you freedom!

Framework7 is not compatible with all platforms. It is focused only on iOS and Google Material design to bring the best experience and simplicity.

Framework7 is definitely for you if you decide to build iOS or Android hybrid app (PhoneGap) or web app that looks like and feels as great native iOS and Google Material apps.

##Building the Application
First follow [Apache Cordova](https://cordova.apache.org/#getstarted) or [PhoneGap](http://docs.phonegap.com/getting-started/1-install-phonegap/cli/) install instrucctions.

Then install the needed NPM packages:

```
$ npm install
```

And setup project:

```
$ npm run setup
```

###Add your chosen platform

```
$ phonegap platform add android
$ phonegap platform add ios
```

###Develop

```
$ phonegap serve
```

###Build

```
$ phonegap build android
$ phonegap build ios
```

##Application Structure
+ `package.json`
+ `config.xml` - Cordova/PhoneGap configuration file
+ `\www`
  + `index.html` - Entry HTML for app.
  + `\res` - icons and splashscreens used by the app.
  + `\services` - Services to handle the communication to the Nestoria APIs and persist recent searches and favourites.
  + `\pages` - Includes a folder for each app page (view and logic).
  + `\assets` - Vendor and Custom JavaScript and styles.

