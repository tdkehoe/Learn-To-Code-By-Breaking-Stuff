# Moving the CRUDiest Movies to the Cloud with Firebase

Firebase is a cloud database service. Storing your data in the cloud has become popular for a variety of reasons:

* You may have noticed that after we set up the back end with Node, Express, and MongoDB we never touched it again. If someone else could set up our back end we could get right into the front end.
* Most of the work we did setting up the back end was making the routes so that HTTP requests can access the database. What if we could access the database without HTTP requests or routes? What if Angular could query the database directly?
* HTTP requests always come from the client (browser) and go to the server (database). What if the database has new data that is needed by the browser, but the browser has no way to know when the database has new data? For example, if multiple users are adding movies to our database, the movies I added won't appear in your browser unless you refresh the page, or add a movie. You have to do something to get new data. The database should tell Angular that new data is available. Angular already does this, with two-way data binding so that the view and the $scope (the local database) stay in sync. What if we had three-way data binding to stay in sync with a remote database? Then when I add a movie to the database, the new movie instantly appears in your view without you doing anything.
* A reliable cloud database saves us from having to deal with server crashes.
* AngularFire's OAuth2 library makes authorization easy with Facebook, GitHub, Google, Twitter, tokens, and passwords.

## Make a New Directory

Duplicate your ```angular-app``` directory (from the GUI is easy). Call it ```firebase-app```.

From your new directory look if it has a GitHub repository. If yes, run ```grv``` to see the remote repository, then remove the remote repository: ```git remote rm origin```.

Make a new GitHub repository. Follow the instructions on GitHub to add the new repository as the origin for your new directory.

## Firebase Account

If you haven't already, [sign up for a free Firebase account](https://www.firebase.com/).

Create an app, then follow the instructions to install ```firebase-tools```:

```
npm install -g firebase-tools
```

This installs ```firebase-tools``` globally so you don't have to do this for every project.

Deploy your website:

```
firebase init
```

This creates a ```firebase.json``` file. If you copied your Firebase app directory from your MEAN stack directory in the previous tutorial you'll already have a ```firebase.json``` file. View the file using ```cat firebase.json``` or your text editor. You'll see that it's pointed to your previous Firebase website (for your MEAN stack app). Change this to your new Firebase website or delete ```firebase.json``` and run ```firebase init``` again.

Then you can upload your file with

```
firebase deploy
```

## AngularFire

Firebase has a "vanilla" interface that we won't be using. It also has interfaces for various frameworks. The Angular interface is called AngularFire. This is what we'll be using.

To use AngularFire we need three script dependencies in ```index.html```;

```html
<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.2.4/firebase.js"></script>

<!-- AngularFire -->
<script src="https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"></script>
```

