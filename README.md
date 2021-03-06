# DailyXKCD
A module for MagicMirror<sup>2</sup> that displays the daily XKCD web comic.

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone this repo into your `modules` directory.
  2. Create an entry in your `config.js` file to tell this module where to display on screen.
  
 **Example:**
```
 {
    module: 'DailyXKCD',
	position: 'top_left',
	config: {
		invertColors: true
		title: true
		altText: false
	}
 },
```

## Config
| **Option** | **Description** |
| --- | --- |
| `invertColors` | Set to `true` to invert the colors of the comic to white on black for a darker feel. |
| `title` | Set to `true` to display the title of the comic. |
| `altText` | Set to `true` to display the alternate text of the comic. |
