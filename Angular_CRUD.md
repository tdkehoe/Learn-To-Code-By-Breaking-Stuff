# Building the Angular Front End of the CRUDiest Movies Database

In this section you'll built the front end of the CRUDiest Movies Database. You'll design an attractive web app running in the browser. We'll use the front-end _framework_ Angular. Angular is made by Google and is one of the two most popular front-end frameworks. (The other is React.)

Prerequisites: This section assumes that you've completed the section "Building the Node/Express/MongoDB Back End of the CRUDiest Movies Database".

## Directory Structure

Make a directory called ```angular-app```. Don't make it a subdirectory of a directory with a local Git repository. In the ```angular-app``` directory make two files and a subdirectory with one file:

```
mkdir angular-app
cd angular-app
touch app.js
touch index.html
ls
```

### Git Repository

Initialize a Git repository. In your GitHub account, click the ```+``` in the upper right corner to create a new repository. Name it ```CRUDiest Movies Database Angular Front End```.

GitHub will give you instructions to run in your CLI:

```
echo "# CRUDiest-Movies-Database-Angular-Front-End" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:myAccount/CRUDiest-Movies-Database-Angular-Front-End.git
git push -u origin master
```

Change ```myAccount``` to your account name.

### .gitignore?

## index.html

Open the file ```index.html``` in your text editor. Type ```html``` followed by the ```TAB``` key to autofill from a snippet.

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

After line 4 add a content delivery network (CDN) for Angular:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0/angular.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0/angular-route.js"></script>
```

You can change the version number ```1.5.0``` to the [latest version](https://angularjs.org/). We will use Angular 1. Don't use Angular 2, it's a different framework.

Alternatively you can [download Angular](https://angularjs.org/) and link to it locally. That's more reliable as you can use your app without an Internet connection. The CDN is easier to install and update. To update it you just change the version number.

Change ```<title></title>``` to ```<title>CRUDiest Movies Database</title>```.

In the ```<body``` put two lines:

```html
<h1>CRUDiest Movies Database</h1>

<script type="text/javascript" src="app.js"></script>
```

The first line is a text header. The second line links to a JavaScript file.

Your ```index.html``` file should now look like this:

```html
<!DOCTYPE html>
<html lang="en" ng-app="CRUDiestMovies">
<head>
<meta charset="utf-8">
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0/angular.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0/angular-route.js"></script>
<title>CRUDiest Movies Database</title>
</head>
<body>

<h1>CRUDiest Movies Database</h1>

<script type="text/javascript" src="app.js"></script>

</body>
</html>
```

## app.js

Open ```app.js``` in your text editor. Put in this line:

```js
var app = angular.module("CRUDiestMoviesApp", ['ngRoute']);
```

This creates an Angular app called ```CRUDiestMoviesApp```. The convention is for Angular apps to end with ```App```. Our app has one _dependency_, a module called ```ngRoute```.  This is Angular's router. Angular has its own routes because we're making a separate app from our Express app, which has its own router.

### Test Angular

Globally install the Node module ```http-server```:

```
npm install http-server -g
```

This is simple Node server requiring zero configuration. It always uses port 8080, i.e., it will open your browser to ```http://127.0.0.1:8080/```.

From the ```angular-app``` project root directory spin up a server:

```
http-server -c-1 -o
```

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/angular_test.png)

You should see your webpage with the header.

> ```-c-1``` disables caching. ```-o``` opens a browser window.

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular hooked up!"
git push origin master
```

> Open the browser console with ```option-⌘-J```. If a page fails to display correctly, read the error message.

### Add the Stylesheet

Double-check that you're in the ```angular-app``` project root directory. Make this folder and file:

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

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/angular_css_test.png)

Save your work to your GitHub repository:

```
git add .
git commit -m "CSS stylesheet hooked up!"
git push origin master
```

## Angular Directory Structure

Double-check that you're in the ```angular-app``` directory. Make these folders and files:

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

## README.md

Include instructions to your ```README.md``` file for starting your app:

```
express-app
nodemon
mongod

angular-app
http-server -c-1 -o  

