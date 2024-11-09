import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  private baseUrl =  environment.apiUrl;

  constructor(private http: HttpClient) {}

 
  addSchool(schoolData: any): Observable<any> {
    const url = `${this.baseUrl}/School/AddSchool`;
    return this.http.post(url, schoolData);
  }



  // dropdown data list

  getSchoolTypes(): Observable<any> {
    const url = `${this.baseUrl}SchoolType/GetAllSchoolTypes`;
    return this.http.get(url);
  }

  getDivisionDetailsBySchoolType(schoolType:number): Observable<any> {
    const url = `${this.baseUrl}SchoolType/GetDivisionsBySchoolType/${schoolType}`;
    return this.http.get(url);
  }

  getCities(): Observable<any> {
    const url = `${this.baseUrl}ProfileDetails/GetAllCities`;
    return this.http.get(url);
  }
 

  
  getSchoolById(schoolId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}School/SchoolHomePage${schoolId}`);
  }

}
