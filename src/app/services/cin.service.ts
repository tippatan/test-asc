import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CinService {
  constructor(private http: HttpClient) {}

  findCinList(obj: any) {
    // return this.http.post(`${environment.baseURL}/cin/list-cin`, obj);
    if (obj.flg == 'export') {
      return this.http.post(`${environment.baseURL}/cin/list-cin`, obj, {
        observe: 'response',
        responseType: 'blob',
      });
    } else {
      return this.http.post(`${environment.baseURL}/cin/list-cin`, obj);
    }
  }

  viewCin(body) {
    return this.http.post(`${environment.baseURL}/cin/view-cin`, body);
  }

  initSendCIN(body: any) {
    return this.http.post(`${environment.baseURL}/cin/init-send-cin`, body);
  }

  reOpenCIN(body) {
    return this.http.post(`${environment.baseURL}/cin/re-open-cin`, body);
  }

  initModifyCIN(body) {
    // body = {
    //     cinId: CNxx-xxxxxx
    // }
    return this.http.post(`${environment.baseURL}/cin/init-modify-cin`, body);
  }

  modifyCIN(body) {
    return this.http.post(`${environment.baseURL}/cin/modify-cin`, body);
  }

  initCreateCin() {
    return this.http.get(`${environment.baseURL}/cin/init-create-cin`);
  }

  findCINGroup() {
    return this.http.get(`${environment.baseURL}/cin/find-cin-group-mail`);
  }

  sendCIN(body: any) {
    return this.http.post(`${environment.baseURL}/cin/send-cin`, body);
  }

  initCloseCin(body) {
    return this.http.post(
      `${environment.baseURL}/cin/init-close-one-cin`,
      body
    );
  }

  findCINSymptomForModify(bodyParam) {
    const params = new HttpParams()
      .set('cinId', bodyParam.cinId)
      .set('serviceId', bodyParam.serviceId)
      .set('serviceEN', bodyParam.serviceEN);
    return this.http.get(
      `${environment.baseURL}/cin/find-cin-symptom-for-modify`,
      { params }
    );
  }

  closeCin(body) {
    return this.http.post(`${environment.baseURL}/cin/close-one-cin`, body);
  }

  findCINSymptomByService(bodyParam) {
    const params = new HttpParams().set('service', bodyParam.serviceId);
    return this.http.get(
      `${environment.baseURL}/cin/find-cin-symptom-by-service`,
      { params }
    );
  }

  createCin(body) {
    return this.http.post(`${environment.baseURL}/cin/create-cin`, body);
  }
}
