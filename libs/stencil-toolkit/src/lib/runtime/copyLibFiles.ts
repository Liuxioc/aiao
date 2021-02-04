import { resolve } from 'path';

import { copyFile } from '@nrwl/workspace';
import { fileExists } from '@nrwl/workspace/src/utils/fileutils';

import { ConfigAndPathCollection } from './interface';

export function copyLibFiles(values: ConfigAndPathCollection) {
  if (!fileExists(values.pkgJson)) {
    throw new Error('package.json not found');
  }
  copyFile(values.pkgJson, values.distDir);
  const readmePath = resolve(values.projectRoot, 'README.md');
  if (fileExists(readmePath)) {
    copyFile(readmePath, values.distDir);
  }
}
