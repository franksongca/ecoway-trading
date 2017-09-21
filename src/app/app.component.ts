import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  slides = [
    {
      image: './assets/img/1.png',
      text: 'Slide 1'
    },
    {
      image: './assets/img/2.png',
      text: 'Slide 2'
    },
    {
      image: './assets/img/3.png',
      text: 'Slide 3'
    },
    {
      image: './assets/img/4.png',
      text: 'Slide 4'
    }

  ];
}
