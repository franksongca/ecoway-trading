import { ConfigService } from '../../../services/config.service';
import { ActionService } from '../../../services/action.service';

export class MenuShared {
  action = 0;
  menu;

  constructor() {
    ConfigService.getConfig().subscribe(
      response => {
        this.menu = response.menu;
      },
      () => console.log('load config error occurs!')
    );

    ActionService.onMenuItemSelected.subscribe((action) => {
      this.action = action;
    });

  }

  doAction(action) {
    this.action = action;
    ActionService.doAction(action);
  }
}
