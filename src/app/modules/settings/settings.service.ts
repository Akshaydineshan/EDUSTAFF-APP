import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient,) { }

  passwordResetWithEmail(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'User/ResetPasswordByUser', data);
  }


}
