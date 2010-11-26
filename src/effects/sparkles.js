// Generate sparkles that float around and react to
// mouse movements.

var sparkles = [],
    sparkles_interval = false;

// Turn the sparkles on.
//
// Usage:
//
//     {a:'sparkles_on', d:{num: 50}}
function sparkles_on (data) {
    var count = (data && data.num) ? data.num : 50;

    for (var i = 0; i < count; i++) {
        // Create a sparkle object and add it to the canvas.
        sparkles[i] = sparkles_create ();
        cacophony.canvas.append (sparkles[i]);
    }

	// Update every 25ms.
    sparkles_interval = cacophony.addInterval (sparkles_update, 25);
}

// Turn the sparkles off.
//
// Usage:
//
//     {a:'sparkles_off'}
function sparkles_off (data) {
	// Remove the interval updates.
    cacophony.removeInterval (sparkles_interval);
    sparkles_interval = false;

	// Remove the sparkle objects from the canvas.
    for (var i = 0; i < sparkles.length; i++) {
        cacophony.canvas.remove (sparkles[i]);
    }
    sparkles = [];
}

// Helper function to get a random value between min and max,
// optionally rounded.
function sparkles_rand (min, max, round) {
    var rand = min + (Math.random () * (max - min));
    return (round) ? Math.round (rand) : rand;
}

// Create a new sparkle with random position, opacity, direction,
// and speed.
function sparkles_create () {
    var s = new Circle (sparkles_rand (1, 5));
    s.x = cacophony.width / 2 + sparkles_rand (-50, 50);
    s.y = cacophony.height / 2 + sparkles_rand (-50, 50);
    s._opacity = Math.random();
    s.fill = 'rgba(255,255,255,' + s._opacity + ')';
    s._dir = [sparkles_rand (-2.5, 2.5), sparkles_rand (-2.5, 2.5)];
    s._dir[0] = (s._dir[0]) ? s._dir[0] : -1;
    s._dir[1] = (s._dir[1]) ? s._dir[1] : 1;
    return s;
}

// Update the sparkles on interval.
function sparkles_update () {
    var rad = 0, op = 0;
    for (var i = 0; i < sparkles.length; i++) {
    	// Update the radius and opacity for a pulsing effect.
        rad = sparkles_rand (-.1, .1);
        if (sparkles[i].radius + rad > 0 && sparkles[i].radius + rad <= 5) {
            sparkles[i].radius += rad;
        }

        op = sparkles_rand (-.1, .1);
        if (sparkles[i]._opacity + op > 0.2 && sparkles[i]._opacity + op <= 1) {
            sparkles[i]._opacity += op;
        }
        sparkles[i].fill = 'rgba(255,255,255,' + sparkles[i]._opacity + ')';

        // Detect edges and slow them down.
        if (sparkles[i]._dir[0] < 0) {
            if (sparkles[i].x < 1) {
                // Reverse course and boost speed
                sparkles[i]._dir[0] = Math.abs (sparkles[i]._dir[0]) + 1;
            } else if (sparkles[i]._dir[0] < -1) {
                // Slow down
                sparkles[i]._dir[0] += 0.05;
            }
        } else if (sparkles[i]._dir[0] > 0) {
            if (sparkles[i].x > cacophony.width) {
                // Reverse course and boost speed
                sparkles[i]._dir[0] = (sparkles[i]._dir[0] * -1) - 1;
            } else if (sparkles[i]._dir > 1) {
                // Slow down
                sparkles[i]._dir[0] -= 0.05;
            }
        }

        if (sparkles[i]._dir[1] < 0) {
            if (sparkles[i].y < 1) {
                // Reverse course and boost speed
                sparkles[i]._dir[1] = Math.abs (sparkles[i]._dir[1]) + 1;
            } else if (sparkles[i]._dir[1] < -1) {
                // Slow down
                sparkles[i]._dir[1] += 0.05;
            }
        } else if (sparkles[i]._dir[1] > 0) {
            if (sparkles[i].y > cacophony.height) {
                // Reverse course and boost speed
                sparkles[i]._dir[1] = (sparkles[i]._dir[1] * -1) - 1;
            } else if (sparkles[i]._dir > 1) {
                // Slow down
                sparkles[i]._dir[1] -= 0.05;
            }
        }

		// Update the position
        sparkles[i].x += sparkles[i]._dir[0];
        sparkles[i].y += sparkles[i]._dir[1];
    }
}

// Increase speed and update direction based on proximity to the mouse.
function sparkles_react (i) {
    if (cacophony.mousex > sparkles[i].x && sparkles[i]._dir[0] > 0) {
        sparkles[i]._dir[0] = (sparkles[i]._dir[0] * -1) - 1;
    } else if (cacophony.mousex < sparkles[i].x && sparkles[i]._dir[0] < 0) {
        sparkles[i]._dir[0] = Math.abs (sparkles[i]._dir[0]) + 1;
    }

    if (cacophony.mousey > sparkles[i].y && sparkles[i]._dir[1] > 0) {
        sparkles[i]._dir[1] = (sparkles[i]._dir[1] * -1) - 1;
    } else if (cacophony.mousey < sparkles[i].y && sparkles[i]._dir[1] < 0) {
        sparkles[i]._dir[1] = Math.abs (sparkles[i]._dir[1]) + 1;
    }
}

// Update the sparkles on mousemove.
function sparkles_mousemove () {
    // Update each sparkle object's direction only if they're within
    // a certain distance of the mouse.
    for (var i = 0; i < sparkles.length; i++) {
        if (cacophony.dist (sparkles[i].x, sparkles[i].y,
                  cacophony.mousex, cacophony.mousey) <= 25) {
            sparkles_react (i);
        }
    }
}

// Register a mousemove callback for the effect.
cacophony.mousemove (function () {
    if (sparkles_interval === false) {
        // Don't call if the effect is not active.
        return;
    }

    sparkles_mousemove ();
});

// Register the effects.
_e['sparkles_on'] = sparkles_on;
_e['sparkles_off'] = sparkles_off;
