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
	datafeed_slideshow_images = [],
	datafeed_slideshow_img,
	datafeed_headlines_items = [],
	datafeed_headlines_cur = 0,
	datafeed_headlines_duration = 4,
	datafeed_headlines_limit = false,
	datafeed_headlines_last_y = false;

// Display a slideshow based on a specified RSS or ATOM feed.
// TODO: Ken Burns effect, fade between
//
// Usage:
//
//     {a:'datafeed_slideshow', d:{url: '/example.rss'}}
function datafeed_slideshow (data) {
	if (data) {
		var feed = cacophony.datafeed[data.url];
		datafeed_slideshow_images = feed.childNodes[0].getElementsByTagName ('content');
		datafeed_slideshow_cur = 0;
		datafeed_slideshow_limit = (data.limit) ? data.limit : false;
		datafeed_slideshow_duration = (data.duration) ? data.duration : 4;
	}

	if (! cacophony.playing) {
		setTimeout (datafeed_slideshow, cacophony.beatLength () * datafeed_slideshow_duration);
		return;
	}

	if (datafeed_slideshow_img) {
		cacophony.canvas.remove (datafeed_slideshow_img);
		datafeed_slideshow_img = false;
	}

	if (datafeed_slideshow_limit && datafeed_slideshow_limit <= datafeed_slideshow_cur) {
		return;
	}

	if (datafeed_slideshow_images[datafeed_slideshow_cur]) {
		datafeed_slideshow_img = new ImageNode (_i[datafeed_slideshow_images[datafeed_slideshow_cur].getAttribute ('url')]);
		datafeed_slideshow_img.x = 0;
		datafeed_slideshow_img.y = 0;
		datafeed_slideshow_img.dWidth = cacophony.width;
		datafeed_slideshow_img.dHeight = cacophony.height;
		cacophony.canvas.append (datafeed_slideshow_img);
		datafeed_slideshow_cur++;

		setTimeout (datafeed_slideshow, cacophony.beatLength () * datafeed_slideshow_duration);
	}
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