test with Postman
GET http://localhost:3000/movies/
```

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular directory structure, README.md finished!"
git push origin master
```

## Angular Routes

A CRUD app with four views needs four routes and four controllers.

The order of the routes matters. The SHOW route must be at the bottom, as it catches the other routes.

Open your Angular ```routes.js``` file and enter these routes:

```js
app.config(function($routeProvider) {

  $routeProvider
  .when('/movies', { // INDEX
    templateUrl: 'javascript/templates/home.html',
    controller: 'HomeController'
  })
  .when('/movies/new', { // must be above '/:id' otherwise it'll think that the ID is 'new'
  templateUrl: 'javascript/templates/new.html', // NEW
  controller: 'NewController'
})
.when('/movies/:id/edit', { // UPDATE
  templateUrl: 'javascript/templates/edit.html',
  controller: 'EditController'
})
.when('/movies/:id', { // SHOW
  templateUrl: 'javascript/templates/show.html',
  controller: 'ShowController'
})
.otherwise({ redirectTo: '/movies' });
});
```

The first line adds or configures the ```$routeProvider``` function to the ```app``` object. each of the four routes starts with ```.when``` followed by a route:

* ```/movies``` is the home page or ```INDEX``` route, where all records are displayed.
* ```/movies/new``` provides a form for entering a new movie, called the ```NEW``` route.
* ```/movies/:id``` displays one movie, dynamically identified by its ID number, called the ```SHOW``` route.
* ```/movies/:id/edit``` provides a form for editing a movie, called the ```EDIT``` route.

The ```.otherwise``` route redirects any other requests to the home page.

The ```/movies/:id/edit``` must be above the ```/movies/:id``` route because a URL such as ```/movies/123abc/edit``` will be caught by both ```/movies/:id``` and ```/movies/:id/edit```. We want it to be caught only by ```/movies/:id/edit```.

> The dynamic URLs (with the ID numbers) are what Node does easily that's hard to do with Apache.

### Test Controllers

You made a directory ```javascript``` with a subdirectory ```controllers```. In that subdirectory are four files:

* ```EditController.js```
* ```HomeController.js```
* ```NewController.js```
* ```ShowController.js```

Open each file in your text editor and enter this code:

```js
app.controller('HomeController', ['$scope', function($scope) {
  $scope.message = "Connected";
}]);
```

Change ```HomeController``` to ```EditController``` etc.

This creates an Angular _controller_, one of the three legs of a _Model-View-Controller_ (MVC) web app. The controller integrates the views (HTML pages) with the models (data).

Each controller has one dependency ```$scope```. This is an object that provides local variables. We attached the property ```message``` to this object, with the value ```"Connected"```.

Link your ```index.html``` file to the routes and controllers:

```html
<script type="text/javascript" src="javascript/routes/routes.js"></script>
<script type="text/javascript" src="javascript/controllers/EditController.js"></script>
<script type="text/javascript" src="javascript/controllers/HomeController.js"></script>
<script type="text/javascript" src="javascript/controllers/NewController.js"></script>
<script type="text/javascript" src="javascript/controllers/ShowController.js"></script>
```

In the ```<body>``` of ```index.html``` put in this directive:

```js
<ng-view>
```

This is the Angular directive (it starts with ```ng-```) for displaying a view.

Your ```index.html``` file should now look like this:

```html
<!DOCTYPE html>
<html lang="en" ng-app="CRUDiestMoviesApp">
<head>
<meta charset="utf-8">
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0/angular.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0/angular-route.js"></script>
<link rel="stylesheet" href="css/style.css">
<title>CRUDiest Movies Database</title>
</head>
<body>

<h1>CRUDiest Movies Database</h1>

<ng-view>

<script type="text/javascript" src="app.js"></script>
<script type="text/javascript" src="javascript/routes/routes.js"></script>
<script type="text/javascript" src="javascript/controllers/EditController.js"></script>
<script type="text/javascript" src="javascript/controllers/HomeController.js"></script>
<script type="text/javascript" src="javascript/controllers/NewController.js"></script>
<script type="text/javascript" src="javascript/controllers/ShowController.js"></script>

</body>
</html>
```

