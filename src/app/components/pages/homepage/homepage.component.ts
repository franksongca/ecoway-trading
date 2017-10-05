import { Component, OnInit, HostListener } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  carouselInfo;


  constructor(){
    ConfigService.getConfig().subscribe(
      response => {
        setTimeout(() => {
          this.carouselInfo = response.carousel;
        });
      },
      () => console.log('load config error occurs!')
    );
  }

  onCarouselSelected(carouselIndex) {
    console.log('carouselIndex selected in homepage', carouselIndex);
  }

  ngOnInit() {
  }

}
