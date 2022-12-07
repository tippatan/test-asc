export interface LoginProfile {
  status: string;
  result: LoginProfileResult;
  actmMenuCalendarDailyReport;
  actmAuth: boolean;
  isBOMUser: number;
  actmMenuCalendarSystemPreference: boolean;
  actmMenuCorpDoc: boolean;
  isWorkingTime: boolean;
  alertMsg: string;
  actmMenuCalendarExport: boolean;
  actmMenuCalendarCreateWorkrequest: boolean;
}

export interface LoginProfileResult {
  profile: LoginProfileResultProfile[];
  checkStatus: string;
  authWorkforce: boolean;
  user: LoginProfileResultUser;
}

export interface LoginProfileResultProfile {
  id: string;
  modifyDate: string;
  profileName: string;
  userId: number;
  createUserId: number;
  modifyUserId: number;
  rownum: number;
  createDate: string;
  profileWF;
}

export interface LoginProfileResultUser {
  regionId: string;
  region: LoginProfileResultUserRegion;
  zoneId: string;
  zone: LoginProfileResultUserZone;
  type: string;
  specialType;
  userStatus: string;
  effDay: string;
  effMonth: string;
  effYear: string;
  expDay: string;
  expMonth: string;
  expYear: string;
  userAffectedZone;
  criticalJob;
  id: number;
  managerId;
  nodeMode;
  smsJBBy;
  sendType;
  firstname: string;
  lastname: string;
  specialSkill;
  status: string;
  username: string;
  receivePlanSms: string;
  directToACTM: string;
  activeProfileId: string;
  position: string;
  modifyDate: string;
  dept: string;
  sec: string;
  telNo: string;
  mobileNo: string;
  fullName: string;
  all_wf;
  team;
  edsTeamId;
  teamType;
  userIdRefer;
  smsGroupType;
  moduleAction;
  serverName;
  port;
  loginBy;
  accessId;
  ecsTeam;
  actionId;
  wfmcompany;
  vendorFlag;
  teamName;
  registerDate;
  faultFlag: string;
  planFlag: string;
  teamFlag: string;
  effDate: string;
  expDate;
  countLogin: number;
  lastLogin: string;
  modifyUserId: number;
  userWF;
  activeProfile: LoginProfileResultUserActiveProfile;
  allProfile;
  rownum;
  nodeId;
  userType: string;
  currentLogin: string;
  node;
  email: string;
}

export interface LoginProfileResultUserRegion {
  id: string;
  regionNameTh: string;
  regionNameEn: string;
}

export interface LoginProfileResultUserZone {
  id: string;
  description: string;
  regionId: string;
}

export interface LoginProfileResultUserActiveProfile {
  id: string;
  modifyDate: string;
  profileName: string;
  userId: number;
  createUserId: number;
  modifyUserId;
  rownum;
  createDate: string;
  profileWF: LoginProfileResultUserActiveProfileProfileWF[];
}

export interface LoginProfileResultUserActiveProfileProfileWF {
  id: number;
  createDate: string;
  profileId: string;
  wfId: string;
  createUserId: number;
}
