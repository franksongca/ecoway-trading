import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchEventModule } from 'ng2-events/lib/touch'
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  imports: [
    CommonModule,
    TouchEventModule
  ],
  declarations: [
    CarouselComponent
  ],
  exports: [
    CarouselComponent
  ]
})
export class EasyCarouselModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: EasyCarouselModule, providers: []};
  }
}
