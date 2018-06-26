This tutorial will build a Firebase web app from scratch.

#Install and Deploy Firebase

Follow the directions on the Firebase website to install the `firebase-tools` Node module. Use a npm update module to check if your `firebase-tools` are up-to-date.

```
npm install -g firebase-tools
```

Next, from your project root directory run

```
firebase init
```

This will ask some questions. Say "yes" to everything (several questions default to "no"). This should add three files to your project root directory:

```
.firebaserc
database.rules.json
firebase.json
```

Check your Firebase version:

```
firebase version
```

This will show you your version of the Firebase CLI tools. This isn't the same as the [Firebase JavaScript SDK](https://firebase.google.com/support/release-notes/js).

To update to the latest version of the `firebase-tools` Node module, run a Node module updater or re-install the module: `npm install -g firebase-tools`.


#Set Up Directory

We'll start in the CLI and make the directory and file structure.

## Directory Structure

Make a directory with your project name. Don't make it a subdirectory of a directory with a local Git repository. In the ```project-name``` directory make a ```public``` directory with two files:

```
mkdir project-name
cd project-name
touch .gitignore
mkdir public
cd public
touch app.js
touch index.html
ls
```

You should see:
```
├── database.rules.json
├── firebase.json
└── public
    ├── 404.html
    ├── app.js
    └── index.html
```

### Git Repository

Initialize a Git repository. In your GitHub account, click the ```+``` in the upper right corner to create a new repository. Name it with the same name as your project name.

GitHub will give you instructions to run in your CLI:

```
echo "# Project Name" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:myAccount/Project-Name.git
git push -u origin master
```

Change `myAccount` to your account name and `Project-Name` to your project name.

## index.html

Open the file `index.html` in your text editor. Type `html` followed by the `TAB` key to autofill from a snippet.

Your file should look like this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
</head>
<body>

</body>
</html>
```

Change line 2 from `<html>` to

```html
<html lang="en" ng-app="ProjectNameApp">
```

This declares that this will be an Angular app, and sets the name of the app. ```ng``` is short for _Angular_.

After line 4 add a content delivery network (CDN) for Angular:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-route.js"></script>
```

