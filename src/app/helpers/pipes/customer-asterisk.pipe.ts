import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'customerAsterisk' })
export class CustomerAsteriskPipe implements PipeTransform {

  index : number = 2;
  replacement : string = 'xxxx';
  transform(value: string): string {
    return value 
      ? value.substring(0, this.index) + this.replacement + value.substring(this.index + this.replacement.length)
      : value;
  }

}