In the directory ```javascript``` look for a subdirectory ```templates```. In that subdirectory are four _view_ files:

* ```edit.html```
* ```home.html```
* ```new.html```
* ```show.html```

In each of these views enter code:

```html
<h2>Home</h2>

{{message}}
```

Change ```Home``` to ```New``` etc.

Refresh your browser and go to:

* [http://127.0.0.1:8080/#/](http://127.0.0.1:8080/#/)
* [http://127.0.0.1:8080/#/new](http://127.0.0.1:8080/#/new)
* [http://127.0.0.1:8080/#/show](http://127.0.0.1:8080/#/show)
* [http://127.0.0.1:8080/#/edit](http://127.0.0.1:8080/#/edit)

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/angular_show.png)

Notice a couple things. First, there's a pound sign or hashtag ```#``` in the URL.

Second, the ```EDIT``` route displays the ```SHOW``` page. This is correct until we hook up the database.

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular controllers and views hooked up!"
git push origin master
```

## Connect Angular to Express

Open ```new.html``` and replace the code with this code:

```html
<h2>Enter a New Movie</h2>

<form ng-submit="addMovie()" name="newMovie">
<label for="movieName">Movie: </label>
<input type="text" name="movieName" ng-model="movie.movieName" /><br />
<label for="moviePerson">Who To Blame: </label>
<input type="text" name="moviePerson" ng-model="movie.moviePerson" /><br />
<label for="movieYear">Year: </label>
<input type="number" name="movieYear" ng-model="movie.movieYear" /><br />
<label for="movieSummary">Summary: </label>
<input type="text" name="movieSummary" ng-model="movie.movieSummary" /><br />
<label for="moviePoster">Poster: </label>
<input type="url" name="moviePoster" ng-model="movie.moviePoster" /><br />
<label for="movieRating">Rating:</label>
<select name="movieRating" ng-model="movie.movieRating">
<option value="-1">-1</option>
<option value="-2">-2</option>
<option value="-3">-3</option>
<option value="-4">-4</option>
<option value="-5">-5</option>
</select><br />

<input type="submit" value="Add Movie"></input>
</form>
```

Refresh your browser to ```http://127.0.0.1:8080/#/new```:

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/new_movie.png)

We've created a form with six data entry fields plus a submit button.

The form includes ```ng-submit="addMovie()"```. This is the Angular directive for submitting a form. When the user clicks ```Submit``` the form triggers the ```addMovie()``` function.

> This is an example of an _event-driven_ web app. The user entering data and then clicking ```Submit``` is an event, which the website responds to.

Each data entry field has a ```<label>``` and and ```input``` field. This are connected by the same values in ```<label for=``` and ```<input name=```.

Most of the data entry fields are type ```text```. One is a ```number``` and one is a ```url```. The ```url``` field has ????, try entering something other than a URL and you'll see a yellow warning flag.

There are many other [input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

Most of the data entry fields use ```ng-model```. This Angular directive binds an ```input```, ```select```, or ```textarea``` data entry field to a property on the ```$scope```. Angular's views and controllers can be thought of as its front end and back end. In this form we're working on the view or the front end that the user sees. The controllers work on local variables (the ```$scope```) which are out of the user's sight, like a back end. ```ng-model``` binds data between the view and the ```$scope```. The data entered as ```movie.movieName``` becomes ```$scope.movie.movieName```.

Open ```NewController.js``` and replace the code with this code:

```js
app.controller('NewController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  console.log("New controller.");
  $scope.addMovie = function(movie){
    var movie = {
      movieName:  $scope.movie.movieName,
      moviePerson: $scope.movie.moviePerson,
      movieYear: $scope.movie.movieYear,
      movieSummary: $scope.movie.movieSummary,
      moviePoster: $scope.movie.moviePoster,
      movieRating: $scope.movie.movieRating
    }
    $http.post('http://localhost:3000/movies/movies/', movie).then(function(response) { // NEW
      console.log("Movie added.");
      $location.path( "/movies" );
    }, function(response) {
      console.log("Error, no movie added.");
    });
  }
}]);
```

On line 1, note that we now have three services (dependencies):

* ```$scope``` creates local variables.
* ```$http``` facilitates communication with remote HTTP servers. It's used on line 19 when we post data to ```http://localhost:3000/movies/movies/```.
* ```$location``` parses the URL in the browser address bar and makes the URL available to your application. It's used on line 21 when we return the user to the home page.

Note that services are listed twice on line 1, first as dependencies and then in the callback function. As dependencies they are in quotation marks (use single quotes) but in the callback function they don't use quotation marks.

Line 2 prints in the ```console.log``` that the ```New``` controller was called. This will help us in debugging.

Lines 3 through 18 are the ```$scope.addMovie``` function. Recall that in the view we have ```ng-submit="addMovie()"```. When the form is submitted the function ```addMovie()``` is executed.

Lines 3 through 11 create an object called ```movie``` with six properties, bound to the six data entry fields in the view.

After the ```movie``` object is created, lines 12 through 17 create an HTTP POST request to the specified URL and send the ```movie``` object. ```.then``` is a promise. When the server sends a ```200``` (OK) response we print to the ```console.log``` that the movie was added, and the user is redirected to the home page. If the server returns an error then this is noted in the ```console.log```.

Enter a movie in your form and click ```Submit```. If you have your console open (```control-⌘-J```) you should see ```New controller.``` and then ```Movie added.```. Open Postman and send a ```GET``` request to ```localhost:3000/movies/movies/``` and your movie should be there.

> Why it's ```localhost:3000/movies/movies/``` instead of ```localhost:3000/movies/``` is a mystery I've never figured out! We're including ```movies``` in every URL because this is best practices for ReSTful CRUD apps.

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular sending data to the database from the CREATE route!"
git push origin master
```

### Angular INDEX Route

This route displays all the records in ```home.html```.

Open ```HomeController.js``` and replace the code with this code:

```js
app.controller('HomeController', ['$scope', '$http', function($scope, $http){
  console.log("Home controller.");
  $http.get('http://localhost:3000/movies//movies').then(function(response) { // INDEX
    $scope.movies = response.data;
  }, function(response) {
    console.log("Error, no data returned.");
  });
}]);
```

Line 3 sends a ```GET``` request to the server. Line 4 takes the response (which is a JSON object) and attaches it to the ```$scope```, where it will be available to the view.

Open ```home.html``` and replace the code with this code:

```html
<div ng-repeat="movie in movies">
<span>{{movie.movieName}}</span><br />
<span>{{movie.moviePerson}}</span><br />
<span>{{movie.movieYear}}</span><br />
<span>{{movie.movieSummary}}</span><br />
<span><img class="moviePoster" ng-src="{{movie.moviePoster}}"></span><br />
<span>{{movie.movieRating}}</span>
<br />
</div>
```

Open your browser to ```http://127.0.0.1:8080/#/``` and you should see all your records:

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/movies_index.png)

Line 1 uses the Angular directive ```ng-repeat```. This binds to the array (JSON object) ```$scope.movies``` that was created in ```HomeController.js```. ```movie``` refers to each element (object) in the array. ```movieName``` etc. are the properties of the objects. Angular then just spins out the data however you set it up.

Line 6 is a little different. We're specifying that we want an image, and using the Angular directive ```ng-src```. The data is a URL for the image.

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular INDEX route working!"
git push origin master
```

### Angular NEW Route

The ```NEW``` route takes the user to ```new.html```. No Angular controller or Express route is needed because no data is fetched from the database. All you need is an anchor link in ```home.html```:

```js
<a href="/#/movies/new"><button>Add a new movie</button></a>
```

### Angular SHOW Route

The SHOW route shows one movie from the database.

In ```ShowController.js``` replace the code with this code:

```js
app.controller('ShowController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
  console.log("Show controller.");
  $http.get('http://localhost:3000/movies//movies/' + $routeParams.id).then(function(response) { // SHOW
    $scope.movie = response.data;
    console.log($scope.movie);
  }, function(response) {
    console.log("Error, no data returned.");
  });
}]);
```

Note the new Angular service ```$routeParams```. We use this in line 3 when we add the database record ID to the URL.

In ```show.html``` replace the code with this code:

```js
<table>
<tr><td>Movie Name:</td><td>{{movie.movieName}}</td></tr>
<tr><td>Who To Blame:</td><td>{{movie.moviePerson}}</td></tr>
<tr><td>Year:</td><td>{{movie.movieYear}}</td></tr>
<tr><td>Summary:</td><td>{{movie.movieSummary}}</td></tr>
<tr><td>Poster:</td><td><img class="jobPicture" ng-src="{{movie.moviePoster}}"></td></tr>
<tr><td>Rating:</td><td>{{movie.movieRating}}</td></tr>
<tr><td><a href="/#/movies/{{movie._id}}/edit"><button>Edit Movie</button></a></td></tr>
</table>
```

In ```home.html``` add an anchor link so that the user can click a movie name and go to the show page for that movie. Change the line:

```js
<span>{{movie.movieName}}</span><br />
```

to

```js
<a ng-href="/#/movies/{{movie._id}}"><span>{{movie.movieName}}</span></a><br />
```

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/movies_show.png)

Note the record ID in the URL.

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular NEW and SHOW routes working!"
git push origin master
```

