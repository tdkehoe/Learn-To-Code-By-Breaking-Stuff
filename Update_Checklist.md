# Update Checklist

Start every week by updating your software.

1. Open the Macintosh App Store app and select "Update" in the top nav bar. This updates GUI apps.
2. Updating CLI apps is more work. Start with updating Homebrew: `brew update`.
3. Next, update your CLI apps installed with Homebrew: `brew upgrade`. This should update Git, Node, Mongod, and others.
4. Update Atom with `Atom > Check for Update`.
5. Update your Atom packages in `Atom > Preferences > Updates`.
6. Update your Node modules by installing the Node module npm-check: `npm install -g npm-check`. Then check your global Node modules by entering: `npm-check -gu`. Check your local Node modules from your project directory (where your `package.json` is): `npm-check`. To update your Node modules: `npm-check -u -g` or `npm-check -u`.
7. Oh-my-zsh will tell you when a Z shell update is available.
8. Microsoft Office will autoupdate if you set this in Help > Check For Updates
9. Chrome updates by opening the "Chrome > About Google Chrome" and then clicking the update button.
10. Chromium updates by downloading a new version. "Chromium > About Chromium" displays the version.
11. Chrome Canary auto-updates daily.
12. Intego NetUpdate.
13. Update nvm to update Node
  find latest version: https://github.com/creationix/nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
14. Check Node version: node -v
Update Node: find latest version https://nodejs.org/en/
nvm install 6.11.3
15. webdriver-manager update (updates Protractor)


brew
Check version:

1. Check your npm version: `npm -v` and check the current version listed in the footer of the [npm docs](https://dos.npmjs.com/getting-started/installing-node). Update npm: `npm install npm@latest -g`.
2. Check your MongoDB version: `mongod --version`.

npm
Update CDNs:

Use "^1.1.1" to automatically update CDNs. (This doesn't always work -- check error messages in the console.)

1. AngularJS: https://github.com/angular/angular.js/blob/master/CHANGELOG.md  (1.7.0 2018-5-11) (check if available https://cdnjs.com/libraries/angular.js/)
2. Firebase JavaScript SDK: https://firebase.google.com/support/release-notes/js (5.0.4, update in index.html)
3. Firebase Functions Node modules in `functions` directory:
Check with `npm list --depth=0` or `npm-check`.
Find latest versions:
https://www.npmjs.com/package/firebase-admin
https://www.npmjs.com/package/firebase-functions
https://www.npmjs.com/package/request
Update with `npm-check -u` or
`npm install --save firebase-admin@latest firebase-functions@latest` in the `functions` directory

npm list --depth=0

4. AngularFire: https://github.com/firebase/angularfire ("Removed change log and reset repo after 2.3.0 release")
5. UI Bootstrap: https://angular-ui.github.io/bootstrap/ (2.5.0)
6. Bootstrap CSS: http://getbootstrap.com/ (3.3.7) (4.0.0)
7. Videogular https://www.npmjs.com/package/videogular (2.2.1)
8. VLC https://www.videolan.org/vlc/download-macosx.html (3.0.1)

Update Firebase CLI with Node module updater or reinstall with `npm install -g firebase-tools`

To check what Node modules are installed:

`npm -g list --depth=0`npm-chec


rm -rf /usr/local/share/doc/homebrew
