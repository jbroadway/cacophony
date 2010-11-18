// This is where you describe the storyline of your video.
//
// Available effects:
//
// Jump to the specified beat of the song:
//
//     {a:'jump_to', d:1}
//
// Background colour effects:
//
//     {a:'bg_colour', d: {colour: "#eee"}}
//     {a:'bg_fade_to', d: {colour: "rgba(123, 123, 123, %d)"}}
//     {a:'bg_fade_in'}
//     {a:'bg_fade_out'}
//
// Flicker images:
//
//     {a:'flicker', d: {img: "pix/image.png", duration: 1}}
//     {a:'flicker_sequence', d: {images: ["img1.png", "img2.png"], duration: 1}}
//     {a:'flicker_panels', d: {
//         images: ["img1.png", "img2.png", "img3.png", "img4.png"], duration: 1}}
//     {a:'flicker_parallax', d: {
//         layers: ["back.png", "middle.png", "top.png"],
//         duration: 4, auto: true, direction: 'right'}}
//
// Display the specified lyrics then fade them away:
//
//     {a:'lyrics', d: {txt: "...", x: 123, y: 123, colour:'rgba(102, 102, 102, 1)'}}
//
// Volume control:
//
//     {a:'set_volume', d:0.7}
//     {a:'volume_fade', d:{to:0.7, duration:4}}
//
// Request viewer input:
//
//     {a:'input_text', d: {msg: "Please enter your name",
//         save_to: "/save_input.php", jump_to: 10}}
//     {a:'input_text', d: {msg: "Please enter your city",
//         save_to: "/save_input.php", jump_to: 10, autocomplete: list_values}}
//     {a:'input_textarea', d: {msg: "Tell me a story",
//         save_to: "/save_input.php", jump_to: 10}}
//     {a:'input_branching', d: {msg: "What would you do?", options: [
//     	{choice: "Go down the dark staircase", jump_to: 10}
//     	{choice: "Hide in the attic", jump_to: 20}
//     	{choice: "Call the Ghostbusters", jump_to: 30}
//     ]}}
//
// An interactive circle hide/reveal effect:
//
//     {a:'circles_on', d: {fill: '#eee'}}
//     {a:'circles_off'}
//
// Bounce a skyline of the `eq_data` to the beat of the song:
//
//     {a:'skyline_on'}
//     {a:'skyline_off'}
//
// Render ContextFree.js code:
//
//     {a:'context_on', d: "code here"}
//     {a:'context_off'} (use img:'context' to reference the saved image later)
//
// Allow drawn input using the Harmony ribbon pen:
//
//     {a:'ribbon_on', d: {msg: "Draw me something", save_to: "/save_image.php"}}
//     {a:'ribbon_off'} (use img:'ribbon' to reference the saved image later)
//
// Render a scene from Three.js:
//
//     {a:'three_on', d:{func:function_with_three_js_code, arg1:'foo', arg2:'bar'}}
//     {a:'three_off'}
//
// Use data feeds to display current info in your video (JSON, RSS, ATOM, XML):
//
//     {a:'datafeed_slideshow', d:{url: '/example.rss'}}
//     {a:'datafeed_headlines', d:{url: '/example.rss'}}
//     {a:'datafeed_map_on', d:{url: '/coords.json', view:'street'}}
//     {a:'datafeed_map_off'}
//
// Example story:
//
//     _s[0] = [
//     	{a:'bg_fade_in'}
//     ];
//     _s[1] = [
//     	{a:'lyrics', d: {txt: "Draw how you're feeling today", x: 50, y: 50}}
//     ];
//     _s[4] = [
//     	{a:'lyrics', d: {txt: "Ready?", x: 100, y: 100}}
//     ]
//     _s[6] = [
//     	{a:'lyrics', d: {txt: "Set...", x: 200, y: 100}}
//     ]
//     _s[8] = [
//     	{a:'lyrics', d: {txt: "Go!", x: 300, y: 100}},
//     	{a:'ribbon_on', d: {save_to: "http://www.example.com/save_image.php"}}
//     ];
//     _s[20] = [
//     	{a:'lyrics', d: {txt: "Almost done?", x: 100, y: 100}}
//     ];
//     _s[24] = [
//     	{a:'ribbon_off'},
//     	{a:'lyrics', d: {txt: "Saving...", x:100, y: 100}}
//     ];
//

// #### Your story goes here.

_s[0] = [
	{a:'bg_colour', d:{colour: 'rgba(200, 200, 200, 1)'}}
];

_s[1] = [
	{a:'lyrics', d:{txt:'Let\'s draw some trees!', x: 225, y: 200, colour:'rgba(0, 0, 0, 1)'}}
];

