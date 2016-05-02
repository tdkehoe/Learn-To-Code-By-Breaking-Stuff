# Firebase Project: Make the CRUDiest Movies Database

Firebase is a NoSQL cloud database service. Storing your data in the cloud has become popular for a variety of reasons. To explain the advantages of Firebase, allow me to walk through my twenty years of building websites. In the 1990s we built static websites by hand-coding HTML. The World Wide Web (WWW) enabled users to look up information but websites weren't interactive. The browser sent an _HTTP request_ to the server, which served an HTML file to the browser, and the browser rendered the HTML code for the user to see. Then the user clicked a link, which sent another HTTP request to the server for another webpage, and so on.

In 1999 I wrote the first documentation for using a new language called Personal Home Page (PHP) with a new database called MySQL. My documentation became the most popular and highest-rated download from the website DevShed.com. Being able to (relatively) easily connect a database to your HTML enabled customers to do things such as make dating website profiles. Soon the WWW was dominated by websites where users stored stuff in databases, e.g., MySpace.com and Facebook.com. We wrote static HTML webpages but inserted PHP code to get data to fill in spaces on the webpage, such as a user's name or picture. The browser sent an HTTP request to the server, which ran PHP, Java, or another programming language to translate the HTTP requests into SQL queries. The data filled in the spaces of a static webpage with dynamic content, then served it to the browser.

The next step was _dynamic websites_, in which a database retrieved parts of a website and assembled the parts into webpages. No longer did webmasters have to write HTML. Instead we used _content management systems_ (CMS) such as WordPress. A blogger could set up a complex website by plugging in modules, with little or no coding knowledge. With Ruby on Rails (RoR) developers could spin up a website in hours instead of weeks, plugging in modules for almost anything. The browser sent an HTTP request to the server, which hit the database perhaps hundreds of times to assemble the webpage, then rendered the webpage and served it to the browser. The user clicked on a button or a link, another HTTP request went to the server, the server hits the database perhaps hundreds more times, etc.

Dynamic websites are slow. Users click and wait while a lot of stuff happens on the server, before their page loads. Webmasters have to design websites to minimize clicks or users will bounce, and then pay top dollar for the fastest hosting services, and their websites are still slow.

Vast numbers of software engineers work at companies with SQL back ends, coding in PHP, C, Java, or Python. With SQL a database administrator must set up the _schema_ or structure of the database. The arrays and objects that software developers create must be translated into tables of columns and rows. Like most professions, learning the work isn't easy, but once you learn it you can expect to do the same stuff every day for the next twenty years.

The next step was JavaScript. JavaScript is the only language that runs in the browser. Initially JavaScript did only minor tasks on websites but then frameworks such as Angular were developed. Initially the browser sends an HTTP request to the server, but the server sends not a rendered webpage but an application that runs on the user's computer, in the browser. The user clicks on buttons and the app does stuff, such as opening a calendar, without going back to the server. The user interface or user experience (UI/UX) is fast, practically instantaneous.

JavaScript web apps still need data. An app can open a calendar, but to open a calendar of your AirBnB reservations that app has to send an HTTP request to the server to access the database and send back data. This is faster than a client-server website because only small amounts of data are requested (instead of entire webpages), and the webpages (now called _views_) don't have to be rendered each time they change, as only the parts that change are updated.

With JavaScript web apps the _back end_ servers do little. The servers just translate HTTP requests into SQL queries and send data in HTTP responses. _NoSQL databases_ eliminate the translation into SQL queries. NoSQL databases store arrays of objects, connecting seamlessly to programming languages, especially JavaScript and JavaScript Object Notation (JSON). A NoSQL server can be spun up in a few hours, and after that there's little or nothing to do on the back end.

## What Is Firebase?

Firebase is a NoSQL cloud database. You write your front-end app in Angular, React, or another framework. You use the ```$firebaseArray``` and ```$firebaseObject``` _services_ in your controllers to _bind_ your local arrays and objects to arrays and objects in the remote database. Your local arrays and objects stay synchronized to the remote database without HTTP requests or database queries.

When data changes in Firebase the app updates, and vice versa. In contrast, with a client-server structure the app only updates when the browser sends an HTTP request to the server, usually when the user clicks something. If you order a pizza and the driver's GPS is constantly sending updates, you don't want to have to click every five seconds to get new data. You want the app to show the driver getting closer to you without you having to click anything.