We already have Angular installed so just add the Firebase and AngularFire CDNs. The above version numbers are out of date. The latest Firebase version is in the [changelog](https://www.firebase.com/docs/web/changelog.html). The latest AngularFire version is on its [home page](https://www.firebase.com/docs/web/libraries/angular/).

## app.js

Inject the dependency ```firebase```:

```js
var app = angular.module("CRUDiestMoviesApp", ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.typeahead', 'firebase']);
```

## Firebase Arrays vs. Objects

Firebase is a NOSQL database, similar but not the same as MongoDB. It stores an arrays and objects. When you set up a controller you must think about whether your controller will work with arrays or objects. ```HomeController.js``` works with arrays (all the movies). ```ShowController.js``` and ```EditController.js``` works with objects (one movie).

In ```HomeController.js``` inject the service ```$firebaseArray```:

```js
app.controller('HomeController', ['$scope', '$http', '$route', '$location', '$firebaseArray',
  function($scope, $http, $route, $location, $firebaseArray) {
    ...
  }
]);
```

In ```ShowController``` and ```EditController``` inject the dependency ```$firebaseObject```:

```js
app.controller('ShowController', ['$scope', '$http', '$routeParams', '$location', '$firebaseObject',
  function($scope, $http, $routeParams, $location, $firebaseObject) {
    ...
  }
]);
```

## New Firebase Object

In each controller we create a new Firebase object. This is an example of _object-oriented programming_ (OOP). Do not confuse the new Firebase object with ```$firebaseObject``` (below). The latter connects to an object in your remote Firebase database. The former is the entire interface between your local Angular app and the remote Firebase database.

Depending on whether you injected ```$firebaseArray``` or ```$firebaseObject``` the new object is either an array or an object. It is the same as one of the arrays or objects in your remote database, i.e., you are locally mirroring part or all of your remote database.

The argument for the new Firebase is the URL of your Firebase database. This is not the same as the URL we used to view our Firebase front end.

* The database access URL ends in ```firebaseIO.com```.
* The front end access URL ends in ```firebaseapp.com```.

You call the new Firebase object or array anything you want. The typical name is ```ref```.

After we create the new Firebase object or array we bind it to the ```$scope```. This makes the remote data available locally, as if the remote data were local.

### HomeController.js with $firebaseArray

We set up the new Firebase array:

```js
var ref = new Firebase("https://my-angularfire-app.firebaseio.com/");
$scope.movies = $firebaseArray(ref);
```

The first line specifies the remote database. The second line creates a local array synchronized to the remote database. We could write this in one line:

```js
$scope.movies = $firebaseArray(new Firebase("https://my-angularfire-app.firebaseio.com/"));
```

That's hard to read so we typically write two lines.

We now have _three-way data binding_ between the remote database, ```$scope```, and the DOM. Here's what the controller looks like now (without the functions):

```js
app.controller('HomeController', ['$scope', '$http', '$route', '$location', '$firebaseArray', function($scope, $http, $route, $location, $firebaseArray) {
  console.log("Home controller.");
  $scope.loading = true;

  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.movies = $firebaseArray(ref);
  $scope.order = '$id';
  $scope.reverse = true;
  $scope.loading = false;

}]);
```

The function ```$scope.getLocation``` has an HTTP GET request to the Open Movies Database (OMDB). We'll leave this as it is.

The function ```$scope.onSelect``` has an HTTP GET request to OMDB. We'll leave that.

Then it has two HTTP request to our MongoDB database:

* A HTTP POST request to add a new movie to the MongoDB database.
* A HTTP GET request to synchronize the local ```$scope``` array to the remote MongoDB database.

We change ```push()``` to the AngularFire method ```$add()```:

```js
$scope.movies.$add(movie);
```

This both adds the movie to our local ```$scope``` and synchronizes the remote database. We can then remove both HTTP requests.

The full ```HomeController.js``` is now:

```js
app.controller('HomeController', ['$scope', '$http', '$route', '$location', '$firebaseArray', function($scope, $http, $route, $location, $firebaseArray) {
  console.log("Home controller.");
  $scope.loading = true;

  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.movies = $firebaseArray(ref);
  $scope.order = '$id';
  $scope.reverse = true;
  $scope.loading = false;

  $scope.getLocation = function(val) {
    return $http.get('//www.omdbapi.com/?s=' + val)
    .then(function(response){
      return response.data.Search.map(function(item){
        return item.Title;
      });
    });
  };

  $scope.onSelect = function ($item) {
    $scope.loading = true;
    console.log("Selected!");
    return $http.get('//www.omdbapi.com/?t=' + $item)
    .then(function(response){
      var movie = {
        movieActors: response.data.Actors,
        movieAwards: response.data.Awards,
        movieCountry: response.data.Country,
        movieDirector: response.data.Director,
        movieGenre: response.data.Genre,
        movieLanguage: response.data.Language,
        movieMetascore: response.data.Metascore,
        moviePlot: response.data.Plot,
        moviePoster: response.data.Poster,
        movieRated: response.data.Rated,
        movieRuntime: response.data.Runtime,
        movieTitle: response.data.Title,
        movieWriter: response.data.Writer,
        movieYear: response.data.Year,
        movieImdbID: response.data.imdbID,
        movieImdbRating: response.data.imdbRating,
        movieImdbVotes: response.data.imdbVotes,
        movieLikes: 0
      };
      // reset orderBy so that new movie appears in upper left
      $scope.order = '$id'
      $scope.reverse = true;
      $scope.movies.$add(movie);
      $scope.loading = false;
    });
  };

}]);
```

You can open your browser to view your app but there won't be any movies as it's a new database. Add some movies, starting with _Escape from Firebase Kate_!

### ShowController.js with $getRecord()

An important distinction is made in Firebase between arrays and objects. Different services are used--```$firebaseArray``` vs. ```$firebaseObject```--with different methods. The INDEX page obviously accesses an array--all of our movies. The SHOW page accesses an object, a single movie. Which service do we use?

We can use either the ```$firebaseArray``` service or the ```$firebaseObject``` service. It's possible to use both services in one controller but most functions can be set up for either service so you should only need one service or the other in a controller.




#### $firebaseArray

We'll build the SHOW view first with ```$firebaseArray```. We access the array ```$scope.movies``` containing all of our movies, then select one movie from the array, and set ```$scope.movie``` to equal this selected movies. Pay attention to the pluralization of ```movies``` vs ```movie```!

Start by making the Firebase reference in ```ShowController.js```. Also, we no longer the ```$http``` service as we're not making HTTP requests from the SHOW view.

```js
app.controller('ShowController', ['$scope', '$routeParams', '$location', '$firebaseArray', function($scope, $routeParams, $location, $firebaseArray) {
  console.log("Show controller.");
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.movies = $firebaseArray(ref);
  console.log(movies);
  console.log($routeParams.id);
  $scope.movie = $scope.movies.$getRecord($routeParams.id);
  console.log($scope.movie);

}]);
```

This doesn't work. ```console.log(movies);``` returns the array of our movies. ```console.log($routeParams.id);``` returns the ```$id``` of the movie we clicked on in the INDEX view. But ```console.log(movie);``` returns ```null```.

The problem is that Firebase is asynchronous. ```console.log(movie);``` executes before the data is downloaded. If our array of movies was large this could take awhile. To solve this problem we use ```$loaded()``` to return a promise:

```js
app.controller('ShowController', ['$scope', '$routeParams', '$location', '$firebaseArray', function($scope, $routeParams, $location, $firebaseArray) {
  console.log("Show controller.");
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.movies = $firebaseArray(ref);
  $scope.movies.$loaded()
  .then(function(){
    $scope.movie = $scope.movies.$getRecord($routeParams.id);
  }, function(error) {
    console.log("Error, movie array not loaded.");
    console.log(error);
  });

}]);
```

Your movie should now display in the SHOW view. You may have to wait a few seconds to see your movie.

To reiterate how this code block works, the first line injects our dependencies. We're using:

* ```$scope``` for two-way data binding between the controller and the view.
* ```$routeParams``` to pull the movie ID from the URL.
* ```$location``` to redirect the view back to the INDEX route.
* ```$firebaseArray``` to three-way bind to the remote database, particularly to bind to the entire database, which is an array of objects.

We set ```ref``` to the remote Firebase URL.

We set ```$scope.movies``` to the ```ref```, i.e., synchronized to the entire array of movies in the remote database.

We use ```$loaded()``` to tell us when the remote array has downloaded. Without this we'd be accessing empty values in ```$scope.movies```.

The promise ```.then``` executed after the remote array has downloaded. ```$routeParams.id``` is the movie ID in the URL, passed in from the INDEX view. We use ```$getRecord()``` with the movie ID to get the selected movie, an object in the array ```$scope.movies```. We set this to ```$scope.movie``` to make the selected movie available to the view.

#### $firebaseObject

Here's the same code using ```$firebaseObject```:

```js
app.controller('ShowController', ['$scope', '$routeParams', '$location', '$firebaseObject', '$firebaseObject', function($scope, $routeParams, $location, $firebaseObject, $firebaseObject) {
  console.log("Show controller.");
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.movies = $firebaseArray(ref);
  $scope.movie = $firebaseObject(ref.child($routeParams.id));
  console.log($scope.movie);

}]);
```

It shows the movie data but the likes and comments don't work. This code is synchronous. Making the code asynchronous doesn't fix the problem.

#### Comments

The console log shows that the comment has been added to ```$scope.movie``` and the comment displays in the view, but when we refresh the browser the comment is gone, indicating that ```$save()``` didn't save the comment to the remote database. The error message is "Invalid record; could determine key for [object Object]".

We're looking at the ```$scope.newComment()``` function, specifically at the line ```$scope.movies.$save(movie)```. Reviewing the [documentation for the ```$firebaseObject``` service ```$save()``` method](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebaseobject-save) I don't see any arguments for ```$save()```, in other words ```$save(movie)``` apparently isn't acceptable syntax.

Let's refactor that code as

```js
$scope.movie.comments = $firebaseObject(ref.child($routeParams.id).child('comments'));
$scope.movie.comments.$save().then(function() {
  ...
});
```

This returns an error message: ```TypeError: $scope.movie.comments.$save is not a function```. Add ```console.log($scope.movie.comments);``` and we see that ```$scope.movie.comments``` is an array. The error message said ```TypeError```. It looks like we have to use ```firebaseArray``` with the comments.

Let's refactor that again:

```js
$scope.movie.comments = $firebaseObject(ref.child($routeParams.id));
$scope.movie.$save().then(function() {
  ...
});
```

That works! ```$firebaseObject``` works only with objects, not with arrays.

#### Likes

Now we'll examine why the likes aren't working:

```js
$scope.movie.movieLikes = $firebaseObject(ref.child($routeParams.id).child('movieLikes'));
$scope.movie.movieLikes.$save().then(function() {
  ...
});
```

We get the same error message ```TypeError: $scope.movie.movieLikes.$save is not a function```. But the console log shows that ```$scope.movie.movieLikes``` is a property of the object ```$scope.movie```. Let's try:

```js
$scope.movie.movieLikes = $firebaseObject(ref.child($routeParams.id).child('movieLikes'));
$scope.movie.$save().then(function() {
  ...
});
```

That works! ```$firebaseObject``` works only with objects, not with properties of objects.

We now know how to use ```$firebaseArray``` or ```$firebaseObject``` to access the same data.

Using ```$firebaseArray()```:

```js
var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
$scope.movies = $firebaseArray(ref);
$scope.movies.$loaded()
  .then(function(){
    $scope.movie = $scope.movies.$getRecord($routeParams.id);
    ...
    $scope.movies.$save(movie).then(function() {
      ...
    });
  });
```

Using ```$firebaseObject()```:

```js
var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
$scope.movies = $firebaseArray(ref);
$scope.movies.$loaded()
  .then(function(){
    $scope.movie = $firebaseObject(ref.child($routeParams.id));
    ...
    $scope.movie.$save().then(function() {
      ...
    });
  });
```

### Performance

Which is faster, ```$firebaseArray``` or  ```$firebaseObject```?

Let's analyze the performance using the Timeline in Chrome Dev Tools. In the console, click on ```Timeline```, then ```⌘-R``` to refresh the view. I found:

* Synchronous ```$firebaseArray```, 567 to 1000 ms total; loading 8.2 ms.
* Asynchronous ```$firebaseArray```, 696 to 861 ms, loading 8.4 ms.
* Synchronous ```$firebaseObject```, 569 to 946 ms, loading 8.3 ms.

The answer seems to be that all three methods are equally fast. In other words, there shouldn't be a performance gain or penalty for using the asynchronous ```$firebaseArray``` vs. the synchronous ```$firebaseObject```. Use whichever you prefer. The synchronous ```$firebaseObject``` has less code but I don't understand why this version works, when the synchronous ```$firebaseArray``` doesn't work.

### deleteMovie()

To delete a movie we use ```$firebaseArray $remove(recordOrIndex)```. This requires a record or the index number of the record in the array. We're not using ```$firebaseObject remove()```.

```js
$scope.deleteMovie = function(movie) { // DESTROY
  var index = $scope.movies.$indexFor(movie.$id); // finds index of the movie in the array of movies
  $scope.movies.$remove(index).then(function() { // $firebaseArray $remove, not $firebaseObject $remove
    console.log("Movie deleted.");
    $location.path( "/movies" );
  }, function(error) {
    console.log("Error, movie not deleted.");
    console.log(error);
  });
};
```

You can view your remote data in your Firebase App Dashboard and see that the record has been deleted.

### upLike() and downLike()

The ```$upLike()``` and ```$downLike()``` functions use ```$save()```. Note that we pass in ```movie``` from the view then ```movie``` becomes the argument for ```$save(movie)```.

```js
$scope.upLike = function(movie) {
  movie.movieLikes += 1;
  $scope.movies.$save(movie).then(function() {
    console.log("Upliked!");
  }, function(error) {
    console.log("Error, movie not upliked.");
    console.log(error);
  });
};

$scope.downLike = function(movie) {
  movie.movieLikes -= 1;
  $scope.movies.$save(movie).then(function() {
    console.log("Downliked!");
  }, function(error) {
    console.log("Error, movie not downliked.");
    console.log(error);
  });
};
```

### newComment()

We also use ```$save(movie)``` in ```newComment()```:

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
  $scope.movies.$save(movie).then(function() {
    console.log("Comment added!");
  }, function(error) {
    console.log("Error, comment not added.");
    console.log(error);
  });
};
```

### deleteComment()

Lastly, we also use ```$save(movie)``` in ```deleteComment()```:

```js
$scope.deleteComment = function(movie, comment) {
  console.log("Deleting comment.")
  var index = movie.comments.indexOf(comment); // find the index of the comment in the array of comments
  movie.comments.splice(index, 1); // removes the comment from the array
  $scope.movies.$save(movie).then(function() {
    console.log("Comment deleted!");
  }, function(error) {
    console.log("Error, comment not deleted.");
    console.log(error);
  });
};
```

## EditController.js

The EDIT view uses ```$firebaseArray```, similar to the INDEX and SHOW views. We no longer the ```$http``` service.

Copy and paste ```$scope.deleteMovie()``` from the ```ShowController.js```:

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', function($scope, $routeParams, $location, $firebaseArray){
  console.log("Edit controller.");
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.movies = $firebaseArray(ref);
  $scope.movies.$loaded()
  .then(function(){
    $scope.movie = $scope.movies.$getRecord($routeParams.id);
  });

  $scope.deleteMovie = function(movie) { // DESTROY
    $scope.movies.$remove(movie).then(function() {
      console.log("Movie deleted.");
      $location.path( "/movies" );
    }, function(error) {
      console.log("Error, movie not deleted.");
      console.log(error);
    });
  };

}]);
```

