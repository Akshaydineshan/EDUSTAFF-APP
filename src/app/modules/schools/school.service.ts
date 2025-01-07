import { NumberFormatStyle } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  addVacantPosition(data: any): Observable<any> {
    const url = `${this.baseUrl}/Position/AddNewSchoolPosition`;
    return this.http.post(url, data);
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

  // getDivisionDetailsBySchoolType(schoolTypes: any): Observable<any> {
  //   let params = new HttpParams()
  //   console.log("school types",schoolTypes)
  //   schoolTypes.forEach((element:any) => {
  //     console.log("elem",element.schoolTypeID.toString())
  //     params.append('schooltypeIDs', element.schoolTypeID.toString());
  //   });
 
  //   console.log("params", params.toString());
    
  //   const url = `${this.baseUrl}SchoolType/GetClassesBySchoolType`;
  //   return this.http.get(url, { params });
  // }

  getDivisionDetailsBySchoolType(schoolTypes: any): Observable<any> {
    let params = new HttpParams();
    
    console.log("school types", schoolTypes);
  
    schoolTypes.forEach((element: any) => {
      console.log("elem", element.schoolTypeID.toString());
      params = params.append('schooltypeIDs', element.schoolTypeID.toString());
    });
  
    console.log("params", params.toString());
  
    const url = `${this.baseUrl}SchoolType/GetClassesBySchoolType`;
    return this.http.get(url, { params });
  }
  
  getCities(): Observable<any> {
    const url = `${this.baseUrl}ProfileDetails/GetAllCities`;
    return this.http.get(url);
  }

  getTableListData(url: string): Observable<any[]> {
    debugger
    return this.http.get<any[]>(this.baseUrl + url, { headers: { accept: '*/*' } }).pipe(

      catchError((error) => {
        console.error('Error fetching teachers data:', error);
        return throwError(error);
      })
    );
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
