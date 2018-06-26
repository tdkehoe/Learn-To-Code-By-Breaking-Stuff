Upload files to Firebase Storage with Angular 1 and AngularFire

Firebase Storage stores your images, videos, etc. in the Google Cloud. AngularFire is the library for using Angular with Firebase.

First we make an HTML file upload form:

```HTML
<form action="/action_page.php">
  <input type="file" name="pic" accept="image/*">
  <input type="submit">
</form>
```

You can see the form in action at [W3schools.com](https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_input_accept).

Next, add Angular and Bootstrap:

```HTML
<form ng-submit="uploadFile(file)">
  <input type="file" accept="txt" ng-model="file" class="form-control">
  <button type="submit" class="btn btn-primary">Upload File</button>
</form>
```

That doesn't work because `ng-model` can't handle files. Angular 1 doesn't have built-in functions for uploading files so have to make a custom directive:

```js
app.directive('fileModel',['$parse', function ($parse){
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('change', function () {
        $parse(attrs.fileModel)
        .assign(scope, element[0].files[0])
        scope.$apply();
      })
    }
  }
}]);
```

For how this directive works see the [Egghead.io](https://egghead.io/lessons/angularjs-file-uploads) video or [TutorialsPoint](https://www.tutorialspoint.com/angularjs/angularjs_upload_file.htm).

The directive can either go into your `app.js`:

```js
var app = angular.module("MyApp", []);

app.directive('fileModel',['$parse', function ($parse){
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('change', function () {
        $parse(attrs.fileModel)
        .assign(scope, element[0].files[0])
        scope.$apply();
      })
    }
  }
}]);
```

or (preferred) put the directive into its own file in a `directives` folder: `public/javascript/directives/fileModel.js`. Then you have to link the file in your `index.html`:

```HTML
<script type="text/javascript" src="javascript/directives/fileModel.js"></script>
```

Now we can use our custom directive:

```HTML
<form ng-submit="uploadFile(file)">
  <input type="file" accept="txt" file-model="file" class="form-control">
  <button type="submit" class="btn btn-primary">Upload File</button>
</form>
```

Moving on to the controller, we'll make a handler:

```js
app.controller('myController', ['$scope', function($scope) {

  $scope.uploadFile = function(file) {
    console.log("Let's upload a file!");
    console.log($scope.file);
  };

}]);
```

Make a test file. You could call it `test.txt` and put the word `test` in the file.

Spin up a server, open your browser, and upload your test file. In the console you should see that your file is now on the $scope, at `$scope.file`.

Now add Firebase to your `app.js`:

```js
var app = angular.module("MyApp", ['firebase']);
```

and Firebase and AngularFire to your `index.html`:

```html
<!-- Firebase complete -->
<script src="https://www.gstatic.com/firebasejs/3.6.9/firebase.js"></script>
<!-- AngularFire -->
<script src="https://cdn.firebase.com/libs/angularfire/2.3.0/angularfire.min.js"></script>
```

Make sure you have AngularFire 2.3.0 or later, as Firebase Storage was added in 2.3.0.

Add `$firebaseStorage` to the controller:

```js
app.controller('MyController', ['$scope', '$firebaseStorage', function($scope, $firebaseStorage) {

}]);
```

Now we make a Firebase Storage reference, and then use`$put` to upload the our file from the `$scope`:

```js
app.controller('MyController', ['$scope', '$firebaseStorage', function($scope, $firebaseStorage) {

  // Create a Firebase Storage reference
  var storage = firebase.storage();

  $scope.uploadFile = function(file) {
    console.log("Let's upload a file!");
    console.log($scope.file);
    $firebaseStorage(storage).$put($scope.file);
  };

}]);
```

That didn't work. The error message is;

```js
Error: $firebaseStorage expects a Storage reference
```

We'll make a Firebase Storage reference:

```js
app.controller('MyController', ['$scope', '$firebaseStorage', function($scope, $firebaseStorage) {

  // Create a Firebase Storage reference
  var storage = firebase.storage();
  var storageRef = storage.ref();

  $scope.uploadFile = function(file) {
    console.log("Let's upload a file!");
    console.log($scope.file);
    $firebaseStorage(storageRef).$put($scope.file);
  };

}]);
```

That also didn't work. The error message is `Firebase Storage: The operation 'put' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').`

Let's add a `.child`:

```js
app.controller('MyController', ['$scope', '$firebaseStorage', function($scope, $firebaseStorage) {

  // Create a Firebase Storage reference
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var filesRef = storageRef.child('files');

  $scope.uploadFile = function(file) {
    console.log("Let's upload a file!");
    console.log($scope.file);
    $firebaseStorage(filesRef).$put($scope.file);
  };

}]);
```

Success! Go to your [Firebase Console](https://console.firebase.google.com), refresh your Storage, and you should see your file. Mine is taking up five bytes!

But there's a few things we could improve. First, how about we get a success message in our browser console, instead of looking at the Firebase Console? And we'd like to see the download URL of our new file. All this is explained in the [Upload Task](https://github.com/firebase/angularfire/blob/master/docs/reference.md#upload-task) section of the documentation. We'll use `$complete` and `$error`:

```js
var uploadTask = $scope.storage.$put(file);
uploadTask.$complete(function(snapshot) {
  console.log(snapshot.downloadURL);
});
uploadTask.$error(function(error) {
  console.error(error);
})
```

Note that it's `downloadURL`, not `downloadUrl`.

Let's push the `downloadURL` into an array:

```js
var uploadTask = $scope.storage.$put(file);
uploadTask.$complete(function(snapshot) {
  console.log(snapshot.downloadURL);
  $scope.videoArray.push(snapshot.downloadURL);
  console.log($scope.videoArray);
});
uploadTask.$error(function(error) {
  console.error(error);
})
```

##Metadata

We can add metadata to the file. We can't add any metadata, just properties that are already in the `Upload Task`, including:

```js
bucket
cacheControl
contentDisposition
contentEncoding
contentLanguage
contentType
customMetadata
```

`contentLanguage` must be [HTML ISO Language Code](https://www.w3schools.com/tags/ref_language_codes.asp) such `en` or `es`.

`contentType` must be [ASP ContentType Properties](https://www.w3schools.com/asp/prop_contenttype.asp) such as `text/html` or `video/mp4`.

`customMetadata` must be an object with strings for both the keys and values. The inability to use `$scope` variables makes this field less useful than the Firebase Database.

Let's specify two of these properties.

```js
var metadata = {
  contentLanguage: 'en',
  contentType: "text/html",
  customMetadata: {
    'word': 'cat',
    'phonemes': 'k short_a t'
  },
};
```

##Upload Video

Let's upload a video. In the `NewController` change line 7 to:

```js
var storageRef = firebase.storage().ref("videos/videogular.mp4");
```

or whatever the name of the video is.

##Download File

Now we'll download the file. To get the reference we can use `snapshot.downloadURL` or

```js
$scope.storage.$getDownloadURL().then(function(url) {
  $scope.url = url;
});
```

Just put the URL in a browser and the file appears. No AngularFire command is needed.

##Video Player

Now we'll upload a video and then play it in a video player.

Angular doesn't play videos without a plugin. Google "Angular video player" and the first result is [Videogular](http://www.videogular.com/). The [How To Start](http://www.videogular.com/tutorials/how-to-start/) tutorial will getb you started. The tutorial says to run `npm install videogular` to install the node modules but you can also use a CDN. The CDN or link to your `node_modules` library goes in your `index.html`. `npm install videogular` installs three modules: `angular.js`, `angular-sanitize.js` (which takes raw HTML that Angular would otherwise reject in an `ng-repeat`, checks the HTML against a whitelist, and sends them back escaped), and `videogular.js`. So you'll need three CDNs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.2/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.6.2/angular-sanitize.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/videogular/1.4.4/videogular.min.js"></script>
```

