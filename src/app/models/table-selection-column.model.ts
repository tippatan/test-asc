import { TableSelectionDropDownModel } from './table-selection-dropdown.model';
export interface TableSelectionColumnModel {
  fieldShow: boolean;
  fieldSort: boolean;
  fieldSearch: boolean;
  fieldSearchType: string;
  fieldType: string;
  fieldId: string;
  fieldName: string;
  columnName: string;
  // dataDropDownList: TableSelectionDropDownModel[] ;
  // selectedDropDownList: string ;
  // selectedDateRange: Date[];
  width: Number;
  // color: string;
}
