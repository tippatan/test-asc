export class Columns {
  value: string;
  isSortingAsc: boolean;
  styleClass: string;
  callBackAction: string;
  headerName: string;
  propertyName: string;
  isSortingDisplay: boolean = true;
  isLinkClick: boolean = false;
  isInnerHtml: boolean = false;
  htmlInnerValue: string;
  tagComponent: string;
  propertySort: string;
  pipeName: string;

  public constructor(fields?: {
    value?: string;
    isSortingAsc?: boolean;
    headerName?: string;
    styleClass?: string;
    callBackAction?: string;
    propertyName?: string;
    isSortingDisplay?: boolean;
    isLinkClick?: boolean;
    isInnerHtml?: boolean;
    htmlInnerValue?: string;
    tagComponent?: string;
    propertySort?: any;
    pipeName?: any;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
