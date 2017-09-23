import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ngx-bootstrap/alert';

import { CarouselModule } from '../../node_modules/ngx-bootstrap/carousel';

import { AppComponent } from './app.component';
import { ComingSoonComponent } from './components/coming.soon/coming.soon.component';
import { ConfigService } from './services/config.service';
import { ActionService } from './services/action.service';
import { MaintainingComponent } from './components/maintaining/maintaining/maintaining.component';
import { HomepageComponent } from './components/pages/mainpage/homepage.component';
import { BannerComponent } from './components/pages/banner/banner.component';
import { MenuComponent } from './components/pages/menu/menu.component';
import { DropdownComponent } from './components/pages/dropdown.menu/dropdown.menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ComingSoonComponent,
    MaintainingComponent,
    HomepageComponent,
    BannerComponent,
    MenuComponent,
    DropdownComponent
  ],
  imports: [
    AlertModule.forRoot(),
    HttpModule,
    BrowserModule,
    CarouselModule.forRoot()
  ],
  providers: [
    ConfigService,
    ActionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
