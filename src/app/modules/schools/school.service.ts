import { NumberFormatStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
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

  updateSchool(schoolData: any,id:NumberFormatStyle): Observable<any> {
    const url = `${this.baseUrl}/School/UpdateSchool/${id}`;
    return this.http.put(url, schoolData);
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
    return this.http.get(`${this.baseUrl}School/GetSchoolHomePage/${schoolId}`);
  }


  getVacantPositionList(): Observable<any[]> {
    debugger
    // if (this.teachersDataCache.value.length === 0) {
      return this.fetchVacantPositionData();
    // }
    // return this.teachersDataCache.asObservable();
  }

  private fetchVacantPositionData(): Observable<any[]> {
    debugger
    return this.http.get<any[]>(this.baseUrl + 'Position/GetAllNewAndVacantSchoolPositions', { headers: { accept: '*/*' } })

  }

}
