import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStoreService } from '../tokenStore/token-store.service';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenStore: TokenStoreService
  ) { }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password, rememberMe });

    return this.http.post<any>(this.apiUrl + 'User/Login', body, { headers })
      .pipe(
        tap((response: { token: any; }) => {
          const token = response.token;
          if (token) {
            this.tokenStore.saveToken(token);
          }
        })
      );
  }

  register(username: string, password: string, confirmPassword: string, firstName: string, lastName: string, email: string, dateOfBirth: string, roleID: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ username, password, confirmPassword, firstName, lastName, email, dateOfBirth, roleID });
  debugger
    return this.http.post<any>(this.apiUrl + 'User/register', body, { headers })
      .pipe(
        tap((response: { token: any }) => {
          const token = response.token;
          if (token) {
            this.tokenStore.saveToken(token);
          }
        })
      );
  }

  passwordResetWithEmail(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'PasswordReset/reset-password', data);
  }
  
  forgotPassword(data:any){
    return this.http.post(this.apiUrl + 'PasswordReset/forgot-password', data);
  }
}