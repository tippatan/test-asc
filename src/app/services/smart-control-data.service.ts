import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SmartControlDataService {
  private _mode: string;
  private _id: string;
  private _previousCriteria: any;
  private _param: any;
  private _action: boolean = false;

  constructor(private router: Router, private location: Location) {}

  gotoNextPage(url: string, prevCriteria: any): void {
    if (!this.previousCriteria) {
      this.previousCriteria = [];
      // console.log(this.previousCriteria);
    }
    this.previousCriteria.push(prevCriteria);
    this.param = prevCriteria;
    this.action = true;
    // this.backStepIndex += 1;
    this.router.navigate([url]);
  }

  getParam() {
    let result;
    if (this.action) {
      result = this.param ? this.param : this.getPreviousCriteria();
      this.action = false;
      this.param = null;
    }
    return result;
  }

  backToPreviousPage() {
    this.param = null;
    // this.previousCriteria.pop();
    this.action = true;
    this.location.back();
  }

  backSubToPreviousPage(prevCriteria: any): void {
    if (!this.previousCriteria) {
      this.previousCriteria = [];
    }
    // this.previousCriteria.push(prevCriteria);
    this.param = prevCriteria;
    this.action = true;
    // this.backStepIndex += 1;
    this.location.back();
  }

  getPreviousCriteria(): any {
    let prevCriteria: any;
    if (this.previousCriteria) {
      prevCriteria = this.previousCriteria[this.previousCriteria.length - 1];
      this.previousCriteria.pop();
    }
    return prevCriteria;
  }

  clearAllPreviousCriteria() {
    this.previousCriteria = null;
  }

  printPreviousCri() {
    // console.log(this.previousCriteria);
  }

  openLink(url, data) {
    // window.open(url)
    // let popForm = window.open(url);
    // popForm.window.onload=data
    // Store the return of the `open` command in a variable
    let paramUri = 'data=' + btoa(JSON.stringify(data));
    // paramUri =
    let newWindow = window.open(url + '?' + encodeURI(paramUri));

    // Access it using its variable
    // newWindow.data = "Hello World";
  }

  /**
   * Getter mode
   * @return {string}
   */
  public get mode(): string {
    return this._mode;
  }

  /**
   * Setter mode
   * @param {string} value
   */
  public set mode(value: string) {
    this._mode = value;
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Setter id
   * @param {string} value
   */
  public set id(value: string) {
    this._id = value;
  }
  /**
   * Getter id
   * @return {string}
   */

  public clearData() {
    this._mode = null;
    this._id = null;
  }

  /**
   * Getter previousCriteria
   * @return {any}
   */
  public get previousCriteria(): any {
    return this._previousCriteria;
  }

  /**
   * Setter previousCriteria
   * @param {any} value
   */
  public set previousCriteria(value: any) {
    this._previousCriteria = value;
  }

  /**
   * Getter param
   * @return {any}
   */
  public get param(): any {
    return this._param;
  }

  /**
   * Setter param
   * @param {any} value
   */
  public set param(value: any) {
    this._param = value;
  }

  /**
   * Getter action
   * @return {boolean }
   */
  public get action(): boolean {
    return this._action;
  }

  /**
   * Setter action
   * @param {boolean } value
   */
  public set action(value: boolean) {
    this._action = value;
  }
}
