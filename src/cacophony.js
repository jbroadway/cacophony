// A tool for creating and viewing interactive videos, especially
// music videos, using HTML5 and Javascript. Interactive elements
// include visuals/story adapting in response to user input as
// text, mouse movement, drawings, and choices (choose-your-own-
// adventure).
//
// Input from the viewer can affect the subsequent video, and also
// be sent to a server for integration with other web applications
// (social networking, sharing, geotagging), which is possible
// because the video is rendered on-the-fly in the browser, not
// pre-rendered like traditional video. Input can also come from
// external sources (RSS, JSON), so you can integrate external
// data, or previously generated data, back into subsequent
// views of the video.
//
// New effects can be written in Javascript, and several frameworks
// are already integrated into existing effects, including:
//
// * [Cake.js](http://code.google.com/p/cakejs/)
// * [ContextFree.js](http://code.google.com/p/contextfree/)
// * [Harmony](http://mrdoob.com/projects/harmony/)
// * [Three.js](http://github.com/mrdoob/three.js/)
// * [jQuery](http://jquery.com/)
//
// The basic elements of a Cacophony video are:
//
// * An HTML5 Video on the base layer
// * A series of HTML5 Canvas layers above that
// * A timeline of effects to be triggered to the beat of the song
//   (see `js/story.js`)
// * Images to be used by the actions
// * EQ data for the song (see `eq_data` below on generating this data)
//
// The official homepage of Cacophony is [www.cacophonyjs.com](http://www.cacophonyjs.com/).
//
// Copyright 2010, [Johnny Broadway](http://www.johnnybroadway.com/).
// Released under the [GPL Version 2](http://opensource.org/licenses/gpl-2.0.php) license.
//
// ### Usage
//
// **Step 1:** Include the scripts and stylesheet in your `<head>`:
//
//     <script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
//     <script type="text/javascript" src="js/cacophony.min.js"></script>
//     <script type="text/javascript" src="js/settings.js"></script>
//     <script type="text/javascript" src="js/story.js"></script>
//     <link rel="stylesheet" type="text/css" href="css/cacophony.min.css" />
//
// **Step 2:** Create an element like this in your page, note the ID must be 'cacophony':
//
//     <div id="cacophony"></div>
//
// **Step 3:** Add the following script to your web page:
//
//     <script type="text/javascript">
//     $(document).ready (function () {
//         cacophony.init ();
//     });
//     </script>
//
// **Step 4:** Copy the `build/settings.js` and `build/story.js` files into your site
// and follow the instructions found in each.
//
// You can also refer to the `examples/demo.html` file for a complete example, including a
// functioning storyline, and callbacks for integrating the player into your page
// in various ways.
//
// ### API Reference

