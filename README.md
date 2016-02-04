# rollup-plugin-stylus-css-modules

[![Build Status](https://travis-ci.org/mtojo/rollup-plugin-stylus-css-modules.svg?branch=master)](https://travis-ci.org/mtojo/rollup-plugin-stylus-css-modules)

A Rollup.js plugin to compile Stylus and inject [CSS Modules](https://github.com/css-modules/css-modules).

## Installation

```bash
npm install --save-dev rollup-plugin-stylus-css-modules
```

## Usage

Add the following code to your project's `rollup.config.js`:

```js
import stylusCssModules from 'rollup-plugin-stylus-css-modules';

export default {
  entry: 'index.js',
  plugins: [
    stylusCssModules({
      output: 'styles.css'
    })
  ]
};
```

### in Stylus

```stylus
.container
  height 100%
```

### in JS

```js
import styles from './styles.styl';
const container = `<div class="${styles.container}">...</div>`;
```

## Options

* `include`, `exclude`: A minimatch pattern, or an array of minimatch patterns of including ID, or excluding ID (optional).
* `output`: Output destination (optional).
  * If you specify a `string`, it will be the path to write the generated CSS.
  * If you specify a `function`, call it passing the generated CSS as an argument.
* `sourceMap`: If `true` is specified, source map to be embedded in the output CSS (default is `true`).

## External tools

Combination with external tools, such as [PostCSS](http://postcss.org/) works perfectly.

```js
stylusCssModules({
  sourceMap: true,
  output: (css) => {
    return postcss([
      // postcss' plugins...
    ]).process(css, {
      map: true
    }).then((result) => {
      fs.writeFileSync('styles.css', result.css);
    });
  }
});
```

## License

MIT
