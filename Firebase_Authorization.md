# Firebase Authorization and Authentication

_Authentication_ is the process of ascertaining if a user is who he or she claims to be.

_Authorization_ is the process of determining if a user if allowed to do something, e.g., view a page or add data to a database.

_Auth_ means either or both authentication or authorization.

"Old school" websites use a login name and a password. Current design uses _OAuth_ for authorization with third-party websites such as Google, Facebook, Twitter, GitHub, etc. Users like the convenience of clicking "Login With Facebook", etc. But [OAuth 2.0 is controversial](https://en.wikipedia.org/wiki/OAuth#Controversy) because enterprise users made the project "more complex, less interoperable, less useful, more incomplete, and most importantly, less secure" in order "to sell consulting services and integration solutions."

Authorization and authentication are headaches if you write the code yourself, as well as security risks if you don't know what you're doing. To solve this problem several authorization and authentication services are available. Firebase includes an one, and this is a major reason for using Firebase.

Setting up Firebase authorization involves these steps:

* Make buttons on the home page for authorization.
* Get tokens from third-parties such as Google or Facebook.
* User-Based Security Rules
* Routing

## Login Anonymously

We'll start with anonymous login. Even if we don't plan to allow this on our ultra-high-security movies database we'll start here because it's easy.

### Enable Anonymous User Authentication

Navigate to your Firebase dashboard and click ```Login & Auth``` in the left column. Select the ```Anonymous``` tab and click to enable anonymous authentication.

## Inject ```$firebaseAuth``` into ```HomeController.js```

In ```HomeController.js``` inject ```$firebaseAuth```:

```js
app.controller('HomeController', ['$scope', '$http', '$route', '$location', '$firebaseArray', '$firebaseAuth', function($scope, $http, $route, $location, $firebaseArray, $firebaseAuth) {
  ...
}]);
```

## Create ```$firebaseAuth``` Object

Make a object for ```$firebaseAuth``` and put it on the $scope:

```js
var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
$scope.authObj = $firebaseAuth(ref);
```

### ```$scope.login```

In ```HomeController.js``` add a function ```$scope.login```:

```js
$scope.login = function() {
  $scope.authData = null;
  $scope.error = null;

  $scope.authObj.$authAnonymously().then(function(authData) {
    $scope.authData = authData;
    console.log($scope.authData);
  }).catch(function(error) {
    $scope.error = error;
    console.log($scope.error);
  });
};
```

This function creates two new variables in the ```$scope```: ```authData``` and ```error```. The variables start as ```null``` or no value.

We then run the method ```$authAnonymously()``` on our ```$firebaseAuth``` object. It returns (as a promise) data, which we store as ```$scope.authData```.

[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) can be fulfilled or rejected. When a promise is fulfilled the ```.then(function()){})``` callback is executed. If the promise is rejected, we can handle the error in the ```.then``` function. But it's neater to chain a ```.catch``` callback for error handling. Here we assign the error message to ```$scope.error```.

### Make Login Buttons

Now we'll make a button for anonymous login on ```home.html```:

```html
<div class="row">
  <div class="col-sm-12">
    <button type="button" class="btn btn-info btn-block" ng-click="login()">Login Anonymously</button>
    <p ng-if="authData">Logged in user: <strong>{{ authData.uid }}</strong></p>
    <p ng-if="error">Error: <strong>{{ error }}</strong></p>
  </div>
</div>
```

Refresh the browser and try it out:

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/login_anonymously.png)

That's ugly but it works.

### Logout Button

Now we need a ```Logout``` button.

Add ```ng-if="!authData"``` to our ```Login Anonymously``` button:

```HTML
<button type="button" class="btn btn-info btn-block" ng-click="login()" ng-if="!authData">Login Anonymously</button>
```

This shows the ```Login``` button when there's no ```authData``` (the user isn't logged in).

Now we can add a ```Logout``` button:

```HTML
<button type="button" class="btn btn-info btn-block" ng-click="auth.$unauth()" ng-if="authData">Logout</button>
```

That doesn't do anything.

Let's make a handler. Change the button to:

```HTML
<button type="button" class="btn btn-info btn-block" ng-click="logout()" ng-if="authData">Logout</button>
```

In ```HomeController.js``` add a ```$scope.logout()``` handler:

```js
$scope.logout = function() {
  console.log("Logging out!");
  $scope.authObj.$unauth();
  console.log($scope.authData)
};
```

That doesn't do anything either. Let's check the auth status of the user with ```$onAuth()```:

```js
$scope.logout = function() {
  console.log("Logging out!");
  $scope.authObj.$unauth();
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      console.log("Logged in as:", authData.uid);
    } else {
      console.log("Logged out");
    }
  });
};
```

The console log says that the user is logged out.

Let's clear the ```$scope.authData``` object by adding ```$scope.authData = null;```:

