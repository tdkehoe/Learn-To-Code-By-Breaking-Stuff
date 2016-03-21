# Add Typeahead To the CRUDiest Movies Database

Typing in a movie name is tedious! Wouldn't it be better if you could type a few letters or the first words of a movie title, and the input form guessed what movie you hated? This is called _typeahead_ or _autofill_.

[UI Bootstrap](https://angular-ui.github.io/bootstrap/) includes a _typeahead_ plugin. We're lucky because UI Bootstrap is the JavaScript plugin library for Angular. Standard Bootstrap JavaScript plugins are [incompatible with Angular](https://scotch.io/tutorials/how-to-correctly-use-bootstrapjs-and-angularjs-together), and don't have a _typeahead_ plugin.

## Linking to UI Bootstrap

The first step is to add a link to the UI Bootstrap library from ```index.html```. The link must be below the Angular links.

The easiest way is to [find the latest CDN](https://cdnjs.com/libraries/angular-ui-bootstrap):

This website gives you a choice of four CDNs:

* Two with _templates_ that start with ```ui-bootstrap-tpls```.
* Two without templates, that start with ```ui-bootstrap```.
* Two _minified_ files that are small and load quickly, but can't be read by humans, and end in ```min.js```.
* Two not minified files that are bigger but humans can read (and change) the code, and end in ```js```.

We'll use the CDN with templates, minified:

```HTML
<script  type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.2.5/ui-bootstrap-tpls.min.js"></script>
```

Link only one of the four CDNs. Adding a second CDN will cause errors.

> Alternatively you can also download the library from the [UI Bootstrap](https://angular-ui.github.io/bootstrap/) website. There's a big purple button that says ```Download```. Move the file into your project folder and make a local link.

## Dependency Injection

Add the dependencies ```ui.bootstrap``` and ```ui.bootstrap.typeahead``` to ```app.js```:

```js
var app = angular.module("CRUDiestMoviesApp", ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.typeahead']);
```

## Typeahead Plugin

Go to [UI Bootstrap](https://angular-ui.github.io/bootstrap/) and scroll down to the bottom. The last plugin is ```Typeahead```. You'll see there are five type of typeahead plugins:

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/typeahead_five_options.png)

* Four of the plugins -- ```Static arrays```, ```ngModelOptions support```, ```Custom templates for results```, and ```Custom popup templates for typeahead's dropdown``` -- look up in an array of values in your controller. This is ideal when you have a limited number of options, e.g., the fifty states. The four choice format the values differently for the user, including one that adds a state flag downloaded live from Wikipedia.
* The ```Asynchronous results``` plugin goes to any database on the Internet with an API. We'll use this to connect to the Internet Movie Database (IMDB).

Look for the ```Markup``` code samples and add this code to ```new.html```. Put it at the bottom, below the ```</form>``` tag.

```HTML
<h4>Asynchronous results</h4>
<pre>Model: {{asyncSelected | json}}</pre>
<input type="text" ng-model="asyncSelected" placeholder="Locations loaded via $http" uib-typeahead="address for address in getLocation($viewValue)" typeahead-loading="loadingLocations" typeahead-no-results="noResults" class="form-control">
<i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
<div ng-show="noResults">
  <i class="glyphicon glyphicon-remove"></i> No Results Found
</div>
```

Look for the ```JavaScript``` code samples and add this code to ```NewController.js```:

```js
$scope.getLocation = function(val) {
  console.log(val);
  return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: val,
      sensor: false
    }
  }).then(function(response){
    return response.data.results.map(function(item){
      return item.formatted_address;
    });
  });
};
```

Where you put this code block is critical. The controller should look like this:

```js
app.controller('NewController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  console.log("New controller.");
  $scope.addMovie = function(movie){
    var movie = {
      movieName:  $scope.movie.movieName,
      moviePerson: $scope.movie.moviePerson,
      movieYear: $scope.movie.movieYear,
      movieSummary: $scope.movie.movieSummary,
      movieTrivia: $scope.movie.movieTrivia,
      moviePoster: $scope.movie.moviePoster,
      movieRating: $scope.movie.movieRating,
      movieLikes: 0
    };
    $http.post('https://pure-wave-92261.herokuapp.com/movies/movies/', movie).then(function(response) { // NEW
      console.log("Movie added.");
      console.log(movie);
      $location.path( "/movies/" );
    }, function(response) {
      console.log("Error, no movie added.");
    });
  };
  $scope.getLocation = function(val) {
    console.log(val);
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };
}]);
```

Count the ```}``` closing brackets to make sure you got it right.

If you've deployed your app to Firebase then run ```firebase deploy``` again, then refresh your browser. In the ```NEW``` view you should see the form ```Asynchronous results```. Start to type in your address and it should get your complete address from Google Maps.

Save your work to your GitHub repository:

```
git add .
git commit -m "UI Bootstrap Typeahead working with Google Maps!"
git push origin master
```

### Markup

Let's look more closely at the Angular HTML code:

```HTML
<h4>Asynchronous results</h4>
<pre>Model: {{asyncSelected | json}}</pre>
<input type="text" ng-model="asyncSelected" placeholder="Locations loaded via $http" uib-typeahead="address for address in getLocation($viewValue)" typeahead-loading="loadingLocations" typeahead-no-results="noResults" class="form-control">
<i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
<div ng-show="noResults">
  <i class="glyphicon glyphicon-remove"></i> No Results Found
</div>
```

The third line is an input field, type ```text```, as we've used before. It sets a local (```$scope```) variable using ```ng-model```. The local variable is called ```asyncSelected```. It also provides a placeholder in the input form field.

The directive ```uib-typeahead``` does all the work. It looks up a list of addresses using the controller script ```$getLocation```. ```$viewValue``` is the current value in the view, i.e., your string input. You can read more about it in the [ngModel.NgModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController) documentation.

The rest of line three specifies messages to display while the data is loading, if no results are found, and lastly sets the class for Bootstrap to style the form.

The second line displays what you're typing, with the variable ```asyncSelected``` bound with ```ng-model``` in the third line.

The last lines display icons using glyphicons.

### JavaScript

Looking at the ```NewController.js``` code:

```js
$scope.getLocation = function(val) {
  console.log(val);
  return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: val,
      sensor: false
    }
  }).then(function(response){
    return response.data.results.map(function(item){
      return item.formatted_address;
    });
  });
};
```

We're creating a function ```getLocation```. It's a method of the ```$scope``` object so it's available in the view. (Line 3 in the HTML code calls it.)

The function takes the argument ```val```, which is passed in from ```$viewValue```. Watch the console as you enter an address and you'll see that ```val``` is updated with every character you type.

The third line makes an HTTP GET request to Google Maps, and returns the result.

The object ```params``` puts your input into the ```address``` property.

After a value is returned from Google Maps, ```then``` indicates a _promise_. A promise is executed after a deferred or asynchronous function, typically an HTTP request, returns data. Without a promise the following code:

1. Request data from a remote database.
2. Do something with the data.

would execute step 2 first, before the data returns from the remote database. In other words, the JavaScript stack would say, "OK, I've sent the request to the remote database. Is there something else for me to do? Why yes, there's another command, I'll execute that now." What you want is this:

1. Request data from a remote database.
2. Wait for the data to arrive.
3. After the data has arrived, do something with the data.

Because JavaScript is so often used to connect remote resources we often need promises.

Promises connect to the asynchronous function via _dot notation_, just like any other method. However, we usually write the promise on its own line.

Looking at this code block:

```js
.then(function(response){
  return response.data.results.map(function(item){
    return item.formatted_address;
  });
});
```

The first line is the promise, which executes a function. It passes in the HTTP response from the database as ```response```.

The second line takes the HTTP response results, filters to provide only the data from the response, and filters the data to only part of the data (the ```results``` section). Next the [```map()```](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function is called. This has nothing to do with Google Maps. The ```map()``` method creates a new array with the results of calling a provided function on every element in this array. ```map()``` executes a function, which passes in single addresses from the response as ```item```. Finally we return the ```formatted_address``` property of the ```item``` object.

This becomes clear if we examine ```response``` and ```item``` by putting in two ```console.log``` commands:

```js
$scope.getLocation = function(val) {
  return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: val,
      sensor: false
    }
  }).then(function(response){
    console.log(response);
    return response.data.results.map(function(item){
      console.log(item)
      return item.formatted_address;
    });
  });
};
```

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/typeahead_white_house.png)

You can see ```formatted_address``` in the object. If you watch the console as you type each letter you'll see the responses coming in.

## Movies, Not Addresses

But we want movies, not addresses from Google Maps. We'll use the [Open Movies Database](http://www.omdbapi.com/). Take a look at it and search for a movie by title:

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/typeahead_omdb.png)

Note the query: ```http://www.omdbapi.com/?t=day+of+the+triffids&y=&plot=short&r=json```

Let's go into Postman and send that HTTP GET request:

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/typeahead_postman.png)

Now play around with changing the HTTP request query parameters. Try ```s``` for Search instead of ```t``` for Title: ```http://www.omdbapi.com/?s=frozen```

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/typeahead_postman_s.png)

Now we get back an array containing all movies with "frozen" in the title. This is the HTTP request we want. Replace the ```$scope.getLocation``` code with this:

```js
$scope.getLocation = function(val) {
  return $http.get('//www.omdbapi.com/?s=' + val)
  .then(function(response){
    console.log(response.data.Search);
    return response.data.Search.map(function(item){
      console.log(item);
      return item.Title;
    });
  });
};
```

Note that only three lines have changed (not counting the console logs).

* The second line is the HTTP request we used in Postman. The user's typing is passed in as ```val``` from the view.
* The fifth line changes from ```results``` to ```Search```. Look at line 2 of the Postman response to see why. ```Search``` is the name of the array with our data, i.e., OMDB calls the array ```Search``` when Google Maps calls the array ```results```.
* The seventh line specifies that we want the ```Title```, not the ```formatted_address```.

Run ```firebase deploy```, refresh your browser, and it should work. Watch the console to see each letter you type return single responses with multiple items.

Save your work to your GitHub repository:

```
git add .
git commit -m "UI Bootstrap Typeahead working with OMDB."
git push origin master
```
