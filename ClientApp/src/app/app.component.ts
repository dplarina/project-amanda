import { Component } from '@angular/core';
import { TopNavService } from './top-nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title$ = this.topNav.title$;
  backRoute$ = this.topNav.backRoute$;
  editing$ = this.topNav.editing$;
  editable$ = this.topNav.editable$;

  constructor(private topNav: TopNavService) {}

  toggleEdit(): void {
    this.topNav.editing$.next(!this.topNav.editing$.value);
  }
}
