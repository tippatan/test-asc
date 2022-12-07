import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

@Injectable()
export class PaginatorService {
  private selectedPageSubject$ = new ReplaySubject(1);

  constructor() {}

  subscribePageChange() {
    return this.selectedPageSubject$.asObservable();
  }

  set selectedPage(selectedPage: number) {
    this.selectedPageSubject$.next(selectedPage);
  }
}
