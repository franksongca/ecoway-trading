import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, OnInit, Input, HostListener, SimpleChanges, OnChanges, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'yu-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  // animations: [
  //   trigger('moveAnimation', [
  //     state('moveLeft',   style({
  //       transform: translate(50px, 100px)
  //     })),
  //   ]),
  // ]
})
export class CarouselComponent implements OnInit, OnChanges {
  @ViewChild('carouselContent') el:ElementRef;
  @Input() carouselItems: any;
  @Input() carouselInfo: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustCarouselInfo();
  }
//transform: translate(50px, 100px)
  maxCarouselPieces;
  carouselIndex = 0;  // at the beginning, set the first one at the left
  allowMoveLeft = true;
  allowMoveRight = false;

  moveLeft() {
    //this.el.nativeElement.
  }

  moveRight() {

  }


  constructor() {
    this.adjustCarouselInfo();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.maxCarouselPieces = this.carouselItems.length;

    this.adjustCarouselInfo();
  }

  updateArrowButtonStatus() {
    if (this.carouselIndex === 0) {
      this.allowMoveLeft = true;
      this.allowMoveRight = false;
    } else if (this.carouselIndex === this.maxCarouselPieces - 2) {
      this.allowMoveLeft = false;
      this.allowMoveRight = true;
    } else {
      this.allowMoveLeft = true;
      this.allowMoveRight = true;
    }
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