You should already have the Angular CDN or Node module installed.

Next, you can install a theme and some plugins. These seem to a good idea:

```
npm install videogular-themes-default
npm install videogular-controls
npm install videogular-buffering
npm install videogular-overlay-play
npm install videogular-poster
```

These seem to be less important:

```
npm install videogular-ima-ads
npm install videogular-angulartics
npm install videogular-dash
```

Then you link up the Node modules from your `index.html`.
I've never figured out how to link to Node modules so I just put the folder in my `public` folder and add `node_modules` to my `.gitignore`:

```html
<script src="node_modules/videogular-controls/vg-controls.js"></script>
<script src="node_modules/videogular-overlay-play/vg-overlay-play.js"></script>
<script src="node_modules/videogular-poster/vg-poster.js"></script>
<script src="node_modules/videogular-buffering/vg-buffering.js"></script>
```

In `app.js` add `'ngSanitize', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay', 'com.2fdevs.videogular.plugins.poster'`:

```js
'use strict';
var app = angular.module("LanguageTwoApp", [
  'ngRoute',
  'ui.bootstrap',
  'firebase',
  'ngSanitize',
  'com.2fdevs.videogular',
  'com.2fdevs.videogular.plugins.controls',
  'com.2fdevs.videogular.plugins.overlayplay',
  'com.2fdevs.videogular.plugins.poster'
]);
```