Change the version number `1.6.1` to the [latest version](https://angularjs.org/). We will use Angular 1. Don't use Angular 2, it's a different framework.

Alternatively you can [download Angular](https://angularjs.org/) and link to it locally. That's more reliable as you can use your app without an Internet connection. The CDN is easier to install and update.

Add a link to your stylesheet:

```html
<link rel="stylesheet" href="css/style.css">
```

Change `<title></title>` to `<title>Project Name</title>`.

In the `<body` put two lines:

```html
<div class="container">
  <div class="row text-center">
    <a ng-href="/#/projectname"><h1>Project Name</h1></a>
  </div>
  <ng-view />
</div>

<script type="text/javascript" src="app.js"></script>
```

The first line is a text header. The second line links to a JavaScript file.

Your `index.html` file should now look like this:

```html
<!DOCTYPE html>
<html lang="en" ng-app="ProjectNameApp">
<head>
  <meta charset="utf-8">
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-route.js"></script>
  <title>Project Name</title>
</head>
<body>

  <div class="container">
    <div class="row text-center">
      <a ng-href="/#/projectname"><h1>Project Name</h1></a>
    </div>
    <ng-view />
  </div>

</body>
</html>
```

###Add Firebase

Go to your Firebase console (on the Firebase website) and look for the code snippet to download. Add it to your `index.html` at the bottom of the `<body>` section. It should look like this:

```html
<script src="https://www.gstatic.com/firebasejs/3.6.8/firebase.js"></script>
<script>
// Initialize Firebase
var config = {
  apiKey: "2d28h-du29-d2h3d-32ud",
  authDomain: "project-name.firebaseapp.com",
  databaseURL: "https://project-name.firebaseio.com",
  storageBucket: "project-name.appspot.com",
  messagingSenderId: "3472394794238759"
};
firebase.initializeApp(config);
</script>
```

Next, add the Firebase components you'll use. You don't need to add all of these components:

```html
<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-messaging.js"></script>
<!-- Leave out Storage -->
<!-- <script src="https://www.gstatic.com/firebasejs/3.6.2/firebase-storage.js"></script> -->
```

###Add AngularFire

```html
<!-- AngularFire -->
<script type="text/javascript" src="https://cdn.firebase.com/libs/angularfire/2.3.0/angularfire.min.js"></script>
```

###Add Bootstrap

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="The coolest web app ever!">

<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-h9r934r74fh8374" crossorigin="anonymous">
<!-- UI Bootstrap-->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.1.3/ui-bootstrap-tpls.min.js"></script>
```

We use UI Bootstrap with Angular, not the standard Bootstrap, and we don't use jQuery with Angular. See [why]( https://scotch.io/tutorials/how-to-correctly-use-bootstrapjs-and-angularjs-together).

##app.js

Add the `firebase` module to Angular:

```javascript
var app = angular.module("LanguageTwoApp", ['ngRoute', 'ui.bootstrap', 'firebase']);
```

### Spin Up the Firebase Server

Spin up the Firebase server:

```
firebase serve
```

You should see your webpage at `http://localhost:5000/`.

> Open the browser console with ```option-⌘-J```. If a page fails to display correctly, read the error message.


### Add the Stylesheet

Double-check that you're in the ```public``` project  directory. Make this folder and file:

```
mkdir css
cd css
touch style.css
cd ..
```

Add a link to the stylesheet in the ```<head>``` section of ```index.html```:

```html
<link rel="stylesheet" href="css/style.css">
```

Note that stylesheet connect via ```link``` and ```href=``` from the ```<head>``` section, when JavaScript files connect via ```script``` and ```src``` typically from the bottom of the ```<body>``` section.

Open ```style.css``` in your text editor and enter this style:

```css
h1 {
  color: red
}
```

Refresh your browser and check if the stylesheet is hooked up:

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/angular_css_test.png)

Save your work to your GitHub repository:

```
git add .
git commit -m "CSS stylesheet hooked up!"
git push origin master
```

###Link Controllers and other JavaScript Files

These go at the bottom of the `<body>`:

```html
<script type="text/javascript" src="app.js"></script>
<script type="text/javascript" src="javascript/routes/routes.js"></script>
<script type="text/javascript" src="javascript/controllers/HomeController.js"></script>
<script type="text/javascript" src="javascript/controllers/ShowController.js"></script>
<script type="text/javascript" src="javascript/controllers/NewController.js"></script>
<script type="text/javascript" src="javascript/controllers/EditController.js"></script>
```

## Angular Directory Structure

Double-check that you're in the ```public``` directory. Make these folders and files:

```
mkdir javascript
cd javascript

mkdir controllers
cd controllers
touch HomeController.js
touch NewController.js
touch ShowController.js
touch EditController.js
cd ..

mkdir routes
cd routes
touch routes.js
cd ..

mkdir services
cd services
touch services.js
cd ..

mkdir templates
cd templates
touch home.html
touch new.html
touch show.html
touch edit.html
cd ..
cd ..
tree
```

You should see these folders and files in angular-app:

```
app.js
├── css
│   └── style.css
├── index.html
└── javascript
├── controllers
│   ├── EditController.js
│   ├── HomeController.js
│   ├── IndexController.js
│   ├── NewController.js
│   └── ShowController.js
├── routes
│   └── routes.js
├── services
│   └── services.js
└── templates
├── edit.html
├── home.html
├── new.html
└── show.html
```

> If ```tree``` doesn't work use ```ls```. ```tree``` may need to be installed?

###Deploy Your App To Firebase

```
firebase deploy
```

Go to the `Hosting URL` and you should see your app at the hosting address Firebase gives you:

```
https://my-project.firebaseapp.com/
```

#JavaScript Files

We'll set up a skeleton of Angular controllers, templates, and the router.

##Router

In `routes.js` add this code:

```javascript
app.config(function($routeProvider) {

  $routeProvider
  .when('/project', { // INDEX
    templateUrl: 'javascript/templates/home.html',
    controller: 'HomeController',
  })
  $routeProvider
  .when('/project/new', { // NEW
    templateUrl: 'javascript/templates/new.html',
    controller: 'NewController',
  })
  $routeProvider
  .when('/project/update', { // UPDATE
    templateUrl: 'javascript/templates/update.html',
    controller: 'UpdateController',
  })
  .when('/project/:id', { // SHOW
    templateUrl: 'javascript/templates/show.html',
    controller: 'ShowController',
  })
  .otherwise({ redirectTo: '/project' });
});
```

It's considered RESTful to include the project name in the URL. The four REST views are INDEX (master), SHOW (detail), NEW, and UPDATE.

##Home Controller

We'll set up  `HomeController.js` with `$firebaseArray` to get your full array of objects:

```javascript
app.controller('HomeController', ['$scope', '$firebaseArray', function($scope, $http, $firebaseArray) {
  console.log("Home controller.");

  // Create Firebase3 reference
  var ref = firebase.database().ref();

  // Access all objects in array
  $scope.movies = $firebaseArray(ref);

  // Initialize variable defaults

}]);
```
#Show Controller

We'll set up `ShowController.js` with `$firebaseObject` to get individual objects.

```javascript
app.controller('ShowController', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
  console.log("Show controller.");

  // Create Firebase3 reference
  var ref = firebase.database().ref();

  // Initialize variables

}]);
```

We'll skip `NewController.js` and `EditController.js` for now.
