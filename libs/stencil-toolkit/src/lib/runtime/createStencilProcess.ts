import { log } from 'console';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { BuilderOutput } from '@angular-devkit/architect';
import { runTask } from '@stencil/core/cli';

import { ConfigAndCoreCompiler } from './interface';

export function createStencilProcess() {
  return function (source: Observable<ConfigAndCoreCompiler>): Observable<BuilderOutput> {
    return source.pipe(
      switchMap(options => runTask(options.coreCompiler, options.config, options.config.flags!.task!)),
      map(() => ({ success: true })),
      catchError(err => {
        log(err);
        return of({ success: false, error: 'Error asd' });
      })
    );
  };
}
