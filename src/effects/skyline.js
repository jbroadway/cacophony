// Effects to bounce a skyline of the `eq_data` to the beat of
// the song.

cacophony.addInterval (skyline, 25);

var colours = ['#eee', '#ddd', '#ddd', '#ccc', '#ccc', '#bbb', '#bbb', '#bbb', '#aaa', '#aaa', '#aaa', '#aaa', '#999', '#999', '#999', '#999', '#999'],
	bottom = [],
	bottom2 = [],
	skyline1 = [],
	skyline2 = [],
	skyline3 = [],
	windows = [],
	skyline_state = false,
	skyline_initialized = false;

// Pre-renders as many of the skyline elements in advance.
function skyline_init () {
	var r;
	for (var i = 0; i < 256; i += 2) {
		r = new Rectangle (cacophony.w * 2, 180);
		r.x = cacophony.w * i;
		r.y = cacophony.height;
		r.fill = 'rgba(51, 51, 51, 0.1)';
		skyline3[i] = r;
		cacophony.canvas.append (skyline3[i]);

		r = new Rectangle (cacophony.w * 2, 180);
		r.x = cacophony.w * i;
		r.y = cacophony.height;
		r.fill = 'rgba(51, 51, 51, 0.3)';
		skyline2[i] = r;
		cacophony.canvas.append (skyline2[i]);

		r = new Rectangle (cacophony.w * 2, 180);
		r.x = cacophony.w * i;
		r.y = cacophony.height;
		r.fill = 'rgba(51, 51, 51, 1.0)';
		skyline1[i] = r;
		cacophony.canvas.append (skyline1[i]);
	}
	skyline_initialized = true;
}

// Turn on the skyline effect. Uses cacophony.eq to set the skyline
// building heights.
//
// Usage:
//
//     {a:'skyline_on'}
function skyline_on () {
	skyline_state = true;
	if (! skyline_initialized) {
		skyline_init ();
	}
}

// Clear the skyline.
//
// Usage:
//
//     {a:'skyline_off'}
function skyline_off () {
	skyline_state = false;

	// clear skyline

	for (var i = 0; i < windows.length; i++) {
		cacophony.canvas.remove (windows[i]);
	}
	windows = [];

	for (var i = 0; i < 256; i += 2) {
		skyline1[i].y = cacophony.height;
		skyline2[i].y = cacophony.height;
		skyline3[i].y = cacophony.height;
	}
}

// Renders the skyline on its own interval.
function skyline () {
	if (! skyline_state) {
		return false;
	}

	var height, c, win;

	for (var i = 0; i < windows.length; i++) {
		cacophony.canvas.remove (windows[i]);
	}
	windows = [];

	for (var i = 0; i < 256; i += 2) {
		var height = Math.abs (((32 - (cacophony.scale  + Math.ceil (cacophony.eq[i] * cacophony.scale ))) * 4));
		if (height > 180) {
			height = 180;
		}

		// fade oldest
		skyline3[i].y = cacophony.height - bottom2[i];
		bottom2[i] = 0;

		// fade old
		skyline2[i].y = cacophony.height - bottom[i];
		bottom2[i] = bottom[i];

		// redraw
		skyline1[i].y = cacophony.height - height;
		bottom[i] = height;

		for (var s = cacophony.height - height + 2; s < cacophony.height; s += 5) {
			// left window
			c = window_colour ();
			if (c != '#999') {
				win = new Rectangle (3, 3);
				win.x = (cacophony.w * i) + 2;
				win.y = s;
				win.fill = c;
				windows.push (win);
				cacophony.canvas.append (win);
			}

			// right window
			c = window_colour ();
			if (c != '#999') {
				win = new Rectangle (3, 3);
				win.x = (cacophony.w * i) + 7;
				win.y = s;
				win.fill = c;
				windows.push (win);
				cacophony.canvas.append (win);
			}
		}
	}
}

// Generate a random shade for each window.
function window_colour () {
	return colours[Math.floor (Math.random () * colours.length)];
}

// Register all effects.
_e['skyline_on'] = skyline_on;
_e['skyline_off'] = skyline_off;
