import { Component, OnInit, HostListener } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  carousel;
  carouselInfo = {
    carouselWidth: window.innerWidth,
    carouselItemWidth: 480,
    carouselHeight: 270
}

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.adjustCarousel();
    this.carouselInfo.carouselWidth = event.target.innerWidth;
  }

  constructor(){
    ConfigService.getConfig().subscribe(
      response => {
        this.carousel = response.carousel;
      },
      () => console.log('load config error occurs!')
    );
  }

  ngOnInit() {
  }

  adjustCarousel() {
  }

}
