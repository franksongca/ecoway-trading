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

  mouseEventManager;
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
    console.log('moveLeft');
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
    console.log('moveRight');
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

    this.mouseEventManager = new MouseEventManager();
    this.mouseEventManager.onNotifyMoveCarousel.subscribe((dir) => {
      if (dir === 0 && (this.carouselIndex > -(this.carouselInfo.items.length - this.carouselInfo.itemsInOneScreen))) {
        this.moveLeft('auto');
      } else if (dir === 1 && (this.carouselIndex < 0)) {
        this.moveRight('auto');
      }
    });
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
    this.mouseEventManager.wait((goForward) => {
      if (goForward) {
        this.stopAutoPlay();
        this.onNotifyCarouselSelected.emit(id);
      }
    });
  }

  down(e) {
    this.stopAutoPlay();

    console.log('down ');
    e.stopPropagation();
    e.preventDefault();
    this.mouseEventManager.start(e.clientX);
  }

  up(e) {
    console.log('up ');
    e.stopPropagation();
    e.preventDefault();
    this.mouseEventManager.stop(e.clientX);
  }
}

export class MouseEventManager {
  static MINI_DURATION:number = 300;
  static MINI_DISTANCE: number = 20;
  static WAITING_TIME: number = 500;
  static EXPIRED_TIME:number = 2000;
  static instance;

  @Output() onNotifyMoveCarousel: EventEmitter<Object> = new EventEmitter<number>();

  constructor() {
    if (MouseEventManager.instance) {
      return MouseEventManager.instance;
    }

    MouseEventManager.instance = this;
  }

  allowCheckTimer;
  expiredCheckTimer;
  positionX = -1;
  startTime = 0;
  allowClick = false;

  wait(callback) {
    if (this.allowCheckTimer) {
      this.allowCheckTimer.unsubscribe();
    }

    this.allowCheckTimer = Observable.timer(MouseEventManager.WAITING_TIME)
      .subscribe(() => {
        callback(MouseEventManager.instance.allowClick);
      });
  }

  start(positionX) {
    console.log('start: '+positionX);
    this.expiredCheckTimer = Observable.timer(MouseEventManager.EXPIRED_TIME)
      .subscribe(() => {
        MouseEventManager.instance.allowClick = false;
        MouseEventManager.instance.positionX = -1;
      });

    this.allowClick = false;
    this.positionX = positionX;
    this.startTime = Date.now();
  }

  stop(positionX) {
    if (this.positionX === -1) {
      return;
    }


    this.expiredCheckTimer.unsubscribe();

    if (Math.abs(positionX - this.positionX) > MouseEventManager.MINI_DISTANCE) {

      console.log('start x ' + this.positionX + ', ' + positionX + ', ' + (positionX > this.positionX ? 1 : 0));

      this.onNotifyMoveCarousel.emit(positionX > this.positionX ? 1 : 0); // 1=right, 0=left
      this.positionX = -1;
    } else {
      this.allowClick = true;
    }
  }
}

