#Node and Express

Node is a JavaScript _server_. Express is a _framework_ that extends Node and makes it easier to use. Along with a database, usually MongoDB, Node and Express form the _back end_ of a website. MongoDB, Express, and Node are three-quarters of the _MEAN stack_ for building complete web apps. (The fourth part is Angular to build the _front end_ or _client_ of the web app.)

## How the World Wide Web Works (and why you should use WordPress)

The World Wide Web (WWW) uses a _client-server_ architecture. The _client_ is your browser, e.g., Chrome. You type or click a URL, e.g., http://www.breakingstuff.net. Your browser sends an _HTTP request_ to the _server_. The server then sends the webpage you requested to your browser. This is called an _HTTP response_. _Dynamic_ websites use a database on the server side. A program queries the database to collect the parts of the webpage, assembles and _renders_ the webpage, then sends it to you.

Since 1996 the most popular server has been the Apache server. It's usually run on Linux with the MySQL database and the PHP language. Together this is called the _LAMP stack_. WordPress is the most popular content management system (CMS) on the LAMP stack. It powers more than 60 million websites, including 23% of the top ten million websites. IMHO every web developer should be familiar with WordPress. I have two WordPress websites. If you can build your website in WordPress, you should. You'll have the website finished in days instead of weeks, and your client will be able to maintain it him- or herself. You should only use JavaScript if your website can't be built in WordPress. Which raises the question, what can a JavaScript web app do that a WordPress website can't?

## What JavaScript Does That No Other Websites Can Do

WordPress websites are slow. All client-server websites are slow. You click on something, your browser sends an HTTP request to the server, a PHP script hits the database, often hundreds of times, then assembles the webpage, then renders it and sends it to you. You click something else and the server has to do it all over again.

JavaScript is the only computer language that runs in the browser. With a _single page_ or _static web app_ your browser sends an HTTP request to the server and the server sends a JavaScript app to your browser. The app runs on your computer just like software that you installed on your computer. You click and type and the app instantly responds. The database is still on the server but new technologies enable web apps to query remote databases and just get the data they need. E.g., when you order a pizza and an app shows you in real-time where your driver is, updating every few seconds, the app is just getting a chunk of data every few seconds, perhaps 100 bytes or less, with a single query to the database. In contrast, in a client-server architecture to watch your pizza driver the server would have to hit the database hundreds of times every few seconds, assembling full webpages and sending perhaps megabytes of data. (A megabyte is a million times bigger than a byte.) The website would never be able to keep up with your pizza driver.

The newest technologies move the database into the cloud. The server just sends out the web app once and it's work is done. You no longer need to build a server or host it somewhere, with all the headaches of server crashes, etc. We'll get to cloud web apps later but first we'll build a MEAN stack web app with a server and a database.

### WordPress vs. JavaScript In Two Sentences

If your business sells stuff, either goods or services, build the website in WordPress. If your business is the app, use JavaScript.

For example, AirBnB doesn't own hotels. It doesn't provide beds or change the sheets or welcome guests when they arrive. The hosts do all that. AirBnB makes an app that connects hosts and guests. AirBnB's business is its web app.

## How Node is Different From Apache

There are several differences between Node and Apache:

* I never wrote _routes_ with Apache servers. I wrote HTML and uploaded webpages to the server. My webpages had links, you'd click a link and the server sent you a new page. With Node you have to write routes. When users click a URL, the router tells the server what _view_ to send to the client.
* Apache is _synchronous_, Node is _asynchronous_. _Synchronous_ means that your browser sends an HTTP request to the server, and then your browser sits there until it gets the HTTP response back from the server. _Asynchronous_ means that your browser sends an HTTP request to the server, then JavaScript does other stuff while it's waiting for the HTTP response from the server. For example, your pizza driver might go through a tunnel and lose GPS and cellphone coverage. Instead of the website freezing on your browser you can click to view promotions, etc.
* I never set up my own Apache server but I've heard that it's non-trivial. Setting up a Node server is very easy. You'll soon be creating and destroying servers with reckless abandon.
* Web apps are written in JavaScript and expect data to come from the database through an API using JSON objects. An _Application Programming Interface_ (API) is how two computer programs, in this case a front-end app running in a browser and a back-end app accessing a database on a server, talk to each other. _JavaScript Object Notation_ (JSON) is a standard way to format data as nested arrays and objects, i.e., group related data into collections. Node and MongoDB understand JSON objects. Other back-end languages and databases require translating JSON objects. This isn't always simple, and bugs can creep into complex data.
* If you're writing JavaScript in the front end you don't have to mentally switch gears to write in another language on the back end.

