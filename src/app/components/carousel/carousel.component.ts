import { Component, OnInit, Output, EventEmitter, Input, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'yu-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnChanges {
  @Input() carouselItems: any;
  @Input() carouselInfo: any;

  @Output() onNotifyCarouselSelected: EventEmitter<number> = new EventEmitter<any>();
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustCarouselInfo();
  }

  autoPlayHandler;

  animationDuration = 2;
  carouselIndex = 0;
  allowMoveLeft = true;
  allowMoveRight = false;

  moveLeft() {
    if (this.carouselIndex > -(this.carouselItems.length - 2)) {
      this.carouselIndex--;
      this.updateArrowButtonStatus();
    }
  }

  moveRight() {
    if (this.carouselIndex < 0) {
      this.carouselIndex++;
      this.updateArrowButtonStatus();
    }

  }

  constructor() {
    this.adjustCarouselInfo();
  }

  ngOnInit() {
    if (this.carouselInfo.autoPlay.enable) {
      let timer = Observable.timer(this.carouselInfo.autoPlay.delay, this.carouselInfo.autoPlay.duration);
      this.autoPlayHandler = timer.subscribe(() => {
        if (this.allowMoveLeft) {
          this.moveLeft();
        } else {
          this.moveRight();
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.adjustCarouselInfo();
  }

  updateArrowButtonStatus() {
    if (this.carouselIndex === 0) {
      this.allowMoveLeft = true;
      this.allowMoveRight = false;
    } else if (this.carouselIndex === -(this.carouselItems.length -  2)) {
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

  onCarouselItemSelected(n) {
    this.onNotifyCarouselSelected.emit(n);
  }

}
