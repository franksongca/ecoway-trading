import { BrowserModule } from '@angular/platform-browser';
import { NgModule  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ngx-bootstrap/alert';
import { EasyCarouselModule } from 'easy-carousel/build/easy-carousel.module';
import { AppComponent } from './app.component';
import { ComingSoonComponent } from './components/coming.soon/coming.soon.component';
import { ConfigService } from './services/config.service';
import { ActionService } from './services/action.service';
import { MaintainingComponent } from './components/maintaining/maintaining/maintaining.component';
import { MainpageComponent } from './components/pages/mainpage/mainpage.component';
import { BannerComponent } from './components/pages/banner/banner.component';
import { MenuComponent } from './components/pages/banner/menu/menu.component';
import { DropdownComponent } from './components/pages/banner/dropdown.menu/dropdown.menu.component';
import { HomepageComponent } from './components/pages/homepage/homepage.component';
import { AbortpageComponent } from './components/pages/abortpage/abortpage.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { FooterComponent } from './components/pages/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ComingSoonComponent,
    MaintainingComponent,
    MainpageComponent,
    BannerComponent,
    MenuComponent,
    DropdownComponent,
    HomepageComponent,
    AbortpageComponent,
    ProductsComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent
  ],
  imports: [
    AlertModule.forRoot(),
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    EasyCarouselModule.forRoot()
  ],
  providers: [
    ConfigService,
    ActionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