In the controller add `$sce`:

```js
app.controller('ShowController', ['$scope', '$location', '$firebaseObject', '$firebaseArray', '$firebaseAuth', '$sce', function($scope, $location, $firebaseObject, $firebaseArray, $firebaseAuth, $sce) {

}]);
```

Then in the body of the controller put this chunk of code:

```js
this.config = {
  preload: "none",
  sources: [
    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
  ],
  tracks: [
    {
      src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
      kind: "subtitles",
      srclang: "en",
      label: "English",
      default: ""
    }
  ],
  theme: {
    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
  },
  plugins: {
    poster: "http://www.videogular.com/assets/images/videogular.png"
  }
};
```
The values for `preload` are `auto`, `none`, and `preload`.

The `sources` are three versions of video, in different video file formats. I can't get `mp4` video to play but the `webm` and `ogg` videos play. I also couldn't get `mov` or `dv` formats to play.

The `tracks` is the closed captioning, which was blocked by CORS when I tried it.

In the `theme` property you must make a link to the theme you downloaded.

The `poster` is a still that displays before the video starts. This didn't work for me.

Next you work on the HTML page. There's one "gotcha":

```HTML
<div ng-controller="HomeCtrl as controller" class="videogular-container">

</div>
```

You must put the `class="videogular-container"` in the same `<div>` as the `ng-controller`. Yes, I know that we set the controller from the router, but unless you can figure how to put a class in the router too then you have to put a redundant `ng-controller` in the HTML page. I.e., this doesn't work:

```HTML
<div class="videogular-container">

</div>
```

Then you just put this code into `<div>` and you should see a video from the ISS:

```html
<div ng-controller="HomeCtrl as controller" class="videogular-container">
  <videogular vg-theme="controller.config.theme.url">
    <vg-media vg-src="controller.config.sources" vg-tracks="controller.config.tracks" vg-native-controls="true"></vg-media>
  </videogular>
</div>
```

We're using `vg-native-controls`. We could leave that out (or set it to `false`) and instead use these controls:

```html
<div ng-controller="HomeCtrl as controller" class="videogular-container">
  <videogular vg-theme="controller.config.theme.url">
    <vg-media vg-src="controller.config.sources" vg-tracks="controller.config.tracks" vg-native-controls="false"></vg-media>

    <vg-controls>
      <vg-play-pause-button></vg-play-pause-button>
      <vg-time-display>{{ currentTime | date:'mm:ss' }}</vg-time-display>
      <vg-scrub-bar>
        <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
      </vg-scrub-bar>
      <vg-time-display>{{ timeLeft | date:'mm:ss' }}</vg-time-display>
      <vg-volume>
        <vg-mute-button></vg-mute-button>
        <vg-volume-bar></vg-volume-bar>
      </vg-volume>
      <vg-fullscreen-button></vg-fullscreen-button>
    </vg-controls>

    <vg-overlay-play></vg-overlay-play>
    <vg-poster vg-url='controller.config.plugins.poster'></vg-poster>

  </videogular>
</div>
```

You can choose between two sets of controls. If you set `vg-native-controls="true"` then you get a full set of controls without doing any more work. You can't use the `overlay-play` button or the `poster`.

If you set `vg-native-controls="false"` then you can add the `<vg-controls>` and choose which controls you want, the order they're displayed, etc. You'll also want to use `overlay-play` and `<vg-poster`. When the video isn't playing, you get a big "play" button in the middle of a still image (the poster).

##Video Formats

You saw in the controller that Videogular's sample video has three sources, in three media formats: `mp4`, `webm`, and `ogg`. [No video format is supported by every browser](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) so you'll need to pick two to get (close to) 100% coverage of every user. The best two choices are:

