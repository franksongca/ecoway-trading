import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  imports: [
    CommonModule
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
