import { getMode, setMode } from '@stencil/core';

import { Mode } from '../../interface';
import { IAiaoElementsConfig } from '../interfaces/elements.interface';
import { isPlatform } from '../utils/platform';
import { config } from './config';

declare const Context: any;
let defaultMode: Mode;

export const getAiaoMode = (ref?: any): Mode => (ref && getMode(ref)) || defaultMode;

export default () => {
  const doc = document;
  const win: any = window;
  const aiao = (win.aiao = win.aiao || {});

  // config
  const elements: any = (aiao['elements'] = aiao['elements'] || {});
  elements.Context = Context;
  const conf: IAiaoElementsConfig = {
    resourcesUrl: './',
    ...elements.config
  };
  config.reset(conf);
  elements.config = config;

  // mode
  elements.mode = defaultMode = config.get(
    'mode',
    doc.documentElement.getAttribute('mode') || (isPlatform(win, 'ios') ? 'ios' : 'md')
  );

  config.set('mode', defaultMode);
  doc.documentElement.setAttribute('mode', defaultMode);
  doc.documentElement.classList.add(defaultMode);
  const isAiaoElement = (elm: any) => elm.tagName && elm.tagName.startsWith('AIAO-');
  const isAllowedAiaoModeValue = (elmMode: string) => ['ios', 'md'].includes(elmMode);
  setMode((elm: any) => {
    while (elm) {
      const elmMode = (elm as any).mode || elm.getAttribute('mode');
      if (elmMode) {
        if (isAllowedAiaoModeValue(elmMode)) {
          return elmMode;
        } else if (isAiaoElement(elm)) {
          console.warn('Invalid aiao mode: "' + elmMode + '", expected: "ios" or "md"');
        }
      }
      elm = elm.parentElement;
    }
    return defaultMode;
  });
};
