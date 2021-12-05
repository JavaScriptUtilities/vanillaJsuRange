# vanilla Jsu Range

Create a range with two thumbs.

## Install

First, load `assets/js/range.js` and `assets/css/range.css` in your webpage.

Then, when DOM is ready, start the plugin :

```js
document.querySelectorAll(".range").forEach(function($item) {
    new vanillaJsuRange($item);
});
```

## Roadmap

- [x] Add touch compatibility.
- [x] Avoid thumb collisions.
- [x] Display track between thumbs.
- [x] Minified version.
- [x] Initial values.
- [x] Refresh from input values.
- [x] How to install.
- [ ] Fix when manually changing an input to its minimal or maximal values.
