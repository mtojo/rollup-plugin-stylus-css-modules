'use strict';

const assert = require('assert');
const fs = require('fs');
const runInNewContext = require('vm').runInNewContext;
const rollup = require('rollup').rollup;
const {createFilter} = require('rollup-pluginutils');
const stylusCssModules = require('../dist/rollup-plugin-stylus-css-modules.cjs');

describe('stylus-css-modules', () => {
  it('should export tokens', () => {
    return rollup({
      entry: 'test/example/main.js',
      plugins: [
        stylusCssModules({
          output: 'test/example/styles.css'
        })
      ]
    }).then((bundle) => bundle.generate({format: 'cjs'})).then(({code}) => {
      const exports = {};
      const module = {exports};
      runInNewContext(code, {module, exports});
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
    }).then((bundle) => bundle.generate({format: 'cjs'})).then(({code}) => {
      const exports = {};
      const module = {exports};
      runInNewContext(code, {module, exports});
      assert(output !== null);
    });
  });

  it('should not output CSS', () => {
    return rollup({
      entry: 'test/example/main.js',
      plugins: [
        stylusCssModules({
          output: false
        })
      ]
    }).then((bundle) => bundle.generate({format: 'cjs'})).then(({code}) => {
      const exports = {};
      const module = {exports};
      runInNewContext(code, {module, exports});
    });
  });

  it('should be work the next css plugin', () => {
    const filter = createFilter('**/*.css');
    let output = null;
    return rollup({
      entry: 'test/example/main.js',
      plugins: [
        stylusCssModules(),
        {
          transform(code, id) {
            if (filter(id)) {
              output = code;
              return 'export default null;';
            }
            return code;
          }
        }
      ]
    }).then((bundle) => bundle.generate({format: 'cjs'})).then(({code}) => {
      const exports = {};
      const module = {exports};
      runInNewContext(code, {module, exports});
      assert(output !== null);
    });
  });
});