```js
$scope.logout = function() {
  console.log("Logging out!");
  $scope.authObj.$unauth();
  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      console.log("Logged in as:", authData.uid);
    } else {
      $scope.authData = null;
      console.log("Logged out");
    }
  });
};
```

That works. This suggests that authorization and ```$scope.authData``` are different objects. You can't see the logged in users on your Firebase dashboard. You can't see if a user is logged in on ```$scope.authData```. You can only see if a user is logged in with ```$onAuth()```. In other words, ```$authAnonymously()``` put the ```authData``` on the ```$scope``` but ```unauth()``` doesn't take it off the ```$scope```.

It might be better not to put the authData on the $scope and instead rely directly on authData.

### Authorize Adding a Movie

Let's make it so that only logged in users can add a movie. We'll hide the ```Add a Movie``` data entry field until the user logs in.

Add ```ng-if="authData"``` to the ```Add a Movie``` field, and to the ```glyphicon-search``` icon:

```html
<div class="col-sm-6 col-md-6 col-lg-6">
  <input type="text"
  class="form-control addMovie"
  name="movieTitle"
  ng-model="movie.movieTitle"
  uib-typeahead="address for address in getLocation($viewValue)"
  typeahead-loading="loadingLocations"
  typeahead-no-results="noResults"
  typeahead-min-length="3"
  typeahead-on-select="onSelect($item)"
  placeholder="Add the worst movie you've seen!"
  ng-if="authData"/>
  <span class="glyphicon glyphicon-search form-control-feedback" ng-if="authData"></span>
  <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
  <i ng-show="loading" class="glyphicon glyphicon-refresh"></i>
  <div ng-show="noResults">
    <i class="glyphicon glyphicon-remove"></i> No Results Found
  </div>
</div>
```

Now let's add a ```Logout``` button alongside the ```Add a Movie``` field. Change the ```Add a Movie``` field to use five columns, and then add a one-column button:

```HTML
<div class="col-sm-1 col-md-1 col-lg-1">
  <button type="button" class="btn btn-info btn-block" ng-click="logout()" ng-if="authData">Logout</button>
</div>
```

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/login_logout_button.png)

Now let's show the login button when the ```Add a Movie``` field hides. Copy and paste the ```Login Anonymously``` button into the five-column ```div```, below the ```Add a Movie``` field.

```html
<div class="col-sm-5 col-md-5 col-lg-5">
  <input type="text"
  class="form-control addMovie"
  name="movieTitle"
  ng-model="movie.movieTitle"
  uib-typeahead="address for address in getLocation($viewValue)"
  typeahead-loading="loadingLocations"
  typeahead-no-results="noResults"
  typeahead-min-length="3"
  typeahead-on-select="onSelect($item)"
  placeholder="Add the worst movie you've seen!"
  ng-if="authData"/>
  <span class="glyphicon glyphicon-search form-control-feedback" ng-if="authData"></span>
  <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
  <i ng-show="loading" class="glyphicon glyphicon-refresh"></i>
  <div ng-show="noResults">
    <i class="glyphicon glyphicon-remove"></i> No Results Found
  </div>

  <button type="button" class="btn btn-info btn-block" ng-click="login()" ng-if="!authData">Login Anonymously</button>
</div>

<div class="col-sm-1 col-md-1 col-lg-1">
  <button type="button" class="btn btn-info btn-block" ng-click="logout()" ng-if="authData">Logout</button>
</div>
```

Remove the old login button. Now the interface looks cleaner.

### Adding More Login Services

Let's add buttons for Google, Facebook, Twitter, and e-mail and password. Start by copying and pasting four ```Login Anonymously``` buttons, and changing the labels:

```HTML
<div class="col-sm-5 col-md-5 col-lg-5">
  <input type="text"
  class="form-control addMovie"
  name="movieTitle"
  ng-model="movie.movieTitle"
  uib-typeahead="address for address in getLocation($viewValue)"
  typeahead-loading="loadingLocations"
  typeahead-no-results="noResults"
  typeahead-min-length="3"
  typeahead-on-select="onSelect($item)"
  placeholder="Add the worst movie you've seen!"
  ng-if="authData"/>
  <span class="glyphicon glyphicon-search form-control-feedback" ng-if="authData"></span>
  <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
  <i ng-show="loading" class="glyphicon glyphicon-refresh"></i>
  <div ng-show="noResults">
    <i class="glyphicon glyphicon-remove"></i> No Results Found
  </div>

  <span ng-if="!authData">Login with: </span>
  <button type="button" class="btn btn-info" ng-click="login()" ng-if="!authData">Google</button>
  <button type="button" class="btn btn-info" ng-click="login()" ng-if="!authData">Facebook</button>
  <button type="button" class="btn btn-info" ng-click="login()" ng-if="!authData">Twitter</button>
  <button type="button" class="btn btn-info" ng-click="login()" ng-if="!authData">GitHub</button>
  <button type="button" class="btn btn-info" ng-click="login()" ng-if="!authData">Anonymously</button>

</div>
```

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/login_four_buttons.png)

