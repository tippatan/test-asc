import { Utility } from './../utils/utility';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Constants from './../utils/constants';

export enum TEXT_TYPE {
  LONG_NAME = 'LONG_NAME',
  LONG_NAME_UPPER = 'LONG_NAME_UPPER',
  SHORT_NAME_UPPER = 'SHORT_NAME_UPPER',
}
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  readonly breadcrumbStorageName = 'breadcrumbData';
  readonly initialData = '';

  constructor(private util: Utility, private router: Router) {}

  initialSetData() {
    sessionStorage.setItem(this.breadcrumbStorageName, this.initialData);
  }

  get getBreadcrumb() {
    return sessionStorage.getItem(this.breadcrumbStorageName);
  }

  get getPage() {
    return JSON.parse(sessionStorage.getItem('page'));
  }

  addBreadcrumb(data: string) {
    if (!this.util.isEmpty(data)) {
      if (this.util.isEmpty(this.getBreadcrumb)) {
        this.initialSetData();
      }
      let breadcrumbSplit = this.getBreadcrumb.split('|');
      if (!breadcrumbSplit.includes(data)) {
        // exam data = 'Create TT:/tt/create'
        let newData = `${this.getBreadcrumb}|${data}`;
        sessionStorage.setItem(this.breadcrumbStorageName, newData);
      } else {
        let indexDup = breadcrumbSplit.findIndex((e) => e === data);
        breadcrumbSplit.splice(indexDup, breadcrumbSplit.length, data);
        sessionStorage.setItem(
          this.breadcrumbStorageName,
          breadcrumbSplit.join('|')
        );
      }
    }
  }

  removeLastBreadcrumb() {
    let breadcrumbPop = this.getBreadcrumb.split('|');
    breadcrumbPop.pop();
    sessionStorage.setItem(this.breadcrumbStorageName, breadcrumbPop.join('|'));
  }

  setBreadcrumb(data: string) {
    sessionStorage.setItem(this.breadcrumbStorageName, data);
  }

  get convertBreadcrumbStrToObj(): any[] {
    let newBreadcrumbList = [];
    if (this.util.isEmpty(this.getBreadcrumb)) {
      this.initialSetData();
    }
    let breadcrumbList = this.getBreadcrumb.substring(1).split('|');
    breadcrumbList.forEach((element) => {
      let obj = element.split(':');
      if (obj.length > 1 && obj[1] !== '#' && obj[1] !== '') {
        newBreadcrumbList.push({
          label: obj[0],
          path: obj[1],
        });
      } else {
        newBreadcrumbList.push({
          label: obj[0],
        });
      }
    });
    return newBreadcrumbList;
  }

  // save data for search
  getDataSearch(pageId) {
    return JSON.parse(sessionStorage.getItem(pageId));
  }

  setDataSearch(pageId: string, data: any) {
    sessionStorage.setItem(pageId, JSON.stringify(data));
  }

  setPage(page: any) {
    sessionStorage.setItem('page', JSON.stringify(page));
  }

  removeDataSearch(pageId: string) {
    sessionStorage.removeItem(pageId);
  }

  checkProperties(obj: object) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] != '' && obj[key] !== undefined)
        return false;
    }
    return true;
  }

  goBack() {
    this.removeLastBreadcrumb();
    let breadcrumbSplit = this.getBreadcrumb.split('|');
    if (!(breadcrumbSplit.length === 1 && breadcrumbSplit[0] === '')) {
      let path = breadcrumbSplit[breadcrumbSplit.length - 1].split(':');
      this.router.navigate([path[path.length - 1]], {
        skipLocationChange: true,
      });
    }
  }

  getPathRegion(shortName: string, type: TEXT_TYPE): string {
    switch (shortName) {
      case Constants.REGION.BANGKOK[type]:
        return Constants.PATH.TT_REGION_BKK;
      case Constants.REGION.CENTRAL[type]:
        return Constants.PATH.TT_REGION_CR;
      case Constants.REGION.EAST[type]:
        return Constants.PATH.TT_REGION_ER;
      case Constants.REGION.NORTHEAST[type]:
        return Constants.PATH.TT_REGION_NER;
      case Constants.REGION.NORTH[type]:
        return Constants.PATH.TT_REGION_NR;
      case Constants.REGION.SOUTH[type]:
        return Constants.PATH.TT_REGION_SER;

      default:
        return Constants.PATH.TT_REGION_BKK;
    }
  }
}
