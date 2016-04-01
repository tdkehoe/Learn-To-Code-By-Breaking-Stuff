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

The directive ```uib-typeahead``` does all the work. ```address for address``` is [select directive](https://docs.angularjs.org/api/ng/directive/select) syntax. The archetypal format is ```label for value in sourceArray.``` ```sourceArray``` must be an array so ```getLocation($viewValue)``` must return an array. ```getLocation``` fires the controller function ```$getLocation``` to look up addresses. ```$viewValue``` is the current value in the view, i.e., your string input. You can read more about it in the [ngModel.NgModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController) documentation.

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

The fifth line includes the ```map()``` method, with both Google Maps and OMDB. ```map()``` has nothing to do with Google Maps. It's a [JavaScript method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that "creates a new array with the results of calling a provided function on every element in this array." In other words, ```map()``` takes the response from OMDB and arranges the results into an array for Angular to use in the view. ```map()``` is related to ```reduce()```, which



Run ```firebase deploy```, refresh your browser, and it should work. Watch the console to see each letter you type return single responses with multiple items.

Save your work to your GitHub repository:

```
git add .
git commit -m "UI Bootstrap Typeahead working with OMDB."
git push origin master
```

## Typeahead in the View

Here's the view code we copied from the UI Bootstrap example:

```HTML
<h4>Asynchronous results</h4>
<pre>Model: {{asyncSelected | json}}</pre>
<input type="text" ng-model="asyncSelected" placeholder="Locations loaded via $http" uib-typeahead="address for address in getLocation($viewValue)" typeahead-loading="loadingLocations" typeahead-no-results="noResults" class="form-control">
<i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
<div ng-show="noResults">
  <i class="glyphicon glyphicon-remove"></i> No Results Found
</div>
```

Let's take off the first two lines, and put in a row to match our other rows:

```HTML
<div class="addNewMovie row">
  <form class="form-horizontal" ng-submit="addMovie()" name="newMovie">

    <div class="form-group">
      <label for="movieTitle" class="col-sm-2 control-label">Add the worst movie you've seen recently: </label>
      <div class="col-sm-10">
        ...
      </div>
    </div>

  </form>
</div>
```

Let's reformat the input form to be more readable:

```html
<input type="text"
  ng-model="asyncSelected"
  placeholder="Locations loaded via $http" uib-typeahead="address for address in getLocation($viewValue)" typeahead-loading="loadingLocations" typeahead-no-results="noResults"
  class="form-control" />
<i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
<div ng-show="noResults">
  <i class="glyphicon glyphicon-remove"></i> No Results Found
</div>
```

The data from the form is the movie title so we want the data to bind to ```movie.movieTitle```. ```ng-model``` binds data from the view to the controller (from the form to the ```$scope```) so change ```ng-model="asyncSelected"``` to ```ng-model="movie.movieName"```.

Our form needs to be tied to its label so add ```name="movieTitle"```.

We can add a directive to not send an HTTP request to OMDB until the user has entered three characters: ```typeahead-min-length="3"```.

Lastly, we can get rid of the big red ```Add Movie``` button. We want to fire a function in the controller when the user selects a movie title in the typeahead. We add the directive ```typeahead-on-select="onSelect($item)"```. This fires the function ```$scope.onSelect``` in the controller. ```$item``` passes through the movie title to the controller.

The complete form is:

```html
<div class="addNewMovie row">
  <form class="form-horizontal" ng-submit="addMovie()" name="newMovie">

    <div class="form-group">
      <label for="movieName" class="col-sm-2 control-label">Add the worst movie you've seen recently: </label>
      <div class="col-sm-10">
        <input type="text"
        class="form-control"
        name="movieName"
        ng-model="movie.movieName"
        uib-typeahead="address for address in getLocation($viewValue)"
        typeahead-loading="loadingLocations"
        typeahead-no-results="noResults"
        typeahead-min-length="3"
        typeahead-on-select="onSelect($item)" />
        <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
        <div ng-show="noResults">
          <i class="glyphicon glyphicon-remove"></i> No Results Found
        </div>
      </div>
    </div>

  </form>
</div>
```

In ```NewController.js``` we'll add the ```$scope.onSelect``` function:

```js
$scope.onSelect = function ($item) {
  console.log("Selected!");
  console.log($item);
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
    $http.post('https://pure-wave-92261.herokuapp.com/movies/movies/', movie).then(function(response) { // NEW
      $scope.movies = response.data;
      console.log("Movie added.");
    }, function(response) {
      console.log("Error, no movie added.");
    });
  });
};
```

The movie title is passed in as ```$item```. We then do an HTTP GET request to OMDB. We specify ```t``` for _title_ instead of ```s``` for _search_.

When the HTTP response comes back asynchronously ```then``` executed a promise function. The function creates a ```movie``` object with many properties. We create a property ```movieActors``` and assign a value from the response, ```response.data.Actors```. We do this for all the fields we want from OMDB, plus we initialize our ```movieLikes``` property at zero.

Next, we make an HTTP POST request to our Heroku back end and pass in the ```movie``` object. Finally we take the HTTP POST response and put it in the ```$scope``` so that it's available to the view.

You should be able to select a movie in your ```NEW``` view and see it appear at end of your ```INDEX``` view.

Save your work to your GitHub repository:

```
git add .
git commit -m "Typeahead onSelect saving movies to database."
git push origin master
```

## Combining NEW and INDEX Views

With OMDB providing all of our data except the title we no longer need the forms in the ```NEW``` view. Let's move our typeahead form to the home page:

```html
<<div class="row">

  <div class="colophon col-sm-2 col-md-2 col-lg-2">
    <p class="lead">MEAN stack ReSTful CRUD app with Angular front-end and Bootstrap styling.</p>

    ...

  </div>

  <div class="col-sm-10 col-md-10 col-lg-10">

    <div class="addNewMovie row">
      <form class="form-horizontal" ng-submit="addMovie()" name="newMovie">

        <div class="form-group">
          <label for="movieName" class="col-sm-2 control-label">Add the worst movie you've seen recently: </label>
          <div class="col-sm-10">
            <input type="text"
            class="form-control"
            name="movieName"
            ng-model="movie.movieName"
            uib-typeahead="address for address in getLocation($viewValue)"
            typeahead-loading="loadingLocations"
            typeahead-no-results="noResults"
            typeahead-min-length="3"
            typeahead-on-select="onSelect($item)" />
            <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
            <div ng-show="noResults">
              <i class="glyphicon glyphicon-remove"></i> No Results Found
            </div>
          </div>
        </div>

      </form>
    </div>

    <div class="row visible-xs-block">
      <div ng-repeat="movie in movies" class="movieIndex">
        <a ng-href="/#/movies/{{movie._id}}"><img class="extraSmallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
      </div>
    </div>

    <div class="row visible-sm-block">
      <div ng-repeat="movie in movies" class="movieIndex">
        <a ng-href="/#/movies/{{movie._id}}"><img class="smallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
      </div>
    </div>

    <div class="row visible-md-block">
      <div ng-repeat="movie in movies" class="movieIndex">
        <a ng-href="/#/movies/{{movie._id}}"><img class="mediumMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
      </div>
    </div>

    <div class="row visible-lg-block">
      <div ng-repeat="movie in movies" class="movieIndex">
        <a ng-href="/#/movies/{{movie._id}}"><img class="largeMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
      </div>
    </div>

  </div>
</div>
```

You'll need to move the ```$scope.getLocation``` and ```$scope.onSelect``` functions from  ```NewController.js``` to ```HomeController.js```. You should be able to add movies from home page. We'll no longer use ```new.html``` and ```NewController.js```. You can remove this line from ```index.html```:

```html
  <script type="text/javascript" src="javascript/controllers/EditController.js"></script>
```

Let's make the "Add Movie" row nicer. We'll put the label inside the input form as a placeholder:

```html
placeholder="What's the worst movie you've seen?"
```

A search box should have a search glyphicon. After the ```input``` element put this ```span``` element:

```html
<span class="glyphicon glyphicon-search form-control-feedback"></span>
```

The ```form-control-feedback``` class right-aligns the glyphicon in the input data entry form. To get it where I wanted I had to add padding in ```styles.css```:

```css
.glyphicon-search {
  padding-right: 40px;
  color: silver;
  font-size: larger;
}
```

I also changed the color from black to silver, and made the glyphicon larger.

Then change the columns so that the search box is eleven columns wide, and the label is one column. We'll put a glyphicon in the left column to indicate when data is loading. The row should now look like:

```html
<div class="addNewMovie row">
  <form class="form-horizontal" ng-submit="addMovie()" name="newMovie">

    <div class="form-group col-sm-1 col-md-1 col-lg-1 text-right addMovie">
      <i ng-show="loading" class="glyphicon glyphicon-refresh"></i>
    </div>

    <div class="col-sm-11 col-md-11 col-lg-11">
      <input type="text"
      class="form-control addMovie"
      name="movieTitle"
      ng-model="movie.movieTitle"
      uib-typeahead="address for address in getLocation($viewValue)"
      typeahead-loading="loadingLocations"
      typeahead-no-results="noResults"
      typeahead-min-length="3"
      typeahead-on-select="onSelect($item)"
      placeholder="What's the worst movie you've seen?"/>
      <span class="glyphicon glyphicon-search form-control-feedback"></span>
      <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
      <div ng-show="noResults">
        <i class="glyphicon glyphicon-remove"></i> No Results Found
      </div>

    </div>

  </form>
</div>
```

To make the "loading" glyphicon work we put two lines in ```HomeController.js```. We wrote the icon with ```ng-show="loading"``` so we need a variable ```$scope.loading```. We'll set ```$scope.loading = true;``` as soon as the user selects a movie. Then we'll set ```$scope.loading = false;``` when we get the data from OMDB and push it to the ```$scope```. I'll show this complete code in the next section.

### Updating the INDEX View

When a user adds a movie it should appear immediately in the top row. But our movies are displayed in order of entry in our database. We want to reverse this, and show the newest entries first. We'll use Angular's ```orderBy``` filter. The [documentation](https://docs.angularjs.org/api/ng/filter/orderBy) says the syntax is this:

```html
ng-repeat="movie in movies | orderBy : expression : reverse"
```

The ```expression``` can be a function, an array, or a string. We'll use a property in the movie object, which is a string. Strings have to be quoted. The ```_id``` property orders our movies by date added so we'll set the ```expression``` as ```'_id'```.

The predicate ```reverse``` is _boolean_ and _optional_. In other words, you don't put ```reverse``` in the third position when you want reverse order. You put ```true``` for reverse and ```false``` or nothing for _not reverse_. (IMHO, it should be ```reverse``` for reverse and nothing for not reverse.)

Now our four responsive views are:

```html
<div class="row visible-xs-block">
  <div ng-repeat="movie in movies | orderBy : '_id':true" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="extraSmallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-sm-block">
  <div ng-repeat="movie in movies | orderBy : '_id':true" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="smallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-md-block">
  <div ng-repeat="movie in movies | orderBy : '_id':true" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="mediumMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-lg-block">
  <div ng-repeat="movie in movies | orderBy : '_id':true" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="largeMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>
```

We have another problem. When you add a movie, the poster doesn't appear until you refresh the browser. You can ```console.log($scope.movie)``` in the promise after the HTTP POST request and see that the new movie is in the scope. The issue is that [Angular doesn't always update the view when ```$scope``` is updated](http://jimhoskins.com/2012/12/17/angularjs-and-apply.html). ```$scope.$digest()``` is the Angular function that looks for changes in the ```$scope```. Then ```$scope.$apply``` updates the view. ```$scope.$apply``` calls ```$scope.$digest``` so we only have to call ```$scope.apply```.

But ```$scope.$apply``` can't be called from within a digest cycle. That's pretty much everywhere. HTTP requests call ```$scope.$apply``` so we'll make a useless HTTP GET request to update the view. Here's the finished ```$scope.onSelect``` in ```HomeController.js```:

```js
$scope.onSelect = function ($item) {
  console.log("Selected!");
  console.log($item);
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
    $http.post('https://pure-wave-92261.herokuapp.com/movies/movies/', movie).then(function(response) { // NEW
      console.log("Movie added.");

      // This HTTP GET request is needed to run $scope.$apply() and update the movies in the view.
      $http.get('https://pure-wave-92261.herokuapp.com/movies/movies/').then(function(response) { // INDEX
        $scope.movies = response.data;
      }, function(response) {
        console.log("Error, no data returned.");
      });

    }, function(response) {
      console.log("Error, no movie added.");
    });
  });
};
```

There's a lag between a user selecting a movie and the movie appearing on the page. With slow Internet the lag is substantial. Now we have:

1. GET one movie from OMDB. This is fast.
2. POST one movie to MongoDB. This is fast.
3. GET all of our movies from MongoDB. This is slow.

Is there a faster way to do this? How about:

1. GET one movie from OMDB. This is fast.
2. Push the movie into the Angular array ```$scope.movies```. This is instantaneous. The user thinks sees his or her movie appear in the view.
3. POST one movie to MongoDB. This is fast, and runs while the user is doing something else.
4. GET all of our movies from MongoDB. This is slow and unnecessary unless multiple persons are using your web app at the same time. We can run this in the background while the user is doing something else.

Here's the faster code:

```js
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
    $scope.movies.push(movie);
    $scope.loading = false;
    $http.post('https://pure-wave-92261.herokuapp.com/movies/movies/', movie).then(function(response) { // NEW
      console.log("Movie added.");

      // This HTTP GET request is necessary only if multiple users are using the web app at the same time.
      // $http.get('https://pure-wave-92261.herokuapp.com/movies/movies/').then(function(response) { // INDEX
      //   $scope.movies = response.data;
      // }, function(response) {
      //   console.log("Error, no data returned.");
      // });
    }, function(response) {
      console.log("Error, no movie added.");
    });
  });
};
```

## Changing the Order in the INDEX View

Now we have the movies displaying in order of most recently added first. This is the default order so that users see their movies appear when they add movies. But what if users want to see the movies ranked in order of worst to best?

We'll add two rows to the INDEX view: a row of six buttons, and above the buttons a row of three labels:

```html
<!-- orderBy labels row -->
<div class="row">
  <div class="col-sm-4 text-center">
    <h4>Order by Date Added</h4>
  </div>
  <div class="col-sm-4 text-center">
    <h4>Order by Rating</h4>
  </div>
  <div class="col-sm-4 text-center">
    <h4>Order by Year</h4>
  </div>
</div>

<!-- orderBy buttons row -->
<div class="row">
  <div class="col-sm-2">
    <button type="button" class="btn btn-primary btn-block" ng-click="order = '_id'; reverse = true">Recent</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-primary btn-block" ng-click="order = '_id'; reverse = false">Oldest</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-warning btn-block" ng-click="order = 'movieImdbRating'; reverse = false">Worst</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-warning btn-block" ng-click="order = 'movieImdbRating'; reverse = true">Best</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-success btn-block" ng-click="order = 'movieYear'; reverse = true">Newest</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-success btn-block" ng-click="order = 'movieYear'; reverse = false">Oldest</button>
  </div>
</div>
```

We'll use ```warning``` as the color for the worst movies. "Date added" is the default so it gets the ```primary``` color.

Ww don't need to write any JavaScript in the controller. We're using ```ng-click``` instead of ```ng-submit``` because no data needs to be passed to the controller. ```ng-click="order..."``` is setting ```$scope.order``` to a value, either ```'_id'``` for data added, ```'movieImdbRating'``` for the rating, etc.

Note that we set a second variable, ```reverse```. This is a Boolean parameter so can only be ```true``` or ```false```.

Now in the four responsive views change ```orderby``` to use these variables: ```orderBy : order : reverse```.

The complete code for the responsive views is:

```html
<!-- Responsive views -->
<div class="row visible-xs-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="extraSmallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-sm-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="smallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-md-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="mediumMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-lg-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie._id}}"><img class="largeMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>
```

## Use a Movie Font

Google "movie fonts" and you'll see

![Atom HTML](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/movie_fonts.jpg)

Pick a free movie font and download a TrueType font ```.ttf``` file. Make a subdirectory of ```css``` for your fonts:

```
cd public
cd css
mkdir fonts
```

Put the ```.ttf``` files into your ```css/fonts``` folder.

In ```style.css``` add your font:

```css
@font-face {
  font-family: "Terminator";
  src: url("fonts/Terminator.ttf") format("truetype");
}
```

The ```src``` is tricky. You can set ```url``` or ```local```. With ```url``` you can specify a URL, such as ```//fonts.googleapis.com/css?family=Nixie+One```. You also use ```url``` if your file is local on your server, with the path (relative to ```style.css```) and the filename. ```local``` somehow searches your computer for the font. I've never gotten that to work.
