import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  copyRight;
  dateLabel;
  constructor(){
    ConfigService.getConfig().subscribe(
      response => {
        this.copyRight = response.copyRight;
        this.dateLabel = response.date;
      },
      () => console.log('load config error occurs!')
    );
  }

  ngOnInit() {
  }

}
