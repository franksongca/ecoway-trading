import { Component, OnInit, Output, EventEmitter, Input, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'easy-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnChanges {
  static  MOVE_LEFT = 0;
  static  MOVE_RIGHT = 1;

  @Input() carouselInfo: any;

  @Output() onNotifyCarouselSelected: EventEmitter<number> = new EventEmitter<any>();

  ratioY;
  autoPlayHandler;
  carouselIndex = 0;
  allowMoveLeft = true;
  allowMoveRight = false;
  inAutoPlaying = false;
  idleCount;
  idleCountIndex = 0;
  moveingDir = CarouselComponent.MOVE_LEFT;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustCarouselInfo();
  }


  onMouseMove(e) {
    if (!this.inAutoPlaying) {
      console.log('reset idel');
      this.idleCountIndex = 0;
    }
  }

  moveLeft(drivenBy) {
    if (this.carouselIndex > -(this.carouselInfo.items.length - this.carouselInfo.itemsInOneScreen)) {
      this.carouselIndex--;
      if (!this.inAutoPlaying) {
        this.moveingDir = CarouselComponent.MOVE_LEFT;
      } else {
        if (drivenBy === 'byMouse') {
          this.stopAutoPlay();
        }
      }
      this.updateArrowButtonStatus();
    } else {
      if (drivenBy === 'auto') {
        this.moveingDir = CarouselComponent.MOVE_RIGHT;
        this.moveRight('auto');
      }
    }
  }

  moveRight(drivenBy) {
    if (this.carouselIndex < 0) {
      this.carouselIndex++;
      if (!this.inAutoPlaying) {
        this.moveingDir = CarouselComponent.MOVE_RIGHT;
      } else {
        if (drivenBy === 'byMouse') {
          this.stopAutoPlay();
        }
      }
      this.updateArrowButtonStatus();
    } else {
      if (drivenBy === 'auto') {
        this.moveingDir = CarouselComponent.MOVE_LEFT;
        this.moveLeft('auto');
      }
    }
  }

  constructor() {
    this.adjustCarouselInfo();
  }

  ngOnInit() {
  }

  stopAutoPlay() {
    this.inAutoPlaying = false;
    this.idleCountIndex = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['carouselInfo'].firstChange) {
      return;
    }

    if (!changes['carouselInfo'].previousValue) {
      this.idleCount = Math.round(this.carouselInfo.autoPlay.idle / this.carouselInfo.autoPlay.duration);
      this.ratioY = this.carouselInfo.originalHeight / this.carouselInfo.originalWidth;

      this.carouselInfo.items.forEach((item) => {
        item['multiple'] = false;
        if (item.hasOwnProperty('items')) {
          item['multiple'] = true;
          item.items.forEach((child) => {
            child.size.width = child.size.width * this.carouselInfo.originalWidth;
            child.size.height = child.size.height * this.carouselInfo.originalHeight;
            child['ratioY'] = child.size.height / child.size.width;
            child.position.x = child.position.x * this.carouselInfo.originalWidth;
            child.position.y = child.position.y * this.carouselInfo.originalHeight;
          });
        }
      });


      if (this.carouselInfo.autoPlay.enable) {
        const timer = Observable.timer(this.carouselInfo.autoPlay.delay, this.carouselInfo.autoPlay.duration);
        this.autoPlayHandler = timer.subscribe(() => {
          if (this.inAutoPlaying) {
            if (this.moveingDir === CarouselComponent.MOVE_LEFT) {
              this.moveLeft('auto');
            } else {
              this.moveRight('auto');
            }
          } else {
            if (!this.inAutoPlaying && this.idleCountIndex++ > this.idleCount) {
              this.inAutoPlaying = true;
            }
          }
        });
      }
    }

    this.adjustCarouselInfo();
  }

  updateArrowButtonStatus() {
    if (this.carouselIndex === 0) {
      this.allowMoveLeft = true;
      this.allowMoveRight = false;
    } else if (this.carouselIndex === -(this.carouselInfo.items.length - this.carouselInfo.itemsInOneScreen)) {
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
      this.carouselInfo.originalWidth = window.innerWidth / this.carouselInfo.itemsInOneScreen;
    } else {
      this.carouselInfo.originalWidth = this.carouselInfo.contentWidth / this.carouselInfo.itemsInOneScreen;
    }
    this.carouselInfo.originalHeight = this.carouselInfo.originalWidth * this.ratioY;
  }

  onCarouselItemSelected(n) {
    this.stopAutoPlay();
    this.onNotifyCarouselSelected.emit(n);
  }

}
