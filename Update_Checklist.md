# Update Checklist

Start every week by updating your software.

1. Open the Macintosh App Store app and select "Update" in the top nav bar. This updates GUI apps.
2. Updating CLI apps is more work. Start with updating Homebrew: ```brew update```.
3. Next, update your CLI apps installed with Homebrew: ```brew upgrade```. This should update Git, Node, Mongod, and others.
4. Update Atom with ```Atom > Check for Update```.
5. Update your Atom packages in ```Atom > Preferences > Updates```.
6. Update your Node modules by installing the Node module npm-check: ```npm install -g npm-check```. Then check your global Node modules by entering: ```npm-check -g```. Check your local Node modules from your project directory (where your ```package.json``` is): ```npm-check```. To update your Node modules: ```npm-check -u -g``` or ```npm-check -u```.
7. Oh-my-zsh will tell you when a Z shell update is available.

Check version:

1. Check your npm version: ```npm -v``` and check the current version listed in the footer of the [npm docs](https://dos.npmjs.com/getting-started/installing-node). Update npm: ```npm install npm@latest -g```.
2. Check your MongoDB version: ```mongod --version```.