A third service, ```$firebaseAuth```, creates an _auth object_ to log in a user, authorize which views the user can access, what data the user can read or write, etc.

With Firebase, front-end developers can focus on the UI/UX without thinking about the back end. Compare the [CRUDiest Movies Database](https://crudiest-firebase.firebaseapp.com/#/movies) to the [Internet Movies Database](http://www.imdb.com/) (IMDb). The IMDb feels like it was written a long time ago in a galaxy far, far away. In contrast, the Firebase app feels like it's a native app, i.e., as if the movies are on your computer.

To reiterate the reasons to use Firebase:

* You don't need to run a server. Servers take time to set up, and then can crash or are shut down by your host for maintenance. A Node/Express/MongoDB server adds no value to your website, i.e., it doesn't do anything that you can't do in a front-end framework such as AngularJS (e.g., routing).
* Data binding synchronizes your local arrays and objects to the remote arrays and objects. You don't have to write HTTP requests or database queries. Your users don't have to click to see updated data.
* Firebase handles authorization and authentication for you, including OAuth2, e-mail & password login, and routing authorization.

## And Why Another Movies Database?

Every coding bootcamp student makes a movies database for their mid-term project. For my graduation project at Galvanize I made an advanced web platform that enabled users to interact with each other while running JavaScript apps collaboratively. Jaws dropped when I presented my project at graduation. No one had ever seen anything like it, and they recognized that they were seeing the future of the web.

Hiring managers were less impressed. The website does nothing if no one else is on it. My description with phrases like "collaborative realtime JavaScript apps" meant nothing to them. I pictured a hiring manager going through a stack of resumes, clicking on project after project, spending no more than seconds on each. I decided to make another movies database. Hiring managers have seen hundreds of movie databases, they know what to expect, and can be quickly impressed by a well-executed movies database.

## Directory Structure

Set up this directory structure:

```
└── CRUDiest-Movies-Firebase
    ├── .gitignore
    └── public
        ├── app.js
        ├── css
        │   ├── fonts
        │   └── style.css
        ├── index.html
        ├── javascript
        │   ├── controllers
        │   │   ├── HomeController.js
        │   │   └── ShowController.js
        │   ├── routes
        │   │   └── routes.js
        │   ├── services
        │   └── templates
        │       ├── home.html
        │       └── show.html
        ├── resume
```

These commands should create these directories and files:

```
mkdir CRUDiest-Movies-Firebase
cd CRUDiest-Movies-Firebase
touch .gitignore
mkdir public
cd public
touch app.js
touch index.html
mkdir css
cd css
mkdir fonts
touch style.css
cd ..
mkdir javascript
cd javascript
mkdir controllers
cd controllers
touch HomeController.js
touch ShowController.js
cd ..
mkdir routes
cd routes
touch routes.js
cd ..
mkdir services
mkdir templates
cd templates
touch home.html
touch show.html
cd ..
cd ..
mkdir resume
cd ..
cd ..
tree
```

## Open a Firebase Account

If you haven't already, [sign up for a free Firebase account](https://www.firebase.com/).

Create an app, then follow the instructions to install ```firebase-tools``` from the command line (CLI):

```
npm install -g firebase-tools
```

This installs ```firebase-tools``` globally so you don't have to do this for every project.

Deploy your app from your project root directory, i.e., from ```CRUDiest-Movies-Firebase```:

```
firebase init
```

This creates a ```firebase.json``` file.

Then upload your files with

```
firebase deploy
```

## GitHub Repository

In your GitHub account, click the ```+``` in the upper right corner to create a new repository. Name it ```CRUDiest Movies Firebase```. Don't check the box for "Initialize this repository with a README".

GitHub will give you instructions to run in ```CRUDiest-Movies-Firebase```:

```
echo "# CRUDiest-Movies-Firebase" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:myAccount/CRUDiest-Movies-Firebase.git
git push -u origin master
```

Change ```myAccount``` to your GitHub account name.

Check that your files uploaded to your GitHub repository.

## index.html

Open the file ```index.html``` in your text editor. If you're using Atom, Type ```html``` followed by the ```TAB``` key to autofill from a snippet.

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

Change line 2 from ```<html>``` to

```html
<html lang="en" ng-app="CRUDiestMovies">
```

This declares that this will be an Angular app, and sets the name of the app. ```ng``` is short for _Angular_.

Below ```<meta charset="utf-8">``` add three more ```<meta>``` tags:

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Firebase CRUD app with AngularJS, Bootstrap, and asynchronous typeahead.">
```

The first two set up responsive views for Bootstrap. The third is used by search engines to describe your website.

Change ```<title></title>``` to ```<title>CRUDiest Movies Firebase</title>```.

Hook up the style sheet in the ```<head>``` secton:

```html
<link rel="stylesheet" href="css/style.css">
```

In the ```<body``` add a text header and then hook up the JavaScript files:

```html
<h1>CRUDiest Movies Firebase</h1>

<script type="text/javascript" src="app.js"></script>
<script type="text/javascript" src="javascript/routes/routes.js"></script>
<script type="text/javascript" src="javascript/controllers/HomeController.js"></script>
<script type="text/javascript" src="javascript/controllers/ShowController.js"></script>
```

## AngularFire

Firebase has a "vanilla" interface that we won't be using. It also has interfaces for five frameworks:

* GeoFire for realtime location queries.
* AngularFire for AngularJS.
* EmberFire for Ember.
* ReactFire for React.
* Ionic for developing hybrid mobile apps with AngularFire.

We'll use the AngularFire bindings.

To use AngularFire we need AngularJS, Firebase, and AngularFire. For this project we'll also need the Angular router, Bootstrap, and UI Bootstrap. Install these content delivery networks (CDN) in the ```<head>``` section of ```index.html```;

```html
<!-- AngularJS -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-route.js"></script>

<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-..." crossorigin="anonymous">
<!-- UI Bootstrap-->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.2/ui-bootstrap-tpls.min.js"></script>

<!-- Firebase -->
<script type="text/javascript" src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
<!-- AngularFire -->
<script type="text/javascript" src="https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"></script>
```

The ```Bootstrap CSS``` requires that you download your own copy with a complete hash number (starting with ```sha384-```).

Update the version numbers now for
1. Angular: https://angularjs.org/ (Don't use Angular 2, it's a different framework.)
2. Bootstrap CSS: http://getbootstrap.com/
3. UI Bootstrap: https://angular-ui.github.io/bootstrap/
4. Firebase: https://www.firebase.com/docs/web/changelog.html
5. AngularFire: https://www.firebase.com/docs/web/libraries/angular/changelog.html

Every Monday morning I go through my [checklist of software updates](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/Update_Checklist.md).

Alternatively you can [download Angular](https://angularjs.org/) and the other libraries and link to them locally. That's more reliable as you can use your app without an Internet connection. The CDN is easier to install and update. To update it you just change the version number.

## Finish index.html

Your ```index.html``` should now look like:

```html
<!DOCTYPE html>
<html lang="en" ng-app="CRUDiestMoviesApp">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Firebase CRUD app with AngularJS, Bootstrap, and asynchronous typeahead.">
  <title>CRUDiest Movies Database</title>

  <!-- AngularJS -->
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular-route.js"></script>

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-..." crossorigin="anonymous">
  <!-- UI Bootstrap-->
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.2/ui-bootstrap-tpls.min.js"></script>

  <!-- Firebase -->
  <script type="text/javascript" src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
  <!-- AngularFire -->
  <script type="text/javascript" src="https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"></script>

  <link rel="stylesheet" href="css/style.css">

</head>
<body>

  <h1>CRUDiest Movies Database</h1>

  <script type="text/javascript" src="app.js"></script>
  <script type="text/javascript" src="javascript/routes/routes.js"></script>
  <script type="text/javascript" src="javascript/controllers/HomeController.js"></script>
  <script type="text/javascript" src="javascript/controllers/ShowController.js"></script>

</body>
</html>
```

Open your browser to the URL that Firebase provided to you. It prints after you run ```firebase deploy```. You should see your ```<h1>``` header:

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/crudfb-header.png)

Save to GitHuB and deploy to Firebase

```
git status
git add .
git commit -m "Finished index.html."
git push origin master
firebase deploy
```
