import { style, transition, animate, trigger, sequence, stagger, query } from '@angular/animations';
import { Component, OnInit, Input, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'yu-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnChanges {
  @Input() carouselItems: any;
  @Input() carouselInfo: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustCarouselInfo();
  }
//transform: translate(50px, 100px)
  allowMoveLeft = true;
  allowMoveRight = false;
  animateTime = 1000;
  timer;

  moveLeft() {
    // move the first one to the end
    let one = this.carouselItems.shift();
    this.carouselItems.push(one)
  }

  moveRight() {
    // move the last to the top
    let one = this.carouselItems.pop();
    this.carouselItems.unshift(one);
  }

  constructor() {
    this.adjustCarouselInfo();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.adjustCarouselInfo();
  }

  adjustCarouselInfo() {
    if (!this.carouselInfo) {
      return;
    }

    if (window.innerWidth < this.carouselInfo.contentWidth) {
      this.carouselInfo.originalWidth = window.innerWidth/2;
    } else {
      this.carouselInfo.originalWidth = this.carouselInfo.contentWidth/2;
    }
    this.carouselInfo.originalHeight = this.carouselInfo.originalWidth * this.carouselInfo.ratioY;
  }

}
