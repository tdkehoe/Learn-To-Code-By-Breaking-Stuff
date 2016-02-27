# Setting Up Your Computer

## Mac or PC?

Looking around co-working spaces and meetups I see almost everyone using Apple MacBook laptops. Whenever I try to use Windows I end up on the phone with three people in India who can't fix the problem so I'm not going to document software development on a PC. But this is a Wiki so maybe someone else will explain how to set up Windows for developing software.

## Which Mac?

At Galvanize we were required to buy a MacBook no more than one year old but I don't agree with this. A five-year-old MacBook Pro has almost the same specs as this year's MacBook Air and sells for less than half the price. (I'll let someone else write in this Wiki just how old a MacBook can be and still be usable.)

If you buy an older MacBook you should upgrade the memory:

* A solid state drive (SSD) is _way_ faster than a hard drive, especially the low-speed hard drives that used to ship with MacBooks. I have a 251GB SSD and after completing Galvanize I have only 100GB used, so a 120GB SSD would be adequate for learning to code.
* I have 16GB RAM. You can probably get by with 8GB.

Almost everyone buys 13" MacBooks. In my class, three of us had 15" MacBooks with Retina displays, and 22 students had 13" MacBooks with LCD displays. In the co-working space I see about the same ratio.

At home I have two 27" monitors on my desk, plus the 15" MacBook. At Galvanize each classroom had one 24" monitor. I was the only student who used the 24" monitors. I was also the oldest student and the only student wearing bifocals, but Jeff Dean, our Director of Instruction, told us to make our code as large as possible because you're more likely to see bugs. When I code I have:

* Two or three files open in Atom, the text editor where I write code.
* Several terminals windows open, typically one of which is running ```nodemon``` to monitor errors messages from the server, another is running ```mongod``` to monitor errors messages from the database, and a third is the command line interface (CLI) for typing commands.
* A Chrome browser window to see my app and a browser pane for dispalying error messages.
* A Safari browser window displaying documentation such as Mozilla pages.

That's nine windows open. On my 15" laptop I can configure the code editor on the left and the browser on the right, with a little peek at the terminal at the bottom of my screen to alert me of error messages. That's four cramped windows.

What everyone else did was to key ```command-tab``` to display a selection of screens, and then ```tab``` and ```return``` to select a new screen. I find it's mentally taxing to remember one screen while looking at another, and really taxing to remember nine screens. I'd rather have all the screens open next to each other.

If you pair program you will have to have an external monitor. Keying between screens on a 13" monitor will drive your coding partner up the wall. You'll want to look at the terminal while your partner is trying to read the code, etc.

Some MacBooks can't drive two monitors. If you plug in an external monitor they can only do mirror mode, i.e., display the same thing on the laptop and the external monitor.

IMHO I'd rather have an old 15" MacBook and an old 24" monitor than a new 13" MacBook, but most coders don't agree with me.

If you only code from home you could buy a nice big iMac and be done with it. But a MacBook laptop is a better choice because you can go to hackathons, meetups, job interviews, or just code at a coffee shop.

Other than that you just need headphones to listen to videos without annoying people around you. I have pair of noise-canceling headphones for noisy places, and a headset with a good microphone for video conferencing.

### Protect Your MacBook

Buy a plastic cover for your MacBook to protect your investment. I've never found a padded case for my MacBook so I went to Office Depot and bought bubble pack mailing envelopes. I put my MacBook in two mailing envelopes in my backpack to protect it.

## Your _playground_ Folder

Make a folder for your coding work. Call it anything you want. Typical names are _workspace_, _playground_, etc.

## Applications That You Install from the Finder

These apps install like any other Macintosh app.

At Galvanize we used only free, open-source software. There's no need to buy software to learn to code.

At the beginner level IMHO it's better to stick to the simpler apps, as advanced features are unnecessary and confusing. Don't worry about "getting in the habit" of using the wrong apps. After you've mastered one app it's easy to switch to other apps.

### Browser

The Google Chrome browser is the standard for software developers. Chrome includes the Dev Tools for debugging, styling, optimizing, etc.

You should also have Firefox and Safari available to test if your website works and looks the same ("cross-browser compatibility") but 99% of the time you'll be in Chrome.

### Terminal

Your MacBook comes with the Terminal app. It's in the ```Applications > Utilities``` folder.

Some coders prefer terminals with advanced features, such as [iTerm2](https://www.iterm2.com/).

### Text Editor

Coders fight holy wars over which text editor is better. At Galvanize we were required to learn [Atom](https://atom.io/), which is free. I still use it.

[Sublime Text](https://www.sublimetext.com/) is another popular choice. It's shareware, i.e., you can download and use it free but you're asked to pay $70 for a license.

[Vim](http://www.vim.org/) is popular among hard-core developers with excellent typing skills, as there are a zillion keyboard shortcuts. It's free.

[WebStorm](https://www.jetbrains.com/webstorm/) is a JavaScript integrated development environment (IDE). It can run and debug your code. It costs $129. WebStorm is arguably the best choice for a professional developer but IMHO it'll just confuse a beginner, and you can get the same functionality free between Atom and Chrome Dev Tools.

### f.lux (optional)

[f.lux](https://justgetflux.com/) is a free app that turns down the blue light from your monitor at night, changing it to an orange glow that enables your brain to produce melatonin and make you sleepy. I recommend also setting your text editor with a black background at night.

## Typing skills

At Galvanize our instructors told us that typing speed was very important, because all great coders are super fast typists. I type with two fingers 45 words per minute on a good day. 22 weeks into the course the class took a exam in which we had to make a CRUD app in 7.5 hours. We weren't allowed to cut-and-paste code, i.e., we had to key in every character. The app required about 20,000 characters. Not only was I among the half the class that passed the exam, I once one of the first to finish my app, and I had time to add extra features and style it to look nice. I saw no relationship between typing speed and ability to code.
