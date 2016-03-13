# The Atom Text Editor

If you prefer to use a different text editor you can skip this chapter.

You must use a text editor to write code. You can't use Microsoft Word, etc.

The Atom text editor is a good place to start. It's simple to learn, free, and open-source. To install it go to [Atom.io](https://atom.io) and download it.

Check for updates in ```File > Check for Update```. Make that part of your weekly habit.

## Atom Cheatsheet

Print out an Atom cheatsheet. Make a folder in your laptop bag for cheatsheets. I like the  [bugsnag](http://d2wy8f7a9ursnm.cloudfront.net/atom-editor-cheat-sheet.pdf) cheatsheet.

## Save Files With Extensions

When you create a file in Atom (```File > New File```) immediately save it (```File > Save```) with an extension:

* Save HTML files with the ```.html``` extension.
* Save CSS files with the ```.css``` extension.
* Save JavaScript files wth the ```.js``` extension.
* Save Markdown files with the ```.md``` extension.

Atom will then format and colorcode your text.

__Exercise:__ In your ```playground``` folder make a folder called ```atom```.

In Atom, open a new file and save it as ```index.html``` in your ```playground``` directory. Now type in the first line ```html``` and hit the ```TAB``` key. You should see this:

![Atom HTML](/Users/TDK/playground/LearnCoding/media/atom_html.png)

Pretty neat, huh? You just used a _snippet_. More about snippets later.

Now type between the ```<body``` and ```</body>``` tags:

```
Hello, world.
```

![Atom HTML](/Users/TDK/playground/LearnCoding/media/helloworld.png)

Open your Chrome browser and use ```File > Open File``` to open to your file ```index.html```.

![Atom HTML](/Users/TDK/playground/LearnCoding/media/helloworld2.png)

You've just created your first web page!

## Menu Bar

I'll point out some useful items in the menu bar.

![Atom HTML](/Users/TDK/playground/LearnCoding/media/atom_menu_bar.png)

Under ```Atom``` I use:

* ```Check for Updates```. Atom has bugs. It's open-source and maintained by volunteers. Keep your Atom up-to-date to minimize bugs.
* ```Preferences```. This is where you'll install modules, change themes, etc. More on this later.
* ```Open Your Snippets```. This is where you'll make your own snippets, writing a dozen lines of "boilerplate" code by typing a few characters.

Under ```File``` everything is standard Macintosh except:
* ```Add Project Folder```. Use this to put two folders in the left column. You might have your back-end in one project folder and your front-end in another project folder.

Under ```Edit``` the first items are standard Macintosh. Then you have text editor commands, starting with:
* ```Toggle Comments```. You'll use this often but with the keyboard shortcut. Click anywhere in your ```index.html``` file and then use the keyboard shortcut ```⌘ /```. The line is _commented out_, i.e., it will be ignored when the software runs, but you can still read it.

Under ```View``` I use:
* ```Panes```. I like to have two or three files open. Select a file (you'll see a blue bar on the left side of the file tab at the top of the page). Then select ```View > Panes > Split Right``` to open a new pane on the right side with your selected file. (I don't use ```Split Left```.)
* ```Toggle Soft Wrap``` is useful when your writing text and your paragraph goes off the screen to the right. Unlike a word processor a text editor doesn't automatically start a new line.

I do the ```Selection``` items from the keyboard, for example:
* ```⌘ l``` selects an entire line.

I often use the ```Find``` menu:
* ```⌘ f``` finds a word or phrase in the current document, as is standard for all Macintosh apps.
* ```shift ⌘ F``` searches an entire project folder for a word or phrase. This is really useful, for example, if you have a bug that seems to involve the route ```'/movies/:id'``` you can list everywhere in the project where that route appears.

I don't often use the ```Packages```, ```Window```, or ```Help``` menus.

## Keyboard Shortcuts

Coders like to keep their hands on their keyboards so text editors have myriad keyboard shortcuts. Here are some I use:

* ```⌘ /``` toggles comments for a line.
* ```⌘ l``` selects a line.
* ```shift control k``` deletes (kills) a line.
* ```control ⌘ up/down arrow``` moves a line up or down.

That will get your started, and you can learn more from your cheatsheet or the menu items. You can create your own keyboard shortcuts at ```Atom > Preferences > Keybindings```.

## Folding

In code files you'll see, in between the line numbers and your code, little down carets.

![Atom HTML](/Users/TDK/playground/LearnCoding/media/fold_carats.png)

Clicking on a down caret _folds_ a block of code into a single line, and changes the down caret into a right carat. Clicking the right caret unfolds your code block.

Folding is useful when you have a long program and you can hide certain functions that you're not interested in.

## Indentation

To manually indent type ```⌘ ]```.

Or you can automagically correctly indent everything by typing ```shift ⌘ i```. If this doesn't work open ```Atom > Preferences``` and look for a Community Package called ```auto-indent```. You may need to enable it or install it.

## Markdown Preview

Markdown is the text markup language that coders prefer. It does pretty much the same things as HTML (lists, _italics_, hyperlinks) but with less typing. There will be a chapter about writing in Markdown. For now you just want to read Markdown files. ```shift control m``` opens a new right pane in Markdown preview mode.

Markdown preview slows down Atom. You may not want to have a preview pane open while you're writing in Markdown.

## Save on Focus Lost

When you're coding you will switch between your code and the browser as often as my dog pees on fire hydrants. If you want to become a nervous wreck, do ```File > Save All``` or ```shift ⌘ S``` every time you switch to view the browser. If you want to tear your hair out, then fix a bug and forget to save all, or do ```⌘ s``` with the wrong file highlighted (i.e., save the wrong file), switch to the browser and see your bug still there. Then spend half an hour trying to figure out why your bug fix didn't work, before you realize that you didn't save your changes before viewing the browser.

To be a happy coder, set _save on focus lost_. Open ```Atom > Preferences``` and look for a Core Package called ```autosave```. Enable this package.

## Linting

When we get into the JavaScript chapter we'll use _linting_. This highlights typos and other common mistakes in JavaScript. This is done with another Community Package.

## Core and Community Packages

I've mentioned Core and Community Packages several times. These are in ```Atom > Preferences```. Adding or enabling packages is how you add functionality to Atom. 77 core packages are included in Atom but you might have to enable them or adjust settings. Community packages have to be added using ```Atom > Preferences > Install```. [Instructions](https://atom.io/docs/v1.5.3/using-atom-atom-packages) are on Atom website. A [list of packages](https://atom.io/packages) (3,662!) is also on the Atom website.

Some community packages can crash Atom so disable or delete community packages that you're not using.

### Auto-Indent

I like the ```auto-indent``` package. I can key ```shift-⌘-I``` and it indents my code correctly.

## Themes

Atom also has a variety of themes available. I'm happy with the default themes. I prefer a dark theme, especially at night. I switch to a light theme when I'm outside in the sun.

## Snippets

Did you like typing ```html```, hitting ```TAB```, and seeing ten lines of boilerplate code appear? Try typing ```lorem``` and hit ```TAB```. This text is called "greek" in the advertising industry when a designer creates an ad but the copywriter hasn't written the ad copy so text is needed to fill spaces. You'll use "greek" when you're designing websites and have spaces for text.

To see all snippets that are available type ```shift option S```. The available snippets change depending on the file extension. You can also see all snippets by examining packages, e.g., in ```Atom > Preferences > Packages``` filter for ```language-html``` then click ```Settings```. Scroll down to view the snippets.

Creating your own snippets is easy. Let's say that you want your HTML skeleton to specify that your websites are in English:

```
<html lang="en">
```

Plus you always include a link to a CSS stylesheet and a link to a JavaScript app. And you want your websites to start with a default title.

Open ```Atom > Open Your Snippets```. Paste in this code at the bottom of the file:

```
'.text.html.basic':
  'HTML5 Skeleton':
    'prefix': 'html5'
    'body': """
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="style.css">
        <title>Title</title>
      </head>
      <body>

        <script type="text/javascript" src="app.js"></script>
      </body>
    </html>
"""
```

You may have to quit and restart Atom for your new snippet to work. Then you just type ```html5``` and ```TAB``` and your code appears.

As we learn to code I'll suggest snippets you can use, and custom snippets you can write.

## Writing Documentation in Atom

Writing documentation is an important part of coding, and especially of learning to code. In the Markdown editor you format code and code blocks with triple backticks: ``` ``` ```

Backticks are on the upper left key of your keyboard, sharing the tilde ```~``` key.

Put triple backticks before and after your code to format it as code. Atom colors your text differently if the triple backticks are inline or on their own lines.

Here's the cool part. Put the language after the first set of backticks, e.g., ``` ```javascript ```

Now your code will (in the Markdown Preview pane) appear colorcoded and indented correctly in your documentation.

## File Management

You can rename a file by selecting it in the directory and file listing in the left column, then right-clicking. You can also delete a file, duplicate a file, etc.


![Atom Right-Click Menu](/Users/TDK/playground/LearnCoding/media/atom_right_click.png)


## Open Hidden Files

Sometimes you have to edit a hidden file, e.g., ```.gitignore```. Go to ```File > Open``` or use the keybinding ```⌘ o```. A window will open showing files you can open. Now use the keybinding ```shift ⌘ .``` You should now see hidden files. Toggle ```shift ⌘ .``` to hide hidden files.
