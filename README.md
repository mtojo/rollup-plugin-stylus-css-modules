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

* `output`: Path to write the generated CSS (optional).

## License

MIT
