import { Component, OnInit, HostListener } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  carouselItems;
  carouselInfo;


  constructor(){
    ConfigService.getConfig().subscribe(
      response => {
        this.carouselInfo = {
          contentWidth: response.pageInfo.contentWidth,
          originalWidth: response.carousel.originalWidth,
          originalHeight: response.carousel.originalHeight,
          speed: response.carousel.interval,
          ratioY: response.carousel.originalHeight/response.carousel.originalWidth
        };

        this.carouselItems = response.carousel.items;
      },
      () => console.log('load config error occurs!')
    );
  }

  ngOnInit() {
  }

}
