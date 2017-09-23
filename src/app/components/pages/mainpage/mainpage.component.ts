import { Component, OnInit } from '@angular/core';
import { ActionService } from './../../../services/action.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  currentPage = 0;
  
  constructor() {
    ActionService.Action = 0;
    ActionService.onMenuItemSelected.subscribe((action) => {
      this.currentPage = action;

      ActionService.closeDropdown();
      
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
