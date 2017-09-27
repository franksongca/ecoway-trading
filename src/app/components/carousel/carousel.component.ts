import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'yu-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() carouselItems: any;

  constructor() {

  }

  ngOnInit() {
    let a = this.carouselItems;
  }

}
