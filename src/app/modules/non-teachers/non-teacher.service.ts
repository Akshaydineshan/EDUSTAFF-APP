import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NonTeacherService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  fetchNonTeachersData(): Observable<any[]> {
    debugger
    return this.http.get<any[]>(this.apiUrl + 'NonTeacher/GetAllActiveNonTeachersList', { headers: { accept: '*/*' } })
      .pipe(
        tap((data: any) => {


          catchError((error) => {
            console.error('Error fetching teachers data:', error);
            return throwError('Failed to fetch teachers data.');
          })
        }
        ))
  }

  addTeacher(teachersData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'NonTeacher/AddEmployee', teachersData).pipe(
      catchError((error) => {
        console.error('Error adding teacher:', error);
        return throwError(error);
      })
    );
  }
  updateTeacher(teachersData: any,employeId:number): Observable<any> {
    debugger
    return this.http.put(`${this.apiUrl}NonTeacher/update-employee/${employeId}`, teachersData).pipe(
      catchError((error) => {
        console.error('Error adding teacher:', error);
        return throwError(error);
      })
    );
  }
}