* `webm` runs natively in desktop and mobile Chrome, Firefox, and Opera, and with a plug it can run in Internet Explorer and on Safari on a Macintosh. It can't run in Safari on an iOS device. Microsoft is working on making `webm` run in Edge. `webm` is a Google product and Apple appears unlikely to ever support it. `webm` comes in two flavors `VP8` (before 2012) and `VP9` (since 2012). `VP9` is about a third more compressed so you'll get faster download times, i.e., don't use `VP8`.

* `H.264` video in the `mp4` media format. This runs natively in Safari, both on the Macintosh and iOS, and Internet Explorer, plus Chrome, so the combination of `webm` and `mp4` covers everything. `mp4` doesn't run in Chromium or Opera. Firefox may or may not run `mp4` videos, depending on various factors. Don't use `H.265` as no browsers support it and because of the licensing fees none are likely to support it (except maybe Edge).
onsidered to be the highest quality video in the smallest download size.

* I would skip `ogg` files as this format's compatibility profile is similar to `webm`. It runs in desktop and mobile Chrome, Firefox, and Opera. It can run in Safari on a Macintosh with a plugin but not in Safari on an iOS device. It doesn't run in Internet Explorer.

###Converting Video

There are dozens apps for converting video formats. I've found a eight for OS X that claim to convert to `VP9` and `webm`. It appears that all converters use the same libraries, for example `libvpx` for `webm`. For my tests I used a 3-second 640x480 12.7MB video in `.dv` format.

* Any Video Converter   www.any-video-converter.com
* Avidemux	www.avidemux.org
* Audials Tunebite 10 Platinum	audials.com  webm?
* Dr. DivX  labs.divx.com/DrDivX webm?
* Handbrake  handbrake.fr  no webm
* MEncoder  mplayerhq.hu  ??
* Prism Video Converter  www.nchsoftware.com/prism  no webm



