import { StencilBuildOptions } from '../builders/build/shcema';
import { StencilE2EOptions } from '../builders/e2e/schema';
import { StencilTestOptions } from '../builders/test/schema';

export function parseRunParameters(
  runOptions: string[],
  options: StencilBuildOptions | StencilTestOptions | StencilE2EOptions
) {
  Object.keys(options).forEach(optionKey => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return runOptions;
}
