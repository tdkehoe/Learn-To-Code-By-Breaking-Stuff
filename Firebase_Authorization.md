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

### Twitter

### GitHub

https://github.com/settings/applications/new

### E-mail and Password