How do we update the ```$scope.updateMovie()``` function? The MEAN stack version used an HTTP PUT request. In our Express routes you can see that the PUT route queries the MongoDB database with ```findAndModify()```. Looking through the [$firebaseArray methods](https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray), ```$save(recordOrIndex)``` says that this method "saves an existing, modified local record back to the database." That's what we want to do.

Our MEAN stack function was:

```js
$scope.updateMovie = function() {
  console.log("Updating movie.");
  $http.put('https://pure-wave-92261.herokuapp.com/movies/movies/' + $routeParams.id, $scope.movie).then(function(response) { // UPDATE
    $location.path( "/movies" );
    console.log("Movie updated.");
  }, function(error) {
    console.log("Error, no data returned.");
    console.log(error);
  });
};
```

Let's change that to:

```js
$scope.updateMovie = function() {
  console.log("Updating movie.");
  console.log($scope.movies);
  $scope.movies.$save($routeParams.id).then(function(response) { // UPDATE
    $location.path( "/movies" );
    console.log("Movie updated.");
  }, function(error) {
    console.log("Error, no data returned.");
    console.log(error);
  });
};
```

That doesn't work. The error message is: ```Invalid record; could determine key for -KEEi3xNrikL2RUXMx_W```. ```$save()``` takes an argument that can be either a record or index. Let's check if the index went through correctly. Add ```console.log($routeParams.id);``` after the second line. Update your movie and your log shows that the index is correct.