### Angular EDIT, UPDATE Routes

The EDIT route takes the user to ```edit.html```. The UPDATE route sends the updated data to the database.

In ```EditController.js``` replace the code with this code:

```js
app.controller('EditController', ["$scope", '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
  console.log("Edit controller");
  $http.get('http://localhost:3000/movies/movies/' + $routeParams.id + '/edit/').then(function(response) { // EDIT
    $scope.movie = response.data;
    console.log(response.data);
  }, function(response) {
    console.log("Error, no data returned.");
  });

  $scope.updateMovie = function(movie) {
    console.log("Updating movie.");
    var movie = {
      movieName:  $scope.movie.movieName,
      moviePerson: $scope.movie.moviePerson,
      movieYear: $scope.movie.movieYear,
      movieSummary: $scope.movie.movieSummary,
      moviePoster: $scope.movie.moviePoster,
      movieRating: $scope.movie.movieRating
    }
    console.log($routeParams.id);
    $http.put('http://localhost:3000/movies/movies/' + $routeParams.id, movie).then(function(response) { // UPDATE
      $location.path( "/movies" );
      console.log("Movie updated.");
    }, function(response) {
      console.log("Error, no data returned.");
    });
  }
}]);
```

Note the new function ```$scope.updateMovie```.

In ```edit.html``` replace the code with this code:

