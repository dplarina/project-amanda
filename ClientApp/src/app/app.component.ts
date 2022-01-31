import { Component } from '@angular/core';
import { fadeAnimation } from './animations';
import { SignalrService } from './signalr.service';
import { TopNavService } from './top-nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  title$ = this.topNav.title$;
  backRoute$ = this.topNav.backRoute$;
  editing$ = this.topNav.editing$;
  editable$ = this.topNav.editable$;
  settingsUrl$ = this.topNav.settingsUrl$;

  constructor(private topNav: TopNavService, private changes: SignalrService) {
    this.changes.connect();
  }

  toggleEdit(): void {
    this.topNav.editing$.next(!this.topNav.editing$.value);
  }
}
