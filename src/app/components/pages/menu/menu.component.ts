import { Component, OnInit } from '@angular/core';
import { MenuShared } from './../menu.shared';

@Component({
  selector: 'horizontal-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends MenuShared implements OnInit {

  constructor(){
    super();
  }

  ngOnInit() {
  }

}
