// Effects to take a prefetched data feed (JSON, RSS, ATOM, XML)
// and use in your video. In combination with the input effects,
// and a bit of server-side coding, this can yield some interesting
// possibilities.
//
// For all data feeds used by these effects, make sure to include
// them in the `cacophony.preloadData ()` section of your settings
// file.

var datafeed_map_colours = ['#7E2D95', '#E65008', '#5b6c03', '#9d3e62', '#278699', '#cc0101', '#ffd800'],
	datafeed_slideshow_duration = 4,
	datafeed_slideshow_limit = false,
	datafeed_slideshow_cur = 0,
	datafeed_slideshow_n = 0,
	datafeed_slideshow_images = [],
	datafeed_slideshow_front_img,
	datafeed_slideshow_back_img,
	datafeed_slideshow_front_burns,
	datafeed_slideshow_back_burns,
	datafeed_headlines_items = [],
	datafeed_headlines_cur = 0,
	datafeed_headlines_duration = 4,
	datafeed_headlines_limit = false,
	datafeed_headlines_last_y = false;

// Make the calculations for performing the Ken Burns effect on an image
// in the slideshow. Based on the Ken Burns implementation at
// [Adventures in Software](http://adventuresinsoftware.com/blog/?p=209).
function datafeed_slideshow_burns (proportion) {
	proportion = (isNaN (proportion)) ? 1.5 : proportion;
	var burns = {
		_x0: 0,
		_x1: 0,
		_y0: 0,
		_y1: 0,
		_w0: 0,
		_w1: 0,
		_h0: 0,
		_h1: 0,
		apply: function (img, time) {
			time *= .02;
			img.x = (this._x0 - this._x1) * time - this._x0;
			img.y = (this._y0 - this._y1) * time - this._y0;
			img.dWidth = (this._w1 - this._w0) * time + this._w0;
			img.dHeight = (this._h1 - this._h0) * time + this._h0;
		}
	};

	// Choose rectangles based on more constrained dimension.
	if (proportion < cacophony.width / cacophony.height) {
		burns._w0 = cacophony.width * (1 + (.25 * Math.random ()));
		burns._w1 = cacophony.width * (1 + (.25 * Math.random ()));
		burns._h0 = burns._w0 / proportion;
		burns._h1 = burns._w1 / proportion;
	} else {
		burns._h0 = cacophony.height * (1 + (.25 * Math.random ()));
		burns._h1 = cacophony.height * (1 + (.25 * Math.random ()));
		burns._w0 = burns._h0 * proportion;
		burns._w1 = burns._h1 * proportion;
	}

	// Calculate the translation to keep image within window.
	burns._x0 = (burns._w0 - cacophony.width) * Math.random ();
	burns._x1 = (burns._w1 - cacophony.width) * Math.random ();
	burns._y0 = (burns._h0 - cacophony.height) * Math.random ();
	burns._y1 = (burns._h1 - cacophony.height) * Math.random ();

	return burns;
}

// Used by `datafeed_slideshow()` to perform the timeout work.
function datafeed_slideshow_step () {
	if (! cacophony.playing) {
		setTimeout (datafeed_slideshow_step, (cacophony.beatLength () * datafeed_slideshow_duration) / 25);
		return;
	}

	datafeed_slideshow_n++;

	if (datafeed_slideshow_n == 20) {
		datafeed_slideshow_cur++;

		if (datafeed_slideshow_images[datafeed_slideshow_cur]) {
			datafeed_slideshow_front_img = new ImageNode (datafeed_slideshow_images[datafeed_slideshow_cur]);
			datafeed_slideshow_front_burns = datafeed_slideshow_burns (datafeed_slideshow_front_img.width / datafeed_slideshow_front_img.height);
			datafeed_slideshow_front_img.opacity = 0;
			datafeed_slideshow_front_burns.apply (datafeed_slideshow_front_img, -5);
			cacophony.canvas.append (datafeed_slideshow_front_img);
		}
	} else if (datafeed_slideshow_n == 25) {
		cacophony.canvas.remove (datafeed_slideshow_back_img);
		datafeed_slideshow_back_img = datafeed_slideshow_front_img;
		datafeed_slideshow_back_burns = datafeed_slideshow_front_burns;
		if (datafeed_slideshow_back_img) {
			datafeed_slideshow_back_img.opacity = 1;
		}
		datafeed_slideshow_front_img = null;
		datafeed_slideshow_front_burns = null;
		datafeed_slideshow_n = 0;
	} else if (datafeed_slideshow_n > 20) {
		if (datafeed_slideshow_front_img) {
			datafeed_slideshow_front_img.opacity += .2;
			datafeed_slideshow_front_burns.apply (datafeed_slideshow_front_img, datafeed_slideshow_n - 25);
		}
		datafeed_slideshow_back_img.opacity -= .2;
	}

	if (datafeed_slideshow_back_img) {
		datafeed_slideshow_back_burns.apply (datafeed_slideshow_back_img, datafeed_slideshow_n);

		setTimeout (datafeed_slideshow_step, (cacophony.beatLength () * datafeed_slideshow_duration) / 25);
	}
}

