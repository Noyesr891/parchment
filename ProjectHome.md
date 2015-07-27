# The Parchment homepage has moved #
**Please go to https://github.com/curiousdannii/parchment**

Parchment is a web interactive fiction interpreter powered by the Gnusto and Quixe engines. Using bleeding-edge Javascript technologies it aims to be a high-performance site that you'll love sharing with your friends!

Particular areas of interest for the project include:

  * **Typography**.  This is a significant part of experiencing any work of fiction, interactive or not.  HTML and CSS easily provide far more flexibility in this realm than any desktop technology, which makes the web a natural fit for a Z-machine interpreter.  Authors of interactive fiction should be able to specify a CSS style sheet for their work in a way that allows the typesetting to honor the content in the best possible way.

  * **Speed**.  Parchment is powered by Thomas Thurman's [Gnusto](http://gnusto.org) engine, which uses just-in-time compilation to speed up the processing of z-code.  Coupled with advances in Javascript performance made by modern browsers, Parchment should be able to run at a reasonable speed on any system.

  * **Someday: Full offline support**.  Cutting-edge browser features make it possible for Parchment to be used offline just like any desktop-based Z-machine interpreter.  For instance, [DOM Storage](http://developer.mozilla.org/en/docs/DOM:Storage) is used to save and load games.  The entire Parchment application requires no dynamic server-side code and is transparently cached for offline use by the browser.  It should also be possible to load Z-files from the user's hard drive while the user is offline, and to use [data: URIs](http://en.wikipedia.org/wiki/Data:_URI_scheme) to allow the user to save a [Quetzal-formatted saved game](http://www.inform-fiction.org/zmachine/standards/quetzal/) or a transcript file to their disk if they so choose.

  * **Simplicity**.  Parchment aims to have a user interface that "just works", and which gets out of the player's way so they can be fully immersed in the work.  Instead of using a screen-based model, Parchment--true to its name and its medium--adopts a page-based model for user interaction, which lends itself to a very natural scroll-back mechanism.  Parchment also employs visual cues such as fading and smooth-scrolling effects where it can to ease transitions.

  * **Shareability**.  One of the most powerful advantages of the web is that it's incredibly easy to share things with people.  Allowing someone to experience an immersive work of interactive fiction with the click of a hyperlink drastically lowers the bar to entry for players and improves an author's ability to reach new audiences.  This is especially true when compared to the current paradigm which requires players to go through a relatively arduous task of finding a Z-machine interpreter for their operating system, downloading and installing it, and then downloading a z-file and opening it with an interpreter.  It should be possible not only to share z-files, but also saved games, which would, among other things, ease the beta testing period for authors.

  * **Extensibility and reuse**. Embedding Parchment in web applications also creates a plethora of interesting use cases, such as an online version of the [Inform](http://www.inform-fiction.org/I7/Inform%207.html) development environment.  Extending Parchment to allow players to collaboratively play through a game online is another interesting possibility.  Parchment should also be decoupled enough from the specifics of the Z-machine architecture to allow it to be used as a [Glk-like frontend](http://www.eblong.com/zarf/glk/) for any interactive fiction engine. (Maybe... it is more likely we will develop a UI system that is a superset of the Z-Machine UI and Glk.)

Of course, not all of these goals are currently being met; it's more like an interesting vision of what the future could be like.

## Playing Stories with Parchment ##

You can see Parchment in action by playing any z-based work on The Interactive Fiction Archive at [iplayif.com](http://iplayif.com/).

## Distributing Your Stories with Parchment ##

Playing and distributing your own stories using Parchment is easy!  Just create a z-code file using software like [Inform](http://inform7.com/), then upload it to a web server and [follow these instructions](http://parchment.googlecode.com/svn/trunk/zcode.html).

## Browser Compatibility ##

Parchment is known to work in Chrome, Firefox, Safari, Opera 9.5+, and Internet Explorer 8+.