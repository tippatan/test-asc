import { Utility } from './../utils/utility';
import { AuthService } from 'app/services/auth.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpClient,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private utility: Utility,
    private http: HttpClient
  ) {}

  generatorXSession() {
    var result = '';
    var characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 22; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let username = '';
    let xSession = this.generatorXSession();
    if (!this.utility.isEmpty(this.authService.tokenValue)) {
      username = this.authService.tokenValueDecode.name;
    }
    const modifiedReq = request.clone({
      headers: new HttpHeaders({
        'X-session-Id': xSession,
        projectCode: environment.projectCode,
        transactionId: `${xSession}${moment().format('YYYYDDMMHHmmss')}`,
        transactionDate: moment().format('DD/MM/YYYY HH:mm:ss'),
        moduleName: this.getModuleName(request.url),
        channel: environment.channel,
        username: username,
      }),
    });
    return next.handle(modifiedReq);
  }

  getModuleName(url: string): string {
    if (url.includes('/login-asc')) return 'LOGIN_TTS';
    if (url.includes('/view-login')) return 'LOAD_PROFILE';
    if (url.includes('/change-log-in-profile')) return 'CHANGE_LOGIN_PROFILE';
    if (url.includes('/view-change-login-profile'))
      return 'VIEW_CHANGE_LOGIN_PROFILE';
    if (url.includes('/file/add-file')) return 'UPLOAD_FILE';
    if (url.includes('/file/download-file/')) return 'DOWNLOAD_FILE';
    if (url.includes('/common/find-column-sort')) return 'LOAD_COLUMN_SORT';
    if (url.includes('/common/create-column-sort')) return 'CREATE_COLUMN_SORT';
    if (url.includes('/common/find-service')) return 'FIND_SERVICE';
    if (url.includes('/common/find-site')) return 'FIND_SITE';
    if (url.includes('/common/init-site-query')) return 'LOAD_SITE_QUERY';
    if (url.includes('/common/find-site-info')) return 'FIND_SITE_INFO';
    if (url.includes('/common/find-site-query')) return 'FIND_SITE_QUERY';
    if (url.includes('/menu-left/list')) return 'LOAD_LEFT_MENU';
    if (url.includes('/tt/find-tt-in-active-box'))
      return 'TT-LOAD_TT_ACTIVE_BOX';
    if (url.includes('/tt/find-tt-in-active-box-other'))
      return 'TT-LOAD_TT_ACTIVE_BOX_OTHER';
    if (url.includes('/tt/find-tt-in-region-active-box'))
      return 'TT-LOAD_TT_IN_REGION_ACTIVE_BOX';
    if (url.includes('/tt/find-tt-region-other'))
      return 'TT-LOAD_TT_IN_REGION_OTHER_BOX';
    if (url.includes('/tt/find-tt-inbox')) return 'TT-LOAD_TT_IN_BOX';
    if (url.includes('/tt/find-tt-inbox-other'))
      return 'TT-LOAD_TT_IN_BOX_OTHER';
    if (url.includes('/tt/find-tt-in-nmc-box')) return 'TT-LOAD_TT_IN_NMC_BOX';
    if (url.includes('/tt/find-tt-in-out-box')) return 'TT-LOAD_TT_IN_OUT_BOX';
    if (url.includes('/tt/find-tt-in-out-box-other'))
      return 'TT-LOAD_TT_IN_OUT_BOX_OTHER';
    if (url.includes('/tt/find-tt-filter')) return 'TT-FIND_TT_FILTER';
    if (url.includes('/tt/init-find-tt-filter')) return 'TT-LOAD_TT_FILTER';
    if (url.includes('/tt/init-create-tt')) return 'TT-LOAD_CREATE_TT';
    if (url.includes('/tt/create-tt')) return 'TT-CREATE_TT';
    if (url.includes('/tt/find-tt-template')) return 'TT-FIND_TT_TEMPLATE';
    if (url.includes('/tt/find-tt-template-by-id'))
      return 'TT-FIND_TT_TEMPLATE_BY_ID';
    if (url.includes('/tt/get-tt-template-escalate-by-template-id'))
      return 'TT-LOAD_TT_TEMPLATE_ESCALATE_BY_TEMPLATE_ID';
    if (url.includes('/tt/get-site-radio-by-location'))
      return 'TT-LOAD_SITE_RADIO_BY_LOCATION';
    if (url.includes('/tt/get-master-default-escalate'))
      return 'TT-LOAD_MASTER_DEFAULT_ESCALATE';
    if (url.includes('/tt/get-region')) return 'TT-LOAD_REGION';
    if (url.includes('/tt/flow')) return 'TT-LOAD_FLOW';
    if (url.includes('/tt/history/')) return 'TT-LOAD_TT_HISTORY';
    if (url.includes('/tt/TT')) return 'TT-LOAD_VIEW_TT';
    if (url.includes('/tt/init-modify-tt')) return 'TT-LOAD_MODIFY_TT';
    if (url.includes('/tt/modify-tt')) return 'TT-MODIFY_TT';
    if (url.includes('/tt/init-close-more-msi'))
      return 'TT-LOAD_CLOSE_MORE_MSI';
    if (url.includes('/tt/find-eng-reason')) return 'TT-FIND_ENG_REASON';
    if (url.includes('/tt/find-eng-solution')) return 'TT-FIND_ENG_SOLUTION';
    if (url.includes('/tt/close-tt')) return 'TT-CLOSE_TT';
    if (url.includes('/tt/init-find-similar-tt'))
      return 'TT-LOAD_FIND_SIMILAR_TT';
    if (url.includes('/tt/find-similar-tt')) return 'TT-FIND_SIMILAR_TT';
    if (url.includes('/query/query-tt')) return 'TT-QUERY_TT';
    if (url.includes('/query/init-query-tt')) return 'TT-LOAD_QUERY_TT';
    if (url.includes('/init-combine-tt')) return 'TT-LOAD_REOPEN_TT';
    if (url.includes('/reopen-tt')) return 'TT-REOPEN_TT';
    if (url.includes('/tt/find-tt-message-box'))
      return 'TT-FIND_TT_MESSAGE_BOX';
    if (url.includes('/tt/list-transfer')) return 'TT-FIND_LIST_TRANSFER';
    if (url.includes('/tt/list-transfer-condition'))
      return 'TT-FIND_LIST_TRANSFER_CONDITION';
    if (url.includes('/menu')) return 'LOAD_MENU';
    return this.convertUrlToModuleName(url.substr(1));
  }

  convertUrlToModuleName(inputString: string) {
    let result = '';
    if (inputString.match(/[a-z,A-Z]{2}[\d]{2}-[\d]{6,7}/g)) {
      result = inputString.replace(/[aA][pP][iI][/][vV][1][/]/g, '');
      result = result.replace(/[a-z,A-Z]{2}[\d]{2}-[\d]{6,7}/g, 'LOAD_VIEW');
      result = result.split('-').join('_');
      result = result.split('/').join('-');
      result = result.toUpperCase();
    } else {
      result = inputString.replace(/[aA][pP][iI][/][vV][1][/]/g, '');
      result = result.split('-').join('_');
      result = result.split('/').join('-');
      result = result.toUpperCase();
    }
    return result;
  }
}
