import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ActionService {
  static onMenuItemSelected:EventEmitter<Number> = new EventEmitter();
  static onDropdownClose:EventEmitter<Object> = new EventEmitter();

  static ACTIONS = {
    HOME: 0,
    ABOUT: 1,
    PRODUCTS: 2,
    SERVICES: 3,
    CONTACT: 4
  };

  private static _action;

  public static get Action() {
      return ActionService._action;
  }

  public static set Action(action) {
    ActionService._action = action;
    ActionService.onMenuItemSelected.emit(action);
  }

  constructor() { }

  public static doAction(action) {
    ActionService.onMenuItemSelected.emit(action);
  }

  public static closeDropdown() {
    ActionService.onDropdownClose.emit();
  }

}
