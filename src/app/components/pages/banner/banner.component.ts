import { Component, OnInit } from '@angular/core';
import { ActionService } from './../../../services/action.service';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  status = 1;

  constructor() {
    ActionService.onDropdownClose.subscribe(() => {
      if (this.status) {
        this.toggleMenu();
      }
    });
  }

  toggleMenu() {
    document.getElementById('dropdown-menu').classList.toggle('closed');
    this.status = 1 - this.status;
  }

  goHome() {
    ActionService.Action = ActionService.ACTIONS.HOME;
    if (this.status) {
      this.toggleMenu();
    }
  }

  ngOnInit() {
    this.toggleMenu();
  }
}
