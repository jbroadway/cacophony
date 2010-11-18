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
	{a:'bg_colour', d:{colour: 'rgba(25, 30, 35, 1)'}},
	{a:'flicker_sequence', d:{images:[
		'pix/phase1.png',
		'pix/phase2.png',
		'pix/phase3.png',
		'pix/phase4.png',
		'pix/phase5.png',
		'pix/phase6.png',
		'pix/phase7.png',
		'pix/phase8.png'
	], duration: 7}},
	{a:'lyrics', d:{txt: 'This demo showcases some new possibilities', x: 50, y: 50, colour: 'rgba(200, 200, 200, 1)'}}
];

_s[6] = [
	{a:'bg_fade_to', d:{colour: 'rgba(25, 35, 30, %d)'}},
	{a:'lyrics', d:{txt: 'in interactive online video.', x: 150, y:90, colour: 'rgba(200, 200, 200, 1)'}}
];

_s[12] = [
	{a:'bg_fade_to', d:{colour: 'rgba(45, 35, 0, %d)'}}
];

_s[18] = [
	{a:'bg_fade_to', d:{colour: 'rgba(45, 45, 25, %d)'}}
];

_s[22] = [
	{a:'lyrics', d:{txt: 'Use your mouse to control certain elements,', x: 50, y:130, colour: 'rgba(200, 200, 200, 1)'}}
];

_s[24] = [
	{a:'bg_fade_to', d:{colour: 'rgba(25, 30, 35, %d)'}}
];

_s[27] = [
	{a:'lyrics', d:{txt: 'like this...', x: 600, y:160, colour: 'rgba(200, 200, 200, 1)'}}
];

_s[30] = [
	{a:'bg_fade_to', d:{colour: 'rgba(25, 35, 30, %d)'}}
];

_s[36] = [
	{a:'bg_fade_to', d:{colour: 'rgba(45, 35, 0, %d)'}}
];

_s[42] = [
	{a:'bg_fade_to', d:{colour: 'rgba(45, 45, 25, %d)'}},
	{a:'circles_on', d:{fill: 'rgba(120,120,120,.5)'}},
	{a:'input_text', d: {msg: 'What city do you live in?',
         save_to: 'save_city.php',
         thanks: 'Thanks for participating! Now let\'s see where others have watched this video...'}}
];

_s[48] = [
	{a:'bg_fade_to', d:{colour: 'rgba(30, 45, 30, %d)'}}
];

_s[54] = [
	{a:'bg_fade_to', d:{colour: 'rgba(30, 30, 45, %d)'}}
];

_s[60] = [
	{a:'bg_fade_to', d:{colour: 'rgba(45, 45, 25, %d)'}}
];

_s[66] = [
	{a:'bg_fade_to', d:{colour: 'rgba(30, 45, 30, %d)'}}
];

_s[72] = [
	{a:'bg_fade_to', d:{colour: 'rgba(45, 45, 60, %d)'}}
];

_s[78] = [
	{a:'bg_fade_to', d:{colour: 'rgba(75, 60, 60, %d)'}}
];

_s[84] = [
	{a:'bg_fade_to', d:{colour: 'rgba(75, 90, 75, %d)'}},
	{a:'circles_off'},
	{a:'skyline_on'}
];

_s[88] = [
	{a:'lyrics', d:{txt: 'Map of viewers:', x: 20, y:5, colour: 'rgba(200, 200, 200, 1)'}}
];

_s[90] = [
	{a:'bg_fade_to', d:{colour: 'rgba(90, 90, 105, %d)'}}
];

_s[94] = [
	{a:'datafeed_map_on', d:{url: 'cities.json', zoom: 3, lat: 47.5, lng: -97}}
];

_s[96] = [
	{a:'bg_fade_to', d:{colour: 'rgba(120, 105, 105, %d)'}}
];

_s[102] = [
	{a:'bg_fade_to', d:{colour: 'rgba(120, 135, 120, %d)'}}
];

_s[108] = [
	{a:'bg_fade_to', d:{colour: 'rgba(120, 120, 150, %d)'}}
];

_s[114] = [
	{a:'bg_fade_to', d:{colour: 'rgba(165, 150, 150, %d)'}}
];

_s[120] = [
	{a:'bg_fade_to', d:{colour: 'rgba(165, 180, 165, %d)'}}
];

_s[126] = [
	{a:'bg_fade_to', d:{colour: 'rgba(180, 180, 195, %d)'}}
];

_s[132] = [
	{a:'datafeed_map_off'},
	{a:'bg_fade_to', d:{colour: 'rgba(180, 195, 210, %d)'}}
];

_s[138] = [
	{a:'bg_fade_to', d:{colour: 'rgba(180, 210, 225, %d)'}}
];

_s[140] = [
	{a:'skyline_off'},
	{a:'lyrics', d:{txt: 'Thanks for watching, {input}!', x: 180, y:100, colour: 'rgba(50, 50, 50, 1)'}},
	{a:'flicker_parallax', d: {
         layers: ['pix/demo_back.png', 'pix/demo_middle.png', 'pix/demo_front.png'],
         duration: 28, auto:true, direction:'left'}}
];

_s[144] = [
	{a:'bg_fade_to', d:{colour: 'rgba(180, 210, 240, %d)'}}
];

_s[166] = [
	{a:'skyline_off'},
	{a:'bg_fade_out'}
];