* [Techisky Doremisoft Video Converter](http://www.techisky.com/software/vp9-converter.html)
* [Idealshare](https://www.idealshare.net/vp9-encoder-decoder-for-mac-windows.html)
* [Faasoft](http://www.faasoft.com/articles/vp9-converter.html)
These apps appear to be identical, along with Bigasoft. They even have identical product pages, all claiming to do `VP9` and `webm`. The app(s) don't do `VP9` or `webm`. Now I'm worried that I was scammed into installing malware on my computer.

* [Movavi Video Converter 7](https://www.movavi.com/videoconvertermac/). No `VP9` support. The `VP8` file is 922KB, looks good, and plays in every expected browser.

* [Bigasoft](http://www.bigasoft.com/total-video-converter-mac.html). The "Auto" video size mistakenly converted my 640x480 video to 720x480. Does this converter make me look fat? I was able to change the settings to 640x480. The free samples are only the first half of your videos, so files sizes are half what the full video would be. The "Normal" video was 61KB. The "High Quality" video was 90KB (or 180KB for the full video). Video quality was OK. Both the `webm` and `mp4` videos played in all of the expected browsers. Processing time was a few seconds.

* [WinXDVD](https://www.winxdvd.com/resource/vp9-encoder.htm)
The codec was `VP8`. The file was 749KB, looked OK, and was letter-boxed to 720x480. I couldn't find a setting for 640x480 output.

* [ffmpeg](https://ffmpeg.org/) I had high hopes for this free, open source app. It runs from the command line. The documentation is poor and installation took hours. The `VP9` `webm` converter was extremely slow (1.4 fps). The `webm` file played in no browsers. The `mp4` file played in Chrome but no other browsers.

* [Anymp4 Mac Video Converter Ultimate](https://www.anymp4.com/mac-video-converter-ultimate/). This letter-boxed my video even though I set the format to 640x480. File size was 2.3MB for one second (less than half the video).

Bigasoft appears to be the winner, with Movavi and WinXDVD as runner-ups.

In production you'd want users to be able to upload videos in any format, and then have a converter automatically save the video in both `webm` and `mp4` formats. This would be another challenge!












Have I sold you on Google's `webm` video file format? The bad news is that Apple doesn't support it, as in Final Cut Pro and QuickTime won't convert files to `webm` format. To convert your videos to `webm` you can use the [ffmpeg](https://ffmpeg.org) app.

###Install `ffmpeg`

On a Macintosh you install `ffmpeg` using `homebrew`. But `brew install ffmpeg` does only a minimum install which won't convert anything to anything, as far as I can see. You must specify the format libraries you want to use when you install `ffmpeg`. As far as I can figure out there's no way to add format libraries after `ffmpeg` has been installed. (I see a flag `--enable`, e.g., `--enable-libvpx` but I don't understand how to use it.)

To install `ffmpeg` with `webm` and `mp4` formats use this command line instruction:

```
brew install ffmpeg --with-libvpx --with-x264
```

Or, better, check the current options:

```
brew options ffmpeg
```

I threw in a few more libraries:

```
brew install ffmpeg --with-libvpx --with-x264 --with-openh264 --with-tools
```

If you screw up something run `brew uninstall ffmpeg` and then start over. Each install takes about five minutes.

####Convert Your Files

To convert a file to `webm`:

```
ffmpeg -i zmirfast.dv -strict -2 zmirfast.webm
```

I couldn't get the `webm` video to play.

To convert a file to `mp4`:

```
ffmpeg -i zmirfast.dv zmirfast.mp4
```

This video played in Chrome and Chrome Canary. It didn't play in Chromium, Firefox, or Safari.


ffmpeg -i videogular.mp4 -strict -2 ffvideogular.webm






ffmpeg video file conversions quality/compatibility problems

I'm trying to convert `.dv` and `.mov` videos to VP9 `.webm` and H.264 `.mp4` file formats. I'm using OS X 10.12.3. I downloaded and installed `ffmpeg` with the `libvpx` and `x264` libraries:

```
brew install ffmpeg --with-libvpx --with-x264
```

Then I converted the files:

```
ffmpeg -i myvideo.dv myvideo.webm
```

That didn't work, it told me to use `strict -2`:

```
ffmpeg -i myvideo.dv -strict -2 myvideo.webm
```

The conversion was slow (1.4 fps, unacceptable) and the `webm` file wouldn't play in Chrome, Chrome Canary, Chromium, or Safari. In Firefox the audio played but not the video. All my browsers are up-to-date. `ffmpeg` used the VP9 format. The file size was 12.7MB for `.dv` and 172KB for `.webm` (almost 100x compression). The only warning message was `Using AVStream.codec to pass codec parameters to muxers is deprecated, use AVStream.codecpar instead.` I'll attach a screenshot that doesn't show any file properties (mime type, etc.).

Next, I tried `mp4`:

```
ffmpeg -i myvideo.dv myvideo.mp4
```

That converted fast. The file size went from 12.7MB for `.dv` to 296KB (about 50x compression). I got the same warning message about `AVStream.codec`.

The `.mp4` video plays in Chrome and Chrome Canary.

In Firefox the audio plays but the video is messed up (see screenshot). The video doesn't play in Safari or Chromium.

I'll attach a screenshot of the file properties.

I know that Safari doesn't support  `.webm` and Chromium doesn't support `.mp4`.

Why don't these files work? Do I have to do something different in `ffmpeg`?

Also, what's the difference between `--with` and `--enable`?

I'd be happy to pay for an app to convert videos but looking on the App Store I don't see any that convert to VP9, and few of the apps have ratings or reviews.

And is see that a similar question (http://stackoverflow.com/questions/32030113/ffmpeg-file-conversion-unreadable) was closed: "Questions about general computing hardware and software are off-topic for Stack Overflow unless they directly involve tools used primarily for programming. You may be able to get help on Super User." IMHO `ffmeg` is a tool for programmers. It runs from the command line with more flags than a Trump rally. For example, a command such as

```
ffmpeg -i INPUT -map 0 -c copy -c:v:1 libx264 -c:a:137 libvorbis OUTPUT
```

isn't for "general" computer software users.


Movavi webm (VP8): Chromium, Chrome Canary, Chrome, Firefox (not Safari)
Movavi mp4: Chrome Canary, Chrome, Safari, Firefox (not Chromium)









Lastly I set the Firebase Storage rules to "public":

```
service firebase.storage {
  match /b/myFirebaseProject.appspot.com/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Running all this, I can select my test file, click `Upload File`, and the file loads into the `$scope`. My directive is working. But then I get an error message:

```
POST https://firebasestorage.googleapis.com/v0/b/languagetwo-cd94d.appspot.com/o?name=files 403 ()
```

My guess is that I need to do something with `.child`. Any suggestions?

Also, is `storageRef` the folder or directory in Firebase Storage where I want the uploaded file to go?

Thanks!
