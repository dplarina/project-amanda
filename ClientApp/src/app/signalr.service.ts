import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { IRetryPolicy, RetryContext } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

class SignalrConnectionRetryPolicy implements IRetryPolicy {
  private readonly retryDelays = [0, 2000, 10000, 30000];

  public nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null {
    // if document is hidden do not retry connection
    if (document.hidden) {
      return null;
    }

    const delay: number =
      // if the count is higher than the size of the retry delay then always return last number
      // return the appropriate retryDelay to fake an exponential back-off
      retryContext.previousRetryCount > this.retryDelays.length - 1
        ? this.retryDelays[this.retryDelays.length - 1]
        : this.retryDelays[retryContext.previousRetryCount];
    console.debug(`Will attempt to reconnect in ${delay}ms`);

    return delay;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  refresh$ = new Subject();

  connection: signalR.HubConnection;

  get state(): signalR.HubConnectionState {
    return this.connection.state;
  }

  offline$ = new BehaviorSubject<boolean>(true);
  stateChanged$ = new BehaviorSubject<string>('');

  error$ = new Subject<Error>();
  connecting$ = new Subject();
  connected$ = new Subject();
  reconnected$ = new Subject();
  reconnecting$ = new Subject();
  disconnected$ = new Subject();

  private forcedDisconnect = false;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/hub")
      .withAutomaticReconnect(new SignalrConnectionRetryPolicy())
      .build();

    this.connection.on("refresh", () => {
      this.refresh$.next();
    });

    // bind events
    this.connection.onreconnecting(() => {
      this.stateChanged$.next('reconnecting');
      this.offline$.next(true);
      this.reconnecting$.next();
    });

    this.connection.onreconnected(() => {
      this.stateChanged$.next('connected');
      this.offline$.next(false);
      this.reconnected$.next();
      this.connected$.next();
    });

    this.connection.onclose((error) => {
      if (this.forcedDisconnect) {
        return;
      }
      // connection was interrupted
      this.stateChanged$.next('disconnected');
      this.offline$.next(true);
      this.disconnected$.next();

      console.warn('SignalR disconnected: ' + error);

      // if the page is not visible then we don't need to reconnect signalr
      // wait 5 seconds and check again
      if (document.hidden) {
        console.debug('App is not visible. Waiting for tab to become visible before reconnecting');
        this.reconnectWhenVisible();
        return;
      }
      console.debug('Unexpected disconnection detected. Will retry in 5 seconds');
      setTimeout(() => this.connect(), 5000);
    });
  }


  reconnectWhenVisible(): void {
    setTimeout(() => {
      if (document.hidden) {
        return this.reconnectWhenVisible();
      }

      console.debug('App is visible. Reconnecting to signalr');
      this.connect();
    }, 1000);
  }

  connect(): Promise<void> {
    this.forcedDisconnect = false;

    this.stateChanged$.next('connecting');
    this.offline$.next(false);
    this.connecting$.next();

    return this.connection
      .start()
      .then(() => {
        this.stateChanged$.next('connected');
        this.offline$.next(false);
        this.connected$.next();
      })
      .catch((err) => {
        console.error(err);
        this.error$.next(err);

        if (err instanceof signalR.HttpError) {
          // unable to start connection, retry in 30s
          console.debug('Unable to start connection. Retrying in 30000ms');
          // retry with a random amount of time to prevent dogpiling
          setTimeout(() => this.connect(), 30000 + Math.random() * 30000);
        }
      });
  }

  disconnect(): Promise<void> {
    console.debug('App called forced disconnect');

    this.forcedDisconnect = true;

    this.offline$.next(true);

    return this.connection.stop();
  }

  reconnect(): Promise<void> {
    // reconnect to signalr
    return this.disconnect()
      .catch((err) => console.error(err))
      .then(() => this.connect());
  }
}
