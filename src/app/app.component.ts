import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewComponent } from './view/view.component';

@Component({
  selector: 'map-root',
  standalone: true,
  imports: [RouterOutlet, ViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'map';
}
