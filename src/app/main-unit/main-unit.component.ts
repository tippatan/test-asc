import {
  Component,
  ElementRef,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { WebsocketService } from 'app/web-socket.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main-unit',
  templateUrl: './main-unit.component.html',
  styleUrls: ['./main-unit.component.scss'],
})
export class MainUnitComponent implements OnInit {
  @ViewChild('viewer') private viewer: ElementRef;
  public serverMessages = new Array<any>();

  public sender = '';

  constructor(private socketService: WebsocketService) {}

  ngOnInit() {
    this.socketService.connect();
    this.sender = 'test_call';
    this.serverMessages = this.socketService.serverMessages;
  }

  ngAfterViewInit(): void {
    this.scroll();
  }

  public send() {
    this.socketService.sendMessage(
      'this.clientMessage',
      true,
      'this.sender',
      null
    );
  }

  private scroll(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  private getDiff(): number {
    if (!this.viewer) {
      return -1;
    }

    const nativeElement = this.viewer.nativeElement;
    return (
      nativeElement.scrollHeight -
      (nativeElement.scrollTop + nativeElement.clientHeight)
    );
  }

  private scrollToBottom(t = 1, b = 0): void {
    if (b < 1) {
      b = this.getDiff();
    }
    if (b > 0 && t <= 120) {
      setTimeout(() => {
        const diff = this.easeInOutSin(t / 120) * this.getDiff();
        this.viewer.nativeElement.scrollTop += diff;
        this.scrollToBottom(++t, b);
      }, 1 / 60);
    }
  }

  private easeInOutSin(t): number {
    return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
  }
}

export class Message {
  constructor(
    public sender: string,
    public content: string,
    public isBroadcast = false
  ) {}
}
