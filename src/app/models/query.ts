export interface QueryTTRequest {
  sidFlag: string;
  numberDisplay: string;
  sortBy1: string;
  sortBy2: string;
  sortBy3: string;
  shiftTime: string;
  problemServiceDescription: string;
  regionId: string;
  page: string;
  newQuery: string;
  order1: string;
  order2: string;
  order3: string;
  orderBy1: string;
  orderBy2: string;
  orderBy3: string;
  systemParam: string;
  inputSystemValue: string;
  ttCriteria: TTCriteria;
}

export interface TTCriteria {
  ttId: string;
  ttPrefix: string;
  ttPostfix: string;
  ownerFirstName: string;
  ownerLastName: string;
  regionIdList: string[];
  priorityId: string;
  ttStatusId: string;
  title: string;
  system: string;
  subsystem: string;
  problemService: string;
  interRegion: string;
  affectedRegionIdList: string[];
  problemNodeId1: string;
  problemNodeCode: string;
  affectedNodeCode: string;
  affectedNodeId: string;
  ttType: string;
  planStatus: string;
  faultTypeId: string;
  problemTypeId: string;
  nodeId: string;
  startShiftTime: string;
  endShiftTime: string;
  createDateFlag: string;
  createDate1: string;
  createDay1: string;
  createMonth1: string;
  createYear1: string;
  createHour1: string;
  createMinute1: string;
  createDate2: string;
  createDay2: string;
  createMonth2: string;
  createYear2: string;
  createHour2: string;
  createMinute2: string;
  subSystemCol: string[];
  sectionAuth: string;
  zoneIdAuth: string;
  regionAuth: string;
  systemValue: string;
  sidFlag: string;
}
