# Cacophony

A tool for creating and viewing interactive videos, especially
music videos, using HTML5 and Javascript. Interactive elements
include visuals/story adapting in response to user input as
text, mouse movement, drawings, and choices (choose-your-own-adventure).

Input from the viewer can affect the subsequent video, and also
be sent to a server for integration with other web applications
(social networking, sharing, geotagging), which is possible
because effects are rendered on-the-fly in the browser, not
pre-rendered like traditional video. Input can also come from
external sources (RSS, JSON), so you can integrate external
data, or previously generated data, back into subsequent
views of the video.

New effects can be written in Javascript, and several frameworks
are already integrated into existing effects, including:

* [Cake.js](http://code.google.com/p/cakejs/)
* [ContextFree.js](http://code.google.com/p/contextfree/)
* [Harmony](http://mrdoob.com/projects/harmony/)
* [Three.js](http://github.com/mrdoob/three.js/)
* [jQuery](http://jquery.com/)

The basic elements of a Cacophony video are:

* An HTML5 Video on the base layer
* A series of HTML5 Canvas layers above that
* A timeline of effects to be triggered to the beat of the song
* Images and other elements to be used by the effects

The official homepage of Cacophony is [www.cacophonyjs.com](http://www.cacophonyjs.com/).

Copyright 2010, [Johnny Broadway](http://www.johnnybroadway.com/).
Released under the [GPL Version 2](http://opensource.org/licenses/gpl-2.0.php) license.

### Download/Links

* [Releases](http://github.com/jbroadway/cacophony/downloads)
* [Source](http://github.com/jbroadway/cacophony)
* [Google Group](http://groups.google.com/group/cacophonyjs)
* [Bug Reports](http://github.com/jbroadway/cacophony/issues)

### Usage

**Step 1:** Include the scripts and stylesheet in your `<head>`:

    <script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="js/cacophony.min.js"></script>
    <script type="text/javascript" src="js/settings.js"></script>
    <script type="text/javascript" src="js/story.js"></script>
    <link rel="stylesheet" type="text/css" href="css/cacophony.min.css" />

**Step 2:** Create an element like this in your page, note the ID must be 'cacophony':

    <div id="cacophony"></div>

**Step 3:** Add the following script to your web page:

    <script type="text/javascript">
    $(document).ready (function () {
        cacophony.init ();
    });
    </script>

**Step 4:** Copy the `build/settings.js` and `build/story.js` files into your site
and follow the instructions found in each.

You can also refer to the `examples/demo.html` file for a complete example, including a
functioning storyline, and callbacks for integrating the player into your page
in various ways.

### Examples

* [Basic demo](http://www.cacophonyjs.com/examples/demo.html)
* [Branching/looping video](http://www.cacophonyjs.com/examples/branching.html)
* [Embedded advertising](http://www.cacophonyjs.com/examples/advertising.html)
* [Embedded ContextFree.js](http://www.cacophonyjs.com/examples/context.html)
* [Embedded Harmony ribbon pen](http://www.cacophonyjs.com/examples/ribbon.html)
* [Embedded Three.js](http://www.cacophonyjs.com/examples/three.html)
* [Input with autocomplete](http://www.cacophonyjs.com/examples/autocomplete.html)
* [Parallax effect](http://www.cacophonyjs.com/examples/parallax.html)
* [Slideshow from Flickr](http://www.cacophonyjs.com/examples/datafeed.html)
* [Sparkles](http://www.cacophonyjs.com/examples/sparkles.html)
* [Time scrubber](http://www.cacophonyjs.com/examples/scrubber.html)

### Tutorials

* [Customizing the player](http://www.cacophonyjs.com/tutorials/customizing.html)
* [Writing a custom effect](http://www.cacophonyjs.com/tutorials/effects.html)

### API Documentation

* [Cacophony](http://www.cacophonyjs.com/docs/cacophony.html)
* [Settings](http://www.cacophonyjs.com/docs/settings.html)
* [Story](http://www.cacophonyjs.com/docs/story.html)
* Built-in effects:
  * [Core](http://www.cacophonyjs.com/docs/core.html)
  * [Circles](http://www.cacophonyjs.com/docs/circles.html)
  * [Context](http://www.cacophonyjs.com/docs/context.html)
  * [Cube](http://www.cacophonyjs.com/docs/cube.html)
  * [Datafeed](http://www.cacophonyjs.com/docs/datafeed.html)
  * [Flicker](http://www.cacophonyjs.com/docs/flicker.html)
  * [Input](http://www.cacophonyjs.com/docs/input.html)
  * [Lyrics](http://www.cacophonyjs.com/docs/lyrics.html)
  * [Ribbon](http://www.cacophonyjs.com/docs/ribbon.html)
  * [Slideshow](http://www.cacophonyjs.com/docs/slideshow.html)
  * [Sparkles](http://www.cacophonyjs.com/docs/sparkles.html)
  * [Skyline](http://www.cacophonyjs.com/docs/skyline.html)
  * [Three](http://www.cacophonyjs.com/docs/three.html)
  * [Volume](http://www.cacophonyjs.com/docs/volume.html)

### Compatibility

Cacophony is compatible with the following browsers:

* Firefox 3.6+
* Safari 5+
* Google Chrome 7+
* Opera 10.6+
* Internet Explorer 9
* Internet Explorer 6, 7, 8 through the Google Chrome Frame plugin

The core player is also compatible with iOS 4.2+ devices, however some
effects will render videos unplayable on current iOS devices (iPhone 4G,
original iPad). As such, iOS support is disabled by default, but can be
enabled in your `settings.js` file with the following setting change:

    cacophony.enable_ipad = true;

-----

Brought to you by [Johnny Broadway](http://www.johnnybroadway.com/)
