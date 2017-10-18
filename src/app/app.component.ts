import { Component } from '@angular/core';

import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  websiteStatus;

  constructor(private configService: ConfigService){
    ConfigService.getConfig().subscribe(
      response => {
        this.websiteStatus = response.websiteStatus;
      },
      () => console.log('load config error occurs!')
    );



  }
}
