import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CarouselModule } from '../../node_modules/ngx-bootstrap/carousel';

import { AppComponent } from './app.component';
import { ComingSoonComponent } from './components/coming.soon/coming.soon.component';

@NgModule({
  declarations: [
    AppComponent,
    ComingSoonComponent
  ],
  imports: [
    BrowserModule,
    CarouselModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