_s[12] = [
	{a:'context_on', d: "startshape SCALE\r\rrule SCALE{\r	FOREST{ s .03 y -1 x .5 }\r}\r\rrule FOREST {\r     SEED {}\r     SEED {x -20}\r     SEED {x -40}\r}\r\rrule SEED {BRANCH {}}\rrule SEED {BRANCH {rotate 1}}\rrule SEED {BRANCH {rotate -1}}\rrule SEED {BRANCH {rotate 2}}\rrule SEED {BRANCH {rotate -2}}\rrule SEED {FORK {}}\r\rrule BRANCH {LEFTBRANCH {flip 90}}\rrule BRANCH {LEFTBRANCH {}}\r\rrule LEFTBRANCH 4 {BLOCK {} LEFTBRANCH {y 0.885 rotate 0.1 s 0.99}}\rrule LEFTBRANCH 4 {BLOCK {} LEFTBRANCH {y 0.885 rotate 0.2 s 0.99}}\rrule LEFTBRANCH {BLOCK {} LEFTBRANCH {y 0.885 rotate 4 s 0.99}}\rrule LEFTBRANCH {BLOCK {} FORK {}}\r\r\rrule BLOCK {\r     SQUARE {rotate 1}\r     SQUARE {rotate -1}\r     SQUARE {}\r}\r\rrule FORK {\r     BRANCH { }\r     BRANCH {s 0.5 rotate 40}\r}\rrule FORK {\r     BRANCH { }\r     BRANCH {s 0.5 rotate -40}\r}\rrule FORK {\r     BRANCH {s 0.5 rotate -20}\r     BRANCH { }\r}\rrule FORK {\r     BRANCH {s 0.7 y 0.1 rotate 20}\r     BRANCH {s 0.7 y 0.1 rotate -20}\r}"}
];

_s[35] = [
	{a:'context_off'},
	{a:'lyrics', d:{txt:'Now let\'s show our finished drawing again:', x: 100, y: 200, colour:'rgba(0, 0, 0, 1)'}}
];

_s[55] = [
	{a:'flicker_panels', d: {images: ['context', 'context', 'context', 'context'], duration: 6}}
];

_s[62] = [
	{a:'lyrics', d:{txt:'Let\'s draw something different this time...', x: 100, y: 200, colour:'rgba(0, 0, 0, 1)'}}
];

_s[84] = [
	{a:'context_on', d: "startshape start\r\rrule start { EDERA { s .006 y .6 x -.4 } }\r\rrule EDERA{\r  CIGLIO {x 0}  CIRCLE { x 0 s 5 hue 200 sat 0.5}\r  CIGLIO {x 5}  CIRCLE { x 5 s 5 hue 200 sat 0.5}\r  CIGLIO {x 10}  CIRCLE { x 10 s 5 hue 200 sat 0.5}\r  CIGLIO {x 15}  CIRCLE { x 15 s 5 hue 200 sat 0.5}\r  CIGLIO {x 20}  CIRCLE { x 20 s 5 hue 200 sat 0.5}\r  CIGLIO {x 25}  CIRCLE { x 25 s 5 hue 200 sat 0.5}\r  CIGLIO {x 30}  CIRCLE { x 30 s 5 hue 200 sat 0.5}\r  CIGLIO {x 35}  CIRCLE { x 35 s 5 hue 200 sat 0.5}\r  CIGLIO {x 40}  CIRCLE { x 40 s 5 hue 200 sat 0.5}\r  CIGLIO {x 45}  CIRCLE { x 45 s 5 hue 200 sat 0.5}\r}\r\rrule CIGLIO 100 {\r  SQUARE {hue 200 sat 0.5}\r  CIGLIO  {y -1 s 0.998 b 0.005}\r}\r\rrule CIGLIO {\r  SQUARE {hue 200 sat 0.5}\r  CIRCLE {hue 200 sat 0.5 alpha -0.4 s 10 y -10 }\r  CIGLIO  {y -1 r 1 s 0.998 b 0.005}\r}\r\rrule CIGLIO 0.0005 {\r  SQUARE {hue 200 sat 0.5}\r  CIRCLE {hue 200 sat 0.5 alpha -0.8 s -20 x 20 y -10 }\r  CIGLIO  {y -1  s 0.998 b 0.005 }\r}\r\rrule CIGLIO {\r  SQUARE {hue 200 sat 0.5}\r  CIRCLE {hue 200 sat 0.5 alpha -0.4 s 5 y -10 }\r  FIORE   {}\r FIORE  { x -1 flip 90}\r  CIGLIO  {y -1  s 0.998 b 0.005 }\r}\r\rrule FIORE {\r CIRCLE {hue 200 sat 0.5}\r FIORE {y -1 r 4 s 0.998 b 0.005}\r}\r\rrule FIORE 0.005 {\r CIRCLE {s 5 hue 200 sat 0.5}\r FIORE {y -1 r 4 s 0.998 b 0.005 flip 90}\r}"}
];

_s[140] = [
	{a:'context_off'}
];

_s[141] = [
	{a:'lyrics', d:{txt:'Neat, eh? :)', x: 350, y: 200, colour:'rgba(0, 0, 0, 1)'}}
];

_s[166] = [
	{a:'bg_fade_out'}
];