Now we'll set up these third-party providers.

## Get Client ID and Client Secret From Google

Go to your [Google Developers Console](https://console.developers.google.com/apis/library) and click on ```Credentials``` in the left column. Put in your project name, click ```Create```, then ```Create credentials```, then ```OAuth client ID```. Fill out the forms and get your ```Client ID``` and ```Client secret```.

In the field ```Authorized JavaScript origins``` put in ```https://auth.firebase.com```. This is not your app's URL or home page.

In the field ```Authorized redirect URIs``` put in ```https://auth.firebase.com/v2/``` followed by your project name followed by ```/auth/google/callback```. For example, my project name is ```crudiest-firebase``` so the ```Authorized redirect URIs``` is  ```https://auth.firebase.com/v2/crudiest-firebase/auth/google/callback```.

If you don't enter your authorized redirect URI, when you attempt to login you'll get an error message such as ```Given URL is not allowed by the Application configuration: One or more of the given URLs is not allowed by the App's settings.``` This is confusing because your Firebase Dashboard Login & Auth tabs has a field to enter ```Authorized Domains for OAuth Redirects```. This is not the same as ```Authorized redirect URIs```. Firebase automatically creates the ```Authorized Domains for OAuth Redirects``` in its dashboard, you shouldn't need to enter any domains here. In contrast, the ```Authorized redirect URIs``` at the provider (Google, Facebook, etc.) must have a domain entered.

### Save Your Client IDs and Client secrets

Make a new file and call it ```OAuth_keys.txt```. Put it in your project folder at the root level, not in the ```public``` folder. Add the file to your ```.gitignore``` file. You don't want to upload this information to a public GitHub repository.

In this file make a form:

```
GOOGLE

Client ID:

Client secret:

Authorized JavaScript origins:
https://auth.firebase.com

Authorized redirect URIs:
https://auth.firebase.com/v2/MY-APP/auth/google/callback
```

Later we'll add the information for Facebook, GitHub, etc.

### Firebase Login & Auth

Now navigate to your Firebase dashboard and click ```Login & Auth``` in the left column. Select the ```Google``` tab, click to enable Google authentication, and enter your Google Client ID and Google Client Secret.

### $scope.loginGoogle

In ```HomeController.js``` add a ```$scope.loginGoogle``` function:

```js
$scope.loginGoogle = function() {
  $scope.authData = null;
  $scope.error = null;
  $scope.authObj.$authWithOAuthPopup("google").then(function(authData) {
    $scope.authData = authData;
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed:", error);
  });
};
```

Now in ```home.html``` set the ```ng-click```:

```HTML
<button type="button" class="btn btn-info" ng-click="loginGoogle()" ng-if="!authData.uid">Google</button>
```

Deploy your code, refresh your browser, and the ```Google``` button should open a pop-up window. OK the authorization and you should see the ```Add a Movie``` field, and the console log should say ```Logged in as: ``` followed by the user ID.

### Facebook

Go to [facebook for developers](https://developers.facebook.com/apps) and click ```+ Add a New App```.

Get your ```Facebook App ID``` and ```Facebook App Secret```. Save them in your file ```OAuth-keys.txt```.

In your ```developers.facebook.com```, look in the left column under ```PRODUCT SETTINGS``` for ```Facebook Login```. On this page, look for ```Valid OAuth redirect URIs```.

In this field put in ```https://auth.firebase.com/v2/``` followed by your project name followed by ```/auth/facebook/callback```. For example, my project name is ```crudiest-firebase``` so the ```Authorized redirect URIs``` is  ```https://auth.firebase.com/v2/crudiest-firebase/auth/facebook/callback```.

Save changes and go to the Firebase Dashboard. In ```Login & Auth``` in the ```Facebook``` tab, check the box for ```Enable Facebook Authentication``` and enter your ```Facebook App ID``` and ```Facebook App Secret```.

Set up the button in ```home.html```:

```html
<button type="button" class="btn btn-info" ng-click="loginFacebook()" ng-if="!authData.uid">Facebook</button>
```

In ```HomeController.js``` set up the ```loginFacebook()``` function:

```js
$scope.loginFacebook = function() {
  $scope.authData = null;
  $scope.error = null;
  $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
    $scope.authData = authData;
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed:", error);
  });
};
```

#### Facebook SDK

Alternatively, Facebook has a _Software Development Kit_ (SDK). The kit has two pieces:

* A JavaScript block that you're told to put in the  ```<body>``` of your ```index.html```. You can put this script into a controller. There is a short code block and a long code block, depending on what features you want.
* HTML code blocks for your view. These give you a button, display the user's login status, etc.

The SDK is easy to use and works well if you're not using Angular. However, the Facebook SDK has an ```authResponse``` object when Firebase has an ```authData``` object. Facebook has a field for ```userID``` when Firebase has a field for ```uid```. We need ```authData.uid``` for make the ```Add a Movie``` field and the ```Logout``` button display. Getting the data from the Facebook SDK into our ```$scope``` in the format we need isn't easy.

### Twitter

Go to [Twitter Apps](https://apps.twitter.com/) and click ```Create New App```.

Enter your app's name, description, website, and the ```Callback URL```. In this field put in ```https://auth.firebase.com/v2/``` followed by your project name followed by ```/auth/twitter/callback```. For example, my project name is ```crudiest-firebase``` so the ```Authorized redirect URIs``` is  ```https://auth.firebase.com/v2/crudiest-firebase/auth/twitter/callback```.

In the ```Keys and Access Tokens``` tab copy your  ```Consumer Key (API Key)``` and ```Consumer Secret (API Secret)``` to your file ```OAuth-keys.txt```.

Go to your Firebase Dashboard. In ```Login & Auth``` in the ```Twitter``` tab, check the box for ```Enable Twitter Authentication``` and enter your ```Twitter API Key``` and ```Twitter App Secret```.

Set up the button in ```home.html```:

```html
<button type="button" class="btn btn-info" ng-click="loginTwitter()" ng-if="!authData.uid">Twitter</button>
```

In ```HomeController.js``` set up the ```loginTwitter()``` function:

```js
$scope.loginTwitter = function() {
  $scope.authData = null;
  $scope.error = null;
  $scope.authObj.$authWithOAuthPopup("twitter").then(function(authData) {
    $scope.authData = authData;
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed:", error);
  });
};
```

### GitHub

Go to [Developer applications](https://github.com/settings/developers) and click ```Register new application```.

Enter your application's name, Homepage URL, description, and the ```Authorization callback URL```. In this field put in ```https://auth.firebase.com/v2/``` followed by your project name followed by ```/auth/github/callback```. For example, my project name is ```crudiest-firebase``` so the ```Authorized redirect URIs``` is  ```https://auth.firebase.com/v2/crudiest-firebase/auth/github/callback```.

In the ```Keys and Access Tokens``` tab copy your  ```Client ID``` and ```Client Secret``` to your file ```OAuth-keys.txt```.

Go to your Firebase Dashboard. In ```Login & Auth``` in the ```GitHub``` tab, check the box for ```Enable GitHub Authentication``` and enter your ```GitHub Client ID``` and ```GitHub Client Secret```.

Set up the button in ```home.html```:

```html
<button type="button" class="btn btn-info" ng-click="loginGitHub()" ng-if="!authData.uid">GitHub</button>
```

In ```HomeController.js``` set up the ```loginGitHub()``` function:

```js
$scope.loginGitHub = function() {
  $scope.authData = null;
  $scope.error = null;
  $scope.authObj.$authWithOAuthPopup("github").then(function(authData) {
    $scope.authData = authData;
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed:", error);
  });
};
```

### Complete OAuth2 Code

Here's the ```home.html``` code with all the OAuth2 buttons:

```html
<div class="row">

  <div class="addNewMovie row">
    <form class="form-horizontal" ng-submit="addMovie()" name="newMovie">

      <div class="col-sm-2 col-md-2 col-lg-2">
        <button type="button" class="btn btn-danger btn-block" ng-click="techSummary = !techSummary">Tech Notes</button>
      </div>

      <div class="col-sm-6 col-md-6 col-lg-6">
        <input type="text"
        class="form-control addMovie"
        name="movieTitle"
        ng-model="movie.movieTitle"
        uib-typeahead="address for address in getLocation($viewValue)"
        typeahead-loading="loadingLocations"
        typeahead-no-results="noResults"
        typeahead-min-length="3"
        typeahead-on-select="onSelect($item)"
        placeholder="Add the worst movie you've seen!"
        ng-if="authData"/>
        <span class="glyphicon glyphicon-search form-control-feedback" ng-if="authData"></span>
        <i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>
        <i ng-show="loading" class="glyphicon glyphicon-refresh"></i>
        <div ng-show="noResults">
          <i class="glyphicon glyphicon-remove"></i> No Results Found
        </div>

        <span ng-if="!authData">Login with: </span>
        <button type="button" class="btn btn-info" ng-click="loginGoogle()" ng-if="!authData.uid">Google</button>

    <button type="button" class="btn btn-info" ng-click="loginFacebook()" ng-if="!authData.uid">Facebook</button>
    <button type="button" class="btn btn-info" ng-click="loginTwitter()" ng-if="!authData.uid">Twitter</button>
    <button type="button" class="btn btn-info" ng-click="loginGitHub()" ng-if="!authData.uid">GitHub</button>
    <button type="button" class="btn btn-info" ng-click="loginEmail()" ng-if="!authData.uid">E-mail &amp; password</button>

  </div>

  <div class="col-sm-2 col-md-2 col-lg-2">
    <button type="button" class="btn btn-info btn-block" ng-click="loginAnon()" ng-if="!authData.uid">Anonymously</button>
    <button type="button" class="btn btn-info btn-block" ng-click="logout()" ng-if="authData.uid">Logout</button>
  </div>

  <div class="col-sm-2 col-md-2 col-lg-2">
    <a target="_self" href="../../resume/T-D-Kehoe.pdf" download="T-D-Kehoe.pdf" class="resume">
      <button type="button" class="btn btn-danger btn-block">Résumé</button>
    </a>
  </div>

</form>
</div>

<!-- Tech Notes row -->
<div class="row well well-lg" ng-show="techSummary">
  <p class="lead text-justify">MEAN stack CRUD app optimized for speed with Angular, Bootstrap, and async typeahead.</p>
  <p class="text-justify">This is two apps, with separate back and front ends. The back end uses Node, Express, and MongoDB and is deployed on Heroku. The data is served to an API as JSON objects. MongoDB is accessed via the lightweight, schemaless Monk Node module.</p>
  <p class="text-justify">The front end uses Angular and Bootstrap and is deployed on Firebase. There are three views: INDEX/NEW (Home), SHOW, and EDIT. The asynchronous typeahead reduces the typing required to add a new movie to a few keystrokes so a separate NEW view isn't needed.</p>
  <p class="text-justify">The asynchronous typeahead is implemented with UI Boostrap. Each keystroke makes an HTTP request to the Open Movie Database, which returns ten movie titles. onSelect (clicking a movie title) fires an HTTP GET request for a single movie to the OMDB which returns the movie data. This movie is then pushed locally to the $scope.movies array. This updates the INDEX view almost instantly. Then, running in the background, an HTTP POST adds the movie to the CRUDiest Movies Database. Lastly, an HTTP GET request to the CRUDiest Movies Database gets all the movies and syncs to $scope. This is the slowest step but happens without the user's awareness.</p>
  <p class="text-justify">The "Order By" buttons have ng-click set up with two values, <i>order</i> and <i>reverse</i>. These values are passed to the $scope and then to ng-repeat.</p>
  <p class="text-justify">The app is responsive. The number of movies displayed per row changes from five in the large view, to four in the medium view, three in the small view, and two on mobile devices.</p>
  <p class="text-justify">On the SHOW page, comments are an array of objects nested in the movie object. This is easy with the NoSQL database but would be more work with an SQL database. The "number of comments display" hides and shows the comments when clicked. A tooltip informs users of this feature. The number of comments pluralizes. The likes/dislikes buttons use glyphicons.</p>
  <p class="text-justify">The <a ng-href="https://github.com/tdkehoe/CRUDiest-Movies-Database-Node-back-end">back end code</a> and <a ng-href="https://github.com/tdkehoe/CRUDiest-Movies-Database-Angular-Front-End">front end code</a> are on GitHub. Tutorials to make the <a ng-href="https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/Node_and_Express.md">back end</a>, the <a ng-href="https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/Angular_CRUD.md">front end</a>, and the <a ng-href="https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/Typeahead.md">asynchronous typeahead</a> are also on GitHub.</p>
</div>

<!-- orderBy labels row -->
<div class="row visible-sm-block visible-md-block visible-lg-block">
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

<!-- orderBy buttons row, mobile screens -->
<div class="row visible-xs-block">
  <div class="col-sm-2">
    <button type="button" class="btn btn-primary btn-block" ng-click="order = '$id'; reverse = true">Order By Recently Added</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-primary btn-block" ng-click="order = '$id'; reverse = false">Order By Least Recently Added</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-warning btn-block" ng-click="order = 'movieImdbRating'; reverse = false">Order By Worst First</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-warning btn-block" ng-click="order = 'movieImdbRating'; reverse = true">Order By Best First</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-success btn-block" ng-click="order = 'movieYear'; reverse = true">Order By Newest</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-success btn-block" ng-click="order = 'movieYear'; reverse = false">Order By Oldest</button>
  </div>
</div>

<!-- orderBy buttons row, large screens -->
<div class="row visible-sm-block visible-md-block visible-lg-block">
  <div class="col-sm-2">
    <button type="button" class="btn btn-primary btn-block" ng-click="order = '$id'; reverse = true">Recent</button>
  </div>
  <div class="col-sm-2">
    <button type="button" class="btn btn-primary btn-block" ng-click="order = '$id'; reverse = false">Oldest</button>
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

<!-- Responsive views -->
<div class="row visible-xs-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie.$id}}"><img class="extraSmallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-sm-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie.$id}}"><img class="smallMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-md-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie.$id}}"><img class="mediumMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

<div class="row visible-lg-block">
  <div ng-repeat="movie in movies | orderBy : order : reverse" class="movieIndex">
    <a ng-href="/#/movies/{{movie.$id}}"><img class="largeMoviePoster" ng-src="{{movie.moviePoster}}" alt="{{movie.movieTitle}}"></a>
  </div>
</div>

</div>

```

Here's ```HomeController.js``` with all the OAuth2 functions:

```js
app.controller('HomeController', ['$scope', '$http', '$route', '$location', '$firebaseArray', '$firebaseAuth', function($scope, $http, $route, $location, $firebaseArray, $firebaseAuth) {
  console.log("Home controller.");
  $scope.loading = true;

  var ref = new Firebase("https://crudiest-firebase.firebaseio.com/");
  $scope.authObj = $firebaseAuth(ref);
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

  $scope.loginAnon = function() {
    $scope.authData = null;
    $scope.error = null;
    $scope.authObj.$authAnonymously().then(function(authData) {
      $scope.authData = authData;
      console.log($scope.authData);
    }).catch(function(error) {
      $scope.error = error;
      console.log($scope.error);
    });
  };

  $scope.loginGoogle = function() {
    $scope.authData = null;
    $scope.error = null;
    $scope.authObj.$authWithOAuthPopup("google").then(function(authData) {
      $scope.authData = authData;
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  };

  $scope.loginFacebook = function() {
    $scope.authData = null;
    $scope.error = null;
    $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData) {
      $scope.authData = authData;
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  };

  $scope.loginTwitter = function() {
    $scope.authData = null;
    $scope.error = null;
    $scope.authObj.$authWithOAuthPopup("twitter").then(function(authData) {
      $scope.authData = authData;
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  };

  $scope.loginGitHub = function() {
    $scope.authData = null;
    $scope.error = null;
    $scope.authObj.$authWithOAuthPopup("github").then(function(authData) {
      $scope.authData = authData;
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  };

  // Logout

  $scope.logout = function() {
    console.log("Logging out!");
    $scope.authObj.$unauth();
    $scope.authObj.$onAuth(function(authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
      } else {
        $scope.authData = null;
        console.log("Logged out");
        console.log($scope.authData);
      }
    });
  };

}]);
```

### E-mail and Password

You might think that e-mail and password auth would be easier than OAuth2 but it's actually more complex. You need to have views and functions for users to:

* Create an account.
* Login.
* Change e-mail addresses.
* Change passwords.
* Send a password reset e-mail.
* An admin function to delete accounts.

Firebase provides all these functions.

Bootstrap, however, doesn't have official templates all these forms. There are many login Bootstrap templates available from third-party developers but these all use JavaScript, or, specifically, jQuery. There are no UI Bootstrap login templates.

The simplest solution is to make six (!) [CSS Bootstrap forms](http://getbootstrap.com/css/#forms), showing and hiding each form with ```ng-show```.

A better UX/UI design would be to use a _modal_ window:

> A *modal window* is a subordinate window on top of the browser's main window which blocks the user from using the main window until action is taken in the modal window.

UI Bootstrap has modal windows but they're not simple. We'll start with simple show/hide forms for beginner coders, and then we'll make a modal window for intermediate/advanced developers.

#### Create New User

The first thing a new e-mail & password user does is create an account. In ```home.html``` add a button for e-mail & password users:

```html
<button type="button" class="btn btn-info" ng-click="loginEmail()" ng-if="!authData.uid">E-mail &amp; password</button>
```

Then add a basic Bootstrap form for entering an e-mail address and password:

```html
<!-- E-mail & password login screens -->

<div class="row newUser" ng-if="loginEmail.login">
  <form>
    <div class="form-group">
      <label for="enterEmail">E-mail address</label>
      <input type="email" ng-model="user.email" class="form-control" id="enterEmail" placeholder="E-mail address">
    </div>
    <div class="form-group">
      <label for="enterPassword">Password</label>
      <input type="password" ng-model="user.password" class="form-control" id="enterPassword" placeholder="Password">
    </div>
    <input type="submit" ng-click="newUser(user)" class="btn btn-default" value="Create New User" />
    <input type="button" ng-click="reset()" class="btn btn-default" value="Reset" />
  </form>
</div>
```

The form is set to show when ```$scope.loginEmail.login``` is true.

The form has two data entry forms. The first is for the e-mail address. Setting ```type="email"``` verifies that the user entered a correctly formatted e-mail address. Similarly in the second field setting ```type="password"``` hides the password.

The form has two buttons. ```Create New User``` runs the function ```$scope.newUser()```. Note that we're not passing through the email and password, e.g., ```ng-click="newUser(email, password)"``` in the view and ```$scope.newUser = function(email, password) {``` in the controller. We could, it works either way, but the Angular way is to pass data through on the ```$scope```. We'll see an advantage of this in a minute.

The button ```Reset``` runs the function ```$scope.reset()```.

You can add a little space above the top of the form in ```style.css```:

```css
.newUser {
  margin-top: 12px;
}
```

Now we'll add these functions for ```HomeController.js```. First we'll make a function for making the form show when the user clicks the button ```E-mail & passsword```:

```js
$scope.loginEmail = function() {
  $scope.loginEmail.login = true;
};
```

Next we'll make a function for ```Create New User```:

```js
$scope.user = {};
$scope.newUser = function(user) {
  ref.createUser({
    email: $scope.user.email,
    password: $scope.user.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $scope.loginEmail.login = false;
    }
  });
};
```

This runs the Firebase method ```createUser```. Deploy the new code, refresh your browser, and enter a new user. You should see in the console:

```
Successfully created user account with uid: c06a9f0e-7747-49d4-877c-dc9e2ff79570
```

Now look at the Firebase Dashboard, in the ```Login & Auth``` section, in the ```Email & Password``` tab. Scroll down to the bottom and you should see your new user:

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/login_new_user.png)

And finally we'll add the function for ```Reset```:

```js
$scope.reset = function() {
  $scope.user.email = "E-mail address";
  $scope.user.password = "Password";
};
```

That worked...almost! The password placeholder is ```********```, not ```Password```. Instead we'll use the Angular method ```copy```. This method copies the elements or properties of an array or object to another array or object. In this case we made ```user``` an object with the properties for ```user.email``` and ```user.password```. We'll create an empty object then copy the empty object to ```user``` when the user clicks the reset button.

```js
$scope.master = {};

$scope.reset = function() {
  angular.copy($scope.master, $scope.user);
};
```

We're passing the object ```user``` from the HTML form to the controller function as an argument to ```ng-click()``` and ```$scope.newUser()```. We're also passing the data through on the scope. In ```home.html``` we can change the code to ```ng-click="newUser()"```, then in ```HomeController.js```:

```js
$scope.user = {};
$scope.newUser = function() {
  console.log($scope.user);
  ref.createUser({
    email: $scope.user.email,
    password: $scope.user.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $scope.loginEmail.login = false;
    }
  });
};
```

Or we can use ```$scope.newUser(user)``` and

```js
$scope.newUser = function(user) {
  console.log(user);
  ref.createUser({
    email: user.email,
    password: user.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $scope.loginEmail.login = false;
    }
  });
};
```

Both ways work for adding a new user. However, the ```Reset``` button until works when we create the object ```$scope.user```.

OK, our first login view is working. Save to GitHub.

A couple things aren't working. The ```Reset``` button resets the e-mail address when it's correctly formatted but doesn't reset an incorrectly formatted e-mail address. I don't know why this doesn't work, but it probably has to do with the ```type="email"```. The password field resets without a problem.

Another problem is that the form isn't resetting after our user is created.

Another problem is that the form isn't hiding after our user is created.

Let's try to fix these problems:

```js
$scope.user = {};
$scope.newUser = function(user) {
  ref.createUser({
    email: $scope.user.email,
    password: $scope.user.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $scope.reset();
      $scope.loginEmail.login = false;
    }
  });
};
```

After the user is successfully created we've added ```$scope.reset();``` to reset the form fields. Then we set ```$scope.loginEmail.login = false;``` to hide the form. Neither of these work. Add ```console.log($scope.loginEmail.login)``` and you'll see that the variable has correctly changed in the ```$scope```. The problem is that the view seems to be ignoring the ```$scope```.

Angular's two-way data binding makes the view change when the ```$scope``` changes, and vice versa. But it doesn't always happen. When we change data outside of Angular the ```$digest``` function that runs the two-way data binding doesn't run. We need to run ```$apply()``` to tell Angular to run the ```$digest``` cycle:

```js
$scope.user = {};
$scope.newUser = function(user) {
  ref.createUser({
    email: $scope.user.email,
    password: $scope.user.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $scope.reset();
      $scope.loginEmail.login = false;
      $scope.$apply(function() {
        console.log("Applied!");
      });
    }
  });
};
```

Now it works. Try commenting out ```$scope.reset();```, adding a new user, then click ```E-mail & password``` again to open the forms. You'll see that your previous user is still in the forms.

Can we speed up ```$digest```? ```$scope.$apply``` runs the ```$digest``` cycle on the entire ```$scope```. This slows down our app. Can we only run the ```$digest``` cycle on the ```user``` object? Try changing  this to ```$scope.user.$apply```. No, that doesn't work! The ```$digest``` cycle only runs on the entire ```$scope```.

#### Duplicate User Creation

What happens when we enter the same e-mail address twice, to create duplicate accounts? You'll see in the console: ```Error creating user: Error: The specified email address is already in use.``` OK, but the user should see the error message too. Let's create an alert.

HTML alerts are easy but we'll use a more stylish Bootstrap alert. Dismissible alerts require JavaScript so we have to use UI Bootstrap [alerts](https://angular-ui.github.io/bootstrap/).

Add the alert below the e-mail & password ```form```, but within the ```div```.

```html
<uib-alert class="alert" ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</uib-alert>
```

In ```HomeController.js``` we create an array for alerts. Then we'll make a function to dismiss the alert:

```js
$scope.alerts = [];

$scope.closeAlert = function(index) {
  $scope.alerts.splice(index, 1);
};
```

Finally, we call the alert within the error function:

```js
if (error) {
  console.log("Error creating user:", error);
  $scope.alerts.push({msg: 'Error: The specified email address is already in use.'});
  $scope.$apply(function() {
    console.log("Applied!");
  });
}
```

This is complex so we'll walk through it. We're creating an array of alerts. When there's an error, we push an alert object into the array. The alert object has two properties, the ```message``` and the ```type```. We then run ```$scope.apply()``` to make the two-way binding run and move the alert into the view.

In the view, we've created an element that displays all the alerts in the array. The alert has a dismiss button. The message is taken from the alert object.

The alert object also has a property for ```type```. The types are on the same as the [Bootstrap alerts](http://getbootstrap.com/components/#alerts): ```'success'```, ```'info'```, ```'warning'```, and ```'danger'```. The types must be in quotes.

IMHO, the ```'danger'``` class has ugly styling. I'm going to remove the ```type``` and instead in ```style.css``` give our alert some style:

```css
.alert {
  color: red;
  background-color: white;
  border-color: red;
  margin-top: 12px;
}
```

Let's try it out:

![Atom HTML](/Users/TDK/playground/BreakingStuff/media/login_alert_duplicate.png)

Click ```Create New User``` a few times to make the alert repeat.









Here's the complete e-mail & password form in ```home.html```:

```html
<!-- E-mail & password login screens -->

<div class="row newUser" ng-if="loginEmail.login">
  <form>
    <div class="form-group">
      <label for="enterEmail">E-mail address</label>
      <input type="email" ng-model="user.email" class="form-control" id="enterEmail" placeholder="E-mail address">
    </div>
    <div class="form-group">
      <label for="enterPassword">Password</label>
      <input type="password" ng-model="user.password" class="form-control" id="enterPassword" placeholder="Password">
    </div>
    <input type="submit" ng-click="newUser(user)" class="btn btn-default" value="Create New User" />
    <input type="button" ng-click="reset()" class="btn btn-default" value="Reset" />
  </form>

    <uib-alert class="alert" ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</uib-alert>
</div>
```

Here's the complete e-mail & password ```Create New User``` code in ```HomeController.js```:

```js
// E-mail & password login functions

$scope.loginEmail = function() {
  $scope.loginEmail.login = true;
};

$scope.user = {};
$scope.newUser = function(user) {
  ref.createUser({
    email: $scope.user.email,
    password: $scope.user.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
      $scope.alerts.push({
        msg: 'Error: The specified email address is already in use.'
      });
      console.log($scope.alerts);
      $scope.$apply(function() {
        console.log("Applied!");
      });
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      $scope.reset();
      $scope.loginEmail.login = false;
      $scope.$apply(function() {
        console.log("Applied!");
      });
    }
  });
};

$scope.master = {};
$scope.reset = function() {
  console.log("Resetting!");
  angular.copy($scope.master, $scope.user);
};

// Alerts

$scope.alerts = [];

$scope.closeAlert = function(index) {
  $scope.alerts.splice(index, 1);
};
```

And in ```style.css```:

```css
.newUser {
  margin-top: 12px;
}

.alert {
  color: red;
  background-color: white;
  border-color: red;
  margin-top: 12px;
}
```

### Login User






## UI Bootstrap Modal Window for Login

A UI Bootstrap modal window requires making:

* Two controllers.
* A template.
* HTML buttons in the view to open the modal window.
* Links in ```index.html``` to hook up the controllers.












Go to your Firebase Dashboard. In ```Login & Auth``` in the ```Email & Password``` tab, check the box for ```Enable Email & Password Authentication```.

Set up two buttons in ```home.html```:

```html
<button type="button" class="btn btn-info" ng-click="loginEmail()" ng-if="!authData.uid">E-mail &amp; password</button>
```

In ```HomeController.js``` set up the ```loginPassword()``` function:

```js
$scope.loginGitHub = function() {
  $scope.authData = null;
  $scope.error = null;
  $scope.authObj.$authWithOAuthPopup("github").then(function(authData) {
    $scope.authData = authData;
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed:", error);
  });
};
```
