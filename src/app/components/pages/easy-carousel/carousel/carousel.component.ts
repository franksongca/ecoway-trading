import { Component, OnInit, Output, EventEmitter, Input, HostListener, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'easy-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnChanges {
  static MIN_IDEL_TIME = 5000;
  static  MOVE_LEFT = 0;
  static  MOVE_RIGHT = 1;

  @Input() carouselInfo: any;

  @Output() onNotifyCarouselSelected: EventEmitter<Object> = new EventEmitter<any>();

  selectedCarouselItem;
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

    if (this.carouselInfo.looping) {
      if (this.carouselIndex === -(this.carouselInfo.items.length - this.carouselInfo.itemsInOneScreen)) {
        // when cannot go left furher, move the first item to the right end
        // but need to update the position of the carousel items

        let t = this.carouselInfo.animationDuration;
        this.carouselInfo.animationDuration = 0;
        this.carouselIndex = -(this.carouselInfo.items.length - this.carouselInfo.itemsInOneScreen) + 1;
        let firstItem = this.carouselInfo.items.shift();
        this.carouselInfo.items.push(firstItem);

        Observable.timer(0).subscribe(() => {
          this.carouselInfo.animationDuration = t;
          this.carouselIndex--;
        });
      } else {
        this.carouselIndex--;
      }


      if (!this.inAutoPlaying) {
        this.moveingDir = CarouselComponent.MOVE_LEFT;
      } else {
        if (drivenBy === 'byMouse') {
          this.stopAutoPlay();
        }
      }
    } else {
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
  }

  moveRight(drivenBy) {
    console.log('moveRight');

    if (this.carouselInfo.looping) {
      if (this.carouselIndex === 0) {
        // when cannot go right furher, move the last item to the left end
        // but need to update the position of the carousel items

        let t = this.carouselInfo.animationDuration;
        this.carouselInfo.animationDuration = 0;
        this.carouselIndex = -1;
        let lastItem = this.carouselInfo.items.pop();
        this.carouselInfo.items.unshift(lastItem);

        Observable.timer(0).subscribe(() => {
          this.carouselInfo.animationDuration = t;
          this.carouselIndex++;
        });
      } else {
        this.carouselIndex++;
      }

      if (!this.inAutoPlaying) {
        this.moveingDir = CarouselComponent.MOVE_RIGHT;
      } else {
        if (drivenBy === 'byMouse') {
          this.stopAutoPlay();
        }
      }
    } else {
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
  }

  constructor() {
    this.mouseEventManager = new MouseEventManager();
    this.mouseEventManager.onNotifyMoveCarousel.subscribe((dir) => {
      if (dir === 0) {
        if (this.carouselInfo.looping || (this.carouselIndex > -(this.carouselInfo.items.length - this.carouselInfo.itemsInOneScreen))) {
          this.moveLeft('auto');
        }
      } else {
        if (this.carouselInfo.looping || this.carouselIndex < 0) {
          this.moveRight('auto');
        }
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    Observable.timer(100).subscribe(() => {
      this.adjustCarouselInfo();
    });
  }

  stopAutoPlay() {
    this.inAutoPlaying = false;
    this.idleCountIndex = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['carouselInfo'].previousValue && changes['carouselInfo'].currentValue && !this.idleCount) {
      if (this.carouselInfo.looping) {
        this.allowMoveLeft = true;
        this.allowMoveRight = true;
      }

      this.idleCount = Math.round(CarouselComponent.MIN_IDEL_TIME / this.carouselInfo.autoPlay.duration);
      if (this.idleCount === 0) {
        this.idleCount = 1;
      }
      this.carouselInfo['originalWidth'] = this.carouselInfo.maxWidth / this.carouselInfo.itemsInOneScreen;
      this.carouselInfo['originalHeight'] = this.carouselInfo['originalWidth'] * this.carouselInfo.ratioHW;

      if (!this.carouselInfo.carouselItemInfo.itemOutlineWidth) {
        this.carouselInfo.carouselItemInfo.itemOutlineWidth = 1;
      }
      if (!this.carouselInfo.carouselChildItemInfo.itemOutlineWidth) {
        this.carouselInfo.carouselChildItemInfo.itemOutlineWidth = 1;
      }

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
      this.adjustCarouselInfo();
    }
  }

  updateArrowButtonStatus() {
    if (this.carouselInfo.looping) {
      return;
    }

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

    this.carouselInfo.selectedItemInfo.opacity = 0;

    this.carouselInfo.carouselItemInfo['nameFontSize'] = this.carouselInfo['originalHeight']/7.5;
    if (this.carouselInfo.carouselItemInfo['nameFontSize'] > this.carouselInfo.carouselItemInfo['maxFontSize']) {
      this.carouselInfo.carouselItemInfo['nameFontSize'] = this.carouselInfo.carouselItemInfo['maxFontSize']
    }
    if (this.carouselInfo.carouselItemInfo['nameFontSize'] < this.carouselInfo.carouselItemInfo['minFontSize']) {
      this.carouselInfo.carouselItemInfo['nameFontSize'] = this.carouselInfo.carouselItemInfo['minFontSize']
    }
    this.carouselInfo.carouselItemInfo['descFontSize'] = this.carouselInfo.carouselItemInfo['nameFontSize'] * 0.8;

    this.carouselInfo.carouselChildItemInfo['nameFontSize'] = this.carouselInfo['originalHeight']/7.5 * 0.7;
    if (this.carouselInfo.carouselChildItemInfo['nameFontSize'] > this.carouselInfo.carouselChildItemInfo['maxFontSize']) {
      this.carouselInfo.carouselChildItemInfo['nameFontSize'] = this.carouselInfo.carouselChildItemInfo['maxFontSize']
    }
    if (this.carouselInfo.carouselChildItemInfo['nameFontSize'] < this.carouselInfo.carouselChildItemInfo['minFontSize']) {
      this.carouselInfo.carouselChildItemInfo['nameFontSize'] = this.carouselInfo.carouselChildItemInfo['minFontSize']
    }
    this.carouselInfo.carouselChildItemInfo['descFontSize'] = this.carouselInfo.carouselItemInfo['nameFontSize'] * 0.8;

    this.carouselInfo.selectedItemInfo['nameFontSize'] = this.carouselInfo['originalHeight']/7.5 * 0.7;
    if (this.carouselInfo.selectedItemInfo['nameFontSize'] > this.carouselInfo.selectedItemInfo['maxFontSize']) {
      this.carouselInfo.selectedItemInfo['nameFontSize'] = this.carouselInfo.selectedItemInfo['maxFontSize']
    }
    if (this.carouselInfo.selectedItemInfo['nameFontSize'] < this.carouselInfo.selectedItemInfo['minFontSize']) {
      this.carouselInfo.selectedItemInfo['nameFontSize'] = this.carouselInfo.selectedItemInfo['minFontSize']
    }
    this.carouselInfo.selectedItemInfo['descFontSize'] = this.carouselInfo.selectedItemInfo['nameFontSize'] * 0.8;
    this.carouselInfo.selectedItemInfo['deatilsFontSize'] = this.carouselInfo.selectedItemInfo['nameFontSize'] * 0.7;

    this.carouselInfo.originalHeight = this.carouselInfo.originalWidth * this.carouselInfo.ratioHW;
    this.carouselInfo.items.forEach((item) => {
      if (item['multiple'] === true) {
        item.items.forEach((child) => {
          child.size.width = child.sizeRatio.width * this.carouselInfo.originalWidth;
          child.size.height = child.sizeRatio.height * this.carouselInfo.originalHeight;
          child.position.x = child.positionRatio.x * this.carouselInfo.originalWidth;
          child.position.y = child.positionRatio.y * this.carouselInfo.originalHeight;

          if (!child.selectedImg) {
            child.selectedImg = child.img;
          }

        });
      } else {
        if (!item.selectedImg) {
          item.selectedImg = item.img;
        }
      }
    });
  }

  onCarouselItemSelected(item) {
    if (item === undefined) {
      return;
    }
    this.mouseEventManager.wait((goForward) => {
      if (goForward) {
        this.stopAutoPlay();

        if (!!this.carouselInfo.selectedItemInfo) {
          this.selectedCarouselItem = item;
          Observable.timer(0).subscribe(() => {
            this.carouselInfo.selectedItemInfo.opacity = 1;
          });
        }

        this.onNotifyCarouselSelected.emit(item.id);
      }
    });
  }

  onSelectedItemClicked(id) {
    alert('element ' + id + ' selected!');
  }

  closeSelected() {
    this.carouselInfo.selectedItemInfo.opacity = 0;

    Observable.timer(1000).subscribe(() => {
      this.selectedCarouselItem = undefined;
    });
  }

  down(e) {
    if (e.clientX === undefined) {
      return;
    }
    this.stopAutoPlay();
    e.stopPropagation();
    e.preventDefault();
    this.mouseEventManager.start(e.clientX);
  }
  up(e) {
    if (e.clientX === undefined) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    this.mouseEventManager.stop(e.clientX);
  }
}
export class MouseEventManager {
  static MINI_DISTANCE: number = 20;
  static WAITING_TIME: number = 500;
  static EXPIRED_TIME:number = 2000;
  @Output() onNotifyMoveCarousel: EventEmitter<Object> = new EventEmitter<number>();
  constructor() {
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
        callback(this.allowClick);
      });
  }
  start(positionX) {
    console.log('start: '+positionX);
    this.expiredCheckTimer = Observable.timer(MouseEventManager.EXPIRED_TIME)
      .subscribe(() => {
        this.allowClick = false;
        this.positionX = -1;
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
