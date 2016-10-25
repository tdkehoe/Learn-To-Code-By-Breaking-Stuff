When I don't understand something I draw a picture. I drew a picture of an Angular 2 "hello world" app, similar to the Angular 2 Quickstart app.

![Angular 2 Quickstart](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/angular2helloworld.png)

You write the rectangular files. You don't write the rounded files.

I count eleven files to display "hello world" in the browser. No wonder Angular 2 is difficult to understand!

First we create the four files in the left column. These are pretty much "boilerplate," i.e., the Angular 2 Quickstart app provides a set of these files that will work for most of your projects.

`package.json` has three objects of importance. First, the scripts object runs scripts when you run npm start. The scripts spin up a server, starts TypeScript, etc.

The second object specifies the modules dependencies. Most of these start with `@angular` and are the modules of Angular 2. The provided `package.json` includes Angular2 modules for forms, HTTP requests, routing, upgrading from Angular 1 to Angular 2, and other stuff we don't need for our "hello world" app. Don't worry, Angular 2 will only download to the client the modules that your app needs, i.e., you don't need to do anything to minimize bandwidth.

A third object specifies dependencies you'll use only in your developer environment.

The next file is `typings.json`. This links to resources that specify the TypeScript types in various libraries such as node and jasmine. You don't need to deal with this file. When you run npm start, a `package.json` script will write the `typings.json` file.

A third file is `systemjs.config.js`. This file has a map object with paths to the Angular 2 modules and other libraries. It also has a packages object that specifies file extensions such as `js`, etc.

The last of the four configuration files is `tsconfig.json`. This has settings for TypeScript. Again we can copy and paste the file provided in the Angular 2 Quickstart app, as we likely won't be changing any TypeScript settings.

In the middle column are ellipses representing Angular 2 bundles such as `@angular/core`, `@angular/platform-browser`, etc. These are bundles of Angular 2 modules such as `Component`, `NgModule`, `BrowserModule`, etc. We don't write these bundles or modules, we just list the ones we want in `package.json` and they are available to our app.

Moving to the right column, we begin by writing two files that should be familiar: `hello_world.component.html` and `hello_world.component.css`. What we write in these files is indicated in green.

Next we write `app.component.ts`. This file includes a decorator that adds metadata to the `@Component` class. The metadata includes links to the HTML and CSS files we just wrote (`templateUrl` and `styleUrls`) plus the selector property, which is a CSS selector that displays the component in an HTML template (in this case, `index.html`) and displays the contents in the browser.

`app.component.ts` begins with an import statement that pulls in the Component module from the `@angular/core` bundle. The file ends with an export statement that creates a new class: `AppComponent`. I've colored `AppComponent` orange to indicate that it's not a blue class that came with Angular, and I've made it an ellipse to indicate that it's not a file that you wrote.

The next file that we write is `app.module.ts`. The format is similar to `app.component.ts`: an import statement that pulls in modules, followed by a decorator that adds metadata to a class, and ending with an `export` statement making a new class. In this case we have three import statements, pulling in the `NgModule` module from the `@angular/core` bundle, the `BrowserModule` from the `@angular/platform-browser` bundle, and finally the `AppComponent` class we just made from `app.component.ts`.

Next, the decorator adds metadata to the `NgModule` module we just imported. Here is where we say what stuff (components, directives, pipes, providers) is part of our project. The module names are listed, not the file names. There are five categories:

* `declarations` are stuff we made such as `AppComponent`
* `imports` are Angular modules such as `BrowserModule`
* `exports`
* `providers` are services we made such as `HeroService`
* `bootstrap` is `AppComponent`

Lastly, an `export` function makes a new class available: `AppModule`.

Next we write `main.ts`. Note that it's not `app.main.ts`. This indicates that `main.ts` is different from the `app...ts` files, i.e., it has a unique function. Like the `app...ts` files, `main.ts` starts with import functions, bringing in `platform-browser-dynamic` (a library that will display Angular 2 apps in any browser) from the `@angular/platform-browser-dynamic` bundle, and importing the `AppModule` class we just made. Next, `main.ts` does some magic that I don't understand to prepare the app for its debut.

The last file we write is `index.html`. This is mostly familiar, with some links to scripts for libraries. There's also a script link to the `systemjs.config.js` file we created. Then there's a script link that imports `app`, which was specified in `systemjs.config.js` to map to `main.js.`

We can also write a `styles.css` file to link from `index.html` in the normal way. This will provide overall styles for our views, as compared to `hello_world.component.css` providing styles that are limited in scope to AppComponent.

Finally, in the body we have a custom directive: `<my-app>`. This directive loads our app and "hello world" displays in the browser.
