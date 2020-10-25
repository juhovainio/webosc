import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControllerPageRoutingModule } from './controller-routing.module';

import { ControllerPage } from './controller.page';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControllerPageRoutingModule,
    ColorPickerModule
  ],
  declarations: [ControllerPage]
})
export class ControllerPageModule {}
