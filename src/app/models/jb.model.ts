import { TT } from './tt.model';

export interface JB {
  jbId: string;
  planFlag: string;
  moveEquip: string;
  createDate: Date;
  initiateDate: Date;
  finishDate: Date;
  expandDate: Date;
  assignById: number;
  assignBy: Object;
  prevAssignTo: number;
  assignToId: number;
  assignTo: Object;
  ownerId: number;
  regionId: string;
  region: Object;
  title: string;
  statusId: string;
  jbStatus: Object;
  historyStatusId: string;
  priorityId: string;
  priority: Object;
  taskDesc: string;
  waitingSparepart: string;
  configFlag: string;
  namId: string;
  trId: string;
  report: string;
  workHour: string;
  waitingReport: string;
  faultAlarmNumber: string;
  closeFlag: string;
  ownerType: string;
  subcontract: string;
  spmEvaluate: string;
  jbRelation: string;
  jbSiteAccess: Array<any>;
  attachFile: Array<any>;
  subsystemDesc: string;
  interRegion: string;
  system: string;
  siteAccessDesc: string;
  jbType: string;
  jbCreateType: string;
  replaceResetEquip: string;
  showStaffZr: string;
  ttTemplateId: string;

  workSheetSent: string;
  workSheetEmail: string;
  detailSent: string;
  detailEmail: string;

  // a add new collumn
  n2iWorkFlowType: string;
  waitJobApprove: string;
  autoFlag: string;
  engState: string;
  storeState: string;
  pvJbApprove: Object;
  modifyRo: string;
  reportDate: Date;
  closeDate: Date;
  reportType: string;
  reportTypeID: string;
  mgrMobileNo: string;
  finishDateColor: string;
  startDowntime: Date;
  finishDowntime: Date;
  downtimeYn: string;
  impactYn: string;
  affectCDR: string;
  affectExtCUSTOMER: string;
  affectIntCUSTOMER: string;
  affectNETWORK: string;
  affectSERVICE: string;
  jbRefCol: Array<any>;
  avrRating: number;
  messageForOverdue: string;
  overdueDate: string;
  beforeOverdueDate: string;
  dueDate: string;
  currentDate: string;

  assignStaff: string;
  teamId: string;
  assignToIdList: Array<any>;
  teamIdList: Array<any>;

  alertJobRequestMail: string;
  alertJobRequestSms: string;
  requestDetail: string;
  flagRequestDetail: string;

  reasonOverdue: string;
  restatusFlag: boolean;
  smsFlag: boolean;
  aamShow: string;
  latitude: string;
  longtitude: string;
  mobileFlag: boolean;
  oldStatus: string;
  operatorPartner: Array<any>;

  // APO
  apodec: string;
  aposolveby: string;
  apoID: number;
  apoissuetype: string;
  apoproblem: string;
  apoimpact: string;
  apocause: string;
  aporefscript: string;
  apodelayreason: string;
  apodelaynode: string;
  apoflag: string;
  aposolution: string;
  ttId: string;
  typeOfTk: string;
  detailOfType: string;
  parentId: string;
  detailId: string;

  // MultiChange
  createDt: Date;
  finishDt: Date;
  assignByName: string;
  assignByTel: string;
  priorityName: string;
  statusName: string;
  systemName: string;
  groupJB: string;
  multiChangeFlag: false;

  reportUpdateDt: Date;
  visitSite: string;

  //change priority flag
  samePriority: string;
  changeStatusFlag: string;

  //jbPartner
  jbPartner: Object;
  remarkOverdue: string;
  systemValue: number;
  systemViewLong: string;
  systemViewShort: string;
  autoReportFlag: string;
  reportRemark: string;
  spanInfoCol: Array<any>;
  cableCompany: Array<any>;
  relateTemplate: false;
  appendTitle: false;
  estDay: string;
  estHour: string;
  estMinute: string;

  //workforce
  workforceFlag: false;
  workforce: string;
  estimateTime: Date;
  assignWorkforce: false;
  canAssignWorkforce: string;

  //SuggestionStaff
  suggestionStaffList: Array<any>;
  leaveFlag: string;
  oldLeaveFlag: string;

  // Estimate Time
  estimateStartTime: Date;
  estimateFinishTime: Date;

  //estimate Bean
  wfmJobEstTime: Object;
  actionFlag: string;
  reasonRemarkVal: string;
  reasonRemark: string;
  reasonRemarkDesc: string;
  oldEstimate: number;
  newEstimate: number;
  ttbean: TT;
  maxEstimate: number;
  lastJob: string;

  //sub job
  mainJobId: string;
  subJobId: string;
  isSubJob: false;
  statusMainJobId: string;
  assignToMainJobId: string;
  estTimeMainJob: Object;
  jbIdDisplay: string;
  zoneId: string;

  //held Type
  heldType: string;
  oldEstStart: string;
  oldEstEnd: string;
  newEstStart: string;
  oldEstStartTime: Date;
  oldEstEndTime: Date;
  newEstStartTime: Date;
  newEstEndTime: Date;
  createType: string;
  vendorFlag: false;
  assignJobWFM: false;
  isHasJobRelate: false;
  msgSumJobRelate: string;
  refPSAC: string;
  isPSACSystemActionFlag: false;
  idYy: string;
  idNo: string;
}