Let's look at ```$scope.movies```. Add ```console.log($scope.movies);``` after the third line. Update your movie and your updated movie is now in ```$scope.movies```.

Let's read the error message again. We'll assume that ```could``` should be ```couldn't```: ```couldn't determine key for -KEEi3xNrikL2RUXMx_W```. There's a method ```$keyAt(recordOrIndex)```. Add this command:

```js
console.log($scope.movies.$keyAt($routeParams.id));
```

This returns ```null```. We're on the right track! What is a key? It's not the index. The _index_ is the place in the array, e.g., 0, 1, 2, etc. Let's find the key of the first element in the array:

```js
console.log($scope.movies.$keyAt(0));
```

Now we get back ```-KEEi3xNrikL2RUXMx_W```. We now know what a key is. The method we're using is ```$save(recordOrIndex)```. It's not ```$save(recordOrKey)```. We can't say ```$save($routeParams.id)```. Let's try ```console.log($scope.movies.$indexFor($routeParams.id));```.

That returns the index of our record. Let's set that as a variable so we can use it with ```$save()```:

```js
$scope.updateMovie = function() {
  console.log("Updating movie.");
  console.log($routeParams.id);
  console.log($scope.movies);
  console.log($scope.movies.$keyAt(0));
  var index = $scope.movies.$indexFor($routeParams.id);
  $scope.movies.$save(index).then(function(response) { // UPDATE
    $location.path( "/movies" );
    console.log("Movie updated.");
  }, function(error) {
    console.log("Error, no data returned.");
    console.log(error);
  });
};
```

That worked! You can remove the console logs now.

### Comments and Likes

Your web app is now completely functional. Save your work to your GitHub repository:

```
git add .
git commit -m "Everything is functional"
git push origin master
```

### Pass Through the Record

How about saving with the record instead of the index? In ```edit.html```, copy and paste the ```Delete Movie``` button. Change the label and the method:

```html
<div class="form-group">
  <label for="updateMovie" class="col-sm-2 control-label"></label>
  <div class="col-sm-10">
    <button ng-click="updateMovie(movie)" class="form-control btn btn-danger">Update Movie</button>
  </div>
</div>
```

Now you'll see a red button that says ```Update Movie```. Change some values and click your new button. It should work. Now you have two ways to use ```$save(recordOrIndex)```.

### Performance Testing

Let's compare the speed of the MEAN stack web app vs. Firebase web app. In Chrome Dev Tools click on ```Timeline```. Reload the page with ```⌘-R```. My results are:

* MEAN stack, INDEX page: 742 milliseconds (ms).
* MEAN stack, SHOW page: 385 ms.
* Firebase, INDEX page: 481 ms.
* Firebase, SHOW page: 500 ms.

Performance times seem to be similar.

## Get Rid of the Update Button with ```$watch()```

What if we called ```$save()``` from the view? In ```edit.html``` put in ```ng-change="movies.$save(movie)"```. Change the title of your movie and refresh the browser. The title changed, without clicking the ```Update Movie``` button! Look in your Firebase Dashboard and you'll see the new value in the database.

You could add ```ng-change="movies.$save(movie)"``` to each field in ```edit.html``` and remove the ```Update Movie``` button. This changes the user experience (UX). The user may not know that he or she can change a field. After he or she changes a value, he or she needs feedback that the change has updated in the database.

The former problem we can address by highlighting fields on focus, i.e., when the user drags a mouse over the field, as we did in the INDEX view to encourage users to click on a movie poster.

```css
.form-control:hover {
  outline: 2px solid blue;
}
```

We could also put in tooltips.

For the latter problem we can set up a listener that shows an animated pop-up when data is saved. We'll start by putting a pop-up in the ```movieTitle``` data input field in ```edit.html```:

```html
<div class="form-group">
  <label for="editTitle" class="col-sm-2 control-label">Edit Title: </label>
  <div class="col-sm-8">
    <input type="text" class="form-control" name="editTitle" ng-model="movie.movie.title" ng-change="movie.$save(movie)" value={{movie.movieTitle}}></label>
  </div>
  <div class="col-sm-2">
    <p ng-show="watchTitle">Movie Title Saved!</p>
  </div>
</div>
```

Firebase has two ```$watch()``` methods, one for ```$firebaseArray``` and the other for ```$firebaseObject```. The methods are slightly different:

* ```$firebaseArray``` fires whenever the data in the local ```$scope``` updates from the server. The callback returns an object with three properties with info about what changed.

* ```$firebaseObject``` is simpler. It fires whenever the data changes. The callback returns an object with two properties: ```event: "value"``` means that a some value has changed; and ```key:``` tells you the ```$id``` of the object that changed, e.g., ```"-KGUSrbRF8_GYUNi_Hpn"```.

Neither tells us which property of the object changed, i.e., we can figure out that "Battlefield Earth" was changed but we can't find out that the title was changed. We'll have to write code for every field we want to watch.

To "drill down" from the array of all the movies to a single movie and then a single property ```$watch()``` doesn't use dot notation, e.g. ```$scope.movie.movietitle.$watch()``` doesn't work. Instead it uses this syntax to "drill down":

```js
var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
$scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle'));
```

The first line gets the full array of movies and calls the array ```ref```. The second line creates a Firebase object by "drilling down" from the full array of movies to one movie (an object), identified by the ```$id``` taken from the URL, then "drilling down" again to the ```movieTitle``` property of the movie object.

