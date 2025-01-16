import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
 apiUrl = environment.apiUrl;
  constructor(private http: HttpClient,) { }

  passwordResetWithEmail(data: any): Observable<any> {
    return this.http.post(this.apiUrl + 'PasswordReset/reset-password', data);
  }

  getProfile(){
    return this.http.get<any[]>(this.apiUrl + 'User/get-user', { headers: { accept: '*/*' } })
  }

  updateUser(userId:number,data:any){
    return this.http.patch<any[]>(this.apiUrl + 'User/UpdateUser/' + userId,data )
  }

  
}
