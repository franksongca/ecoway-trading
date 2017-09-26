import { Component, OnInit, HostListener } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  carouselWidth = window.innerWidth;
  carousel;

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.carouselWidth = event.target.innerWidth;
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

}
