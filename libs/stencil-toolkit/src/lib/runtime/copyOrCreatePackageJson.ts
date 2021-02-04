import { getSystemPath, join } from '@angular-devkit/core';
import { copyFile } from '@nrwl/workspace';
import { fileExists, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';

import { ConfigAndPathCollection } from './interface';

export function copyOrCreatePackageJson(values: ConfigAndPathCollection) {
  if (fileExists(values.pkgJson)) {
    copyFile(values.pkgJson, values.distDir);
  } else {
    const libPackageJson = {
      name: values.projectName,
      main: 'dist/index.js',
      module: 'dist/index.mjs',
      es2015: 'dist/esm/index.mjs',
      es2017: 'dist/esm/index.mjs',
      types: 'dist/types/index.d.ts',
      collection: 'dist/collection/collection-manifest.json',
      'collection:main': 'dist/collection/index.js',
      unpkg: `dist/${values.projectName}/${values.projectName}.js`,
      files: ['dist/', 'loader/']
    };

    writeJsonFile(getSystemPath(join(values.distDir, `package.json`)), libPackageJson);
  }
}
