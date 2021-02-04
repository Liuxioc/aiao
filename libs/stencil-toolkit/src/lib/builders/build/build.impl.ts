import { Observable } from 'rxjs';

import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { ConfigFlags, parseFlags, TaskCommand } from '@stencil/core/cli';

import { createStencilConfig } from '../../runtime/createStencilConfig';
import { createStencilProcess } from '../../runtime/createStencilProcess';
import { parseRunParameters } from '../../runtime/parseRunParameters';
import { StencilBuildOptions } from './shcema';

function createStencilCompilerOptions(taskCommand: TaskCommand, options: StencilBuildOptions): ConfigFlags {
  let runOptions: string[] = [taskCommand];

  if (options.port) {
    runOptions.push(`--port ${options.port}`);
  }
  runOptions = parseRunParameters(runOptions, options);
  return parseFlags(runOptions);
}

export function runBuilder(options: StencilBuildOptions, context: BuilderContext): Observable<BuilderOutput> {
  const taskCommand: TaskCommand = 'build';
  return createStencilConfig(taskCommand, options, context, createStencilCompilerOptions).pipe(createStencilProcess());
}

export default createBuilder(runBuilder);
