import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public serverMessages = new Array<any>();
  public clientMessage = '';
  public isBroadcast = false;
  public sender = '';
  public receiverMessage: any;

  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = new WebSocketSubject(environment.wsEndpoint);
  }

  public connect() {
    console.log(
      'socket service connect environment.wsEndpoint',
      environment.wsEndpoint
    );
    this.socket$.subscribe(
      (message) =>
        this.serverMessages.push(message) && this.receiveMessage(message),
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }

  async sendMessage(
    clientMessage: string,
    isBroadcast = true,
    sender = 'NS',
    receiver: any
  ) {
    const message = new Message(sender, clientMessage, isBroadcast, receiver);

    await this.socket$.next(message);
    this.clientMessage = '';
    console.log('socketService sendMessage : ', this.serverMessages);
    console.log(
      '==================socketService sendMessage length ==>',
      this.serverMessages.length
    );
    console.log(
      '==================osocketService sendMessagee this.serverMessages ==>',
      this.serverMessages,
      JSON.stringify(this.serverMessages)
    );

    return true;
  }

  receiveMessage(message) {}

  getMessage() {
    return this.receiverMessage;
  }

  close() {
    this.socket$.complete();
  }
}

export class Message {
  constructor(
    public sender: string,
    public content: string,
    public isBroadcast = false,
    public receiver: any
  ) {}
}