```html
<form ng-submit="updateMovie()">
  <label for="editMovie">Edit Movie: </label>
    <input type="text" name="editMovie" ng-model="movie.movieName"></label><br>
  <label for="editPerson">Edit Who To Blame: </label>
    <input type="text" name="editOwner" ng-model="movie.moviePerson"></label><br>
  <label for="editYear">Edit Year: </label>
    <input type="number" name="editYear" ng-model="movie.movieYear"></label><br>
  <label for="editSummary">Edit Summary: </label>
    <input type="text" name="editSummary" ng-model="movie.movieSummary"></label><br>
  <label for="editPoster">Edit Poster: </label>
    <input type="text" name="editPoster" ng-model="movie.moviePoster"></label><br>
  <label for="editRating">Edit Rating: </label>
    <select name="editRating" ng-model="movie.movieRating">
      <option value="-1">-1</option>
      <option value="-2">-2</option>
      <option value="-3">-3</option>
      <option value="-4">-4</option>
      <option value="-5">-5</option>
    </select><br />
  <input type="submit" value="Update Movie"></input>
</form>
```

> This page needs some work. It should display the old data in the forms. It should allow you to update one field without updating all the fields.

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular EDIT and UPDATE routes working!"
git push origin master
```

### Angular DESTROY Route

We'll make a button to delete a movie:

```html
<button ng-click="deleteMovie(movie)">Delete Movie</button>
```

Note that the button uses the Angular directive ```ng-click``` instead of ```ng-submit```. Both directives execute methods in controllers. ```ng-submit``` is only for forms, ```ng-click``` is for any element, such as buttons.

The button executes this method:

```js
$scope.deleteMovie = function(movie) { // DESTROY
    console.log("Deleting movie.");
    $http.delete('http://localhost:3000/movies/movies/' + movie._id).then(function(response){
      console.log("Movie deleted.");
      $route.reload();
    }, function(response) {
      console.log("Error, failed to reload page.");
    });
  };
