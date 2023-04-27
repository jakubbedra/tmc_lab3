import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tmc_lab3';

  position: [number, number];

  appPositionChanged($event: [number, number]) {
    this.position = [$event.pop(), $event.pop()];
  }
}