// Display a slideshow based on a specified RSS or ATOM feed.
//
// Usage:
//
//     {a:'datafeed_slideshow', d:{
//         url: '/example.rss',
//         duration: 8,
//         limit: 10
//     }}
function datafeed_slideshow (data) {
	if (data) {
		var feed = cacophony.datafeed[data.url];
		var images = feed.childNodes[0].getElementsByTagName ('content');
		datafeed_slideshow_cur = 0;
		datafeed_slideshow_limit = (data.limit) ? data.limit : false;
		datafeed_slideshow_duration = (data.duration) ? data.duration : 4;
		datafeed_slideshow_images = [];
		for (var i = 0; i < images.length; i++) {
			if (datafeed_slideshow_limit && i == datafeed_slideshow_limit) {
				break;
			}
			datafeed_slideshow_images[i] = _i[images[i].getAttribute ('url')];
		}
	}

	datafeed_slideshow_n = 0;
	datafeed_slideshow_back_img = new ImageNode (datafeed_slideshow_images[0]);
	datafeed_slideshow_back_burns = datafeed_slideshow_burns (datafeed_slideshow_back_img.width / datafeed_slideshow_back_img.height);
	datafeed_slideshow_back_img.opacity = 1;
	datafeed_slideshow_back_burns.apply (datafeed_slideshow_back_img, datafeed_slideshow_n);
	cacophony.canvas.append (datafeed_slideshow_back_img);

	datafeed_slideshow_step ();
}

// Display a series of headlines based on a specified RSS or ATOM feed.
//
// Usage:
//
//     {a:'datafeed_headlines', d:{
//         url: '/example.rss',
//         duration: 4,
//         limit: 10
//     }}
function datafeed_headlines (data) {
	if (data) {
		var feed = cacophony.datafeed[data.url];
		datafeed_headlines_items = feed.childNodes[0].getElementsByTagName ('item');
		datafeed_headlines_cur = 0;
		datafeed_headlines_duration = (data.duration) ? data.duration : 4;
		datafeed_headlines_limit = (data.limit) ? data.limit : false;
		datafeed_headlines_last_y = false;
		datafeed_headlines_colour = (data.colour) ? data.colour : 'rgba(102, 102, 102, 1.0)';
	}

	if (! cacophony.playing) {
		setTimeout (datafeed_headlines, cacophony.beatLength () * datafeed_headlines_duration);
		return;
	}

	if (datafeed_headlines_limit && datafeed_headlines_limit <= datafeed_headlines_cur) {
		return;
	}

	if (datafeed_headlines_items[datafeed_headlines_cur]) {
		var txt = $(datafeed_headlines_items[datafeed_headlines_cur]).find ('title')[0].textContent;
		if (! datafeed_headlines_last_y || datafeed_headlines_last_y > (cacophony.height / 2)) {
			datafeed_headlines_last_y = 5 + Math.round (Math.random () * ((cacophony.height / 2) - 5));
		} else {
			datafeed_headlines_last_y = (cacophony.height / 2) + Math.round (Math.random () * (cacophony.height / 2));
		}
		lyrics ({
			txt: txt,
			x: Math.random () * (cacophony.width / 4),
			y: datafeed_headlines_last_y,
			colour: datafeed_headlines_colour
		});

		datafeed_headlines_cur++;

		setTimeout (datafeed_headlines, cacophony.beatLength () * datafeed_headlines_duration);
	}
}

// Display a series of points on a map based on a JSON feed of the
// following form:
//
//     [{lat: 5.432, lng: 5.678},
//      {lat: 1.234, lng: 4:321}]
//
// Usage:
//
//     {a:'datafeed_map_on', d:{
//         url: '/coordinates.json',
//         zoom: 2,
//         lat: 1.0,
//         lng: 0.0
//     }}
//
// Also be sure to include the Google Maps API into your `<head>` as well:
//
//     <script type="text/javascript"
//         src="http://maps.google.com/maps/api/js?sensor=false"></script>

function datafeed_map_on (data) {
	var feed, d, zoom, lat, lng, latlng, options, map, c, opts, circle;
	feed = cacophony.datafeed[data.url];

	d = document.createElement ('div');
	d.setAttribute ('style', 'width: ' + (cacophony.width - 40) + 'px; height: ' + (cacophony.height - 100) + 'px');

	zoom = (data.zoom) ? data.zoom : 2;
	lat = (data.lat) ? data.lat : 1.0;
	lng = (data.lng) ? data.lng : 0.0;

	latlng = new google.maps.LatLng (lat, lng);
	options = {
		zoom: zoom,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		mapTypeControl: false,
		backgroundColor: 'transparent',
		draggable: false,
		scrollwheel: false,
		scaleControl: false,
		navigationControl: false,
		streetViewControl: false
	};
	map = new google.maps.Map (d, options);

	for (var i = 0; i < feed.length; i++) {
		c = datafeed_map_colour ();
		opts = {
			center: new google.maps.LatLng (feed[i].lat, feed[i].lng),
			fillColor: c,
			fillOpacity: 1,
			clickable: false,
			map: map,
			radius: feed[i].count * 10000, // 10km per count
			strokeColor: c,
			strokeOpacity: 1,
			strokeWeight: 1,
			zIndex: 100
		};
		circle = new google.maps.Circle (opts);
		circle.setMap (map);
	}

	cacophony.html (d, 30, 20);
}

// Hide the map.
//
// Usage:
//
//      {a:'datafeed_map_off'}
function datafeed_map_off () {
	cacophony.html ();
}

// Get a random colour for the map circles
function datafeed_map_colour () {
	return datafeed_map_colours[Math.floor (Math.random () * datafeed_map_colours.length)];
}

_e['datafeed_slideshow'] = datafeed_slideshow;
_e['datafeed_headlines'] = datafeed_headlines;
_e['datafeed_map_on'] = datafeed_map_on;
_e['datafeed_map_off'] = datafeed_map_off;
