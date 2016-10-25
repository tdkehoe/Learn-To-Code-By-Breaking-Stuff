The Angular 2 [Heroes](https://angular.io/docs/ts/latest/tutorial/) tutorial is a simple CRUD app with two views, some data, routing, etc. Here's the file structure:

![Angular 2 Quickstart](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/angular2heroes.png)

As you can see the CRUD app is more complex than the "hello world" app, with 23 files. But the basic structure is the same. With the bigger app we can see some patterns in Angular. No matter how complex the app there's only one each `app.module.ts`, `app.routing.ts`, `main.ts`, `index.html`, and `styles.css`.

We can also see that complex apps have a lots of components. Each component is consists of a `component.ts` file, and usually also a .html template and a .css styles sheet, but that's about it for files to make components. `component.ts` files often link to many components.

This CRUD app has a service. The HeroService imports the hero class, the mock-heroes array of data, and the Injectable module from @angular/core, and exports a service with two methods, getHero and getHeroes.

AppComponent

app.`component.ts` looks fairly simple, so let's dive into it a bit deeper. It imports the Component module from @angular/core. Then the @Component decorator adds three metadata to the component. Reading the Angular Cheat Sheet, @Component({...})

Declares that a class is a component and provides metadata about the component.
Only eight metadata can be decorated:

A CSS selector for displaying the component in a template.
An HTML template or a link to a templateUrl file.
CSS styles or a styleUrls link. Note that the latter is an array of CSS stylesheets, not a single stylesheet.
A moduleId sets if the templateUrl and styleUrls are absolute (default) or relative.
Arrays of providers and viewProviders that has something to do with dependency injection. (I've never used these metadata.)
In app.`component.ts` we decorate three metadata: the selector 'my-app', an HTML template, and a CSS styleUrls array.

Lastly, the AppComponent class is created, with the export keyword. One property is added, the title. Remember that in an object a property's key and value are separated by a colon, but in a TypeScript class they are separated by an equals, because a colon separates a property's key from its type.

Properties in classes such as AppComponent are where Angular gets values to display in double curly brackets, such as {{title}}. You could set a hero property in the class and display it with {{hero}}. This is called interpolation or one-way data binding. For two-way data binding we use ngModel:

<input [(ngModel)]="hero.name"placeholder="name">
We can make a property to access an array with heroes = HEROES.

The template displays the title, a nav bar with two links ("Dashboard" and "Heroes"), and then the directive "<router-outlet>". According to Angular:

RouterOutlet is one of the directives provided by the RouterModule. The router displays each component immediately below the <router-outlet> as we navigate through the application.
`app.routing.ts`

In `app.routing.ts` we see an array of route definitions. Each route consists of a path and a component. For example, the 'heroes' path displays the HeroesComponent (the list of heroes) when /heroes is in the URL. The 'dashboard' route displays the DashboardComponent when /dashboard is in the URL.

`app.routing.ts` doesn't export a class. Instead it exports a constant:

exportconst routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
The constant is called routing. Its type is the Angular module ModuleWith Providers that we imported from @angular/core at the top of the file. The value is set to the forRoot method on the Angular module RouterModule that we imported. The method brings in as a parameter the array appRoutes, where we wrote the routes.

Our constant routing is then imported into `app.module.ts`.

Routing is also handled in the app.component.html template. Navigation is handled by two anchor links that the user can click. But instead of an href value the links use routerLink. This is an Angular directive that tells the router where to navigate when the user clicks a link.

The directive <router-outlet> displays the component that the router has selected.

Hero class

Let's start with hero.ts, which makes the Hero class. This file is just makes a class with two members, an ID number and a name.

The HEROES array

Next let's look at mock-heroes.ts. This imports the class Hero from hero.ts. It exports a class called HEROES, which is typed as an array:

export const HEROES: Hero[] = [ ...heroes... ];

This syntax is interesting. HEROES is the name of the array, and Hero is the type of the elements of the array. The TypeScript documentation shows how to type the elements of an array as numbers but it doesn't say that you can create your own class.

HeroService

Next is hero.service.ts. This imports three modules: the Injectable module from @angular/core, which the Angular Cheat Sheet says

Declares that a class has dependencies that should be injected into the constructor when the dependency injector is creating an instance of this class.
I don't know what that means but perhaps we'll see when we find a constructor!

hero.service.ts also imports two classes we made, Hero and HEROES.

Then there's an @Injectable() decorator, with no metadata. It appears to do nothing. The documentation says

TypeScript sees the @Injectable() decorator and emits metadata about our service, metadata that Angular may need to inject other dependencies into this service. The HeroService doesn't have any dependencies  at the moment. Add the decorator anyway. It is a "best practice" to apply the @Injectable() decorator ​ from the start​ both for consistency and for future-proofing.
A quick check deleting @Injectable() found that the app works fine without it, i.e., the decorator does nothing.

Finally the class HeroService is exported. There are no property or constructor members, just two methods. The first method is getHeroes(). This returns the array HEROES. Originally this was

getHeroes(): Hero[] {

return HEROES;

}

That's clear enough. The method returns an array type, specifically the Hero[] array. Then it returns the HEROES array. But what if the HEROES array is on a remote database and the data will show up asynchronously, i.e., sooner or later? We should return the array as a promise:

getHeroes(): Promise<Hero[]> {

return Promise.resolve(HEROES);

}

Without the promise you might get no data and look through your code for bugs, when actually the return was executing before the array came back from the server.

The unfamiliar syntax is because HeroService is emitting the promise. The promise is received by HeroComponent. In JavaScript only the receiver uses a promise but apparently in TypeScript both the emitter and the receiver make promises.

The second method is getHero(id: number). This receives the parameter id, which is type number. It returns a promise that is type Hero. Apparently this means that it must be a member of the class Hero, i.e., an element of the array HEROES. The method returns the method getHeroes(), i.e., gets the area, then executes a promise that somehow finds the ID number of the hero. Again, the syntax is obscure but the purpose is clear.

HeroesComponent

This component displays the list of heroes, which some functions the users can click.

The HeroesComponent imports three @angular modules plus our Hero and HeroService classes. It has a decorator that adds metadata to the Component: the selector 'my-heroes', an HTML templateUrl, and a CSS styleUrls array, plus moduleId is set to make the templateUrl and styleUrls relative.

heroes.component.html runs

*ngFor="let hero of heroes"

to display the array of heroes. Each hero is clickable, which runs the method onSelect(hero) and sets the selected hero to the variable selectedHero. There's also an *ngIf so that if there is a selected hero, a button displays for the user to click to view details about the hero.

The tutorial says that the asterisk is critical:

The (*) prefix to ngFor indicates that the <li> element and its children constitute a master template.
I'm not sure what that means. Something about master and detail!

In JavaScript let creates a variable limited in scope (block scope), in contrast to using var to create a global variable. In Angular 2 let is a template input variable for *ngFor, or, rather, it identifies the next keyword as a template input variable. In other words, let hero of heroes means that hero is the variable that will change as the template displays different heroes. We can then use double curly brackets to display properties of the hero object, e.g., {{hero.name}}, or use ngModel for two-way data binding, etc.

The selected hero is highlighted with a CSS class. In the HTML template we set

<li [class.selected]="hero === selectedHero">

This syntax is not in the documentation for Property binding. We could have instead used the syntax

<li [ngClass]="selected">

but this would have made all of the heroes display as selected. Instead we’re saying “evaluate the expression on the right, and if it's true then set the CSS class to selected." Remember that here hero is the template input variable that ngFor is iterating over, i.e., when ngFor racks up a new element from the Heroes array, that becomes the present hero, and then we can evaluate whether that hero is the same as the selectedHero variable.

Exporting the HeroesComponent class is more interesting. First, it implements OnInit, to execute a method when the component is exported.

A TypeScript class is structured with three members:

Properties
Constructors
Methods
The HeroesComponent class has two properties. First, heroes: Hero[]; sets the variable heroes as an array named Hero. TypeScript has the following types: boolean, number, string, array, and enum (similar to an object in JavaScript, with some differences), plus tuple (two types), any, void (for functions that don't return a value), null, undefined, and never (for functions that return an exception).

A second property is defined. selectedHero: Hero; sets the type of the variable selectedHero as a member of the array Hero. This type isn't documented in the TypeScript documentation but it seems like a useful type.

Next is a constructor function:

constructor(private router: Router, private heroService: HeroService) {}

Angular 2 constructors inject dependencies when a class is created. They shouldn't be confused with JavaScript constructors, which are properties that all objects inherit from their prototype. Angular 2 constructors inject dependencies by setting the type of a variable as the class to be injected.

The first strange thing I see is that the members router and heroService are typed as the classes (or components) Router and HeroService, which we imported at the top of the file. This is interesting, I don't see any documentation in TypeScript saying that classes can be types! These members are modified as private, meaning they can only be accessed from within the HeroComponent class.

The constructor's function is empty, i.e., it doesn't construct anything. The tutorial says

The constructor itself does nothing. The parameter simultaneously defines a private heroService property and identifies it as a HeroService injection site.
Apparently when the HeroesComponent class is exported, the constructor sets the types of two variables as classes.

Later in the tutorial we read:

Years of experience and bitter tears have taught us to keep complex logic out of the constructor, especially anything that might call a server as a data access method is sure to do. The constructor is for simple initializations like wiring constructor parameters to properties. It's not for heavy lifting. We should be able to create a component in a test and not worry that it might do real work — like calling a server! — before we tell it to do so.
OK, it looks like the curly brackets of the constructor stay empty. You could put logic into the constructor's curly brackets to execute when the class is created but this is discouraged. Instead we use ngOnInit to execute methods when the class is created.

The last section of the class has four methods: getHeroes(), ngOnInit(), onSelect(), and gotoDetail().

The ngOnInit method executes the getHeroes() method when the class is exported. This is an interface, which apparently should not be confused with TypeScript interfaces:

One of TypeScript’s core principles is that type-checking focuses on the  shape that values have. This is sometimes called “duck typing” or “structural subtyping”. In TypeScript, interfaces fill the role of naming these types, and are a powerful way of defining contracts within your code as well as contracts with code outside of your project.
Angular 2 interfaces are explained in the tutorial:

Angular offers a number of interfaces for tapping into critical moments in the component lifecycle: at creation, after each change, and at its eventual destruction.
I don't understand what TypeScript interfaces are or what Angular 2 interfaces are, but I'm pretty sure they're not the same!

The getHeroes() method returns type void, i.e., it returns nothing. The first iteration was

this.heroes = this.heroService.getHeroes();

I.e., the getHeroes() method in the HeroesComponent calls the getHeroes() method in the HeroesService. I like when methods with the same name do the same thing!

The problem is that HeroService might be accessing data on a remote database, i.e., with an asynchronous connection, so we should make this a promise. So we want to say, "Run the HeroServicegetHeroes() method, return the Heroes array, and when you get the data execute a function that takes the Heroes array as its parameter and set the value for the local variable heroes to the Heroes array."

this.heroService.getHeroes().then(heroes => this.heroes = heroes);

Or in ES5:

this.heroService.getHeroes()

.then(function(heroes) {

this.heroes = heroes;

});

We're using this because the local variable heroes and the getHeroes() method are both properties of the HeroesComponent. this has long confused me so I'll repeat what I know, and hope that it sticks this time. When you have an object with various properties, and some properties have values and some are functions, when you execute one of the functions and want to use one of the properties that has a value, you prepend this. this gives the function access to the other properties in the object. There are many complexities that can make this refer to properties outside the object, e.g., the global object. The fat arrow => syntax limits this to properties inside the object. In Angular 2 we use often classes in place of objects. The bind() method, when attached to a function, copies the function to a second function, which retains the values of properties in the function, even if the values of the same properties in the first function change.

Moving on, heroes.component.html has a list of heroes, and when you click on a hero then

"hero === selectedHero"

and

(click)="onSelect(hero)"

This executes the onSelect() method in HeroesComponent and passes in the selected hero, e.g., Dr. IQ. The method checks that the hero is of the type Hero, i.e., is a member of the Hero array. The method returns type void, i.e., returns nothing. Then the method sets this.selectedHero = hero. OK, so the method sets the variable selectedHero to the hero that the user selected.

(click) is an event binding. The User Input documentation goes into detail on this. Event binding has two sides, with an equals in between. On the right is the template statement, i.e., the method in the component class that executes when the event occurs. The part on the left of the equals is the target of the binding. Choices include (click), (keyup), and (blur) or the user moves the mouse away.

The last method is gotoDetail(). This executed when the user clicks a button in heroes.component.html:

<button (click)="gotoDetail()">View Details</button>

No parameter is passed in and nothing is returned. This method sets router.navigate to display the URL with /detail and the ID number of the selected hero.

HeroDetailComponent

The HeroDetailComponent displays details (ID number and name) about a selected hero.

The template hero-detail.component.html runs *ngIf to display a <div> only if there is a hero selected. Why the asterisk is needed I don't understand, as this is the detail, not the master. The template displays the hero's ID number and name. The name is displayed in an <input> field with [(ngModel)] so that the user can alter hero's name. [(Brackets and parentheses?!)] Finally there's a button to run the goBack() method to go back to the previous route.

The file hero-detail.`component.ts` imports six modules, plus our classes Hero and HeroService.

The @Component decorator adds the usual metadata: a selector 'my-hero-detail', plus an HTML templateUrl and a CSS styleUrls.

The class HeroDetailComponent is exported with OnInit. The class has one property member: @Input() hero: Hero; This is decorator for the Input module, but no metadata is added. Instead it declares that hero is an input, as opposed to a target, when we do property binding.

Next there's a constructor with no properties. It sets the types of three private variables as components HeroService, ActivatedRoute, and Location, all of which were imported above.

Finally there are two methods. The ngOnInit method executes when HeroDetailComponent is created. It iterates a forEach loop over the route parameters and somehow extracts the ID number from the URL.

The method accesses the ActivatedRoute module that was imported at the top. The module was assigned to the variable route in the constructor. this accesses the private route property from within the method. Running

console.log(this.route);

shows us the route object. We can drill down into it and get the hero's ID number with

console.log(this.route['params']['_value']['id']);

The ID number is a string so we can convert it to a number with the plus + operator, then assign the number to the local variable id:

let id = +this.route['params']['_value']['id'];

That looks kludgy. The tutorial has more complex but cleaner code:

this.route.params.forEach((params: Params) => {

  let id = +params['id'];

...

 });

I know how to use forEach loops but I don't understand how we're setting the loop's parameters as a class we imported. Apparently a TypeScript forEach loop is different from a JavaScript forEach.

Either way, when we have the ID number we run the HeroService method getHero(id) and get the hero's details. Finally the tutorial has a promise that executes a function that takes the hero and sets it as this.hero. I don't know why this is done, as hero is never called in the HeroDetailComponent except in the @Input decorator.













On the route variable we access the params observable.







We run a forEach loop over the params. We type params as the module Params that we imported at the top, with params as the parameter for a function. Looking at the body of the function, let's add

console.log(params);

This shows that params is an object with one property:

{id: "18"}





The object's first property uses let for a local variable, instead of var for a global variable. id is set as +params['id'];. The + changes the string into a number. params['id'] is good ol' JavaScript accessing a property in an object. But is params an array or an object?



There's also a goBack() method that runs a function back() on location, to go back to the previous route.

DashboardComponent

There's one last component, to display the dashboard of four heroes.

The template dashboard.component.html runs *ngFor to displays the array of heroes. The user can click each hero to run the method gotoDetail().

The file dashboard.`component.ts` imports three Angular modules plus our classes Hero and HeroService.

A @Component decorator adds the usual metadata, including the selector 'my-dashboard'.

The class DashboardComponent exports with OnInit.

One property is defined:

heroes: Hero[] = [];

That's interesting TypeScript syntax! The local variable heroes is set as type Hero[], and then the value is set as an empty array. In other words, TypeScript allows creating a variable, defining its type, and then setting its value, all in one line.

The constructor, as usual, has no properties but sets the types of two variables as two of the components we imported above.

The first method is ngOnInit, which runs the method getHeroes() on the HeroService component to get the array of heroes. A promise then runs slice(1, 5) on the array to take only the first four elements, which are then displayed in the template.

The second method is gotoDetail(), executes when the user clicks on a hero. This sets up the hero's ID number in the URL and runs the router to display the detail.

`index.html`

The `index.html` file is straightforward except for a few things.

In old school websites <base href="/"> set relative URLs so that your anchor links could be <a href="/contactus"> instead of absolute URLs such as <a href="http://www.mywebsite.com/contactus">. In Angular 1 URLs started with a hash tag /#/. Angular 2 uses the browser's history.pushstate, a.k.a. "HTML 5" type URLs.