Let's try out some ways to implement ```$watch```.

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', '$firebaseObject', function($scope, $routeParams, $location, $firebaseArray, $firebaseObject){
  console.log("Edit controller.");
  $scope.watch = { // Initialize values
    all: false,
    title: false
  };
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/"); // Get all movies from the remote database
  $scope.movies = $firebaseArray(ref); // Put movies onto local $scope
  $scope.movies.$loaded() // Wait until movies downloaded
  .then(function(){ // Promise

    $scope.movies.$watch(function(event) { // Watch the array of all movies
      console.log(event);
      $scope.watch.all = true;
      console.log($scope.watch.all);
    });

    $scope.movie = $scope.movies.$getRecord($routeParams.id); // Get one movie selected by its $id in the URL
    $scope.movie.$watch(function(event) { // Watch all fields in one movie
      console.log(event);
      $scope.watchOneMovieArray = true;
      console.log($scope.watchOneMovieArray);
    });

    $scope.watchMovieObject = $firebaseObject(ref.child($routeParams.id)); // Make the movieTitle property into a $firebaseObject
    $scope.watchMovieObject.$watch(function(event) { // Watch one property of one movie
      console.log(event);
      $scope.watchOneMovieObject = true;
      console.log($scope.watchOneMovieObject);
    });

    $scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle')); // Make the movieTitle property into a $firebaseObject
    $scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
      console.log(event);
      $scope.watch.title = true;
      console.log($scope.watch.title);
    });

  });
}]);
```

Refresh your browser and you'll see that the second ```$watch()``` doesn't work: ```TypeError: $scope.movie.$watch is not a function```. We got the type error because we selected an object (one movie) from an array (all our movies) and set ```$watch()``` on ```$firebaseArray```.  Delete the ```$watch``` code block, leaving the first line:

```js
$scope.movie = $scope.movies.$getRecord($routeParams.id); // Get one movie selected by its $id in the URL
```

Refresh your browser. The next problem is we see the "Movie Title Saved!" before we've edited anything. Look through your console log and you'll see that both the ```watchMovieObject``` and the ```movieTitleObject``` fired when the page loaded. Recall that ```$firebaseObject``` fires its callback on any change in the data, including reloading a page.

Edit the title of a movie and both the "Movie Title Saved!" and "All Saved!" messages should show. Refresh your browser to hide the messages.

Now open a second browser window. Use a second computer if you have one. Open a different movie and edit the title or director. Observe your first browser window and you'll see the "All Saved!" message show. Not good, we don't want the "Saved" message to appear in our browser when another user is editing a different movie! Setting ```$watch()``` on the entire array isn't useful for our project.

Each of our ```$watch()``` functions has a flaw. Let's try nesting the ```$firebaseObject``` watches inside the ```$firebaseArray``` watch. Also move ```$scope.watchAll = true;``` to ```$scope.watchMovieObject.$watch```:

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', '$firebaseObject', function($scope, $routeParams, $location, $firebaseArray, $firebaseObject){
  console.log("Edit controller.");
  $scope.watch = { // Initialize values
    all: false,
    title: false
  };
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/"); // Get all movies from the remote database
  $scope.movies = $firebaseArray(ref); // Put movies onto local $scope
  $scope.movies.$loaded() // Wait until movies downloaded
  .then(function(){ // Promise
    $scope.movie = $scope.movies.$getRecord($routeParams.id); // Get one movie selected by its $id in the URL

    $scope.movies.$watch(function(event) { // Watch the array of all movies
      console.log(event);

      $scope.watchMovieObject = $firebaseObject(ref.child($routeParams.id)); // Make the movieTitle property into a $firebaseObject
      $scope.watchMovieObject.$watch(function(event) { // Watch one property of one movie
        console.log(event);
        $scope.watch.all = true;
        console.log($scope.watch.all);
      });

      $scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle')); // Make the movieTitle property into a $firebaseObject
      $scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
        console.log(event);
        $scope.watch.title = true;
        console.log($scope.watch.title);
      });
    });
  });
}]);
```

This is better. When you refresh the browser, no messages show. When you edit the title, both messages show.

Use your second browser to edit a different movie. We still have the problem that the first browser's messages show when the second browser is edited.

Now add ```ng-change="movies.$save(movie)"``` to the ```movieDirector``` data input form in ```edit.html```:

```html
<input type="text" class="form-control" name="editDirector" ng-model="movie.movieDirector" ng-change="movies.$save(movie)" value={{movie.movieDirector}}></label>
```

Now edit the director's name. Both messages show, when only the "All Saved!" should show.

The problem is that we can only have one ```$firebaseObject``` in a controller. All the Firebase objects fire when one fires. We'll delete the other ```$watch``` functions:

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', '$firebaseObject', function($scope, $routeParams, $location, $firebaseArray, $firebaseObject){
  console.log("Edit controller.");
  $scope.watch = { // Initialize values
    all: false,
    title: false
  };
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/"); // Get all movies from the remote database
  $scope.movies = $firebaseArray(ref); // Put movies onto local $scope
  $scope.movies.$loaded() // Wait until movies downloaded
  .then(function(){ // Promise
    $scope.movie = $scope.movies.$getRecord($routeParams.id); // Get one movie selected by its $id in the URL
    $scope.movies.$watch(function(event) { // Watch the array of all movies
      console.log(event);
      $scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle')); // Make the movieTitle property into a $firebaseObject
      $scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
        console.log(event);
        $scope.watch.title = true;
        console.log($scope.watch.title);
      });
    });
  });
}]);
```

Now we see "Movie Title Saved!" when we edit either ```movieTitle``` or ```movieDirector```. Let's move ```$scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle'));``` out of the nest:

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', '$firebaseObject', function($scope, $routeParams, $location, $firebaseArray, $firebaseObject){
  console.log("Edit controller.");
  $scope.watch = { // Initialize values
    all: false,
    title: false
  };
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/"); // Get all movies from the remote database
  $scope.movies = $firebaseArray(ref); // Put movies onto local $scope
  $scope.movies.$loaded() // Wait until movies downloaded
  .then(function(){ // Promise
    $scope.movie = $scope.movies.$getRecord($routeParams.id); // Get one movie selected by its $id in the URL
    $scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle')); // Make the movieTitle property into a $firebaseObject
    $scope.movies.$watch(function(event) { // Watch the array of all movies
      console.log(event);
      $scope.watch.all = true;
      $scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
        console.log(event);
        $scope.watch.title = true;
        console.log($scope.watch.title);
      });
    });
  });
}]);
```

Now when we edit ```movieTitle``` we get "Movie Title Saved!". When we edit ```movieDirector``` we don't get "Movie Title Saved!". "All Saved!" shows when either field is edited. Checking our second browser, "All Saved!" also shows when we edit a different movie in the second browser. We could try to fix this by checking the ```key``` in the event object. Or we could delete this code and make more codes similar to "Movie Title Saved!". The latter is easier and a nicer user experience (UX).

In every field in the view:

* Add ```ng-change="movies.$save(movie)"``` to every field in the view.
* Make a two-column message.
* Remove the ```Update Movie``` buttons.

Now ```edit.html``` should look like this:

```HTML
<h2>Edit Movie</h2>