## Install Node and Node Package Manager (npm)

If you haven't already, install Node. Go to [Nodejs.org] (https://nodejs.org/).

Node Package Manager (npm) is included in Node. npm will install applications that Node uses on the back end.

### Test That Node Is Installed and Up-to-date

To test that Node is installed and up-to-date:

```
node --version
```

or

```
node -v
```

Go to [Nodejs.org] (https://nodejs.org/) to see what the current version is.

### Update Node

I have no idea how to update Node. I presume that npm updates Node automatically?

## Node Package Manager (npm)

When you make Node apps you'll use ```require``` to include Node _modules_ or _packages_ (same thing). When a Node module or package is listed in your project's ```package.json``` it's called a _dependency_.

To install Node modules you'll use the Node Package Manager (npm).

> Some people dispute whether npm is an acronym for Node Package Manager.

npm installed when you installed Node, i.e., npm is a part of Node.

To test that npm is up-to-date:

```
npm -v
```

The current stable version of npm is listed in the footer of the [npm docs](https://dos.npmjs.com/getting-started/installing-node). To update npm:

```
npm install npm@latest -g
```

### Installing Node Modules

To use npm to install a module, decide whether you want the module installed _globally_ (available to all your projects) or _locally_ in one project.

To install a module globally, type

```
npm install <modulename> -g
```

You can install a module globally from any directory. This installs the module into the directory ```/usr/local/lib/node_modules```. From there any project can access the module.

To install a Node module locally, go to your project directory, where your ```package.json``` file is located. Type

 ```
 npm install <modulename> --save
 ```

This will install the module into a directory ```node_modules``` your project folder. You should add ```node_modules``` to your ```.gitignore``` file so that Git doesn't archive these modules, which can be large.

### Check That Node Modules Are Up-To-Date

As Node updates you should also update your projects's Node modules. Sometimes an older module won't work with a new version of Node, and there's an updated version of the module that fixes the bug. Install a Node module to make this easy:

```
npm install -g npm-check
```

Then check your global Node modules by entering:

```
npm-check -g
```

You can also check local Node modules by entering ```npm-check``` from the project directory where ```package.json``` is located.

To update your global Node modules:

```
npm-check -u -g
```

## Node Without Express

At Galvanize we first learned to make Node servers, including routing, without Express. That was the worst part of the course, and I doubt that anyone does that in production.

### Node REPL

Node provides a Read-Eval-Print-Loop (REPL) for running JavaScript in the CLI. The Node REPL is also known as the Node shell. You enter it by entering:

```
node
```

You can now run any JavaScript. To exit key ```control-C```.

### Node Event Loop (Intermediate Level)

Node is event-driven. Events include users clicking on stuff or submitting forms, or your pizza driver arriving at your house. Phillip Roberts explains it well in this [video](https://www.youtube.com/watch?v=8aGhZQkoFbQ). It's not necessary for beginners but intermediate level coders will find it helpful.

## Express

Express is a framework that extends Node and makes it easier to work with. It's downloaded five million times a month. Everyone who uses Node uses Express.

### Installing Express

Check that you have Node installed and up-to-date:

```
node -v
```

Then uses npm to install Express globally:

```
npm install express -g
```

Check that Express installed correctly and is the latest version:

```
express -V
```

Yes, that's a capital V.

### Express's Three Core Objects

Express has only three core objects:

* The application object, where you create a server, use Node modules, etc.
* The request object, where you specify what HTTP requests your app will accept (e.g., home page, "about" page, etc.).
* The response object, where you specify what HTTP response your app sends in response to requests.

The documentation for the application, request, and response objects is at [http://expressjs.com/en/api.html](http://expressjs.com/en/api.html).

As you remember from the JavaScript chapters, everything in JavaScript is an object. In object-oriented programming we create objects and then attach methods to the objects to do stuff. In other words, the ```application``` doesn't do anything, it's the place we attach methods to do stuff. Similarly a ```request``` or a ```response``` doesn't do anything, rather it's another place where we attach methods that do stuff.

#### The ```app``` Object

To create an instance of the application object:

```javascript
var express = require('express');
var app = new express();
```

The first line requires the Node module ```express``` (i.e., Express becomes a _dependency_ of the app). The second line creates a function or object called ```app```. We can now attach _methods_ (functions that do useful stuff) to ```app```.

The ```app``` object has:

* Two properties, ```locals``` and ```mountpath```. These store local variables and paths.
* One event, ```on```. Events such as a mouse click can fire an event, and ```on``` says what to do when the event fires.
* 19 methods, such as setting and getting properties (name and value pairs), configuring settings, enabling or disabling settings, listing routes, listening for connections, etc.

#### The ```request``` Object

To create an instance of the ```request``` and ```response``` objects:

```javascript
app.get('/user/:id', function(request, response) {
  response.send('user ' + request.params.id);
});
```

The ```request``` and ```response``` objects are created together so that middleware can work on the ```request``` and ```response``` together.

When you've become comfortable reading Express code you can save typing and use ```req``` instead of ```request``` and ```res``` instead of ```response```.

The ```request``` object has:

* 20 properties, such as the hostname in the HTTP request header, the IP address of the browser sending the request, cookies sent from the browser to the server, etc. You'll use these properties to parse out an HTTP request.
* 7 methods, such as checking if an HTTP request's content type is acceptable.

#### The ```response``` Object

The ```response``` object has

* 3 properties, including a boolean property to indicate if the response has an HTTP header, and local variables.
* 21 methods, including sending a response; sending an HTTP status code; attaching headers, files, cookies, JSON objects, links, locations, and redirects; rendering a view; and ending the response.

### Express Concepts

There are a some concepts that are helpful for understanding Node and Express.

#### A Node Server Doesn't Simply Send Out .html Files

This part stumped me at first. In the 1990s I hand-coded websites running on Apache servers. I just uploaded my files, mostly ```.html``` and ```.jpg``` files. I made links to the ```.html``` files. Users clicked on my links and the Apache server delivered the webpages.

Node and Express don't do that. You have to write an ```app.js``` JavaScript program, and ```routes.js``` program, and maybe a lot of other code. Modern web apps aren't like old school websites. Modern apps can do much more than old client-server websites but the coding is complex.

#### Asynchronous JavaScript and Callbacks

In _synchronous_ code, your does the first thing first, then it does the next thing, then it does the next thing, etc. This is fine for many types of programming but not when some things take a long time. Your database request may have asked for a large amount of data. You may have requested a picture or video that's too big. An Internet connection may be slowed down. The webpage freezes while it waits for the response to your request.

JavaScript can be written _asynchronously_. You make a request from a database and while you're waiting for the data the program continues. You can explore the website or do something else while you're waiting.

Node and Express are designed for asynchronous JavaScript programming. Asynchronous coding uses _callback functions_. A callback is usually the last argument of a function. When the function completes, then the callback is executed. For example, ask the database where your pizza driver is now, and when you receive a response display the location on a map.

Asynchronous programs can be confusing because code near the top of the program can execute after code at the bottom executes.

#### Node Modules

Node and Express are designed for minimum functionality. Much functionality is provided by Node modules, for example, connecting to a database, sending e-mails, etc. You choose the modules you need, install them with ```npm```, and use ```require()``` to add them as dependencies to your apps.

You can write your own Node modules. This modularizes your app. You write Node modules by attaching properties and functions to the ```exports``` object (a fifth core object) or by assigning objects to the ```module.exports``` property of a module. Every Express app is a Node module.

#### package.json

_Package_ and _module_ are interchangeable terms in Node. Every Node app includes a _manifest file_ called ```package.json```. This essential file enables your app to connect with its dependencies, and enables your app to become a dependency of another app.

To add dependencies to your app, you include the Node modules in ```package.json``` and then run ```npm install```. ```npm``` handles everything after that.

#### Middleware

[Middleware](http://expressjs.com/en/guide/using-middleware.html) acts like a filter when HTTP requests come in. Middleware is a stack of functions that checks each HTTP request and decides whether to execute a function or pass the HTTP request down the stack to the next function.

Generally middleware does these tasks:

* Executes code.
* Makes changes to the request and response objects.
* Ends the HTTP request.
* Passes the HTTP request on to the next middleware in the stack.

Examples of middleware include:

* Logging the date, time, IP address, etc. of each HTTP request.
* Sending a favicon to the browser.
* Parsing the header, body, cookies, etc. included in an HTTP request.
* Handling sessions.
* Handling errors.
* The router is usually at the bottom of the middleware stack.

### "hello, world" with Express

Make a new directory for your first Node project:

```
mkdir express-app
cd express-app
```

Express apps start with a ```package.json``` file. To create a ```package.json``` file enter:

```
npm init
```

This will ask you some questions and create a ```package.json``` file. If you make a mistake or leave out something just edit ```package.json``` in your text editor (e.g., Atom).

You will be prompted you with suggestions for the name and version number of your app. Hit <return> to accept these, or enter your own specifications.

When you finish open ```package.json``` in your text editor. It should look something like this:

```javascript
  "name": "express-app",
  "version": "1.0.0",
  "description": "My first Express app.",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node --harmony app.js",
    "dev": "nodemon --harmony app.js"
  },
  "dependencies": {
    "express": "*"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/tdkehoe/express-app.git"
  },
  "author": "Thomas David Kehoe",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/tdkehoe/express-app/issues"
  },
  "homepage": "https://github.com/tdkehoe/express-app#readme"
}
```

The critical items are:

* ```"main": "app.js"``` This is where you'll create your server.
* ```"scripts": {"start": "node --harmony app.js", "dev": "nodemon --harmony app.js"}``` This is how you'll start your server, by entering ```nodemon``` on the command line.
* ```"dependencies": {"express": "*""}``` This is where you list the Node modules your app will use.

The rest of the items are unimportant to Node and are more to help you remember what this project does, where its GitHub repository is, etc.

Now enter:

```
npm install
```

This will install your dependencies, in this case, Express.

Create a new file and call it ```app.js```. I prefer to make a new file in my text editor but you could use ```touch app.js```.

If you made a Git repository, make a new file ```.gitignore```. Put ```node_modules``` into the file. This will stop Git from archiving Express and other large Node modules.

In ```app.js``` write the first line:

```javascript
var express = require('express');
var app = express();
```

These two lines create the Express application object.

Next write these lines to spin up the server:

```javascript
app.listen(3000);
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");
```

Finally, we'll create the ```request``` and ```response``` objects:

```javascript
app.get('/', function(request, response){
  response.send("hello, world");
});
```

The first line is the router. ```app.get``` routes the HTTP GET requests for the specified path. In this case the slash ```/``` path means the homepage with nothing following it.

The ```function(request, response)``` is a callback function, executed after an HTTP GET request is received from the browser. The function creates a ```request``` object and a ```response``` object. The next line attaches the ```send``` method to the  ```response``` object and creates an HTTP response with the body "hello, world".

Your complete code should look like this:

```javascript
var express = require('express');
var app = express();

app.listen(3000);
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");

app.get('/', function(request, response){
  response.send("hello, world");
});
```

Open your browser to ```localhost:3000``` and you should see this:

![Atom HTML](/Users/TDK/playground/LearnCoding/media/helloworld-express.png)

Let's try to break this. You change "hello, world" to another message. Refresh your browser and you should see your new message.

You can change the port to another number. Refresh your browser and change the URL.

Let's add another page. Add this code to the end of your program:

```javascript
app.get('/about', function(request, response){
  response.send("I was born at a very young age.");
});
```

Point your browser to ```http://localhost:3000/about``` and you should see:

![Atom HTML](/Users/TDK/playground/LearnCoding/media/about.png)

Let's add some links between the two pages:

```javascript
var express = require('express');
var app = express();

app.listen(3000);
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");

app.get('/', function(request, response){
  response.send("<p>hello, world</p><p><a href='http://localhost:3000/about'>About</a></p>");
});

app.get('/about', function(request, response){
  response.send("<p>I was born at a very young age.</p><p><a href='http://localhost:3000/'>Home</a></p>");
});
```

Now you should be able to click links to go from one page to the other.

Yay! You've finished your first Node Express website! :-)

> "I was born at a very young age" is a quote from Groucho Marx. My grandfather's step-brother's first cousins were the Marx Brothers!

### Modularize with Routes and Views

Now we'll modularize our website by adding a ```routes.js``` program and views.

#### Views

Go to your terminal. If ```nodemon``` is running then open a new tab with ```Shell > New Tab``` or ```⌘ t```.

Make a directory for the views and add two views:

```
mkdir views
cd views
touch home.hbs  
touch about.hbs
cd ..
```

A _view_ is more or less a webpage. The difference is that a webpage is a complete HTML file. Webpages are usually _static_, i.e., they don't have variables or data from a database.

A view includes HTML but it might be part of a webpage, such as the body, header, or footer. A view can also include variables or data from a database. Node and Express assemble the views into webpages.

##### The View Engine

Look up the documentation for ```[app.set](http://expressjs.com/en/api.html)``` :

![Atom HTML](/Users/TDK/playground/LearnCoding/media/app.set.png)

The documentation then lists fourteen properties of the app object whose values you can set with ```app.set```.

Look for the ```view engine``` property. Note that it's undefined by default. We have to set a value. A _view engine_ and a _template engine_ are the same thing. This documentation explains [Using template engines with Express](http://expressjs.com/en/guide/using-template-engines.html).

A template engine combines _static_ HTML with variables, usually from a database, to make a webpage. See the [list of Express template engines](https://github.com/expressjs/express/wiki?&_ga=1.56686765.629262066.1456512839#template-engines).

Jade is the most popular Express template engine. Jade is a shorthand for HTML. If you're an HTML expert you might like Jade, as you have to type less. But beginners shouldn't try to use Jade before they've mastered Jade.

Several template engines can render HTML. We'll use the Handlebars template engine. To use the Handlebars template engine requires several steps:

1. In your ```package.json``` add the dependency ```"hbs": "*"```. Remember that the _previous_ property must end in a comma:

```javascript
"dependencies": {
  "express": "*",
  "hbs": "*"
},
```

2. From your terminal run ```npm install``` to install the Handlebars Node module.

3. In your ```app.js``` file set the application object's property ```view engine``` to ```hbs``` by adding this line:
```javascript
app.set('view engine', 'hbs');
```
4. Name your views with the extension ```.hbs```, e.g., ```home.hbs```.
5. Change the response method. I.e., change ```response.set``` to ```response.render```.

> Five steps is complex!

Your ```app.js``` file should now look like this:

```javascript
var express = require('express');
var app = express();

app.set('view engine', 'hbs');

app.get('/', function(request, response){
  response.render('home');
});

app.get('/about', function(request, response){
  response.render('about');
});

app.listen(3000);
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");
```

In your view ```home.hbs``` type ```html``` and hit the TAB key. In the ```<title>``` section add ```Home```. Put this code into the ```<body>``` section:

```html
<p>hello, world</p>

<p><a href='http://localhost:3000/about'>About</a></p>
```

In your view ```about.hbs``` type ```html``` and hit the TAB key. In the ```<title>``` section add ```About```.Put this code into the ```<body>``` section:

```html
<p>I was born at a very young age.</p>

<p><a href='http://localhost:3000/'>Home</a></p>
```

Refresh your browser and your website should work as it did before.

##### Views Property

Go back to the documentation for ```[app.set](http://expressjs.com/en/api.html)```. Note the property ```views```. The default for the ```views``` property is ```process.cwd() + '/views'```. ```cwd``` is the UNIX command for _change working directory_. We put the ```/views``` directory in our working directory so we don't need to change directories, i.e., we don't need to set this value. If you use this directory structure then you don't need to set this value. But if you use a different directory structure you'll have to ste this value, e.g.,

```javascript
app.set('views', '../my_other_directory/views');
```

##### Make a Public Directory for Static Resources

You may be getting an impression that Node and Express like to differentiate _static_ and _dynamic_ resources. Static resources include images. Dynamic resources include databases.

Express has a middleware to serve static resources. It's called ```static```. Middleware are methods of the express object. Add this line to your ```app.js``` program:

```javascript
app.use(express.static('./public'));
```

> ```static``` is the only middleware built into Express.

Now make a directory for static resources called ```public```:

```
mkdir public
cd public
mkdir images
cd ..
cd..
```

Find a cat picture on the World Wide Web and save it to your ```public``` directory as ```cat.jpg```.

In your ```home.hbs``` file enter ```img``` and then hit the TAB key. Atom should autocomplete:

```html
<img src="" alt="" />
```

Fill in the source as ```images/cat.jpg``` and the alt as "Cat picture":

```html
<img src="images/cat.jpg" alt="Cat picture" />
```

Let's made a CSS stylesheet:

```
cd public
mkdir css
cd stylesheets
touch master.css
cd ..
cd ..
```

Open your stylesheet in your text editor. Add some styling:

```css
img {
  width: 220px;
}

.content {
  width: 220px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #ccc;
  box-shadow: 0 3px 4px #ccc
}
```

In ```home.hbs``` in the ```<head>``` section type ```link``` followed by the TAB key. Atom should autocomplete:

```html
<link rel="stylesheet" href="/css/master.css" media="screen" title="no title" charset="utf-8">
```

<!-- Delete this section? -->
In ```home.hbs``` let's wrap our content in a class:

```html
<div class="content">
  <p>hello, world</p>

  <p><a href='http://localhost:3000/about'>About</a></p>

  <img src="images/cat.jpg" alt="Cat picture" />
</div>
```
<!-- Delete this section? -->


Your ```home.hbs``` file should look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Home</title>
    <link rel="stylesheet" href="/css/master.css" media="screen" title="no title" charset="utf-8">
  </head>
  <body>

    <div class="content">
      <p>hello, world</p>

      <p><a href='http://localhost:3000/about'>About</a></p>

      <img src="images/cat.jpg" alt="Cat picture" />
    </div>

  </body>
</html>
```

Refresh your browser and your website should have a nice home page:

![Atom HTML](/Users/TDK/playground/LearnCoding/media/catpicture.png)

##### Router

#### The ```router``` Object

The router is where you'll specify acceptable HTTP requests (typically a URL) and what response Node will send (typically a view or web page).

The ```router``` object has no properties or events. It has methods for the nine [HTTP request methods](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods) (GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, CONNECT, PATCH) plus a method that uses a middleware package, a method for adding a callback trigger to a route, and other methods.

To create a ```router``` object:

```javascript
var express = require('express');
var router = express.Router();

var db = require('monk')(process.env.MONGOLAB_URI);
var MyDatabase = db.get('myDB');

router.get('/home/', function(request, response) { // INDEX route
  MyDatabase.find({}, function(error, data) {
    if (error) {
      response.send(error);
    }
    response.status(200).json(data); // OK
  })
});
```

After we create the router we hook up the MongoDB database. Then we say that when we get a response for the home page, go to the database and find data. If there's an error, send the error message. If there's data, send the data.




Routes define your app's URL paths. Routes have three parts:

1. An HTTP verb: GET, POST, and [11 others](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods).
2. A path, e.g., ```/about```.
3. A callback function that does something, e.g., serve a view or add a record to the database.

The Express router is middleware but unlike other middleware, which attach to the express object (e.g., ```express.favicon()```, ```express,bodyParser()```), the router attaches to the application object (```app.router```). To add the router to the middleware stack add this code to your ```app.js```:

```javascript
app.use(app.router);
```

The router should go at the bottom of the middleware stack, i.e., after ```app.use(express.static('./public'));``` and above ```app.listen(3000);```.

###### Route Identifiers

Basic routes look like URLs. E.g., ```'/about'``` looks like ```/about.html``` in an old-school website. The user will see ```http://www.mywebsite.com/about``` with Express, vs. ```http://www.mywebsite.com/about.html``` in an old-school website.

Things get more interesting when we route with _request parameters_. For example, a web app might attach a user id number to a URL in the HTTP request: ```http://www.mywebsite.com/user/123abc```. Each user has a unique id number. We can use this route: ```'/user/:id'```.

Or a user may select his or her country on your website's landing page, and send this HTTP request: ```http://www.mywebsite.com/country/mexico```. Your router is set up with ```'/country/:country'``` and routes this user to Spanish-language views.

Routes can even use [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) such as ```'/ab?cd'``` or ```'/ab*cd'```.

###### Order of Route Precedence

Routes are like a filter. If the HTTP request matches the top route, it goes there. If it doesn't match the top route it's compared with the second route, and so on. The ```404``` "page not found" route goes at the bottom as the "catch-all".

##### Modularize Routes

Best practices are to put your routes in a ```routes.js``` file, in a ```routes``` directory. If you have a lot of routes you might makes several routes files in the ```routes``` directory.

Make a directory ```routes``` and a file ```routes.js```:

```
mkdir routes
cd routes
touch routes.js
cd ..
```

In your ```routes.js``` files do three steps:

1. At the top put this code:

```javascript
var express = require('express');
var router = express.Router();
```

The first line should be familiar, it establishes that this is an Express module. The second line is new. The documentation is at the bottom of of the [Guide to Express Routing](http://expressjs.com/en/guide/routing.html). ```express.Router``` is "is a complete middleware and routing system; for this reason, it is often referred to as a 'mini-app'." In other words, it's a black box whose inner workings I don't need to know if I use it correctly.

2. At the bottom of your ```routes.js``` file put this line:

```javascript
module.exports = router;
```

The two keywords of a Node module are ```require``` and ```module.exports```.

> ```module``` and ```exports``` are both objects. ```exports``` is a property of ```module```.

In Node, each file is complete in its scope, i.e., what happens in a file stays in the file, except for ```require``` and ```module.exports```. These keywords enable Node files to communicate with each other. Note that the variable ```router``` is in the second line and in the last line. You could change this to anything you want as long as the same keyword is used in the second line and the last line. However, let's use the keyword ```router``` because it's an instance of the constructor object Router.

> Is it a constructor object? We would use ```new``` not ```var```. A constructor object is a template that creates copies of itself. The original object is usually capitalized and the instances of the constructor object are lowercase.

3. Copy the routes from ```app.js```. Paste them in the middle of ```routes.js```. Change ```app``` to ```router```.

Your file ```routes.js``` should look like this:

```javascript
var express = require('express');
var router = express.Router();

router.get('/', function(request, response){
  response.render('home');
});

router.get('/about', function(request, response){
  response.render('about');
});

module.exports = router;
```

Open ```app.js```. Do two steps:

4. Add two lines:

```javascript
var routes = require('./routes/routes.js');
app.use('/', routes);
```

The first line uses the keyword ```require```. This hooks up ```routes.js```.

> The ```.js``` extension can be left on ```'./routes/routes.js'```or removed ```'./routes/routes'```. We'll leave the ```.js``` extension on for clarity but most coders leave it off, just as they usually write ```req``` instead of ```request``` and ```res``` instead of ```response```.

The second line is saying whenever a path with a slash in it, i.e., any path, is called, call in the ```routes.js```. The two lines could be written as one line:

```javascript
app.use('/', require('./routes/routes'));
```

> In a ReST app it's correct to include the name of the app in the URL. This is a line where we put the app's name. Our app doesn't have a name but if it were named 'cats' our code would be ```app.use('/cats', routes);```

5. Delete or comment out the routes in ```app.js```. Your ```app.js``` file should look like:

```javascript
var express = require('express');
var app = express();

var routes = require('./routes/routes');
app.use('/', routes);

app.set('view engine', 'hbs');

app.use(express.static('./public'));

app.listen(3000);
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");
```

That's it! You now have your Node Express app modularized!

##### File Structure

Unlike frameworks such as Rails, Node and Express are agnostic as to your file structure. However, this file structure is more or less de facto for a back-end ```express-app``` directory (assuming that you'll have a separate ```angular-app``` front-end directory):

```
├── app.js
├── node_modules
├── package.json
├── public
│   ├── css
│   │   └── master.css
│   └── images
│       └── cat.jpg
├── routes
│   └── routes.js
└── views
    ├── about.hbs
    ├── home.hbs
```

##### Middleware

Middleware is a stack of modules that do stuff with HTTP requests and responses:

* Documentation for [Using middleware](http://expressjs.com/en/guide/using-middleware.html).
* A list of [Express middleware modules](https://github.com/senchalabs/connect?&_ga=1.257947788.629262066.1456512839#middleware).
* A list of commonly used [third-party middleware modules](http://expressjs.com/en/resources/middleware.html).

Application-level middleware is called in ```app.js``` with this code:

```javascript
app.use(function (request, response, next) {
  // do something
  next();
});
 ```

Any code you see that starts with ```app.use()``` is middleware.

Middleware first checks if the HTTP request fits the middleware, e.g., a middleware to provide Spanish-language views looks for HTTP requests with ```/es/``` in the URL. If the HTTP request meets the middleware's criteria then the middleware executes its response. If not, it uses ```next``` to pass on the HTTP request to the next middleware in the stack.

Middleware for error-handling have a fourth parameter, ```error```.

The order of middleware matters. The router is usually at the bottom of the stack.

#### Hook Up a Database

Almost every Node Express server includes a database. A database changes a _static_ website into a _dynamic_ website that can interact with users.

Node and Express work with a variety of databases. The first decision when choosing a database is whether to use an SQL database such as PostgresSQL or MySQL vs. using a NoSQL database such as MongoDB.

Structured Query Language (SQL) is a functional language for addressing a _relational_ database. A relational database consists of tables. Tables are two-dimensional with rows and columns, like a spreadsheet. For example there might be a table for users (with names, addresses, etc.), a table for products (with prices, descriptions, pictures, etc.), and a table for orders. The orders include both a username ID and a product ID, e.g., customer #8765 ordered product #ABC-123. Your code can then assemble an invoice for the order that looks up the customer's name and address, the price of the product, etc.

NoSQL databases consist of arrays and objects. Generally the top level of the database is an array or _collection_ of objects. The objects may include arrays, which include objects, and so on. For example, a blog has a collection of posts, i.e., an array. Each post includes, a title, the author, a body, an array of pictures, the date posted, the language, etc. The post is an object that looks like this:

```javascript
var post = {
  title: 'My Favorite Cat Pictures',
  author: 'Karla Katzenjammer',
  body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  pictures: ['./images/cutecat.jpg', './images/anothercutecat.jpg', './images/areallycutecat.jpg'],
  date: 'Mon Feb 29 10:57:08 MST 2016',
  language: 'Greek',
  comments: [...],
  upvotes: 13
};
```

The comments are an array of objects, each with an author, text, date, upvotes, etc. You might allow comments on comments, and comments on comments on comments, etc. Reddit allows at least ten layers of comments. This would be a nightmare in SQL but is easy in NoSQL.

NoSQL databases are easy to work with in JavaScript because JavaScript has arrays and objects. Converting SQL tables into arrays and objects can be done but carries a risk of errors, as well as consumes computer time.

We'll go with NoSQL. The most popular NoSQL database is MongoDB.

#### Monk and Mongoose

Express has three Node modules for connecting to MongoDB:

* Monk, which is simple and good for beginners.
* MongoDB's Node.js driver, which is simple, good for beginners, and the same code also runs with Mongoose if your project grows.
* Mongoose, which is the most sophisticated and not recommended for beginners.

##### Monk

We'll use Monk because I know it. We connect the database from ```routes.js```, not from ```app.js```.











##### MongoDB Driver

The ```mongodb``` driver depends on four other Node modules:

* ```mongodb-core``` provides "basic management of MongoDB topology connections, CRUD operations, and authentication."
* ```bson```, short for Binary JSON, provides binary encoded serialization of JSON objects.
* ```kerberos``` is a computer network authentication protocol, named after the three-headed dog that guarded Hades in Greek mythology.
* ```node-gyp``` compiles native add-on modules for Node.js.

Install them together:

```
npm install mongodb mongodb-core bson kerberos node-gyp --save
```

Check that they've installed:

```
cat package.json
```

Your ```package.json``` should include these dependencies:

```javascript
"dependencies": {
  "bson": "^0.4.21",
  "express": "*",
  "hbs": "*",
  "kerberos": "0.0.18",
  "mongodb": "^2.1.7",
  "mongodb-core": "^1.3.2",
  "node-gyp": "^3.3.0"
},
```

Download and install [MongoDB](https://www.mongodb.org/).







SQL is by far the most popular database for large companies but such companies usually don't use Node and Express for their servers. They usually use Java, PHP, Ruby, or other languages with an Apache or Microsoft server.