```

Let's add the button to ```home.html```:

```html
<a href="/#/movies/new"><button>Add a new movie</button></a>

<div ng-repeat="movie in movies">
    <a ng-href="/#/movies/{{movie._id}}"><span>{{movie.movieName}}</span></a><br />
    <span>{{movie.moviePerson}}</span><br />
    <span>{{movie.movieYear}}</span><br />
    <span>{{movie.movieSummary}}</span><br />
    <span><img class="jobPicture" ng-src="{{movie.moviePoster}}"></span><br />
    <span>{{movie.movieRating}}</span><br />
    <button ng-click="deleteMovie(movie)">Delete Movie</button><br />
</div>
```

And add the method to ```HomeController.js```. Note that we have to add a new service ```$route```:

```js
app.controller('HomeController', ['$scope', '$http', '$route', function($scope, $http, $route) {
  console.log("Home controller.");
  $http.get('http://localhost:3000/movies/movies/').then(function(response) { // INDEX
    $scope.movies = response.data;
  }, function(response) {
    console.log("Error, no data returned.");
  });

  $scope.deleteMovie = function(movie) { // DESTROY
    console.log("Deleting movie.");
    $http.delete('http://localhost:3000/movies/movies/' + movie._id).then(function(response){
      console.log("Movie deleted.");
      $route.reload();
    }, function(response) {
      console.log("Error, failed to reload page.");
    });
  };
}]);
```

The service ```$route``` "is used for deep-linking URLs to controllers and views (HTML partials)." I'm not sure what this means but it reloads pages.

Save your work to your GitHub repository:

```
git add .
git commit -m "Angular DESTROY route working!"
git push origin master
```

## Nested Comments

Users will want to add comments about the movies. Comments are associated with a movie in a database. A new comment doesn't use the NEW route. It uses the UPDATE route. The full record is updated whenever a comment is added or deleted. I.e., adding a comment doesn't create a new movie, it updates an existing movie.

### Adding a New Comment

We'll let users add and read comments only in the ```SHOW``` page. Open ```show.html``` in your text editor. Add this code:

```html
<form ng-submit="newComment(movie)">
  <input type="text" name="commentText" ng-model="movie.newComment.commentText">
  <input type="text" name="commentAuthor" ng-model="movie.newComment.commentAuthor">
  <input type="submit" value="Submit Comment"></input>