<form class="form-horizontal" ng-submit="updateMovie()" name="editMovie">

  <div class="form-group">
    <label for="editTitle" class="col-sm-2 control-label">Edit Title: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editTitle" ng-model="movie.movieTitle" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.title">Movie Title Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="editPoster" class="col-sm-2 control-label">Edit Poster: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editPoster" ng-model="movie.moviePoster" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.poster">Movie Poster Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="editPlot" class="col-sm-2 control-label">Edit Plot: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editPlot" ng-model="movie.moviePlot" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.plot">Movie Plot Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="editTrivia" class="col-sm-2 control-label">Edit Trivia: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editTrivia" ng-model="movie.movieTrivia" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.trivia">Movie Trivia Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="editDirector" class="col-sm-2 control-label">Edit Director: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editDirector" ng-model="movie.movieDirector" ng-change="movies.$save(movie)" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.director">Movie Director Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="editWriter" class="col-sm-2 control-label">Edit Writer: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editWriter" ng-model="movie.movieWriter" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.writer">Movie Writer Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="editActors" class="col-sm-2 control-label">Edit Actors: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editActors" ng-model="movie.movieActors" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.actors">Movie Actors Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="editYear" class="col-sm-2 control-label">Edit Year: </label>
    <div class="col-sm-8">
      <input type="text" class="form-control" name="editYear" ng-model="movie.movieYear" ng-change="movies.$save(movie)"></label>
    </div>
    <div class="col-sm-2">
      <p ng-show="watch.year">Movie Year Saved!</p>
    </div>
  </div>

  <div class="form-group">
    <label for="deleteMovie" class="col-sm-2 control-label"></label>
    <div class="col-sm-8">
      <button ng-click="deleteMovie(movie)" class="form-control btn btn-danger">Delete Movie</button>
    </div>
  </div>

</form>
```

Now in ```EditController.js``` add three items for each field:

* ```$scope.watch.title = false;``` to initialize each variable.
* ```$scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle'));``` to create a ```$firebaseObject``` for each property.
* ```$scope.movieTitleObject.$watch(function(event) {
        $scope.watch.title = true;
      });```
      to watch the database and show the message in the view.

The ```EditController``` should now look like this:

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', '$firebaseObject', function($scope, $routeParams, $location, $firebaseArray, $firebaseObject){
  console.log("Edit controller.");
  $scope.watch = { // Initialize values
    title: false,
    poster: false,
    plot: false,
    trivia: false,
    director: false,
    writer: false,
    actors: false,
    year: false
  };
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/"); // Get all movies from the remote database
  $scope.movies = $firebaseArray(ref); // Put movies onto local $scope
  $scope.movies.$loaded() // Wait until movies downloaded
  .then(function(){ // Promise
    $scope.movie = $scope.movies.$getRecord($routeParams.id); // Get one movie selected by its $id in the URL
    $scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle')); // Make the movieTitle property into a $firebaseObject
    $scope.moviePosterObject = $firebaseObject(ref.child($routeParams.id).child('moviePoster'));
    $scope.moviePlotObject = $firebaseObject(ref.child($routeParams.id).child('moviePlot'));
    $scope.movieTriviaObject = $firebaseObject(ref.child($routeParams.id).child('movieTrivia'));
    $scope.movieDirectorObject = $firebaseObject(ref.child($routeParams.id).child('movieDirector'));
    $scope.movieWriterObject = $firebaseObject(ref.child($routeParams.id).child('movieWriter'));
    $scope.movieActorsObject = $firebaseObject(ref.child($routeParams.id).child('movieActors'));
    $scope.movieYearObject = $firebaseObject(ref.child($routeParams.id).child('movieYear'));
    $scope.movies.$watch(function(event) { // Watch the array of all movies

      $scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.title = true; // Show modal in view
      });

      $scope.moviePosterObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.poster = true; // Show modal in view
      });

      $scope.moviePlotObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.plot = true; // Show modal in view
      });

      $scope.movieTriviaObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.trivia = true; // Show modal in view
      });

      $scope.movieDirectorObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.director = true; // Show modal in view
      });

      $scope.movieWriterObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.writer = true; // Show modal in view
      });

      $scope.movieActorsObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.actors = true; // Show modal in view
      });

      $scope.movieYearObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.year = true; // Show modal in view
      });

    });
  });

  $scope.deleteMovie = function(movie) { // DESTROY
    $scope.movies.$remove(movie).then(function() {
      console.log("Movie deleted.");
      $location.path( "/movies" );
    }, function(error) {
      console.log("Error, movie not deleted.");
      console.log(error);
    });
  };

}]);
```

Test and save your work to your GitHub repository:

```
git add .
git commit -m "$watch() messages working."
git push origin master
```

### Hide and Show ```Saved!```

First, let's put the ```Saved!``` messages into Bootstrap wells. Add ```class="well well-sm"``` to each ```Saved!``` element in ```edit.html```, e.g.,

```HTML
<div class="col-sm-2">
  <div ng-show="watch.title" class="well well-sm">Movie Title Saved!</div>
</div>
```

Now we'll make the ```Saved!``` message hide after two seconds. In vanilla JavaScript we use the ```setTimeout()``` function but in Angular we have to use the ```$timeout``` service instead. (```setTimeout()``` interferes with two-way data binding.) First add this service to ```EditController.js```:

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', '$firebaseObject', '$timeout', function($scope, $routeParams, $location, $firebaseArray, $firebaseObject, $timeout){
  ...
}]);
```

Now we add ```$timeout()``` to the ```$watch``` functions:

```js
$scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
  $scope.watch.title = true; // Show message
  $timeout(function() {
    $scope.watch.title = false; // Hide message
  }, 5000);
});
```

The function wrapped by ```$timeout()``` executes after the time in milliseconds, which is the second argument. We've set the time at five seconds (5000 milliseconds).

The ```EditController.js``` now looks like this:

```js
app.controller('EditController', ["$scope", '$routeParams', '$location', '$firebaseArray', '$firebaseObject', '$timeout', function($scope, $routeParams, $location, $firebaseArray, $firebaseObject, $timeout){
  console.log("Edit controller.");
  $scope.watch = { // Initialize values
    title: false,
    poster: false,
    plot: false,
    trivia: false,
    director: false,
    writer: false,
    actors: false,
    year: false
  };
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/"); // Get all movies from the remote database
  $scope.movies = $firebaseArray(ref); // Put movies onto local $scope
  $scope.movies.$loaded() // Wait until movies downloaded
  .then(function(){ // Promise
    $scope.movie = $scope.movies.$getRecord($routeParams.id); // Get one movie selected by its $id in the URL
    $scope.movieTitleObject = $firebaseObject(ref.child($routeParams.id).child('movieTitle')); // Make the movieTitle property into a $firebaseObject
    $scope.moviePosterObject = $firebaseObject(ref.child($routeParams.id).child('moviePoster'));
    $scope.moviePlotObject = $firebaseObject(ref.child($routeParams.id).child('moviePlot'));
    $scope.movieTriviaObject = $firebaseObject(ref.child($routeParams.id).child('movieTrivia'));
    $scope.movieDirectorObject = $firebaseObject(ref.child($routeParams.id).child('movieDirector'));
    $scope.movieWriterObject = $firebaseObject(ref.child($routeParams.id).child('movieWriter'));
    $scope.movieActorsObject = $firebaseObject(ref.child($routeParams.id).child('movieActors'));
    $scope.movieYearObject = $firebaseObject(ref.child($routeParams.id).child('movieYear'));
    $scope.movies.$watch(function(event) { // Watch the array of all movies

      $scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
        $scope.watch.title = true; // Show message
        $timeout(function() {
          $scope.watch.title = false; // Hide message
        }, 5000);
      });

      $scope.moviePosterObject.$watch(function(event) {
        $scope.watch.poster = true;
        $timeout(function() {
          $scope.watch.poster = false;
        }, 5000);
      });

      $scope.moviePlotObject.$watch(function(event) {
        $scope.watch.plot = true;
        $timeout(function() {
          $scope.watch.plot = false;
        }, 5000);
      });

      $scope.movieTriviaObject.$watch(function(event) {
        $scope.watch.trivia = true;
        $timeout(function() {
          $scope.watch.trivia = false;
        }, 5000);
      });

      $scope.movieDirectorObject.$watch(function(event) {
        $scope.watch.director = true;
        $timeout(function() {
          $scope.watch.director = false;
        }, 5000);
      });

      $scope.movieWriterObject.$watch(function(event) {
        $scope.watch.writer = true;
        $timeout(function() {
          $scope.watch.writer = false;
        }, 5000);
      });

      $scope.movieActorsObject.$watch(function(event) {
        $scope.watch.actors = true;
        $timeout(function() {
          $scope.watch.actors = false;
        }, 5000);
      });

      $scope.movieYearObject.$watch(function(event) {
        $scope.watch.year = true;
        $timeout(function() {
          $scope.watch.year = false;
        }, 5000);
      });

    });
  });

  $scope.deleteMovie = function(movie) { // DESTROY
    $scope.movies.$remove(movie).then(function() {
      console.log("Movie deleted.");
      $location.path( "/movies" );
    }, function(error) {
      console.log("Error, movie not deleted.");
      console.log(error);
    });
  };

}]);
```

Refreshing the browser, none of the ```Saved!``` messages show. When we edit the title, ```Movie Title Saved!``` shows immediately, then hides after five seconds.

### Animate Fade In and Out

We could add an animation to make the ```Saved!``` wells fade in and fade out. Add this code to ```style.css```:

```css
.well-sm {
  -webkit-animation: smooth 10s ease-in;
  -moz-animation: smooth 10s ease-in;
  -o-animation: smooth 10s ease-in;
  -ms-animation: smooth 10s ease-in;
  animation: smooth 10s ease-in;
}

@-webkit-keyframes smooth {
  0% { opacity: 0;}
  25% { opacity: 1;}
  50% { opacity: 1;}
  75% { opacity: 1;}
  100% { opacity: 0;}
}
```

We're targeting the class ```well-sm```. We've set ```animation``` to ten seconds, with ```smooth``` and ```ease-in```. We've added extra instructions for various browsers:

* ```webkit``` is for Chrome and Safari.
* ```moz``` is for Firefox.
* ```o``` is for Opera.
* ```ms``` is for Internet Explorer.

Then we use _keyframes_ for the timing. The opacity starts at 0 (not visible), increases to 1 (fully visible) at 2.5 seconds, stays there for five seconds, then fades out the last 2.5 seconds.

We also need to shorten the ```$timeout()``` to 9999 milliseconds to prevent the message from flashing at the end:

```js
$scope.movieTitleObject.$watch(function(event) { // Watch one property of one movie
  $scope.watch.title = true; // Show message
  $timeout(function() {
    $scope.watch.title = false; // Hide message
  }, 9999);
});
```

Test and save your work to your GitHub repository:

```
git add .
git commit -m "Messages fade in and out."
git push origin master
```

### Remove ```updateMovie()```

Remove ```ng-submit="updateMovie()"``` from ```edit.html```. We're no longer using this method.

### Delete Movie with ```RETURN```

Keying ```RETURN``` anywhere in the ```EDIT``` form deletes the movie. This is because keying ```RETURN``` fires the ```submit``` form field. We no longer have a ```Update Movie``` button so the form thinks that the ```Delete Movie``` button is a ```submit``` form. There are several ways to fix this

The simplest is to specify that our button is a button. The default (if you don't specify) is ```type="submit"```.

```html
<button type="button">
```

That didn't work for me. Another way is to have the form check every keystroke and ignore ```RETURN``` keys:

```html
<form onkeypress="return event.keyCode != 13;">
```

That didn't work for me either. A third way is to move the ```Delete Movie``` out of the ```<form>``` with the data entry fields. That didn't work for me. A fourth way is to add a hidden input field above the ```Delete Movie``` button:

```html
<div>
    <input type="hidden" name="hiddenField" />
</div>
```

This worked!

## Combine EDIT with SHOW View

Let's combine the ```EDIT``` and ```SHOW``` views.

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/combine_show_edit.png)

I combined the ```SHOW``` and ```EDIT``` views only in the large screen view. The medium, small, and mobile screens have seperate ```SHOW``` and ```EDIT``` views.

I made two columns. The data fields and the ```Delete Movie``` button are on the left, copied from the ```EDIT``` view. The right column has ```Tech Notes```, the movie poster, likes, and comments. Here is the code for the large screen view in ```show.html```:

