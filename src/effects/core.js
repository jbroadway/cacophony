// A variety of basic effects to control player flow, modify the
// background colour of the video, and jump to different points
// in the video.

// Set the background colour of the bottom canvas layer (above the video layer).
//
// Usage:
//
//     {a:'bg_colour', d:{colour: '#eee'}}
function bg_colour (data) {
	cacophony.bg.fill = data.colour;
	$('#wrapper').css ('background-color', data.colour);
}

// Fade the background colour of the bottom canvas layer (above the video layer).
// Colour must be specified as `rgba()` with `%d` for the alpha value.
//
// Usage:
//
//     {a:'bg_fade_to', d:{colour: 'rgba(123, 123, 123, %d)'}}
function bg_fade_to (data, alpha) {
	if (! alpha) {
		alpha = 0.1;
	}

	if (! cacophony.playing) {
		setTimeout ('bg_fade_to ({colour: "' + data.colour + '"}, ' + alpha + ')', cacophony.beatLength () / 12);
		return;
	}

	cacophony.bg2.fill = data.colour.replace ('%d', alpha);
	if (alpha >= 0.98) {
		cacophony.bg.fill = data.colour.replace ('%d', 1);
		cacophony.bg2.fill = 'rgba(27, 1, 1, 0)';
		return;
	}
	setTimeout ('bg_fade_to ({colour: "' + data.colour + '"}, ' + (alpha + 0.1) + ')', cacophony.beatLength () / 12);
}

// Fade in, revealing the underlying video and ending with the background
// of the bottom canvas set to alpha 0.
//
// Usage:
//
//     {a:'bg_fade_in'}
function bg_fade_in (op) {
	if (! op) {
		op = 10;
	} else {
		op -= 1;
	}

	if (! cacophony.playing) {
		setTimeout ('bg_fade_in (' + op + ');', 53);
		return;
	}

	if (! f) {
		f = new Rectangle (cacophony.width, cacophony.height);
		f.x = 0;
		f.y = 0;
	}

	f.fill = 'rgba(27, 1, 1, ' + (op / 10) + ')';
	cacophony.canvas.append (f);

	cacophony.bg.fill = 'rgba(27, 1, 1, 0)';

	if (op > 0) {
		setTimeout ('bg_fade_in (' + op + ');', 53);
	} else {
		cacophony.canvas.remove (f);
		f = false;
	}
}

// Fade to black, hiding the underlying video.
//
// Usage:
//
//     {a:'bg_fade_out'}
function bg_fade_out (op) {
	if (! op) {
		op = 0;
	}

	if (! cacophony.playing) {
		setTimeout ('bg_fade_out (' + op + ');', 53);
		return;
	}

	op += 0.8;

	if (! f) {
		f = new Rectangle (cacophony.width, cacophony.height);
		f.x = 0;
		f.y = 0;
	}

	f.fill = 'rgba(27, 1, 1, ' + (op / 10) + ')';
	cacophony.canvas.append (f);
	if (op < 10) {
		setTimeout ('bg_fade_out (' + op + ');', 53);
	} else {
		cacophony.canvas.remove (f);
		f = false;
		bg_colour ({colour: 'rgba(27, 1, 1, 1)'});
	}
}

// Jump to the specified beat of the song.
//
// Usage:
//
//     {a:'jump_to', d:12}
function core_jump_to (data) {
	cacophony.jumpTo (data);
}

// Pause the video.
//
// Usage:
//
//     {a:'pause'}
//
// Optional duration:
//
//     {a:'pause', d:4}
function core_pause (data) {
	if (data) {
		setTimeout (core_continue, cacophony.beatLength * data);
	}
	cacophony.pause ();
}

// Resume playback.
//
// Usage:
//
//     {a:'continue'}
function core_continue () {
	cacophony.play ();
}

// Assign HTML to the video.
//
// Usage:
//
//     {a:'html', d:{html:'<h1>Markup here</h1>'}}
//
//     {a:'html', d:{html:'<h1>Markup here</h1>', top:50, left:50}}
function core_html (data) {
	if (data.top != null) {
		cacophony.html (data.html, data.top, data.left);
	} else {
		cacophony.html (data.html);
	}
}

// Clear any HTML in the video.
//
// Usage:
//
//     {a:'clear_html'}
function core_clear_html () {
	cacophony.html ();
}

// Assign clickable areas to the video with callbacks. Callbacks will have
// a `return false` added to them automatically.
//
// Usage:
//
//     {a:'clickable_areas', d:{
//         coords: [
//             {x:25, y:25, h:75, w:75, callback:'my_function1 ()'},
//             {x:125, y:125, h:75, w:75, callback:'my_function2 ()'},
//             {x:225, y:225, h:75, w:75, callback:'my_function3 ()'}
//         ]
//     }}
function core_clickable_areas (data) {
	var html = '<div style="width: ' + cacophony.width + 'px; height: ' + cacophony.height + 'px; position: relative; border: 0px">';

	for (var i = 0; i < data.coords.length; i++) {
		html += '<a href="#" onclick="' + data.coords[i].callback + '; return false">'
			+ '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=" '
			+ 'style="position:absolute; border: 0px none; top: ' + data.coords[i].y + 'px; left: ' + data.coords[i].x + 'px; height: ' + data.coords[i].h + 'px; width: ' + data.coords[i].w + 'px" /></a>';
	}

	html += '</div>';

	cacophony.html (html, 0, 0);
}

// Register all effects.
_e['bg_colour'] = bg_colour;
_e['bg_fade_to'] = bg_fade_to;
_e['bg_fade_in'] = bg_fade_in;
_e['bg_fade_out'] = bg_fade_out;
_e['jump_to'] = core_jump_to;
_e['pause'] = core_pause;
_e['continue'] = core_continue;
_e['html'] = core_html;
_e['clear_html'] = core_clear_html;
_e['clickable_areas'] = core_clickable_areas;
