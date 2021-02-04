import { getSystemPath, normalize } from '@angular-devkit/core';
import { OutputTarget } from '@stencil/core/internal';

import { ConfigAndPathCollection } from './interface';

export function calculateOutputTargetPathVariables(values: ConfigAndPathCollection, pathVariables: string[]) {
  return values.config.outputTargets!.map((outputTarget: OutputTarget | any) => {
    pathVariables.forEach(pathVar => {
      if (outputTarget[pathVar] != null && !(outputTarget[pathVar] as string).endsWith('src')) {
        const origPath = getSystemPath(normalize(outputTarget[pathVar] as string));
        outputTarget = Object.assign(outputTarget, {
          [pathVar]: origPath.replace(values.projectRoot, values.distDir)
        });
      }
    });
    return outputTarget;
  });
}
