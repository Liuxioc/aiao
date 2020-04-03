import { Color, CssClassMap } from '../../interface';

export const hostContext = (selector: string, el: HTMLElement): boolean => el.closest(selector) !== null;

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export const createColorClasses = (color: Color | undefined | null): CssClassMap | undefined => {
  return typeof color === 'string' && color.length > 0
    ? {
        'aiao-color': true,
        [`aiao-color-${color}`]: true
      }
    : undefined;
};

export const getClassList = (classes: string | (string | null | undefined)[] | undefined): string[] => {
  if (classes !== undefined) {
    const array = Array.isArray(classes) ? classes : classes.split(' ');
    return array
      .filter(c => c != null)
      .map(c => (c as string).trim())
      .filter(c => c !== '');
  }
  return [];
};

export const getClassMap = (classes: string | string[] | undefined): CssClassMap => {
  const map: CssClassMap = {};
  getClassList(classes).forEach(c => (map[c] = true));
  return map;
};
