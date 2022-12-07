import { BreadcrumbService } from './../../services/breadcrumb.service';
import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng-lts/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() items: MenuItem[] = [];
  home: MenuItem;

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  onRemoveItem(event) {
    if (event.item?.path) {
      let index = this.items.findIndex((e) => e === event.item);
      let data = '';

      this.items.splice(index + 1, this.items.length - 1 - index);
      this.items.forEach((e: any) => {
        data = `${data}|${e.label}:${e.path || '#'}`;
      });
      this.breadcrumbService.setBreadcrumb(data);
      this.router.navigate([event.item?.path], { skipLocationChange: true });
    }
  }
}
