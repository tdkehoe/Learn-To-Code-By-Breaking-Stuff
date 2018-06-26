#Videogular: Angular Video player

Angular doesn't include a video player. Videogular (http://www.videogular.com/) is an HTML5 (not Flash) video player module for Angular.

##Installation

Check the latest Videogular version on [CDNjs](https://cdnjs.com/libraries/videogular). Add the Angular and Videogular CDNs to your `index.html`:

```html
<!-- AngularJS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.2/angular.min.js"></script>

<!-- Videogular -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.6.2/angular-sanitize.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/videogular/1.4.4/videogular.min.js"></script>
```

Alternatively you can use `npm` to install Videogular:

```
npm install videogular
```

If you use `npm` then link to the module from your `index.html`:

```html
<script src="node_modules/videogular/videogular.js"></script>
```

In `app.js` inject the dependencies:

```js

'use strict';
var app = angular.module("MyApp", ['ngSanitize', 'com.2fdevs.videogular']);
```

The order of CDNs or links should be: AngularJS, AngularJS Sanitize, Videogular, and Videogular Plugins.

##Controller

In your controller make an object:

```js
$scope.videoObject = {
    preload: "auto",
    sources: [
      {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
      {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
      {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
    ],
    theme: {
      url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
    }
  };
```

#View

In your HTML template put in this code:

```html
<div class="videogular-container">
  <videogular vg-theme="videoObject.theme.url">
    <vg-media vg-src="videoObject.sources" vg-native-controls="true"></vg-media>
  </videogular>
</div>
```

Open up your browser and it should work!

#CSS

To make your video player responsive add this CSS to your style sheet:

```css
.videogular-container {
	width: 100%;
	height: 320px;
	margin: auto;
	overflow: hidden;
}

@media (min-width: 1200px) {
	.videogular-container {
		width: 1170px;
		height: 658.125px;
	}
}

@media (min-width: 992px) and (max-width: 1199px) {
	.videogular-container {
		width: 940px;
		height: 528.75px;
	}
}

@media (min-width: 768px) and (max-width: 991px) {
	.videogular-container {
		width: 728px;
		height: 409.5px;
	}
}
```

#Advanced Stuff

Videogular has many advanced features and settings. You can customize the controls, set a poster, etc.
