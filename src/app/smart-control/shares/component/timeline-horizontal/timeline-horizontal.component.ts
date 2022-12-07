import { Component, Input, OnInit } from '@angular/core';
import { TimelineItem } from './timeline-item';

@Component({
  selector: 'app-timeline-horizontal',
  templateUrl: './timeline-horizontal.component.html',
  styleUrls: ['./timeline-horizontal.component.css'],
})
export class TimelineHorizontalComponent implements OnInit {
  constructor() {}

  @Input() items: TimelineItem[];

  ngOnInit() {}

  activeItem(item: TimelineItem) {
    for (const i of this.items) {
      i.active = undefined;
    }
    item.active = true;

    if (item.command) {
      item.command();
    }
  }

  getColor(item: TimelineItem) {
    if (!item.color) {
      return null;
    }

    if (item.active) {
      return '#' + item.color;
    } else {
      return '#' + this.lighten(item.color, 50);
    }
  }

  lighten(col, amt) {
    col = parseInt(col, 16);
    return (
      // tslint:disable-next-line:no-bitwise
      (
        ((col & 0x0000ff) + amt) |
        ((((col >> 8) & 0x00ff) + amt) << 8) |
        (((col >> 16) + amt) << 16)
      ).toString(16)
    );
  }
}
