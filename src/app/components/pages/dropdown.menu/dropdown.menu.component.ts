import { Component, OnInit } from '@angular/core';
import { MenuShared } from './../menu.shared';

@Component({
  selector: 'dropdown-menu',
  templateUrl: './dropdown.menu.component.html',
  styleUrls: ['./dropdown.menu.component.css']
})
export class DropdownComponent extends MenuShared implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