// Declare a global cacophony object in a closure, passing it the
// jQuery object.
var cacophony = (function ($) {
	var c = {},
		wrapper, wrapper_id, song, video, canvas_id, paper, html,
		started = false,
		width = 854,
		height = 480,
		w = Math.floor (width / 128),
		scale = 32,
		play = false,
		time = 0,
		bpm = 120,
		fader = false,
		fader_opacity = 1.0,
		beat_length = 500,
		interval_length = 125,
		beat = 0,
		new_beat = false,
		new_time = false,
		on_beat = false,
		beats = [],
		key = 'c',
		eq, bg, bg2,
		start_time = false,
		is_playable = false,
		percent = 0,
		bg_initial_fill = 'rgba(227, 234, 234, 1)',
		ipad = navigator.userAgent.match (/iPad/i),
		iphone = navigator.userAgent.match (/iPhone|iPod/i),
		intervals = [],
		eq_data = [],
		videos = [],
		mousemove = [],
		codecs = {
			mp4: "video/mp4; codecs='avc1.42E01E, mp4a.40.2'",
			webm: "video/webm; codecs='vp8, vorbis'",
			ogv: "video/ogg"
		};

	// The Cake.js canvas object for the first layer.
	c.canvas;

	// The jQuery object for the wrapper div.
	c.wrapper;

	// The ID of the wrapper div (defaults to "cacophony" and some effects
	// assume this will be left as-is).
	c.id;

	// Width of the video (use `cacophony.setWidthHeight(w, h)` to modify).
	c.width = 854;

	// Height of the video (use `cacophony.setWidthHeight(w, h)` to modify).
	c.height = 480;

	c.w = Math.floor (width / 128);
	c.scale = 32;
	c.bg;
	c.bg2;

	// The current beat of the song.
	c.beat = 0;

	// The EQ data for the current beat.
	c.eq;

	// Whether the video is currently playing or not.
	c.playing = false;

	// Stops reading keyboard input while an effect is accepting input.
	c.input = false;

	// The current x position of the mouse, for plugins looking to react
	// to mouse movements.
	c.mousex = 427;

	// The current y position of the mouse, for plugins looking to react
	// to mouse movements.
	c.mousey = 240;

	// The list of preloaded images, available to effects via:
	//
	//     _i['file.png']
	c.preloaded_images = {
		context:null,
		ribbon:null
	};

	// Whether to allow iPad playback. Off by default because many
	// interactive elements are too processor intensive for the iPad.
	c.enable_ipad = false;

	// Callback functions for certain actions (e.g., play, pause, etc.).
	// Register a callback via:
	//
	//     cacophony.callback.loading = function (percent) {
	//         // your code here
	//     }
	c.callback = {
		browser_check: false,
		loading: false,
		ready: false,
		play: false,
		pause: false,
		timeupdate: false,
		ended: false
	};

	// This is a list of effects available as actions to a video's story.
	// They are simply references to functions. To add new ones, use:
	//
	//     _e['my_effect'] = function (data) {
	//         // your code here
	//     }
	c.effects = [];

	// This is a list of actions to perform on each beat. For example:
	//
	//     _s[3] = [
	//         {a:'lyrics', d: {txt: "Show this text", x: 50, y: 50}},
	//         {a:'skyline_on'}
	//     ];
	//
	// a is the action, d is the data to pass to it.
	c.story = [];

	// EQ data for each beat. An array of objects of the form:
	//
	//     {b:0, e:[0.5,0.24,...]}
	//
	// * `b` is the beat number
	// * `e` is an array of 256 numeric values
	//
	// I originally used the [SoundManager 2](http://www.schillmania.com/projects/soundmanager2/) API to retrieve this data
	// from Flash, then reduced it to only the data for each down
	// beat, since Flash provided way more data than I needed or was
	// feasible to include in a Javascript file.
	c.eq_data = [];

	// A list of data available to effects, fetched prior to the video
	// starting to play. Access data from individual feeds via:
	//
	//     cacophony.datafeed[my_url];
	//
	// JSON feeds will be parsed into JSON objects, and XML/RSS/ATOM
	// feeds will be parsed into XML documents.
	c.datafeed = {};

	// Has the video ended.
	c.ended = false;

	// Duration of the video. Available after loading is complete.
	c.duration = false;

	// Sets the list of videos to play. It's a list so you can
	// specify multiple formats.
	c.setVideo = function () {
		videos = arguments;
	}

	// Determine the codec to use.
	c.codec = function (vid) {
		if (vid.match (/\.(mp4|m4v)$/i)) {
			return codecs.mp4;
		} else if (vid.match (/\.webm$/i)) {
			return codecs.webm;
		} else if (vid.match (/\.(ogv|ogg|ogm)$/i)) {
			return codecs.ogv;
		}
		return '';
	}

	// on is either a specific layer (0 through 4) or an array
	// specifying the visibility of each layer, e.g.,
	// `[1, 1, 0, 0, 0]`. If it is a number, it always shows
	// that layer. To hide a single layer, use `cacophony.hide (n)`.
	c.visible = function (on) {
		if ($.isArray (on)) {
			if (! on[0]) {
				$('#cacophony-video').hide ();
			} else {
				$('#cacophony-video').show ();
			}
			if (! on[1]) {
				$('#cacophony-canvas1').hide ();
			} else {
				$('#cacophony-canvas1').show ();
			}
			if (! on[2]) {
				$('#cacophony-canvas2').hide ();
			} else {
				$('#cacophony-canvas2').show ();
			}
			if (! on[3]) {
				$('#cacophony-canvas3').hide ();
			} else {
				$('#cacophony-canvas3').show ();
			}
			if (! on[4]) {
				$('#cacophony-canvas4').hide ();
			} else {
				$('#cacophony-canvas4').show ();
			}
		} else {
			if (on == 0) {
				$('#cacophony-video').show ();
			} else if (on == 1) {
				$('#cacophony-canvas1').show ();
			} else if (on == 2) {
				$('#cacophony-canvas2').show ();
			} else if (on == 3) {
				$('#cacophony-canvas3').show ();
			} else if (on == 4) {
				$('#cacophony-canvas4').show ();
			}
		}
	}

	// Hide the specified layer (0 through 4).
	c.hide = function (off) {
		if (off == 0) {
			$('#cacophony-video').hide ();
		} else if (off == 1) {
			$('#cacophony-canvas1').hide ();
		} else if (off == 2) {
			$('#cacophony-canvas2').hide ();
		} else if (off == 3) {
			$('#cacophony-canvas3').hide ();
		} else if (off == 4) {
			$('#cacophony-canvas4').hide ();
		}
	}

	// Pause the song.
	c.pause = function () {
		button = $('#cacophony-play').blur ();

		song.pause ();
		c.clearIntervals ();
		play = false;
		c.playing = false;
		button.html ('<span title="Play" style="font-size: 20px">&#x2023;<' + '/span>');

		if (c.callback.pause) {
			return c.callback.pause ();
		}
		return false;
	}

	// Play the song.
	c.play = function (callback) {
		if (! is_playable) {
			return false;
		}

		if (c.ended) {
			c.ended = false;
			beat = 0;
			song.currentTime = 0;
		}

		button = $('#cacophony-play').blur ();
		started = true;

		song.play ();
		c.setIntervals ();
		play = true;
		c.playing = true;
		button.html ('<span title="Pause">||<' + '/span>');

		if (c.callback.play) {
			return c.callback.play ();
		}
		return false;
	}

	// Play/pause toggle.
	c.playPause = function () {
		if (play) {
			return c.pause ();
		} else {
			return c.play ();
		}
	}

	// Check the status of the video as it's loading.
	c.loading = function () {
		if (ipad) {
			percent += Math.round (Math.random () * 5 + 1);
			if (percent >= 100) {
				is_playable = true;
				c.duration = song.duration;
				if (c.callback.ready) {
					return c.callback.ready ();
				}
			} else {
				if (c.callback.loading) {
					c.callback.loading (percent);
				}
				setTimeout (c.loading, Math.round (Math.random () * 6 + 2) * 100);
			}
			return;
		}

		if (song.readyState == 4 || ($.browser.mozilla && song.readyState >= 2) || ($.browser.msie && song.readyState >= 3)) {
			is_playable = true;
			c.duration = song.duration;
			if (c.callback.ready) {
				return c.callback.ready ();
			}
		} else {
			try {
				percent = parseInt ((song.buffered.end (song.buffered.length - 1) / song.duration) * 100);
				if (c.callback.loading) {
					c.callback.loading (percent);
				}
			} catch (ex) {
			}
			setTimeout (c.loading, 250);
		}
	}

	// Initialize everything.
	c.init = function () {
		id = 'cacophony';
		wrapper = $('#cacophony');
		wrapper_id = id;
		c.wrapper = wrapper;
		c.id = wrapper_id;

		sources = '';
		for (var i = 0; i < videos.length; i++) {
			sources += '<source src="' + videos[i] + '" type="' + c.codec (videos[i]) + '" />';
		}

		wrapper.html (
			'<div id="cacophony-duration"><div id="cacophony-play" onclick="return cacophony.playPause (this)"><span title="Pause">||</span></div><span id="cacophony-time">0:00</span></div>' +
			'<div id="cacophony-video-wrapper"><video id="cacophony-video" width="' + width + '" height="' + height + '" style="z-index: 2; margin: 0px; padding: 0px">' + sources + '</video></div>' +
			'<div id="cacophony-canvas1" style="width:' + width + 'px; height:' + height + 'px; z-index: 3; margin: 0px; padding: 0px; margin-top: -' + (height + 2) + 'px; border: 1px solid transparent"></div>' +
			'<div id="cacophony-canvas2" style="display: none; width:' + width + 'px; height:' + height + 'px; z-index: 4; margin: 0px; padding: 0px; margin-top: -' + (height + 2) + 'px; border: 1px solid transparent"></div>' +
			'<div id="cacophony-canvas3" style="display: none; width:' + width + 'px; height:' + height + 'px; z-index: 5; margin: 0px; padding: 0px; margin-top: -' + (height + 2) + 'px; border: 1px solid transparent"></div>' +
			'<div id="cacophony-canvas4" style="display: none; width:' + width + 'px; height:' + height + 'px; z-index: 6; margin: 0px; padding: 0px; margin-top: -' + (height + 2) + 'px; border: 1px solid transparent"></div>'
		);

		// Browser checking.
		var browser_msg = 'This video is processor intensive. Please shut down other programs and close unnecessary browser tabs to ensure the best viewing experience. Thanks!',
			browser_compat = true;

		if ($.browser.msie && $.browser.version < '9.0') {
			browser_msg = 'This video requires the Google Chrome Frame browser plugin in order to work in Internet Explorer 6, 7, or 8. Please <a href="http://google.com/chromeframe" target="_blank">install the plugin here</a>, or use one of the following browsers to view this video:'
				+ '<ul><li><a href="http://www.google.com/chrome">Chrome</a></li>'
				+ '<li><a href="http://www.apple.com/safari/">Safari</a></li>'
				+ '<li><a href="http://www.mozilla.com/firefox/">Firefox</a></li></ul>';
			browser_compat = false;
		} else if ($.browser.mozilla && $.browser.version < '1.9.2') {
			browser_msg = 'This video requires a newer version of the Firefox browser in order to work. Please <a href="http://www.mozilla.com/firefox/" target="_blank">install the latest version here</a>.';
			browser_compat = false;
		} else if (! c.enable_ipad && (iphone || ipad)) {
			browser_msg = 'This video requires more processing power than is currently available on the iPad, iPhone, or iPod touch. Please use a computer with one of the following browsers to view this video:'
				+ '<ul><li><a href="http://www.google.com/chrome">Chrome</a></li>'
				+ '<li><a href="http://www.apple.com/safari/">Safari</a></li>'
				+ '<li><a href="http://www.mozilla.com/firefox/">Firefox</a></li></ul>';
			browser_compat = false;
		}
		if (c.callback.browser_check) {
			c.callback.browser_check (browser_msg, browser_compat);
		}

		if (! browser_compat) {
			return;
		}

		song = $('#cacophony-video').get (0);
		song.load ();

		paper = new Canvas ($('#cacophony-canvas1').get (0), width, height);
		canvas_id = paper.canvas.getAttribute ('id');
		c.canvas = paper;

		bg = new Rectangle (width, height);
		bg.x = 0;
		bg.y = 0;
		bg.fill = bg_initial_fill;
		paper.append (bg);
		c.bg = bg;

		bg2 = new Rectangle (width, height);
		bg2.x = 0;
		bg2.y = 0;
		bg2.fill = 'rgba(27, 1, 1, 0)';
		paper.append (bg2);
		c.bg2 = bg2;

		setTimeout (c.loading, 250);

		$('#cacophony-video').bind ('timeupdate', function () {
			c.displayTime ();
			if (c.callback.timeupdate) {
				return c.callback.timeupdate (song.currentTime);
			}
		});

		$('#cacophony-video').bind ('ended', function () {
			c.pause ();
			c.ended = true;
			if (c.callback.ended) {
				return c.callback.ended ();
			}
		});

		// Set the main loop in motion.
		setInterval (function () {
			c.downBeat (song.currentTime * 1000);
		}, (beat_length * 1000) / 20);

		// Set keyboard play/pause access.
		$(document).keydown (function (evt) {
			if (! c.input && evt.keyCode == 32) {
				c.playPause ();
			}
		});

		// Handle mouse-based effects.
		$('#cacophony').mousemove (function (e) {
			cacophony.mousex = e.pageX - this.offsetLeft;
			cacophony.mousey = e.pageY - this.offsetTop;
			if (cacophony.playing) {
				for (var i = 0; i < mousemove.length; i++) {
					mousemove[i] ();
				}
			}
		});
	}

	// Register functions to be called on mousemove for your
	// effect. Functions should refer to the mouse position via
	// `cacophony.mousex` and `cacophony.mousey`.
	c.mousemove = function (f) {
		mousemove.push (f);
	}

	// Update the clock. Called `onTimeUpdate` from the `<video>`.
	c.displayTime = function () {
		var ns = song.currentTime,
			min = Math.floor (ns / 60),
			sec = Math.ceil (ns - (min * 60)),
			new_time;

		if (sec == 60) {
			min++;
			sec = 0;
		}
		new_time = min + ':' + (sec < 10 ? '0' + sec : sec);
		if (new_time != time) {
			time = new_time;
			$('#cacophony-time').html (time);
		}
	}

	// This is the main loop.
	c.downBeat = function (s) {
		if (! started || ! play) {
			return false;
		}

		if (beats[beat] && s < beats[beat]) {
			return false;
		}

		on_beat = true;
		c.beat = beat;

		if (c.eq_data[beat]) {
			bn = c.eq_data[beat]; // Get the next `eq_data` value.
			eq = bn.e;
			c.eq = eq;
		} else {
			eq = [];
			c.eq = [];
		}

		if (c.story[beat]) {
			for (var i = 0; i < c.story[beat].length; i++) {
				if (c.story[beat][i].d) {
					c.effects[c.story[beat][i].a] (c.story[beat][i].d);
				} else {
					c.effects[c.story[beat][i].a] ();
				}
			}
		}

		// Wait for the effects on this beat to finish before jumping.
		// TODO: Find a way to make this sound smooth.
		if (new_beat !== false) {
			song.currentTime = song.currentTime + ((new_beat - beat) * beat_length);
			beat = Math.ceil (new_beat);
			new_beat = false;
			new_time = false;
			c.downBeat (song.currentTime);
			return;
		}

		beat++;

		on_beat = false;
	}

	// Converts seconds to beats.
	c.timeToBeat = function (s) {
		return Math.floor (s / beat_length);
	}

	// Jump to the specified beat of the song. Actually tells `c.downBeat()`
	// to do this after the effects of the current beat are finished.
	c.jumpTo = function (b) {
		if (! play) {
			c.play ();
		}
		new_beat = b;
		new_time = false;
	}

	// Jump to the specified point in the song by seconds instead of beat.
	// Useful for implementing a visual scrubber using the timeupdate callback.
	// Unlike `c.jumpTo()`, this method allows you to control whether to resume
	// playback after the jump, and the default is not to resume playback.
	// `c.jumpToTime()` also doesn't wait for the next beat to finish, unless
	// the beat is in progress, since it would also be called outside of the
	// story.
	c.jumpToTime = function (s, play_if_paused) {
		if (! play && play_if_paused) {
			c.play ();
		}
		new_time = s;
		new_beat = c.timeToBeat (s);
		if (on_beat) {
			return;
		}
		song.currentTime = new_time;
		beat = new_beat;
		new_beat = false;
		new_time = false;
		c.downBeat (song.currentTime);
	}

	// Renders the specified html into the canvas (`#cacophony-canvas1`).
	// Top and left are the optional margins. Default values for these are:
	// * `(cacophony.height * .65 / 2) - 20`
	// * `(cacophony.width * .4 / 2) - 20`
	c.html = function (htm, top, left) {
		if (! htm) {
			cacophony.canvas.remove (html);
			html = false;
		} else {
			var margin_top, margin_left;

			if (html) {
				cacophony.canvas.remove (html);
				html = false;
			}

			margin_top = (top != null) ? top : (c.height - (c.height * .35)) / 2 - 20;
			margin_left = (left != null) ? left : margin_left = (c.width - (c.width * .6)) / 2 - 20;
			
			html = new ElementNode (E('div', htm), {
				x: margin_left,
				y: margin_top,
				noScaling: true
			});
			html.element.setAttribute ('id', 'cacophony-html');
			c.canvas.append (html);
			return html;
		}
	}

	// Set the key signature of the music.
	c.setKey = function (k) {
		key = k;
	}

	// Set the width and height of the player. Default is `854x480`.
	c.setSize = function (wid, h) {
		width = wid;
		height = h;
		w = Math.floor (width / 128);
		c.width = width;
		c.height = height;
		c.w = w;
	}

	// Set the volume of the audio.
	c.setVolume = function (v) {
		if (v < 0) {
			v = 0;
		} else if (v > 1) {
			v = 1;
		}

		if (v == 0) {
			song.muted = true;
		} else {
			song.volume = v;
			if (song.muted) {
				song.muted = false;
			}
		}
	}

	// Get the volume of the audio.
	c.getVolume = function () {
		return song.volume;
	}

	// Set the beats-per-minute of the music.
	c.setBPM = function (bpm) {
		bpm = bpm;
		beat_length = 60 / bpm;
		interval_length = beat_length / 4;
		var until = beat_length * (bpm * 60 * 8);
		beats = [];
		for (var b = 0; b <= until; b += beat_length) {
			beats.push (b * 1000);
		}
	}

	// Get the beat length/duration in miliseconds.
	c.beatLength = function () {
		return beat_length * 1000;
	}

	// Preload a list of data feeds for use in the video (JSON, RSS, ATOM, XML).
	c.preloadData = function () {
		for (var i = 0; i < arguments.length; i++) {
			$.ajax ({
				url: arguments[i],
				success: function (data) {
					c.datafeed[$(this)[0].url] = data;
	
					// Try to preload any images in the data
					try {
						// Preload media:content tags for XML
						var images = data.getElementsByTagName ('content');
						for (var j = 0; j < images.length; j++) {
							if (images[j].getAttribute ('type').match (/^image\//)) {
								c.preloadImages (images[j].getAttribute ('url'));
							}
						}
						// Preload img tags for html
						images = data.getElementsByTagName ('img');
						for (var j = 0; j < images.length; j++) {
							c.preloadImages (images[j].getAttribute ('src'));
						}
					} catch (ex) {}
				},
				error: function (xhr, s, e) {
					/*console.log (s);
					console.log (e);*/
				}
			});
		}
	}

	// Preload a list of images for use in the video.
	c.preloadImages = function () {
		for (var i = 0; i < arguments.length; i++) {
			if (! c.preloaded_images[arguments[i]]) {
				c.preloaded_images[arguments[i]] = document.createElement ('img');
				c.preloaded_images[arguments[i]].src = arguments[i];
			}
		}
	}

	// Register a function to be managed on play/pause. To be used in
	// place of `setInterval()`.
	c.addInterval = function (k, ms) {
		intervals.push ({f: k, t: false, m: ms});
	}

	// Starts interval-based functions on play.
	c.setIntervals = function () {
		for (var i = 0; i < intervals.length; i++) {
			intervals[i].t = setInterval (intervals[i].f, intervals[i].m);
		}
	}

	// Stops interval-based functions on pause.
	c.clearIntervals = function () {
		for (var i = 0; i < intervals.length; i++) {
			clearInterval (intervals[i].t);
		}
	}

	return c;
}(jQuery));

// Create aliases to shorten references in effects and settings.
_c = cacophony;
_s = cacophony.story;
_e = cacophony.effects;
_i = cacophony.preloaded_images;
