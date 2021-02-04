import { JsonObject } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';

export interface StencilBuildOptions extends JsonObject {
  projectType?: ProjectType;
  configPath: string;

  assets?: any[];
  ci?: boolean;
  debug?: boolean;
  dev?: boolean;
  docs?: boolean;
  port?: number;
  prerender?: boolean;
  serve?: boolean;
  stats?: boolean;
  verbose?: boolean;
  watch?: boolean;
}
