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

  static  MOVE_LEFT = 0;
  static  MOVE_RIGHT = 1;

  autoPlayHandler;
  carouselIndex = 0;
  allowMoveLeft = true;
  allowMoveRight = false;
  inAutoPlaying = false;
  idleCount;
  idleCountIndex = 0;
  moveingDir = CarouselComponent.MOVE_LEFT; //'to-left';

  onMouseMove(e) {
    if (!this.inAutoPlaying) {
      console.log('reset idel')
      this.idleCountIndex = 0;
    }
  }

  moveLeft(drivenBy) {
    if (this.carouselIndex > -(this.carouselItems.length - 2)) {
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
    this.idleCount = Math.round(this.carouselInfo.autoPlay.idle / this.carouselInfo.autoPlay.duration);

    if (this.carouselInfo.autoPlay.enable) {
      let timer = Observable.timer(this.carouselInfo.autoPlay.delay, this.carouselInfo.autoPlay.duration);
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

  stopAutoPlay() {
    this.inAutoPlaying = false;
    this.idleCountIndex = 0;
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