```HTML
<div class="row visible-lg-block col-lg-6">   <!-- large view, left column -->

  <div class="row">
    <form class="form-horizontal" name="editMovie">

      <div class="form-group">
        <label for="editTitle" class="col-lg-2 control-label">Title: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editTitle" ng-model="movie.movieTitle" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <div ng-show="watch.title" class="saved">Saved!</div>
        </div>
      </div>

      <div class="form-group">
        <label for="editPoster" class="col-lg-2 control-label">Poster: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editPoster" ng-model="movie.moviePoster" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.poster" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editPlot" class="col-lg-2 control-label">Plot: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editPlot" ng-model="movie.moviePlot" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.plot" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editTrivia" class="col-lg-2 control-label">Trivia: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editTrivia" ng-model="movie.movieTrivia" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.trivia" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editDirector" class="col-lg-2 control-label">Director: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editDirector" ng-model="movie.movieDirector" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.director" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editWriter" class="col-lg-2 control-label">Writer: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editWriter" ng-model="movie.movieWriter" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.writer" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editActors" class="col-lg-2 control-label">Actors: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editActors" ng-model="movie.movieActors" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.actors" class="saved">Movie Actors Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editYear" class="col-lg-2 control-label">Year: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editYear" ng-model="movie.movieYear" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.year" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editCountry" class="col-lg-2 control-label">Country: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editCountry" ng-model="movie.movieCountry" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.country" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editLanguage" class="col-lg-2 control-label">Language: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editLanguage" ng-model="movie.movieLanguage" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.language" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editGenre" class="col-lg-2 control-label">Genre: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editGenre" ng-model="movie.movieGenre" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.genre" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editRated" class="col-lg-2 control-label">Rated: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editRated" ng-model="movie.movieRated" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.rated" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editAwards" class="col-lg-2 control-label">Awards: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editAwards" ng-model="movie.movieAwards" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.awards" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editIMDBRating" class="col-lg-2 control-label">IMDB Rating: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editIMDBRating" ng-model="movie.movieIMDBRating" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.imdbRating" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editIMDBVotes" class="col-lg-2 control-label">IMDB Votes: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editIMDBVotes" ng-model="movie.movieIMDBVotes" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.imdbVotes" class="saved">Saved!</p>
        </div>
      </div>

      <div class="form-group">
        <label for="editMetascore" class="col-lg-2 control-label">Metascore: </label>
        <div class="col-lg-8">
          <input type="text" class="form-control" name="editMetascore" ng-model="movie.movieMetascore" ng-change="movies.$save(movie)" tooltip-placement="top-left" uib-tooltip="You can type in this field"></label>
        </div>
        <div class="col-lg-2">
          <p ng-show="watch.metascore" class="saved">Saved!</p>
        </div>
      </div>

      <div>
        <input type="hidden" name="hiddenField" />
      </div>

      <div class="form-group">
        <label for="deleteMovie" class="col-sm-2 control-label"></label>
        <div class="col-sm-8">
          <button type="button" name="deleteMovie" ng-click="deleteMovie(movie)" class="form-control btn btn-danger">Delete Movie</button>
        </div>
      </div>

    </form>
  </div>

</div> <!-- end left column -->

<div class="col-lg-6"> <!-- right column -->

  <button type="button" class="btn btn-danger btn-block" ng-click="techSummary = !techSummary">Tech Notes</button>
  <br />

  <!-- Tech Summary row -->
  <div class="row well well-lg" ng-show="techSummary">
    <p class="text-justify">This large screen view combines the SHOW and EDIT views. You can edit the fields in the left column. The small screen views have seperate SHOW and EDIT pages.</p>
    <p class="text-justify">Edits are saved immediately to the remote database using Firebase three-way binding. No "Update" button is needed. To inform users that their edits have been saved the Firebase method $watch() is used. Each field has its own $watch() method, as opposed to watching the entire database for changes, which would trigger the "Saved!" message when other users add or edit other movies. The Angular service $timeout() is used to display the message for 9.9 seconds. A 10-second animation changes the opacity to make the message fade in and out.
    </p>
    <p class="text-justify">Comments are an array of objects nested in the movie object. This is easy with the NoSQL database but would be more work with an SQL database. The "number of comments display" hides and shows the comments when clicked. A tooltip informs users of this feature. The number of comments pluralizes. The likes/dislikes buttons use glyphicons.</p>
  </div>

  <img class="moviePoster center-block" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}">

  <hr />

  <div class="row">
    <div class="likes col-xs-6 col-sm-6 col-md-6 col-lg-6">
      <span>{{movie.movieLikes}}</span>
    </div>
    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
      <form ng-submit="upLike(movie)">
        <button type="submit" class="btn btn-success btn-lg">
          <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
        </button>
      </form>
      <form ng-submit="downLike(movie)">
        <button type="submit" class="btn btn-danger btn-lg">
          <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
        </button>
      </form>
    </div>
  </div>

  <hr />

  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-12">
      <span ng-click="showComments = !showComments" class="showComments" data-toggle="tooltip" data-placement="top" title="Click to show or hide comments.">
        <ng-pluralize count="movie.comments.length"
        when="{'0': '',
        'one': '1 Comment',
        'other': '{} Comments',
        'NaN': ''}">
      </ng-pluralize><br />
    </span>

    <div ng-hide="showComments" ng-repeat="comment in movie.comments">
      <div class="row comment img-rounded">
        <div class="col-sm-8 col-md-8 col-lg-8">
          <span class="commentText">{{comment.commentText}}</span>
          <div class="commentAuthor">
            <span>&#151;{{comment.commentAuthor}}, </span>
            <span>{{comment.commentTimestamp | date:'mediumDate'}}</span>
          </div>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4">
          <form ng-submit="deleteComment(movie, comment)">
            <button type="submit" class="btn btn-warning btn-sm">Delete Comment</button>
          </form>
        </div>
      </div>
    </div>

    <div class="col-sm-12 col-md-12 col-lg-12">
      <form class="form-horizontal" ng-submit="newComment(movie)">
        <div class="form-group">
          <label for="commentText">Your Comment: </label>
          <input type="text" name="commentText" ng-model="movie.newComment.commentText" class="form-control" >
        </div>
        <div class="form-group">
          <label for="commentAuthor">Your Name: </label>
          <input type="text" name="commentAuthor" ng-model="movie.newComment.commentAuthor" class="form-control" >
        </div>
        <div class="form-group">
          <button type="submit" class="form-control btn btn-info btn-block">Submit Comment</input>
          </div>
        </form>
      </div>
    </div>
  </div>
```

### Add Tooltips

Users might not realize they can edit the field in the ```SHOW``` view. Let's add tooltips to tell them. Add ```tooltip-placement="top-left" uib-tooltip="You can type in this field"``` to each data entry form:

```HTML
<input type="text" class="form-control" name="editTitle" ng-model="movie.movieTitle" ng-change="movies.$save(movie)"></label>

```














### Binding a Single Key-Value Pair with $bindTo

The latter method retrieves the value from the remote database but doesn't update the remote database if the local value changes. To _bind_ the value we use ```$bindTo```:
