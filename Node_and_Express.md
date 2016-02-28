#Node and Express

Node is a _server_ in the JavaScript world. Express is a framework that makes Node easier to use. Along with a database, usually MongoDB, they form the _back end_ of a website. MongoDB, Express, and Node are three-quarters of the _MEAN stack_ for building complete websites (The fourth part is Angular to build the _front end_ or _client_ of the website.)

## How the World Wide Web Works (and why you should use WordPress)

The World Wide Web (WWW) uses a _client-server_ architecture. The _client_ is your browser, e.g., Chrome. You type or click a URL, e.g., http://www.breakingstuff.net. Your browser sends an _HTTP request_ to the _server_. The server then sends the webpage you requested to your browser. This is called an _HTTP response_. Most websites built since 2000 use a database on the server. A program calls the database to collect the parts of the webpage, assembles and _renders_ the webpage, then sends it to you.

Since 1996 the most popular server has been the Apache server. It's usually run on Linux with the MySQL database and the PHP language. Together this is called the _LAMP stack_. WordPress is the most popular content management system (CMS) on the LAMP stack. It powers more than 60 million websites, including 23% of the top ten million websites. IMHO every web developer should be familiar with WordPress. I have two WordPress websites. If you can build your website in WordPress, you should. You'll have the website finished in days instead of weeks, and your client will be able to maintain it him- or herself. You should only use JavaScript if your website can't be built in WordPress. Which raises the question, what can a JavaScript website do that a WordPress website can't?

## What JavaScript Does That No Other Websites Can Do

WordPress websites are slow. All client-server websites are slow. You click on something, your browser sends an HTTP request to the server, a PHP script hits the database, often hundreds of times, then assembles the webpage, then renders it and sends it to you. You click something else and the server has to do it all over again.

JavaScript is the only computer language that runs in the browser. With a _single page web app_ your browser sends an HTTP request to the server and the server sends a JavaScript app to your browser. The app runs on your computer just like software that you installed on your computer. You click and type and the app instantly responds. The database is still on the server but new technologies enable web apps to query remote databases and just get the date they need. E.g., when you order a pizza and an app shows you in real-time where your driver is, updating every few seconds, the app is just getting a chunk of data every few seconds, maybe 100 bytes or less, with a single query to the database. In contrast, in a client-server architecture to watch your pizza driver the server would have to hit the database hundreds of times every few seconds, assembling full webpages and sending perhaps megabytes of data. (A megabyte is a million times bigger than a byte.)

The newest technologies move the database into the cloud. The server just sends out the web app once and it's work is done. You no longer need to build a server or host it somewhere, with all the headaches of server crashes, etc. We'll get to cloud web apps later but first we'll build a MEAN stack web app with a server.

### WordPress vs. JavaScript In Two Sentences

If your business sells stuff, either goods or services, build the website in WordPress. If your business is the app, use JavaScript.

For example, AirBnB doesn't own hotels. It doesn't provide beds or change the sheets or welcome guests when they arrive. The hosts do all that. AirBnB makes an app that connects hosts and guests. AirBnB's business is its web app.

## How Node is Different From Apache

In the 1990s I hand-coded my website. I wrote HTML and uploaded webpages to the server. My webpages had links, you'd click a link and the server sent you a new page. That was a _static_ website.

In 1999 I learned to use a new language called Personal Home Page or PHP. It accessed a database called MySQL. I learned to make a _dynamic_ website that assembled webpages from components in the database.

I don't remember writing routes. With Apache I just uploaded my webpage ```http://www.mywebsite.com/about.html``` and it would download when a user clicked a link to that URL. Node, in contrast, requires writing a router. For example, if a user requests ```http://www.mywebsite.com/about``` from a Node server, the server doesn't do anything unless you've explicitly told it what to do when someone requests ```http://www.mywebsite.com/about```. This doesn't seem like a step forward to me but maybe I misunderstand something.

There are other differences between Node and Apache:

