import { Component, OnInit } from '@angular/core';
import { SmartControlFilterService } from 'app/services/smart-control-filter.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-smart-control',
  templateUrl: './smart-control.component.html',
  styleUrls: ['./smart-control.component.scss'],
})
export class SmartControlComponent implements OnInit {
  constructor(private filterService: SmartControlFilterService) {}

  ngOnInit() {
    combineLatest([
      this.filterService.getListDropdownSystemGroupByUser(),
      this.filterService.getListRegion(),
      this.filterService.getListActivityType(),
      this.filterService.getListAliasNode(),
      this.filterService.getListStatus(),
      this.filterService.getListImportance(),
      this.filterService.getListGroup(),
      this.filterService.getListImpact(),
      this.filterService.getListImpactNRI(),
      this.filterService.getListActivityError(),
      this.filterService.getListCorpDocStatus(),
      this.filterService.getListCorpProductImpact(),
      this.filterService.getListRemarkGroup(),
      this.filterService.getListWrAction(),
    ]).subscribe((test) => {
      // console.log('=======smart control ngOnInit combineLatest => ',test);
    });
  }
}
