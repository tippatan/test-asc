import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as Constants from './constants';

@Injectable({
  providedIn: 'root',
})
export class Utility {
  getItemListFromTotalItem(
    currentPage: number,
    itemPerPage: number,
    totalItem: any[]
  ): any[] {
    let startItemIndex = currentPage * itemPerPage;
    let endItemIndex = Math.min(startItemIndex + itemPerPage, totalItem.length);
    let itemList = [];
    for (
      let itemIndex = startItemIndex;
      itemIndex < endItemIndex;
      itemIndex++
    ) {
      itemList.push({ ...totalItem[itemIndex] });
    }
    return itemList;
  }

  getTotalPageFromTotalSize(itemPerPage: number, totalSize: number) {
    return Math.floor(totalSize / itemPerPage);
  }

  convertDateTimeToString(
    date: Date,
    pattern: string = Constants.DATE_PATTERN['DD/MM/YY HH:mm']
  ) {
    return moment(date).format(pattern);
  }

  numberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  isEmpty(value: any): boolean {
    return value == '' || value == null || value == undefined;
  }
}
