import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() animationDuration: string = '0.7s';
  @Input() strokeWidth: number = 4;

  constructor() {}

  ngOnInit(): void {}
}
