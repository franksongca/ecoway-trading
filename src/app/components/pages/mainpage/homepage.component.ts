import { Component, OnInit } from '@angular/core';
import { ActionService } from './../../../services/action.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor() {
    ActionService.Action = 0;
    ActionService.onMenuItemSelected.subscribe((action) => {
      alert(action)
      switch (action) {
        case ActionService.ACTIONS.ABOUT:
              break;
        case ActionService.ACTIONS.PRODUCTS:
          break;
        case ActionService.ACTIONS.SERVICES:
          break;
        case ActionService.ACTIONS.CONTACT:
          break;
      }
    });
  }

  ngOnInit() {
  }

}
