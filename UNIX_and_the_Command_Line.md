# UNIX and the Command Line Interface (CLI)

The Macintosh has two user interfaces. The graphical user interface (GUI) is the one all Mac users are familiar with. The other is the command line interface (CLI). Instead of using the mouse you type text into the terminal.

Open your terminal from ```Applications > Utilities > Terminal```. You should see a small black window.

![Terminal](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/terminal.png)

You can resize it to make it bigger, and make the font bigger with ```command +```. Or, if you want to experience coding in the 1980s, resize your terminal to monochrome 80x23 characters. :-)

## UNIX

UNIX is an operating system that was developed in the 1970s for minicomputers. It fell into disuse in the 1980s and 1990s as personal computers replaced minicomputers. Personal computers ran MS-DOS (1980), Macintosh OS (1984), and Windows (1990 for 3.x). UNIX returned as personal computers became more powerful and developers wanted a more solid operating system:

* LINUX on PCs (mid-1990s).
* Apple's OS X on the Macintosh (2001).
* Apple's iOS on the iPhone (2007).
* Google's Android on smartphones (2008).
* Google's Chrome OS on PCs (2009).
* Sony's Orbis OS on the PlayStation 4 (2013).

Today UNIX powers every popular operating systems except Windows.

Perhaps you could develop software without using the CLI. Almost every developer tool has both a CLI and a GUI. The MySQL database, for example, has a GUI that, as far as I can tell, does everything and is easier to use. "Real coders" prefer typing to using the mouse, but I like pointing and clicking. I'll point out where you can use a GUI instead of the CLI, but you will have to learn the CLI.

## Package managers

To install software packages that runs from the CLI you need a _package manager_. Eventually you'll use three package managers because you'll be using three operating systems (or operating environments):

* Homebrew to install Mac OS X CLI apps.
* Node Package Manager (npm) to install Node back-end JavaScript server apps. A server is like another operating system running in your computer.
* Bower to install front-end JavaScript apps. These apps run on in the browser on a client's computer.

You'll install Bower when we get to the Angular front-end chapter.

### Homebrew

