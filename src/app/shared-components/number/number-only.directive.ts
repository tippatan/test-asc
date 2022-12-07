import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
})
export class NumberOnlyDirective {
  @Input('appNumberOnly') inputType: string;

  private regex: RegExp = new RegExp(/^-?[0-9]+(\[0-9]*){0,1}$/g);
  private regex3DigitDecimal: RegExp = new RegExp(/^\d+(\.\d{1,3})?$/g);
  private simpleKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
  ];
  private scanBarCode: RegExp = new RegExp(/^[a-zA-Z0-9]*$/);

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.inputType === 'INTEGER') {
      // Allow Backspace, tab, end, and home keys
      if (this.simpleKeys.indexOf(event.key) !== -1) {
        return;
      }
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);

      if ((next && !String(next).match(this.regex)) || current == '0') {
        event.preventDefault();
      }
    } else if (this.inputType === 'DECIMAL') {
      let current: string = this.el.nativeElement.value;
      this.simpleKeys.push('.');
      if (this.simpleKeys.indexOf(event.key) !== -1) {
        if (current.split('.').length > 1 && event.key === '.') {
          // console.log("false");
        } else {
          return;
        }
      }

      let next: string = current.concat(event.key);
      // console.log(this.inputType);
      if (next && !String(next).match(this.regex3DigitDecimal)) {
        event.preventDefault();
      }
    } else if (
      this.inputType === 'CITIZENCARD' ||
      this.inputType === 'MOBILENO'
    ) {
      // Allow Backspace, tab, end, and home keys
      if (this.simpleKeys.indexOf(event.key) !== -1) {
        return;
      }
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);
      // console.log(this.inputType);
      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
    } else if (this.inputType === 'SCANBARCODE') {
      // Allow Backspace, tab, end, and home keys
      if (this.simpleKeys.indexOf(event.key) !== -1) {
        return;
      }
      let current: string = this.el.nativeElement.value;
      let next: string = current.concat(event.key);

      if (next && !String(next).match(this.scanBarCode)) {
        event.preventDefault();
      }
    }
  }
}
