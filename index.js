import fs from 'fs';
import path from 'path';
import CssModules from 'css-modules-loader-core';
import stylus from 'stylus';
import {createFilter} from 'rollup-pluginutils';

export default function stylusCssModules(options = {}) {
  const cssModules = new CssModules();
  const filter = createFilter(options.include || [
    '**/*.styl',
    '**/*.stylus'
  ], options.exclude);
  const fn = options.fn;
  const sourceMap = options.sourceMap !== false;
  const outputFile = typeof options.output === 'string';
  const outputFunction = typeof options.output === 'function';
  const cache = {};

  return {
    load(id) {
      if (cache[id]) {
        return cache[id].injectableSource;
      }
      return null;
    },
    resolveId(importee, importer) {
      if (cache[importee]) {
        return importee;
      }

      return null;
    },
    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const compiledId = `${id}.css`;
      let obj = cache[compiledId];

      if (!obj) {
        // compile Stylus
        const style = stylus(code);
        const relativePath = path.relative(process.cwd(), id);
        style.set('filename', relativePath);
        if (sourceMap) {
          style.set('sourcemap', {inline: true});
        }
        if (fn) {
          style.use(fn);
        }
        const css = await style.render();

        // CSS Modules
        obj = await cssModules.load(css, relativePath, null);

        cache[compiledId] = obj;
      }

      // output
      let importCode = '';
      if (outputFile) {
        await fs.writeFile(options.output, obj.injectableSource);
      } else if (outputFunction) {
        await options.output(obj.injectableSource);
      } else {
        importCode = `import ${JSON.stringify(compiledId)};`;
      }

      return {
        id: compiledId,
        code: `${importCode}export default ${JSON.stringify(obj.exportTokens)};`,
        map: {mappings: ''}
      };
    }
  };
}