</form>
```

As noted above, this code creates a data entry form. ```ng-submit``` is an Angular directive that triggers the function ```$scope.newComment``` in the controller. ```ng-submit``` passes the ```movie``` object from the view to the controller.

The form has two input fields, for the comment text and the comment author's name. Each binds to the ```$scope``` via the Angular directive ```ng-model```.

The form also has a ```Submit Comment``` button.

In ```Show.Controller.js``` add this code inside the controller (above the last line ```}]);```):

```js
$scope.newComment = function(movie) { // full record is passed from the view
  var comment = {
    commentText: movie.newComment.commentText,
    commentAuthor: movie.newComment.commentAuthor,
    commentTimestamp: Date.now(),
  };
  var comments = movie.comments || [];
  comments.push(comment); // push comment to local $scope
  movie.newComment.commentAuthor = null; // needed to prevent autofilling fields
  movie.newComment.commentText = null; // needed to prevent autofilling fields
  movie.comments = comments; // saves new comment locally
  $http.put('http://localhost:3000/movies/movies/' + movie._id, movie).then(function(response) { // UPDATE
    console.log("Comment added.");
  }, function(response) {
    console.log("Error, failed to add comment.");
  });
};
```

The full ```Show.Controller.js``` should look like this:

```js
app.controller('ShowController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
  console.log("Show controller.");
  $http.get('http://localhost:3000/movies/movies/' + $routeParams.id).then(function(response) { // SHOW
    $scope.movie = response.data;
    console.log($scope.movie);
  }, function(response) {
    console.log("Error, no data returned.");
  });
  $scope.newComment = function(movie) { // full record is passed from the view
    var comment = {
      commentText: movie.newComment.commentText,
      commentAuthor: movie.newComment.commentAuthor,
      commentTimestamp: Date.now(),
    };
    var comments = movie.comments || [];
    comments.push(comment); // push comment to local $scope
    movie.newComment.commentAuthor = null; // needed to prevent autofilling fields
    movie.newComment.commentText = null; // needed to prevent autofilling fields
    movie.comments = comments; // saves new comment locally
    $http.put('http://localhost:3000/movies/movies/' + movie._id, movie).then(function(response) { // UPDATE
      console.log("Comment added.");
    }, function(response) {
      console.log("Error, failed to add comment.");
    });
  };
}]);
```

Add a comment, see if it was noted in the console log, and use Postman to see if the comment was saved to the database.

The first line creates a method (function) ```newComment``` in the ```$scope```. It received the ```movie``` object passed in from the view. It then creates a ```comment``` object with three properties:

* The comment text.
* The comment author's name.
* A time stamp.

The line ```var comments = movie.comments || [];``` includes an OR ```||```. It means, "the array ```comments``` is equal to the array ```comments``` attached to the ```movie``` object passed from the view, or, if no such array exists, then it's an empty array."

The next line pushes the comment we just created onto the end of the array ```comments```.

The next two lines are needed to prevent autofilling the new comment form with the text and author's name from the previous comment.

The next line attaches the ```comments``` array to the ```movie``` object.

The last code block sends an HTTP PUT request to the server with the movie ID in the URL, and the ```movie``` object to be updated.

### Displaying Comments

To display comments, add this code to ```show.html```:

```html
<div ng-repeat="comment in movie.comments">
  <span>{{comment.commentText}}</span>
  <span>--{{comment.commentAuthor}}</span>
  <span>{{comment.commentTimestamp | date:'medium'}}</span>
  <br />
</div>
```

This code uses the Angular directive ```ng-repeat``` to display each element (```comment```) in the array ```movie.comments```. Each comment is displayed with its text, author name, and the date added. Note that the date has an Angular filter ```| date:'medium'```. Without the filter Angular would display the seconds since January 1, 1970, e.g., ```1457542163982```. Angular can [display dates in many formats](https://docs.angularjs.org/api/ng/filter/date) by specifying the date filter.

### Deleting Comments

To delete a comment, add this code to ```show.html```:

```html
<form ng-submit="deleteComment(movie, comment)">
  <input type="submit" value="Delete Comment" />
</form>
```

This form has only one input, a button.

Put the code in the ```div``` for displaying comments:

```html
<div ng-repeat="comment in movie.comments">
  <span>{{comment.commentText}}</span>
  <span>--{{comment.commentAuthor}}</span>
  <span>{{comment.commentTimestamp | date:'medium'}}</span>
  <form ng-submit="deleteComment(movie, comment)">
    <input type="submit" value="Delete Comment" />
  </form>
  <br />
