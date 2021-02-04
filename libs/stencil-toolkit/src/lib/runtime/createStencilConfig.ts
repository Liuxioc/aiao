import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BuilderContext } from '@angular-devkit/architect';
import { getSystemPath, normalize } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';
import { ConfigFlags, TaskCommand } from '@stencil/core/cli';
import { OutputTarget } from '@stencil/core/internal';

import { StencilBuildOptions } from '../builders/build/shcema';
import { StencilTestOptions } from '../builders/test/schema';
import { initializeStencilConfig } from '../util/initialize-stencil-config';
import { calculateOutputTargetPathVariables } from './calculateOutputTargetPathVariables';
import { copyLibFiles } from './copyLibFiles';
import { ensureDirExist } from './file-utils';
import { ConfigAndCoreCompiler, ConfigAndPathCollection } from './interface';

export function createStencilConfig(
  taskCommand: TaskCommand,
  options: StencilBuildOptions | StencilTestOptions,
  context: BuilderContext,
  createStencilCompilerOptions: (taskCommand: TaskCommand, options: StencilBuildOptions) => ConfigFlags
): Observable<ConfigAndCoreCompiler> {
  if (!options?.configPath) {
    throw new Error(
      'ConfigPath not set. Please use --configPath or update your project builder in workspace.json/angular.json accordingly!'
    );
  }
  return from(initializeStencilConfig(taskCommand, options, context, createStencilCompilerOptions)).pipe(
    tap((values: ConfigAndPathCollection) => {
      ensureDirExist(values.distDir);
      if (values.projectType === ProjectType.Library) {
        copyLibFiles(values);
      }
      return values.config;
    }),
    map((values: ConfigAndPathCollection) => {
      const pathVariables = [
        'dir',
        'appDir',
        'buildDir',
        'indexHtml',
        'esmDir',
        'systemDir',
        'systemLoaderFile',
        'file',
        'esmLoaderPath',
        'collectionDir',
        'typesDir',
        'legacyLoaderFile',
        'esmEs5Dir',
        'cjsDir',
        'cjsIndexFile',
        'esmIndexFile',
        'componentDts'
      ];
      const outputTargets: OutputTarget[] = calculateOutputTargetPathVariables(values, pathVariables);
      const devServerConfig = Object.assign(values.config.devServer, {
        root: getSystemPath(
          normalize(normalize(values.config.devServer!.root!).replace(normalize(values.projectRoot), values.distDir))
        )
      });

      values.config.packageJsonFilePath = getSystemPath(
        normalize(normalize(values.config.packageJsonFilePath!).replace(values.projectRoot, values.distDir))
      );
      if (values.config.flags!.task === 'build') {
        values.config.rootDir = getSystemPath(values.distDir);
      }

      const config = Object.assign(values.config, { outputTargets }, { devServer: devServerConfig });

      return {
        config: config,
        coreCompiler: values.coreCompiler
      };
    })
  );
}
