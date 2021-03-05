import { Path } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';
import { Config } from '@stencil/core/cli';

export type CoreCompiler = typeof import('@stencil/core/compiler');

export interface ConfigAndCoreCompiler {
  config: Config;
  coreCompiler: CoreCompiler;
}

export interface ConfigAndPathCollection {
  config: Config;
  distDir: Path;
  coreCompiler: CoreCompiler;
  projectRoot: Path;
  projectName: string;
  projectType: ProjectType;
  pkgJson: string;
}
