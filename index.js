import fs from 'fs';
import path from 'path';
import CssModules from 'css-modules-loader-core';
import stylus from 'stylus';
import {createFilter} from 'rollup-pluginutils';

export default function stylusCssModules(options = {}) {
  const cssModules = new CssModules();
  const filter = createFilter(options.include, options.exclude);
  const sourceMap = options.sourceMap !== false;
  const outputFile = typeof options.output === 'string';
  const outputFunction = typeof options.output === 'function';

  return {
    async transform(code, id) {
      if (!filter(id) || path.extname(id) !== '.styl') {
        return null;
      }

      const relativePath = path.relative(process.cwd(), id);

      // compile Stylus
      const style = stylus(code).set('filename', relativePath);
      if (sourceMap) {
        style.set('sourcemap', {inline: true});
      }
      const css = await style.render();

      // CSS Modules
      const {
        injectableSource,
        exportTokens
      } = await cssModules.load(css, relativePath, null);

      // output
      if (outputFile) {
        await fs.writeFile(options.output, injectableSource);
      } else if (outputFunction) {
        await options.output(injectableSource);
      }

      return {
        id: `${id}.css`,
        code: `export default ${JSON.stringify(exportTokens)};`,
        map: {mappings: ''}
      };
    }
  };
}
