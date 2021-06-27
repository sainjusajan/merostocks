import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  // Base url
  baseurl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {
  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // POST


  // GET
  getPartners(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/customer/partners`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }


  // Error handling
  // tslint:disable-next-line: typedef
  errorHandl(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }


}
