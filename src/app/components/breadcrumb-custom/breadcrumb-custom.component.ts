import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem } from 'primeng-lts/api';

@Component({
  selector: 'app-breadcrumb-custom',
  templateUrl: './breadcrumb-custom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./breadcrumb-custom.component.scss'],
})
export class BreadcrumbCustomComponent {
  @Input() model: MenuItem[];

  @Input() style: any;

  @Input() styleClass: string;

  @Input() home: MenuItem;

  @Output() onItemClick: EventEmitter<any> = new EventEmitter();

  itemClick(event, item: MenuItem) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      item.command({
        originalEvent: event,
        item: item,
      });
    }

    this.onItemClick.emit({
      originalEvent: event,
      item: item,
    });
  }

  onHomeClick(event) {
    if (this.home) {
      this.itemClick(event, this.home);
    }
  }
}