* There's some code that you'd have to write in PHP with Apache that Node handles for you. I'm not sure what this code does and, as I said, there's code that you have to write in JavaScript with Node that Apache handles for you (routing).
* Apache is _synchronous_, Node is _asynchronous_. _Synchronous_ means that your browser sends an HTTP request to the server, and then your browser sits there until it gets the HTTP response back from the server. _Asynchronous_ means that your browser sends an HTTP request to the server, then JavaScript does other stuff while it's waiting for the HTTP response from the server. For example, your pizza driver might go through a tunnel and lose GPS and cellphone coverage. Instead of the website freezing on your browser you can click to view promotions, etc.
* I never set up my own Apache server but I've heard that it's non-trivial. Setting up a Node server is very easy. You'll soon be creating and destroying servers with reckless abandon.
* Web apps are written in JavaScript and expect data to come from the database through an API using JSON objects. An _Application Programming Interface_ (API) is how two computer programs, in this case a front-end app running in a browser and a back-end app accessing a database on a server, to talk to each other. _JavaScript Object Notation_ (JSON) is a standard way to format data as nested arrays and objects, i.e., group related data into collections. Node and MongoDB understand JSON objects. Other back-end languages and databases require translating JSON objects. This isn't always simple, and bugs can creep into complex data.
* If you're writing JavaScript in the front end you don't have to mentally switch gears to write in another language on the back end.

## Install Node and Node Package Manager (npm)

If you haven't already, install Node. Go to [Nodejs.org] (https://nodejs.org/).

Node Package Manager (npm) is included in Node. npm will install applications that Node uses on the back end.

### Test That Node Is Installed and Up-to-date

To test that Node is installed and up-to-date:

```
node --version
```

Go to [Nodejs.org] (https://nodejs.org/) to see what the current version is.

### Update Node

I have no idea how to update Node. I presume that npm updates Node automatically?

## Node Package Manager (npm)

When you make Node apps you'll use ```require``` to include Node modules or packages, called _dependencies_. To install these modules you'll use the Node Package Manager (npm).

npm installed when you installed Node, i.e., npm is a part of Node. I presume that npm updates when Node updates.

To use npm to install a module, you'll type ```npm install <modulename>```. This will install the module in your project folder. You'll have to install every project's dependencies every time you make a new project. Instead, you can install a module _globally_ with ```-g``` flag. This installs the module into the directory ```/usr/local/lib/node_modules```. From there any project can access the module. To install a module globally type

```
npm install -g <modulename>
```

### Check That Node Dependencies Are Up-to-date

As Node updates you should also update your projects's Node dependencies. Sometimes an older dependency won't work with a new version of Node, and there's an updated version of the dependency that fixes the bug. Install a Node module to make this easy:

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

You can now run any JavaScript. To exit enter ```control c```.

### Node Event Loop (Intermediate Level)

Node is event-driven. Events include users clicking on stuff or submitting forms, or your pizza driver arriving at your house. Phillip Roberts explains it well in this [video](https://www.youtube.com/watch?v=8aGhZQkoFbQ). It's not necessary for beginners but intermediate level coders will find it helpful.

## Express

Express is a framework that makes Node easier to work with. It's downloaded five million times a month. Everyone who uses Node uses Express.

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

### Express's Four Core Objects

Express has only four core objects:

* The application object, where you create a server, use Node modules, etc.
* The request object, where you specify what HTTP requests your app will accept (e.g., home page, "about" page, etc.).
* The response object, where you specify what HTTP response your app sends in response to requests.
* The router object, where you

The documentation for the application, request, and response objects is at [http://expressjs.com/en/api.html](http://expressjs.com/en/api.html).

As you remember from the JavaScript chapters, everything in JavaScript is an object. In object-oriented programming we create objects and then attach methods to the objects to do stuff. In other words, the ```application``` doesn't do anything, it's the place we attach methods to do stuff. Similarly a ```request``` or a ```response``` doesn't do anything, rather it's another place where we attach methods that do stuff.

#### The ```app``` Object

To create an instance of the application object:

```javascript
var express = require('express');
var app = new express();
```

The first line requires the Node module ```express``` (i.e., Express becomes a _dependency_ of the app). The second line creates a function or object called ```app```. We can now attach _methods_ (more functions that do useful stuff) to ```app```.

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

Express apps start with a ```package.json``` file. You could type it out yourself but there's an easy way. Just enter:

```
npm init
```

This will ask you some questions and create a ```package.json``` file.
