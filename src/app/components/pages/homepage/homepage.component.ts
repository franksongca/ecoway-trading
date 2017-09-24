import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  carousel;

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
