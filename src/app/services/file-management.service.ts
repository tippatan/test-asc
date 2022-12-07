import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileAttachActm } from 'app/models/file-attach-actm.model';
import { FileAttach } from 'app/models/file-attach.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  constructor(
    private http: HttpClient
  ) { }

  upload(fileForm) {
    return this.http.post(environment.baseURL + '/file/add-file', fileForm);
  }

  getFileList(docId: string, refId: any) {
    let queryParam = {};
    if (docId) {
      queryParam['docId'] = docId;
    }
    if (refId) {
      queryParam['refId'] = refId;
    }
    return this.http.get(environment.baseURL + '/file/init-attach-file', { params: queryParam });
  }

  getFile(fileId, ttId = "", displayFrom = "") {
    const params = new HttpParams()
      .set('ttId', ttId)
      .set('displayFrom', displayFrom)
    return this.http.get(environment.baseURL + '/file/download-file/' + fileId, {
      params: params,
      observe: 'response',
      responseType: 'blob'
    });
  }

  deleteAttachFile(file: FileAttach) {
    return this.http.post(environment.baseURL + '/file/delete-file', file);
  }

  downloadFileTemplate(path: string) {
    const params = new HttpParams().set('path', path);
    return this.http.get(
      environment.baseURL + `/file/download-file-template/`+ path,
      {
        params: params,
        observe: 'response',
        responseType: 'blob',
      }
    );
  }

  downloadFileWR(filePath: string, fileGuId: string, fileExtension: string) {
    const params = new HttpParams()
    .set('filePath', filePath)
    .set('fileGuId', fileGuId)
    .set('fileExtension', fileExtension);
    console.log(' file service downloadFileWR params : ',params);
    return this.http.get(
      environment.baseURL + `/file/download-file-wr`,
      {
        params: params,
        observe: 'response',
        responseType: 'blob',
      }
    );
  }

  deleteFileWR(files) : any{
    const body = {
      fileGuId: files.id,
	    wrId: files.wrId,
      fileName: files.fileName,
      fileDesc: files.fileDescription,
      filePath: files.filePath,
      fileSize: files.fileSize,
      fileExtension: files.fileExtension,
      lastUpdBy: files.updateBy
    };
    console.log('====deleteFileWR========= > ',`${environment.baseURL}/file/delete-file-wr`,body);
    return this.http.post(
      `${environment.baseURL}/file/delete-file-wr`,
      body
    );
  }

  uploadFileWr(fileForm): any {
    return this.http.post(environment.baseURL + '/file/add-file-wr', fileForm);
  }
}
