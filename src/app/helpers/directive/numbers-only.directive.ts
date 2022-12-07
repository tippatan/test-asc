import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  NgModule,
} from '@angular/core';

@Directive({
  selector: '[numbersOnly]',
})
export class NumbersOnlyDirective implements OnInit {
  constructor(private elRef: ElementRef) {}

  ngOnInit() {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.elRef.nativeElement.value;
    this.elRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this.elRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@NgModule({
  declarations: [NumbersOnlyDirective],
  exports: [NumbersOnlyDirective],
})
export class NumbersOnlyDirectiveModule {}
