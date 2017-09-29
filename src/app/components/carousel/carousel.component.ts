import { style, transition, animate, trigger, sequence, stagger, query } from '@angular/animations';
import { Component, OnInit, Input, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'yu-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  animations: [
    trigger('move', [
      transition('* => *', [
        animate(1000, style({ left: '{{itemLeft}}' })),
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit, OnChanges {
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

  moveStyleData = '';
  itemLeft = '0px';
  itemLeftDelay = '0px';
  animateTime = 1000;
  timer;

  public currentMoveDir = 'left';
  // private moveStyleDataValues = {
  //   left: { value: 'left;', data: {'moveStyle': { marginLeft: (-1*this.carouselInfo.originalWidth) + 'px'}}},
  //   right: {value: 'right;', data: {'moveStyle': { marginLeft: this.carouselInfo.originalWidth + 'px'}}}
  // }

  // get moveStyleData() {
  //   return this.moveStyleDataValues[this.currentMoveDir];
  // }

  moveLeft() {
    if (this.carouselIndex < this.maxCarouselPieces - 2) {
      this.carouselIndex++;
    }

    this.itemLeft = -(this.carouselIndex * this.carouselInfo.originalWidth) + 'px';
    this.moveStyleData = 'right';
    this.delaySetLeft();
    this.updateArrowButtonStatus();
  }

  moveRight() {
    if (this.carouselIndex > 0) {
      this.carouselIndex--;
    }

    this.itemLeft = -(this.carouselIndex * this.carouselInfo.originalWidth) + 'px';
    this.moveStyleData = 'left';
    this.delaySetLeft();
    this.updateArrowButtonStatus();
  }



  delaySetLeft() {
    window.setTimeout(() => {
      this.itemLeftDelay = this.itemLeft;
      this.moveStyleData = '';
    }, 1000);
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
