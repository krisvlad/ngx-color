import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, NgModule } from '@angular/core';

import { AlphaModule, CheckboardModule, ColorWrap, EditableInputModule, HueModule } from 'ngx-color';
import { LandmarkSaturationModule } from './saturation.component';
import { LandmarkChromeFieldsComponent } from './chrome-fields.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


// <div class="chrome-controls">
//  <div class="chrome-color">
//    <div class="chrome-swatch">
//      <div class="chrome-active"
//        [style.background]="activeBackground"
//      ></div>
//      <color-checkboard></color-checkboard>
//    </div>
//    </div>
//   <div class="chrome-toggles">
//     <div class="chrome-hue">
//       <color-hue
//         [radius]="2"
//         [hsl]="hsl"
//         [pointer]="pointer"
//         (onChange)="handleValueChange($event)"
//       ></color-hue>
//     </div>
//     <div class="chrome-alpha" *ngIf="!disableAlpha">
//       <color-alpha
//         [radius]="2" [rgb]="rgb" [hsl]="hsl"
//         [pointer]="pointer" (onChange)="handleValueChange($event)"
//       ></color-alpha>
//     </div>
//   </div>
// </div>


@Component({
  selector: 'landmark-color-chrome',
  template: `
  <div class="chrome-picker {{ className }}">
    <div class="chrome-body-left">
      <div class="saturation">
        <landmark-color-saturation
          [hsl]="hsl"
          [hsv]="hsv"
          [circle]="circle"
          (onChange)="handleValueChange($event)"
        ></landmark-color-saturation>
      </div>
      <div class="chrome-body">
        <!-- was here originally -->
        <landmark-color-chrome-fields
          [rgb]="rgb" [hsl]="hsl" [hex]="hex"
          [disableAlpha]="disableAlpha"
          (onChange)="handleValueChange($event)"
        ></landmark-color-chrome-fields>
      </div>
    </div>
    <div class="chrome-body-right">
      <div class="chrome-color">
        <div class="chrome-swatch">
          <div class="chrome-active"
            [style.background]="activeBackground"
          ></div>
          <color-checkboard></color-checkboard>
        </div>
      </div>
      <div class="chrome-toggles">
        <div class="chrome-hue">
          <color-hue
            [radius]="2"
            [direction]='"vertical"'
            [hsl]="hsl"
            [pointer]="pointer"
            (onChange)="handleValueChange($event)"
          ></color-hue>
        </div>
        <div class="chrome-alpha" *ngIf="!disableAlpha">
          <color-alpha
            [radius]="2"
            [rgb]="rgb"
            [hsl]="hsl"
            [direction]='"vertical"'
            [pointer]="pointer" (onChange)="handleValueChange($event)"
          ></color-alpha>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
      .chrome-picker {
        padding: 10px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3);
        box-sizing: initial;
        width: 225px;
        font-family: 'Menlo';
        display: flex;
        flex-direction: row;
        gap: 10px
      }
      .chrome-controls {
        display: flex;
      }
      .chrome-color {
        width: 42px;
      }
      .chrome-body {
        padding: 14px 14px 12px;
      }
      .chrome-active {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 20px;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        z-index: 2;
      }
      .chrome-swatch {
        width: 28px;
        height: 28px;
        border-radius: 15px;
        position: relative;
        overflow: hidden;
      }
      .saturation {
        width: 100%;
        padding-bottom: 55%;
        position: relative;
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }
      .chrome-toggles {
        display: flex;
        flex-direction: row;
      }
      .chrome-hue {
        height: 100px;
        position: relative;
        margin-bottom: 8px;
        flex-grow: 1
      }
      .chrome-alpha {
        height: 100px;
        position: relative;
        flex-grow: 1
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LandmarkChromeComponent),
      multi: true,
    },
    {
      provide: ColorWrap,
      useExisting: forwardRef(() => LandmarkChromeComponent),
    },
  ]
})
export class LandmarkChromeComponent extends ColorWrap {
  /** Remove alpha slider and options from picker */
  @Input() disableAlpha = false;
  circle: Record<string, string> = {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
    transform: 'translate(-6px, -8px)',
  };
  pointer: Record<string, string> = {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    transform: 'translate(-6px, -2px)',
    backgroundColor: 'rgb(248, 248, 248)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
  };
  activeBackground!: string;

  constructor() {
    super();
  }

  afterValidChange() {
    const alpha = this.disableAlpha ? 1 : this.rgb.a;
    this.activeBackground = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${alpha})`;
  }
  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }
}

@NgModule({
  declarations: [LandmarkChromeComponent, LandmarkChromeFieldsComponent],
  exports: [LandmarkChromeComponent, LandmarkChromeFieldsComponent],
  imports: [
    CommonModule,
    AlphaModule,
    CheckboardModule,
    EditableInputModule,
    HueModule,
    LandmarkSaturationModule,
  ],
})
export class LandmarkColorChromeModule {}
