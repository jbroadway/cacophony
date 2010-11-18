// An interactive circle hide/reveal effect.

var circles_state = false,
	circle = [],
	circle_fill = '#eee',
	circle_max_dist = dist(0, 0, 400, 400);

// Calculate distance of two points.
function dist (x1, y1, x2, y2) {
	var dx = x1 - x2,
		dy = y1 - y2;
	return Math.sqrt (dx * dx + dy * dy);
}

// Turn on the circles effect. Uses the mouse to move a series of
// circles around the screen.
//
// Usage:
//
//     {a:'circles_on', d:{fill: '#eee'}}
function circles_on (data) {
	circles_state = true;
	if (data && data.fill) {
		circle_fill = data.fill;
	} else {
		circle_fill = '#eee';
	}
}

// Turn off the circles effect.
//
// Usage:
//
//     {a:'circles_off'}
function circles_off () {
	circles_state = false;
	for (var x = 0; x < circle.length; x++) {
		circle[x].radius = 0;
	}
	circle = [];
}

// Render the circles on mousemove.
function circles () {
	x = 0;
	for (var i = 177; i <= 677; i += 20) {
		for (var j = 40; j <= 440; j += 20) {
			size = dist (cacophony.mousex, cacophony.mousey, i, j);
			size = size / circle_max_dist * 66;
			if (circle[x]) {
				circle[x].radius = size;
			} else {
				c = new Circle (size);
				c.x = i;
				c.y = j;
				c.fill = circle_fill;
				circle[x] = c;
				cacophony.canvas.append (circle[x]);
			}
			x++;
		}
	}
}

// Register a mousemove callback for the circles effect.
cacophony.mousemove (function () {
	if (! circles_state) {
		return;
	}
	circles ();
});

// Register all effects.
_e['circles_on'] = circles_on;
_e['circles_off'] = circles_off;