To install Homebrew go to [Homebrew](http://brew.sh) then cut and paste into your terminal the command line that looks like this:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Test if Homebrew installed by typing

```
which brew
```

which should return

```
/usr/local/bin/brew

```

### Advanced Homebrew (you can skip this section now)

Homebrew does more stuff that you don't need to know now. To update to the latest Homebrew:

```
brew update
```

Wait a minute or two while it updates.

To see a list of every software package that Homebrew has installed on your computer:

```
brew list
```

If you're not using a software package it might be a good idea to remove it. A better idea is to make a file where you note every time you install a software package with Homebrew and what the app is for. Then when you run ```brew list``` and have no idea what some of the apps do you can see if they're important.

Homebrew can uninstall software packages:

```
brew uninstall <softwarepackage>
```

Homebrew can tell you which software packages are out of date:

```
brew outdated
```

Get in the habit of starting every week or month with ```brew outdated```.

You can update all your software packages with

```
brew upgrade
```

or upgrade just one software package:

```
brew upgrade <softwarepackage>
```

Finally, there may be a software package that you don't want to update. To _not_ update a software package ever again:

```
brew pin <softwarepackage>
```

## Node and Node Package Manager (npm)

Node is the JavaScript server or back-end. Even if you don't use Node as a server you'll need the Node Package Manager (npm) to install software.

To install Node go to [Nodejs.org] (https://nodejs.org/).

Node Package Manager (npm) is included in Node.

Test if Node is installed: ```node -v```

If you get an ```EACCES``` ("Error: Access") error when installing Node modules then [fix npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

## Bower

[Bower](http://bower.io/) is the package manager for installing front-end apps.

To install Bower from the CLI run the following command:

```
npm install -g bower
```

### Advanced Bower (you can skip this section now)

To install a software package enter at the CLI:

```
bower install <softwarepackage>
```

There are other ways to install software packages. If your directory has a ```bower.json``` file listing project dependencies just run ```bower install```.

You can also install a Git endpoint:

```
bower install git://github.com/user/package.git
```

or install from a URL:

```
bower install http://example.com/script.js
```

## Z Shell (zsh)

A _shell_ adds functionality to the terminal. It autocompletes directory and file names so you only have to type the first few letters. It stores your history of commands so you can go back to repeat a command without retyping. You can also do scripting and other advanced coding that I'm not going to cover.

There are a variety of shells available but the Z shell is one of most commonly used by coders. It's free.

First check if Z shell is already installed and, if so, what version you have:

```
zsh --version
```

As of February 22, 2016 I have version 5.0.8. Your MacBook likely came with an older version of Z shell installed. You can leave it or upgrade to the latest version.

To upgrade to the latest Z shell use the Homebrew package manager:

```
brew install zsh
```

Then recheck the version and you should have the latest.

Next, install _Oh My Zsh_. This is an open-source framework for managing your Z shell, such as checking for updates. It's not required. Go to [Oh My Zsh](http://ohmyz.sh/) then copy and paste the code that looks like

```
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

> The standard for presenting command line code is the start with a ```$```, sometimes in gray, to indicate the command line. Don't copy the ```$```.

## UNIX Commands and Cheatsheet

Print out a UNIX cheatsheet. I like the [FOSSWire](https://rumorscity.com/wp-content/uploads/2014/08/10-Linux-Unix-Command-Cheat-Sheet-021.jpg) cheatsheet.

Make a folder in your laptop bag for cheatsheets.

### File commands

It's important for a software developer to know the following UNIX commands (and more) but for a beginner don't spend too much time memorizing these. If it's easier for you to use the GUI, then use that.

#### pwd and ls

Start by figuring out where you are. In your terminal enter two commands:

```
pwd
```

and

```
ls
```

![Terminal](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/pwd_ls.png)

You should recognize what directory you're in. The picture shows my top-level user directory.

In a GUI you have _folders_. In a CLI you have _directories_. These are the same thing.

#### cd

Let's move into the ```playground``` directory.

```
cd playground
```

The commnd ```cd``` means "change directory". Note that you could type

```
cd play
```

and the Z shell will autocomplete the directory name.

To move up or out of a directory enter

```
cd ..
```

Two dots means "parent directory". One dot means "current directory".

#### touch

The command ```touch <filename>``` creates a file.

#### cat and more

The command ```cat <filename>``` displays a file's contents. ```cat``` is short for _concatenate_ or to join end to end. I learned this as what sailors did to make a long rope, they concatenated several short ropes together.

The command ```more <filename>``` is preferred as it displays the file one page (screen) at a time. You click the spacebar to view the next page.

The command ```cat > <filename>``` opens or creates a file and then you can type into the file. ```control c``` ends input and closes the file. I prefer to use Atom for this.

#### cp

The command ```cp <filename1> <filename2>``` copies a file. I prefer to do this in the GUI.

#### mv

The command ```mv <filename1> <filename2>``` renames (moves) a file. I prefer to do this in the GUI.

#### ls

Enter ```ls``` again and you should see your list of files. ```ls``` means "list".

Enter ```ls -al```. This lists all files including hidden files. Hidden files start with ```.```

The command ```ls -l``` displays more (or _long_) info about the files in a directory, including permissions.

#### mkdir

To make a new directory enter

```
mkdir <directoryname>
```

#### rm

The command ```rm``` removes files and directories. Unlike the GUI, in which you delete folders and files to the Trash folder, the CLI doesn't have a trash folder or an ```undelete``` command. If you remove a file or directory it's gone. You may want to delete files and folders from the GUI into the Trash folder to be safe.

To remove a file enter

```
rm <filename>
```

To remove an empty directory enter

```
rm -r <directoryname>
```

To remove a directory that has files in it I prefer to use the GUI, i.e., use the mouse to drag the directory to the trash. From the CLI you can enter

```
rm -rf <directoryname>
```

That means "remove directory with force". I've heard that ```rm -rf``` without an argument (directory name) will erase all the files in your computer. According to [Wikipedia](https://en.wikipedia.org/wiki/Rm_(Unix)) that's something of an urban legend, based on a grain of truth: "The rm -rf variant of the command, if run by a superuser on the root directory, would cause the contents of nearly every writable mounted filesystem on the computer to be deleted, up to the point the system itself crashes from missing some crucial file, directory, or the like."

Similarly using wildcards with ```rm``` is asking for trouble, e.g., ```rm *.*``` will remove every file in a directory.

### Paths

A path is the unique location of a file or directory in an operating system.

Paths can start with:

* Nothing, e.g., ```directory/subdirectory/file.html```.  This is a _relative path_. It starts in the directory you're in now.
* A slash, e.g., ```/directory/subdirectory/file.html```. This is an _absolute path_, i.e., it starts from the root directory.
* Dot-slash, e.g., ```./directory/subdirectory/file.html```. This is also a _relative path_ starting form the directory you're in now. It's the same as no slash but I recommend using the dot-slash as it's more clear to read.
* Double-dot-slash, e.g., ```../directory/subdirectory/file.html```. This is another _relative path_, starting from the parent directory.

Note that UNIX uses slashes ```/``` but Windows uses backslashes ```\```.

If you get an error message that a resource can't be found, e.g., a jpeg image isn't appearing on your webpage, check if the filename starts with a slash, etc.

A double-slash doesn't mean anything and is interpreted as a single slash. However, in certain systems a pathname that begins with a double-slash can be interpreted to do something. In the Mac OS X a double-slash means nothing. If you're reading documentation for another version of UNIX you might see a path starting with a double-slash.

> Does a double slash mean something in LINUX?

Let's look at an example of a double-dot-slash. Suppose I have two directories, ```front-end``` and ```back-end```. I have a jpeg in ```back-end``` and my JavaScript app is in ```front-end```:

![Terminal](https://github.com/tdkehoe/Learn-To-Code-By-Breaking-Stuff/blob/master/media/directories.png

For my JavaScript app to call my jpeg I would use this path:

```
../back-end/picture.jpg
```

#### Find Your Path

The command ```pwd``` or "print working directory" prints the absolute path to the directory you're in. If you're getting error messages about missing resources, go to the missing resource and get the absolute path, then put that into your code. If that fixes the problem then figure out the relative path. Don't leave an absolute path in your project because if someone clones or forks your project, the path might not work on their system.

## Advanced UNIX (you can skip this now)

#### Adding New Paths

Adding new paths can cause headaches and IMHO should be avoided.

You can see your paths by entering

```
echo $PATH
```

This should list all your paths, separated by colons. Copy and paste this into Atom and split the colons into new lines:

```
/usr/local/bin
/usr/bin
/bin
```

(The Z shell globs your paths together, separated by colons. Other shells split the paths into lines for you.)

These three paths show that UNIX will look, in this order, in the directories ```/usr/local/bin```, ```/usr/bin```, and ```/bin```. I.e., UNIX first looks in ```/usr/local/bin```, then looks in ```/usr/bin```, etc.

The directory name ```bin``` is short for _binary_, i.e., executable files. Paths always end in ```/bin```.

A new software package might require adding a package. For example, the MySQL database might require adding the path ```/usr/local/mysql/bin```. To add a path, edit

Adding or edit paths isn't something beginners should do. If you suspect that you have a path problem, e.g., you're getting error messages that a resource can't be found, ask a senior developer to help you. Chances are the problem is something else and messing with your paths will make things worse.

### Permissions

Permissions can be another headache in UNIX.

To view permissions of the files in a directory:

```
ls -l
```

You'll see ten-character strings like this: ```drwxr-xr-x``` and ```-rw-r--r--```. The first character is the file type: ```d``` means a directory, ```-``` means a file.

The remaining nine characters are three groups of three characters, in this order:

1. User permissions
2. Group permissions
3. World or "other" permissions

The letters mean:

* ```r``` means _read_, or permission to see the file's contents.
* ```w``` means _write_, or permission to alter the file's contents.
* ```x``` means _execute_, or permission to run a file if it's a program.

To change a file or directory's permissions enter

```
chmod <octalnumber> <filename>
```

The octal (base 8) number is the sum of three numbers: read (4), write (2), and execute (1). For example, `chmod 777 myfile` gives the world permission to read, write, and execute your file.

Like paths, modifying permissions, especially for system files, isn't something a beginner should do. In my experience permission problems are rare. If you suspect a permission problem ask a senior developer to help you.

### sudo

The UNIX command ```sudo``` gives you superuser privileges. It requires entering your password. Be careful what you do with ```sudo```.