</div>
```

By putting the ```DELETE``` button inside the ```ng-repeat``` division, a ```DELETE``` button is created for every comment.

Add the ```$scope.deleteComment``` code to ```ShowController.js```:

```js
$scope.deleteComment = function(movie, comment) {
  console.log("Deleting comment.")
  var index = movie.comments.indexOf(comment); // find the index of the comment in the array of comments
  movie.comments.splice(index, 1); // removes the comment from the array
  $http.put('http://localhost:3000/movies/movies/' + movie._id, movie).then(function(response) { // UPDATE
    console.log("Comment deleted.");
  }, function(response) {
    console.log("Error, comment not deleted.");
  });
};
```

The full ```ShowController.js``` should look like this:

```js
app.controller('ShowController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
  console.log("Show controller.");
  $http.get('http://localhost:3000/movies/movies/' + $routeParams.id).then(function(response) { // SHOW
    $scope.movie = response.data;
    console.log($scope.movie);
  }, function(response) {
    console.log("Error, no data returned.");
  });
  $scope.newComment = function(movie) { // full record is passed from the view
    var comment = {
      commentAuthor: movie.newComment.commentAuthor,
      commentText: movie.newComment.commentText,
      commentTimestamp: Date.now(),
    };
    var comments = movie.comments || [];
    comments.push(comment); // push comment to local $scope
    movie.newComment.commentAuthor = null; // needed to prevent autofilling fields
    movie.newComment.commentText = null; // needed to prevent autofilling fields
    movie.comments = comments; // saves new comment locally
    $http.put('http://localhost:3000/movies/movies/' + movie._id, movie).then(function(response) { // UPDATE
      console.log("Comment added.");
    }, function(response) {
      console.log("Error, failed to add comment.");
    });
  };
  $scope.deleteComment = function(movie, comment) {
    console.log("Deleting comment.")
    var index = movie.comments.indexOf(comment); // find the index of the comment in the array of comments
    movie.comments.splice(index, 1); // removes the comment from the array
    $http.put('http://localhost:3000/movies/movies/' + movie._id, movie).then(function(response) { // UPDATE
      console.log("Comment deleted.");
    }, function(response) {
      console.log("Error, comment not deleted.");
    });
  };
}]);
```

### Show or Hide Comments

What if users don't want to see comments? In ```show.html``` add this code:

```html
<span ng-click="showComments = !showComments">
  <ng-pluralize count="movie.comments.length"
  when="{'0': '',
  'one': '1 comment',
  'other': '{} comments',
  'NaN': ''}">
  </ng-pluralize><br>
</span>
```

The first line uses the Angular directive ```ng-click``` to toggle the ```showComments``` value. The strange equation ```showComments = !showComments``` means "toggle this variable between true and false."

The code block uses the Angular directive ```ng-pluralize```. This counts elements in an array by attaching the method ```length``` to the array ```comments```, which returns the number of elements. The ```when``` object has four properties:

* When there are no comments, print nothing.
* When there is one comment, print ```1 comment```.
* Otherwise print the number of comments followed by ```comments```.
* If the method returns something that's not a number print nothing.

Then wrap the comments ```div``` with this ```div```:

```html
<div ng-show="showComments">
...
</div>
```

The full ```show.html``` should look like this:

```html
<table>
  <tr><td>Movie Name:</td><td>{{movie.movieName}}</td></tr>
  <tr><td>Who To Blame:</td><td>{{movie.moviePerson}}</td></tr>
  <tr><td>Year:</td><td>{{movie.movieYear}}</td></tr>
  <tr><td>Summary:</td><td>{{movie.movieSummary}}</td></tr>
  <tr><td>Poster:</td><td><img class="jobPicture" ng-src="{{movie.moviePoster}}"></td></tr>
  <tr><td>Rating:</td><td>{{movie.movieRating}}</td></tr>
  <tr><td><a href="/#/movies/{{movie._id}}/edit"><button>Edit Movie</button></a></td></tr>
</table>

<span ng-click="showComments = !showComments">
  <ng-pluralize count="movie.comments.length"
  when="{'0': '',
  'one': '1 comment',
  'other': '{} comments',
  'NaN': ''}">
</ng-pluralize><br>
</span>

<div ng-show="showComments">
  <div ng-repeat="comment in movie.comments">
    <span>{{comment.commentText}}</span>
    <span>--{{comment.commentAuthor}}</span>
    <span>{{comment.commentTimestamp | date:'medium'}}</span>
    <form ng-submit="deleteComment(movie, comment)">
      <input type="submit" value="Delete Comment" />
    </form>
    <br />
  </div>
</div>

<form ng-submit="newComment(movie)">
  <input type="text" name="commentText" ng-model="movie.newComment.commentText">
  <input type="text" name="commentAuthor" ng-model="movie.newComment.commentAuthor">
  <input type="submit" value="Submit Comment"></input>
</form>
```

Now users can click on the number of comments to make the comments show or hide.

The Angular directive
