import { JsonPipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from 'app/models/userProfile';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SmartControlService {
  constructor(private http: HttpClient) {}

  queryTT(body: any) {
    if (body.flag === 'export') {
      return this.http.post(`${environment.baseURL}/query/query-tt`, body, {
        observe: 'response',
        responseType: 'blob',
      });
    } else {
      return this.http.post(`${environment.baseURL}/query/query-tt`, body);
    }
  }

  listDropdownSystemByUser(subCode: string): any {
    const body = { subCode: subCode };
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  getDashboard(obj): any {
    //const url = urls.getDashboard;
    const body = {
      username: obj.username,
      option: obj.option,
      startDateTime: obj.startDateTime,
      endDateTime: obj.endDateTime,
      systemGroup: obj.systemGroup,
      region: obj.region,
      activityType: obj.activityType,
      aliasNode: obj.aliasNode,
      status: obj.status,
      downtime: obj.downtime,
      scheduleConflict: obj.scheduleConflict,
      fbbImpact: obj.fbbImpact,
      tbbImpact: obj.tbbImpact,
      impact: obj.impact,
      impactNri: obj.impactNri,
      activityError: obj.activityError,
      corpDocStatus: obj.corpDocStatus,
      corpProductImpact: obj.corpProductImpact,
      remarkGroup: obj.remarkGroup,
      siteAccess: obj.siteAccess,
      wrActionAuto: obj.wrActionAuto,
      importance: obj.importance,
      ska: obj.ska,
      group: obj.group,
      ref1: obj.ref1,
      ref2: obj.ref2,
    };
    return this.http.post(
      `${environment.baseURL}/dashboard/get-dashboard`,
      body
    );
  }

  getDefaultFilter(userName, userId): any {
    //const url = urls.getDefaultFilter;
    const body = {
      username: userName,
      userId: userId,
    };
    return this.http.post(
      `${environment.baseURL}/filter/get-default-filter`,
      body
    );
  }

  addDefaultFilter(obj, userId): any {
    const body = {
      userId: userId,
      systemGroup: obj.systemGroup,
      region: obj.region,
      activityType: obj.activityType,
      aliasNode: obj.aliasNode,
      status: obj.status,
      downtime: obj.downtime,
      scheduleConflict: obj.scheduleConflict,
      fbbImpact: obj.fbbImpact,
      tbbImpact: obj.tbbImpact,
      ska: obj.ska,
      impactType: obj.impactType,
      impactNRI: obj.impactNRI,
      activityError: obj.activityError,
      corpDocStatus: obj.corpDocStatus,
      corpProductImpact: obj.corpProductImpact,
      remarkGroup: obj.remarkGroup,
      siteAccess: obj.siteAccess,
      wrAction: obj.wrAction,
      importance: obj.importance,
      group: obj.group,
    };
    return this.http.post(
      `${environment.baseURL}/filter/add-default-filter`,
      body
    );
  }

  loginAsc(userProfile: UserProfile): any {
    //const url = urls.loginAsc;
    const body = { userProfile: userProfile };
    // console.log(`${environment.baseURL}/login-asc`, body);
    return this.http.post(`${environment.baseURL}/login-asc`, body);
  }

  saveWRActivity(body): any {
    //const url = urls.saveWRActivity;
    return this.http.post(
      `${environment.baseURL}/wr-activity/save-wr-activity`,
      body
    );
  }

  saveWRActivityALM(body): any {
    //const url = urls.saveWRActivityALM;
    return this.http.post(
      `${environment.baseURL}/wr-activity/save-wr-activity-alm`,
      body
    );
  }

  saveWRActivityEDS(body): any {
    //const url = urls.saveWRActivityEDS;
    return this.http.post(
      `${environment.baseURL}/wr-activity/save-wr-activity-eds`,
      body
    );
  }

  saveWRActivityFBB(body): any {
    //const url = urls.saveWRActivityFBB;
    return this.http.post(
      `${environment.baseURL}/wr-activity/save-wr-activity-fbb`,
      body
    );
  }

  getASCUserProfile(userProfile: any): any {
    //const url = urls.getASCUserProfile;
    const body = {
      userName: userProfile.name,
    };
    // console.log(`${environment.baseURL}/get-user-profile`, body);
    return this.http.post(`${environment.baseURL}/get-user-profile`, body);
  }

  smartCheckQuery(obj): any {
    //const url = urls.smartCheckQuery;
    const body = {
      siteCodeList: obj.siteCodeList,
    };
    return this.http.post(
      `${environment.baseURL}/smart-check/check-by-sitecode`,
      body
    );
  }

  smartCheckFBB(obj): any {
    //const url = urls.smartCheckFBB;
    const body = {
      accessNode: obj.accessNode,
      pon: obj.pon,
      splitterName: obj.splitterName,
    };
    return this.http.post(`${environment.baseURL}/smart-check/check-fbb`, body);
  }

  smartCheckAlarm(obj): any {
    //const url = urls.smartCheckAlarm;
    const body = {
      alarmType: obj.alarmType,
      siteCodeList: obj.siteCodeList,
    };

    return this.http.post(
      `${environment.baseURL}/smart-check/check-alarm`,
      body
    );
  }

  smartCheckEnterprise(obj): any {
    //const url = urls.smartCheckEnterprise;
    const body = {
      enterpriseList: obj.enterpriseList,
    };
    return this.http.post(
      `${environment.baseURL}/smart-check/check-enterprise`,
      body
    );
  }

  getActivityDetail(wrId: string, userName: string): any {
    //const url = urls.getActivityDetail;
    const body = {
      wrId: wrId,
      userName: userName,
    };
    // console.log('====getActivityDetail========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  checkActivityDetailFBB(obj): any {
    //const url = urls.checkActivityDetailFBB;
    const body = {
      accessNode: obj.accessNode,
      pon: obj.pon,
      splitterName: obj.splitterName,
      wrId: obj.wrId,
      wrStatus: obj.wrStatus,
    };
    return this.http.post(
      `${environment.baseURL}/activity-detail/check-fbb`,
      body
    );
  }

  getActivityService(wrId: string, userName: string): any {
    //const url = urls.getActivityService;
    const body = {
      wrId: wrId,
      userName: userName,
    };
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-service`,
      body
    );
  }

  saveActivityDetail(obj): any {
    //const url = urls.saveActivityDetail;
    const body = {
      wrId: obj.wrId,
      wrStatus: obj.wrStatus,
      wrStatusOld: obj.wrStatusOld,
      userId: obj.userId,
      userName: obj.userName,
      reason: obj.reason,
      autoCheckAlarmFlag: obj.autoCheckAlarmFlag,
      autoCheckAlarmDate: obj.autoCheckAlarmDate,
      autoCheckServiceFlag: obj.autoCheckServiceFlag,
      autoCheckServiceDate: obj.autoCheckServiceDate,
      informNocList: obj.informNocList,
      alarmSiteCodeList: obj.alarmSiteCodeList,
      alarmServiceList: obj.alarmServiceList,
      alarmEnterpriseList: obj.alarmEnterpriseList,
      serviceEnterpriseList: obj.serviceEnterpriseList,
      serviceFixedBroadbandList: obj.serviceFixedBroadbandList,
      alarmSiteCodeNote: obj.alarmSiteCodeNote,
      alarmServiceNote: obj.alarmServiceNote,
      alarmEnterpriseNote: obj.alarmEnterpriseNote,
      serviceEnterpriseNote: obj.serviceEnterpriseNote,
      serviceFbbNote: obj.serviceFbbNote,
      checkSiteCode: obj.checkSiteCode,
      checkService: obj.checkService,
      checkEnterprise: obj.checkEnterprise,
      haveServiceEds: obj.haveServiceEds,
      haveServiceFbb: obj.haveServiceFbb,
      alarmStatusBefore: obj.alarmStatusBefore,
	    edsStatusBefore: obj.edsStatusBefore,
	    fbbStatusBefore: obj.fbbStatusBefore,
      deleteAttachFileIdList: obj.deleteAttachFileIdList
    };
    console.log('service save detail body : ',body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/save-activity-detail`,
      body
    );
  }

  checkActivityDetailAlarmSiteCode(obj): any {
    //const url = urls.checkActivityDetailAlarmSiteCode;
    const body = {
      siteCodeList: obj.siteCodeList,
      serverSerialList: obj.serverSerialList,
      chkBfFlagList: obj.chkBfFlagList,
      wrId: obj.wrId,
      wrStatus: obj.wrStatus,
      checkAll: obj.checkAll,
    };
    return this.http.post(
      `${environment.baseURL}/activity-detail/check-alarm-sitecode`,
      body
    );
  }

  checkActivityDetailAlarmService(obj): any {
    //const url = urls.checkActivityDetailAlarmService;
    const body = {
      serviceList: obj.serviceList,
      serverSerialList: obj.serverSerialList,
      chkBfFlagList: obj.chkBfFlagList,
      wrId: obj.wrId,
      wrStatus: obj.wrStatus,
      checkAll: obj.checkAll,
    };
    return this.http.post(
      `${environment.baseURL}/activity-detail/check-alarm-service`,
      body
    );
  }

  checkActivityDetailAlarmEnterprise(obj): any {
    //const url = urls.checkActivityDetailAlarmEnterprise;
    const body = {
      enterpriseList: obj.enterpriseList,
      serverSerialList: obj.serverSerialList,
      chkBfFlagList: obj.chkBfFlagList,
      wrId: obj.wrId,
      wrStatus: obj.wrStatus,
      checkAll: obj.checkAll,
    };
    return this.http.post(
      `${environment.baseURL}/activity-detail/check-alarm-enterprise`,
      body
    );
  }

  getDropDownImportance(valueType: string): any {
    //const url = urls.getDDLMaster;
    const body = { type: valueType };
    return this.http.post(`${environment.baseURL}/master/get-ddl-master`, body);
  }

  getDropDownGroup(valueType: string): any {
    //const url = urls.getDDLMaster;
    const body = { type: valueType };
    return this.http.post(`${environment.baseURL}/master/get-ddl-master`, body);
  }

  getCountNotification(username): any {
    //const url = urls.getCountNotification;
    const body = { username: username };
    return this.http.post(
      `${environment.baseURL}/notification/count-notification`,
      body
    );
  }

  getAscNotification(username): any {
    //const url = urls.getAscNotification;
    const body = { username: username };
    return this.http.post(
      `${environment.baseURL}/notification/get-notification`,
      body
    );
  }

  updateAscNotificationAck(noti): any {
    //const url = urls.updateAscNotificationAck;
    const body = {
      username: noti.username,
      refId: noti.refId,
    };
    return this.http.post(
      `${environment.baseURL}/notification/update-notification`,
      body
    );
  }

  checkActivityDetailEnterprise(body): any {
    return this.http.post(
      `${environment.baseURL}/activity-detail/check-enterprise`,
      body
    );
  }

  getDropDownRegionEN(): any {
    return this.http.post(`${environment.baseURL}/dropdown/region-en`, {});
  }

  getDropDownActivityType(): any {
    return this.http.post(`${environment.baseURL}/dropdown/activity-type`, {});
  }

  listDropdownSystemGroupByUser(): any {
    return this.http.post(
      `${environment.baseURL}/dropdown/system-group-by-user`,
      {}
    );
  }

  getDropDownAliasNode(): any {
    return this.http.post(`${environment.baseURL}/dropdown/alias-node`, {});
  }

  listStatusActIsShowActm(): any {
    return this.http.post(
      `${environment.baseURL}/dropdown/status-act-show-actm`,
      {}
    );
  }

  getDropDownImpactType(): any {
    return this.http.post(`${environment.baseURL}/dropdown/impact-type`, {});
  }

  getDropDownNRI(): any {
    return this.http.post(`${environment.baseURL}/dropdown/nri`, {});
  }

  getDropDownErrorLevel(): any {
    return this.http.post(`${environment.baseURL}/dropdown/error-level`, {});
  }

  getCorpDocStatus(): any {
    return this.http.post(
      `${environment.baseURL}/dropdown/corp-doc-status`,
      {}
    );
  }

  getDropDownCorpProductImpact(): any {
    return this.http.post(
      `${environment.baseURL}/dropdown/corp-product-impact`,
      {}
    );
  }

  getDropDownRemarkGroup(): any {
    return this.http.post(`${environment.baseURL}/dropdown/remark-group`, {});
  }

  getDropDownWRAutoAction(): any {
    return this.http.post(`${environment.baseURL}/dropdown/wr-auto-action`, {});
  }

  sendSmsFBB(userName, userId, wrId, ainId, fbbSumReport, startDate, lastUpdateDate, smsAction): any {
    //const url = urls.getDefaultFilter;
    const body = {
      userName: userName,
      userId: userId,
      wrId: wrId,
      ainId: ainId,
      fbbSumReport: fbbSumReport,
      startDate: startDate,
      lastUpdateDate: lastUpdateDate,
      smsAction: smsAction
    };
    console.log('--- sendSmsFBB body : '+JSON.stringify(body));
    return this.http.post(
      `${environment.baseURL}/activity-detail/send-sms-fbb`,
      body
    );
  }

  sendSmsFBBById(userName, userId, wrId, ainId, checkFBBIdList, smsAction): any {
    //const url = urls.getDefaultFilter;
    const body = {
      userName: userName,
      userId: userId,
      wrId: wrId,
      ainId: ainId,
      checkFBBIdList: checkFBBIdList,
      smsAction: smsAction
    };
    console.log('--- sendSmsFBB body : '+JSON.stringify(body));
    return this.http.post(
      `${environment.baseURL}/activity-detail/send-sms-fbb-by-id`,
      body
    );
  }

  getDashboard3bb(obj): any {
    //const url = urls.getDashboard;
    const body = {
      username: obj.username,
      option: obj.option,
      startDateTime: obj.startDateTime,
      endDateTime: obj.endDateTime,
      systemGroup: obj.systemGroup,
      region: obj.region,
      activityType: obj.activityType,
      aliasNode: obj.aliasNode,
      status: obj.status,
      downtime: obj.downtime,
      scheduleConflict: obj.scheduleConflict,
      fbbImpact: obj.fbbImpact,
      impact: obj.impact,
      impactNri: obj.impactNri,
      activityError: obj.activityError,
      corpDocStatus: obj.corpDocStatus,
      corpProductImpact: obj.corpProductImpact,
      remarkGroup: obj.remarkGroup,
      siteAccess: obj.siteAccess,
      wrActionAuto: obj.wrActionAuto,
      importance: obj.importance,
      ska: obj.ska,
      group: obj.group,
      ref1: obj.ref1,
      ref2: obj.ref2,
    };
    return this.http.post(
      `${environment.baseURL}/dashboard/get-dashboard-3bb`,
      body
    );
  }

  getActivityDetail3BB(wrId: string, userName: string): any {
    //const url = urls.getActivityDetail;
    const body = {
      wrId: wrId,
      userName: userName,
    };
    // console.log('====getActivityDetail========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail-3bb`,
      body
    );
  }

  saveWRActivityFBB3BB(body): any {
    //const url = urls.saveWRActivityFBB;
    return this.http.post(
      `${environment.baseURL}/wr-activity/save-wr-activity-fbb-3bb`,
      body
    );
  }

  getActivityService3BB(wrId: string, userName: string): any {
    //const url = urls.getActivityService;
    const body = {
      wrId: wrId,
      userName: userName,
    };
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-service-3bb`,
      body
    );
  }

  checkActivityDetailFBB3BB(obj): any {
    //const url = urls.checkActivityDetailFBB;
    const body = obj
    return this.http.post(
      `${environment.baseURL}/activity-detail/check-fbb-3bb`,
      body
    );
  }

  reloadActivityDetail3BB(body): any {
    //const url = urls.saveWRActivityFBB;
    return this.http.post(
      `${environment.baseURL}/activity-detail/reload-activity-detail-3bb`,
      body
    );
  }
}
