'use strict';

const assert = require('assert');
const fs = require('fs');
const runInNewContext = require('vm').runInNewContext;
const rollup = require('rollup').rollup;
const stylusCssModules = require('../dist/rollup-plugin-stylus-css-modules.cjs');

describe('stylus-css-modules', () => {
  it('should export tokens', () => {
    return rollup({
      entry: 'test/example/main.js',
      plugins: [
        stylusCssModules()
      ]
    }).then((bundle) => {
      const result = bundle.generate({format: 'cjs'});
      const exports = {};
      const module = {exports};
      runInNewContext(result.code, {module, exports});
      assert(module.exports.styles.hasOwnProperty('container'));
    });
  });

  it('should output css', () => {
    return rollup({
      entry: 'test/example/main.js',
      plugins: [
        stylusCssModules({
          output: 'test/example/styles.css'
        })
      ]
    }).then((bundle) => {
      const result = bundle.generate({format: 'cjs'});
      const exports = {};
      const module = {exports};
      runInNewContext(result.code, {module, exports});
      assert(module.exports.styles.hasOwnProperty('container'));
      assert(fs.existsSync('test/example/styles.css'));
      fs.unlinkSync('test/example/styles.css');
    });
  });

  it('should call function', () => {
    let output = null;
    return rollup({
      entry: 'test/example/main.js',
      plugins: [
        stylusCssModules({
          output: (css) => {
            output = css;
          }
        })
      ]
    }).then((bundle) => {
      const result = bundle.generate({format: 'cjs'});
      const exports = {};
      const module = {exports};
      runInNewContext(result.code, {module, exports});
      assert(output !== null);
    });
  });
});
