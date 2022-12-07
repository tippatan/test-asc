export interface LoginForm {
  username: string;
  password: string;
  token: string;
}

export interface LoginResponse {
  status: string;
  result: LoginResult;
}

export interface LoginResult {
  rownum: number;
  id: number;
  username: string;
  specialSkill: string;
  firstname: string;
  status: string;
  activeProfileId: string;
  activeProfile: string;
  allProfile: string;
  userWF: string;
  countLogin: number;
  dept: string;
  effDate: string;
  eMail: string;
  expDate: string;
  faultFlag: string;
  lastLogin: string;
  lastname: string;
  mobileNo: string;
  modifyDate: string;
  modifyUserId: number;
  planFlag: string;
  position: string;
  receivePlanSms: string;
  directToACTM: string;
  registerDate: string;
  sec: string;
  teamFlag: string;
  telNo: string;
  regionId: string;
  region: string;
  zoneId: string;
  zone: string;
  type: string;
  specialType: string;
  userStatus: string;
  nodeId: number;
  userType: string;
  currentLogin: string;
}
