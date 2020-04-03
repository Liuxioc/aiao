import { Component, ComponentInterface, Element, h, Host, Prop } from '@stencil/core';

import { Color, CssClassMap } from '../../../interface';
import { getAiaoMode } from '../../global/global';
import { createColorClasses, hostContext } from '../../utils/theme';

@Component({
  tag: 'aiao-action-bar',
  styleUrl: 'action-bar.scss',
  shadow: true
})
export class ActionBar implements ComponentInterface {
  private childrenStyles = new Map<string, CssClassMap>();

  @Element() el!: HTMLElement;

  // --------------------------------------------------------------[ State ]
  // --------------------------------------------------------------[ Event ]
  // --------------------------------------------------------------[ Prop ]
  @Prop() color?: Color;

  // --------------------------------------------------------------[ Watch ]
  // --------------------------------------------------------------[ Listen ]
  // --------------------------------------------------------------[ event hander ]
  // --------------------------------------------------------------[ public function ]
  // --------------------------------------------------------------[ private function ]
  // --------------------------------------------------------------[ lifecycle ]
  render() {
    const mode = getAiaoMode(this);
    const childStyles = {};
    this.childrenStyles.forEach(value => {
      Object.assign(childStyles, value);
    });
    return (
      <Host
        class={{
          'in-action-bar': hostContext('aiao-action-bar', this.el),
          [mode]: true,
          ...childStyles,
          ...createColorClasses(this.color)
        }}
      >
        <div class="action-bar-background"></div>
        <div class="action-bar-container">
          <slot name="start"></slot>
          <slot name="secondary"></slot>
          <div class="action-bar-content">
            <slot></slot>
          </div>
          <slot name="primary"></slot>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
