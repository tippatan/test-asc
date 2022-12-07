import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TtsServiceService {
  constructor(private http: HttpClient) {}

  listDropdownSystemGroupByUser(userId: string): any {
    //const url = urls.listDropdownSystemGroupByUser;
    const body = { userId: userId };
    // console.log('====listDropdownSystemGroupByUser========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  getDropDownRegionEN(userId: string): any {
    //const url = urls.getDropDownRegionEN;
    const body = { userId: userId };
    // console.log('====getDropDownRegionEN========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  getDropDownActivityType(userId: string): any {
    //const url = urls.getDropDownActivityType;
    const body = { userId: userId };
    // console.log('====getDropDownActivityType========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  getDropDownAliasNode(userId: string): any {
    //const url = urls.getDropDownAliasNode;
    const body = { userId: userId };
    // console.log('====getDropDownAliasNode========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  listStatusActIsShowActm(userId: string): any {
    //const url = urls.listStatusActIsShowActm;
    const body = { userId: userId };
    // console.log('====listStatusActIsShowActm========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  getDropDownImpactType(userId: string): any {
    //const url = urls.getDropDownImpactType;
    const body = { userId: userId };
    // console.log('====getDropDownImpactType========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  getDropDownNRI(userId: string): any {
    //const url = urls.getDropDownNRI;
    const body = { userId: userId };
    // console.log('====getDropDownNRI========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-activity-detail`,
      body
    );
  }

  getDropDownErrorLevel(): any {
    //const url = urls.getDropDownErrorLevel;
    const body = { type: 'ERROR_LEVEL' };
    // console.log('====getDropDownErrorLevel========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    //return this.http.get(`${environment.baseURL}/dropdown/error-level`, body);
    return this.http.post(`${environment.baseURL}/dropdown/actm-mst-lov`, body);
  }

  getCorpDocStatus(): any {
    //const url = urls.getCorpDocStatus;
    const body = { type: 'CPB_STATUS' };
    // console.log('====getCorpDocStatus========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(`${environment.baseURL}/dropdown/actm-mst-lov`, body);
  }

  getDropDownCorpProductImpact(userId: string): any {
    //const url = urls.getDropDownCorpProductImpact;
    const body = { userId: userId };
    // console.log('====getDropDownCorpProductImpact========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(
      `${environment.baseURL}/dropdown/corp-product-impact`,
      body
    );
  }

  //	getDropDownRemarkGroup() {
  //const url = urls.getDropDownRemarkGroup;
  // const body = { userId: userId };
  //		const body = { type: 'REMARK_GROUP' };
  // console.log('====getDropDownRemarkGroup========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
  //		return this.http.get(`${environment.baseURL}/dropdown/actm-mst-lov`, body);
  //	}

  getDropDownRemarkGroup(userId: string): any {
    //const url = urls.getDropDownImpactType;
    const body = { userId: userId };
    // console.log('====getDropDownImpactType========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(`${environment.baseURL}/dropdown/actm-mst-lov`, body);
  }

  /*initFindTTFilter(body) {
		// body -> TT: {}
		return this.http.post(`${environment.baseURL}/tt/init-find-tt-filter`, body);
	  }*/

  getACTMMstLovListByCategory(): any {
    //const url = urls.getACTMMstLovListByCategory;
    const body = { type: 'WR_AUTO_ACTION' };
    // console.log('====getACTMMstLovListByCategory========= > ',`${environment.baseURL}/activity-detail/get-activity-detail`,body);
    return this.http.post(`${environment.baseURL}/dropdown/actm-mst-lov`, body);
  }

  listStatusActForKeyIn(userId: string): any {
    //const url = urls.listStatusActForKeyIn;
    const body = { userId: userId };
    return this.http.post(
      `${environment.baseURL}/dropdown/status-act-show-actm`,
      body
    );
  }

  getCustomerDetail(body: any): any {
    return this.http.post(
      `${environment.baseURL}/activity-detail/get-customer-detail`,
      body
    );
  }
}
