import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { log } from 'util';

import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { getSystemPath, join, normalize, Path } from '@angular-devkit/core';
import { copyFile, ProjectType } from '@nrwl/workspace';
import { fileExists, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';
import { CompilerSystem, Config, ConfigFlags, Logger, runTask, TaskCommand } from '@stencil/core/cli';
import { loadConfig } from '@stencil/core/compiler';
import { OutputTarget } from '@stencil/core/internal';
import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';

import { StencilBuildOptions } from '../builders/build/shcema';
import { StencilTestOptions } from '../builders/test/schema';
import { ConfigAndPathCollection, CoreCompiler } from '../runtime/interface';

function getCompilerExecutingPath() {
  return require.resolve('@stencil/core/compiler');
}

const loadCoreCompiler = async (sys: CompilerSystem): Promise<CoreCompiler> => {
  await sys.dynamicImport!(sys.getCompilerExecutingPath());

  return (globalThis as any).stencil;
};

export async function initializeStencilConfig(
  taskCommand: TaskCommand,
  options: StencilBuildOptions | StencilTestOptions,
  context: BuilderContext,
  createStencilCompilerOptions: (
    taskCommand: TaskCommand,
    options: StencilBuildOptions | StencilTestOptions
  ) => ConfigFlags
) {
  const configFilePath = options.configPath;

  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger({ process });
  const sys: CompilerSystem = createNodeSys({ process });
  const metadata = await context.getProjectMetadata(context.target as any);

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  if (flags.ci) {
    logger.enableColors(false);
  }

  const loadConfigResults = await loadConfig({
    config: {
      flags
    },
    configPath: getSystemPath(join(normalize(context.workspaceRoot), configFilePath)),
    logger,
    sys
  });
  const coreCompiler = await loadCoreCompiler(sys);

  const { workspaceRoot } = context;
  const projectName: string = context.target?.project || '';
  const distDir: Path = normalize(`${workspaceRoot}/dist/${metadata.root}`);
  const projectRoot: Path = normalize(`${workspaceRoot}/${metadata.root}`);

  return {
    projectName: projectName,
    config: loadConfigResults.config,
    projectRoot: getSystemPath(projectRoot),
    coreCompiler: coreCompiler,
    distDir: getSystemPath(distDir),
    pkgJson: getSystemPath(join(projectRoot, `package.json`))
  } as ConfigAndPathCollection;
}
