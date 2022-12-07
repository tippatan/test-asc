import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  readonly URL: string = 'common';
  constructor(private http: HttpClient) {}

  findColumnSort(page: string) {
    return this.http
      .get(`${environment.baseURL}/${this.URL}/find-column-sort/${page}`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  createColumnSort(body) {
    // body
    //   {
    //     "page": "TT_ActiveBox",
    //     "sort": [
    //         {
    //             "columnNo": 3,
    //             "orderBy": "desc",
    //             "orderSeq": null
    //         }
    //     ]
    // }
    return this.http.post(
      `${environment.baseURL}/${this.URL}/create-column-sort`,
      body
    );
  }

  findService(subSystem: string, regionId: string) {
    return this.http.post(`${environment.baseURL}/${this.URL}/find-service`, {
      subsystemId: subSystem,
      regionId: regionId,
      nodeList: '',
      multi: 'y',
    });
  }

  findSite(body) {
    return this.http.post(`${environment.baseURL}/${this.URL}/find-site`, body);
  }

  initSiteQuery(body) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/init-site-query`,
      body
    );
  }

  // body = {siteId}
  findSiteInfo(body) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-site-info`,
      body
    );
  }

  findSiteQuery(body) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-site-query`,
      body
    );
  }

  findColumnShow(body) {
    // body = {
    //   page: string
    // }
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-column-show`,
      body
    );
  }

  createColumnShow(body) {
    // body = {
    //   page: string,
    //   column: array
    // }
    return this.http.post(
      `${environment.baseURL}/${this.URL}/create-column-show`,
      body
    );
  }

  findTeam(zoneId: string) {
    return this.http.post(`${environment.baseURL}/${this.URL}/find-team`, {
      zoneId: zoneId,
    });
  }
  initSMSGroup(corpFlag, field) {
    const params = new HttpParams()
      .set('corpFlag', corpFlag)
      .set('field', field);
    return this.http.get(`${environment.baseURL}/${this.URL}/init-sms-group`, {
      params,
    });
  }

  initStaffQuery(body) {
    // body = {
    //   region_id: "",
    //   pageType: "",
    //   smsJob: ""
    // }
    return this.http.post(
      `${environment.baseURL}/${this.URL}/init-staff-query`,
      body
    );
  }

  findStaffQuery(body) {
    // body = {
    //   hiddenregion: ""// hiddenregionId,
    //   region_id: ""//regionId,
    //   staffType: ""//,
    //   fromPage: ""//,
    //   corpFlag: ""//
    // }
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-staff-query`,
      body
    );
  }

  findJobTitle() {
    return this.http.get(`${environment.baseURL}/${this.URL}/find-job-title`);
  }

  findReferenceJob(ttId: string, body, fromRow, toRow) {
    const params = new HttpParams().set('fromRow', fromRow).set('toRow', toRow);
    // body = {
    //   JB: {}//
    // }
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-reference-job/${ttId}`,
      body,
      { params }
    );
  }

  findMultiProblemCause(obj: any) {
    return this.http.post(
      `${environment.baseURL}/common/find-multi-cause`,
      obj
    );
  }

  findFavoriteProblemMulti(obj: any) {
    return this.http.post(
      `${environment.baseURL}/common/find-favorite-problem-cause-multi`,
      obj
    );
  }

  findReaSonOverdue(obj: any) {
    return this.http.post(
      `${environment.baseURL}/common/findreasonoverdue`,
      obj
    );
  }
  findReaSonOverdueByDesc(obj: any) {
    return this.http.post(
      `${environment.baseURL}/common/find-reason-overdue-by-desc`,
      obj
    );
  }

  initFindAlarmActiveForJob() {
    return this.http.get(
      `${environment.baseURL}/${this.URL}/init-find-alarm-active-for-job`
    );
  }

  getSiteAccessFromQueryAlActive(obj: any) {
    return this.http.post(
      `${environment.baseURL}/common/get-site-access-from-query-al-active`,
      obj
    );
  }

  findProvince(obj: any) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-province`,
      obj
    );
  }

  findAmphur(obj: any) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-amphur`,
      obj
    );
  }

  findAlarmActive(obj: any) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-alarm-active`,
      obj
    );
  }

  findCinServe(obj: any) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-cin-service`,
      obj
    );
  }

  findCinCustomerImpact(obj: any) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-cin-customerimpact`,
      obj
    );
  }

  findCauseNotify(obj: any) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/find-cause-notify`,
      obj
    );
  }

  checkAlarmBySiteCode(obj: any) {
    return this.http.post(
      `${environment.baseURL}/${this.URL}/check-alarm-by-site-code`,
      obj
    );
  }

  findMSI(obj: any) {
    return this.http.post(`${environment.baseURL}/${this.URL}/find-msi`, obj);
  }
}
