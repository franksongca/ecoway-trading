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

  @Output() onNotifyCarouselSelected: EventEmitter<Object> = new EventEmitter<any>();

  autoPlayHandler;
  carouselIndex = 0;
  allowMoveLeft = true;
  allowMoveRight = false;
  inAutoPlaying = false;
  idleCount;
  idleCountIndex = 0;

  pointer = {x: -1, y: -1};

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

    if (!changes['carouselInfo'].previousValue && !this.idleCount) {
      this.idleCount = Math.round(this.carouselInfo.autoPlay.idle / this.carouselInfo.autoPlay.duration);
      this.carouselInfo['originalWidth'] = this.carouselInfo.maxWidth / this.carouselInfo.itemsInOneScreen;
      this.carouselInfo['originalHeight'] = this.carouselInfo['originalWidth'] * this.carouselInfo.ratioHW;

      this.carouselInfo.items.forEach((item) => {
        if (item['multiple'] === undefined) {
          item['multiple'] = false;
          if (item.hasOwnProperty('items')) {
            item['multiple'] = true;
            item.items.forEach((child) => {
              child['size'] = {};
              child['position'] = {};
              child.size.width = child.sizeRatio.width * this.carouselInfo.originalWidth;
              child.size.height = child.sizeRatio.height * this.carouselInfo.originalHeight;
              child.position.x = child.positionRatio.x * this.carouselInfo.originalWidth;
              child.position.y = child.positionRatio.y * this.carouselInfo.originalHeight;
            });
          }
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

    if (window.innerWidth < this.carouselInfo.maxWidth) {
      this.carouselInfo.originalWidth = window.innerWidth / this.carouselInfo.itemsInOneScreen;
    } else {
      this.carouselInfo.originalWidth = this.carouselInfo.maxWidth / this.carouselInfo.itemsInOneScreen;
    }
    this.carouselInfo.originalHeight = this.carouselInfo.originalWidth * this.carouselInfo.ratioHW;

    this.carouselInfo.items.forEach((item) => {
      if (item['multiple'] === true) {
        item.items.forEach((child) => {
          child.size.width = child.sizeRatio.width * this.carouselInfo.originalWidth;
          child.size.height = child.sizeRatio.height * this.carouselInfo.originalHeight;
          child.position.x = child.positionRatio.x * this.carouselInfo.originalWidth;
          child.position.y = child.positionRatio.y * this.carouselInfo.originalHeight;
        });
      }
    });
  }

  onCarouselItemSelected(id) {
    console.log('onCarouselItemSelected ' + id);
    this.stopAutoPlay();
    this.onNotifyCarouselSelected.emit(id);
  }

  down(e) {
    console.log('down ');
    e.stopPropagation();
    e.preventDefault();
    //alert('swapped!');
  }

  up(e) {
    console.log('up ');
    e.stopPropagation();
    //alert('swapped!');
  }
}
