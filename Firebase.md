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

An important distinction is made in Firebase between arrays and objects. Different services are used--```$firebaseArray``` vs. ```$firebaseObject```--with different methods. The INDEX page obviously accesses an array--all of our movies. The SHOW page accesses a an object, a single movie. Which service do we use?

We can use either the ```$firebaseArray``` service or the ```$firebaseObject``` service. Perhaps it's possible to use both services in one controller but I haven't figured out how to do that. A better practice is to use one service or the other. Most functions can be set up for either service.

#### $firebaseArray

We'll build the SHOW view first with ```$firebaseArray```. Here we access the array ```$scope.movies``` containing all of our movies, then select one movie from the array, and set ```$scope.movie``` to equal this selected movies. Pay attention to the pluralization of ```movies``` vs ```movie```!

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
app.controller('ShowController', ['$scope', '$routeParams', '$location', '$firebaseObject', function($scope, $routeParams, $location, $firebaseObject) {
  console.log("Show controller.");
  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.movie = $firebaseObject(ref.child($routeParams.id));
  console.log($scope.movie);

}]);
```

Note a big difference: this code is synchronous, and it works. Is this because it's faster to use ```$firebaseObject```?

Let's analyze the performance using the Timeline in Chrome Dev Tools. In the console, click on ```Timeline```, then ```⌘-R``` to refresh the view. I found:

* Synchronous ```$firebaseArray```, 567 to 1000 ms total; loading 8.2 ms.
* Asynchronous ```$firebaseArray```, 696 to 861 ms, loading 8.4 ms.
* Synchronous ```$firebaseObject```, 569 to 946 ms, loading 8.3 ms.

The answer seems to be that all three methods are equally fast. In other words, there shouldn't be a performance gain or penalty for using the asynchronous ```$firebaseArray``` vs. the synchronous ```$firebaseObject```. Use whichever you prefer. The synchronous ```$firebaseObject``` has less code but I don't understand why this version works, when the synchronous ```$firebaseArray``` doesn't work.

### deleteMovie()

To delete a movie we use ```$remove()```.

```js
$scope.deleteMovie = function(movie) { // DESTROY
  $scope.movies.$remove(movie).then(function() {
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

## Get Rid of the Update Button

What if we called ```$save()``` from the view? In ```edit.html``` put in ```ng-change="movies.$save(movie)"```. Change the title of your movie and refresh the browser. The title changed, without clicking the ```Update Movie``` button! Look in your Firebase Dashboard and you'll see the new value in the database.

You could add ```ng-change="movies.$save(movie)"``` to each field in ```edit.html``` and remove the ```Update Movie``` button. This changes the user experience (UX). The user may not know that he or she can change a field. After he or she changes a value, he or she needs feedback that the change has updated in the database.

The former problem we can address by highlighting fields on focus, i.e., when the user drags a mouse over the field, as we did in the INDEX view to encourage users to click on a movie poster. We could also put in tooltips.

For the latter we can set up a listener that shows an animated pop-up when data is saved. We'll use AngularFire's ```$watch()``` method. Add ```$watch()``` to the ```EditController.js```:

```js
$scope.movies.$watch(function(event) {
  console.log(event);
});
```

Update a movie title and watch in the console as every keystroke is logged: ```Object {event: "child_changed", key: "-KEIDakifQfpUHWphD62"}```.

Now we










## Binding Objects with $firebaseObject

Binding Firebase arrays is easy. Binding objects is trickier.

### Fetch a Single Key-Value Pair with $firebaseObject

Fetching a single property (key-value pair) in an object is easy. We're not going to do this but the strategy is first to use ```$firebaseObject``` instead of ```$firebaseArray``` because we're working with an object, not an array. Then we attach ```.child()``` to the object to target a property of the object:

```js
app.controller('ShowController', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {

function($scope, $firebaseObject) {
  var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
  $scope.property = $firebaseObject(ref.child('someProperty'));
  }
]);
```

You can string ```.child``` many times to drill down inside a nested object.

### Binding a Single Key-Value Pair with $bindTo

The latter method retrieves the value from the remote database but doesn't update the remote database if the local value changes. To _bind_ the value we use ```$bindTo```: