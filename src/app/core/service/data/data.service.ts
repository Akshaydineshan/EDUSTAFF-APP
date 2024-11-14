import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = environment.apiUrl;

  private schoolDataCache = new BehaviorSubject<any[]>([]);
  private teachersDataCache = new BehaviorSubject<any[]>([]);
  private SchoolPromotionEligibleCache = new BehaviorSubject<any[]>([]);
  private teachersPromotionEligibilityCache = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient,) { }

  formatDateToISO(date: any): string | null {
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    }
    return null;
  }
  formatDateToLocal(dateString: string): string {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTotalActiveTeachersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(this.apiUrl + '/Teacher/GetAllActiveTeachersCount');
  }

  getTotalOpenSchoolCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(this.apiUrl + '/School/GetAllOpenSchoolsCount');
  }

  getVacantPositionData(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(this.apiUrl + '/Position/GetAllPositionCount');
  }

  getPromotionEligibleCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(this.apiUrl + '/Teacher/GetPromotionEligibleTeachersCount')
  }

  getDashboardStats(): Observable<any> {
    return forkJoin({
      activeTeachers: this.getTotalActiveTeachersCount().pipe(catchError(() => of({ count: 0 }))),
      openSchools: this.getTotalOpenSchoolCount().pipe(catchError(() => of({ count: 0 }))),
      vacantPositions: this.getVacantPositionData().pipe(catchError(() => of({ count: 0 }))),
      promotionEligible: this.getPromotionEligibleCount().pipe(catchError(() => of({ count: 0 }))),
    }).pipe(
      catchError(this.handleError)
    );
  }
  getTeacherDetailPopUp(teacherId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/Teacher/GetTeacherPopUp/' + teacherId);
  }

  getSchoolDetailPopUp(schoolId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/School/GetSchoolPopUp/' + schoolId);
  }

  getTransferRequestData(): Observable<any[]> {
    debugger
    // if (this.teachersDataCache.value.length === 0) {
      return this.fetchTransferRequestData();
    // }
    // return this.teachersDataCache.asObservable();
  }

  private fetchTransferRequestData(): Observable<any[]> {
    debugger
    return this.http.get<any[]>(this.apiUrl + 'TransferRequest/GetAllTransferRequests', { headers: { accept: '*/*' } }).pipe(
      tap(data => this.teachersDataCache.next(data)),
      catchError((error) => {
        console.error('Error fetching teachers data:', error);
        return throwError(error);
      })
    );
  }


  getTeachersData(): Observable<any[]> {
    debugger
    // if (this.teachersDataCache.value.length === 0) {
      return this.fetchTeachersData();
    // }
    // return this.teachersDataCache.asObservable();
  }

  private fetchTeachersData(): Observable<any[]> {
    debugger
    return this.http.get<any[]>(this.apiUrl + 'Teacher/GetAllActiveTeachersList', { headers: { accept: '*/*' } }).pipe(
      tap(data => this.teachersDataCache.next(data)),
      catchError((error) => {
        console.error('Error fetching teachers data:', error);
        return throwError('Failed to fetch teachers data.');
      })
    );
  }

  getSchoolData(): Observable<any[]> {
    // if (this.schoolDataCache.value.length === 0) {
      return this.fetchSchoolData();
    // }
    // return this.schoolDataCache.asObservable();
  }
  private fetchSchoolData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'School/GetOpenSchoolsList').pipe(
      tap(data => this.schoolDataCache.next(data)),
      catchError(error => {
        console.error('Error fetching school data:', error);
        return [];
      })
    );
  }

  getTeachersPromotionEligibilityList(): Observable<any[]> {
    if (this.teachersPromotionEligibilityCache.value.length === 0) {
      return this.fetchTeachersPromotionEligibilityList();
    }
    return this.teachersPromotionEligibilityCache.asObservable();
  }

  private fetchTeachersPromotionEligibilityList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/Teacher/GetPromotionEligibilityTeachersList', { headers: { accept: '*/*' } }).pipe(
      tap(data => this.teachersPromotionEligibilityCache.next(data)),
      catchError((error) => {
        console.error('Error fetching teachers promotion eligibility List:', error);
        return throwError('Failed to fetch teachers promotion eligibility List.');
      })
    );
  }

  refreshTeachersPromotionEligibleList(): void {
    this.fetchTeachersPromotionEligibilityList().subscribe();
  }

  refreshSchoolPromotionEligibleList(): void {
    // this.fetchSchoolPromotionEligibleList().subscribe();
  }

  refreshSchoolData(): void {
    this.fetchSchoolData().subscribe();
  }

  refreshTeachersData(): void {
    this.fetchTeachersData().subscribe();
  }

  filterTeacherList(filters: any): any {
    debugger

    let params = new HttpParams();
    if (filters.subjectFilter) params = params.append('subjectFilter', filters.subjectFilter);
    if (filters.retiringInMonths) params = params.append('retiringInMonths', filters.retiringInMonths);
    if (filters.schoolNameFilter) params = params.append('schoolNameFilter', filters.schoolNameFilter);
    if (filters.uniqueIdFilter) params = params.append('uniqueId', filters.uniqueIdFilter);
    if (filters.documents) params = params.append('documents', filters.documents);
    if (filters.minExperienceYear) params = params.append('minExperienceYear', filters.minExperienceYear);
    if (filters.maxExperienceYear) params = params.append('maxExperienceYear', filters.maxExperienceYear);
    if (filters.ExperienceYear) params = params.append('ExperienceYear', filters.ExperienceYear);
    if (filters.newRecruit) params = params.append('newRecruit', filters.newRecruit.toString());
    if (params) {
      return filters ? this.http.get<any[]>(`${this.apiUrl}Teacher/GetTeachersFilterList`, { params }).pipe(
        catchError((error) => {
          console.error('Error fetching teacher list:', error);
          return throwError('Failed to fetch teacher list.');
        })
      ) : null
    }
  }


  listNonTeachersData(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'Teacher/GetTeacherList', { headers: { accept: '*/*' } }).pipe(
      catchError((error) => {
        console.error('Error fetching teachers data:', error);
        return throwError('Failed to fetch teachers data.');
      })
    );
  }

  uploadPhoto(teacherId: number, photoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('PhotoFile', photoFile);
    return this.http.post(this.apiUrl + 'Teacher/UploadPhoto' + '/' + teacherId, formData);
  }
  createTransferRequest(data:any): Observable<any> {
   
    return this.http.post(this.apiUrl + 'TransferRequest/CreateTransferRequest',data);
  }

  approveTransferRequest(data:any,id:number): Observable<any> {
     return this.http.patch(this.apiUrl + `TransferRequest/${id}/approve`,data);
  }
  rejectTransferRequest(data:any,id:number): Observable<any> {
    return this.http.put(this.apiUrl + `TransferRequest/UpdateSchool/${id}`,data);
 }
  uploadProfilePhoto(photoFile: File): Observable<any> {
    debugger
    const formData = new FormData();
    formData.append('PhotoFile', photoFile);
    return this.http.post(this.apiUrl + 'FileUpload/AddPhoto', formData);
  }
  uploadDocument(documentFile: File): Observable<any> {
    const formData = new FormData();

    formData.append('DocumentName', "educationCertificate");
    formData.append('DocumentFile', documentFile);
    return this.http.post(this.apiUrl + 'FileUpload/AddDocument', formData);
  }

  addTeacher(teachersData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'Teacher/AddEmployee', teachersData).pipe(
      catchError((error) => {
        console.error('Error adding teacher:', error);
        return throwError(error);
      })
    );
  }
  updateTeacher(teachersData: any,employeId:number): Observable<any> {
    debugger
    return this.http.put(`${this.apiUrl}Teacher/update-employee/${employeId}`, teachersData).pipe(
      catchError((error) => {
        console.error('Error adding teacher:', error);
        return throwError(error);
      })
    );
  }

  getAllSubjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllSubjects`);
  }

  getTeacherById(teacherId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}Teacher/get-employee/${teacherId}`);
  }


  getAllStatuses(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllStatuses`);
  }

  getAllSchools(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllSchools`);
  }
  getSchoolWithCity(): Observable<any> {
    return this.http.get(`${this.apiUrl}School/withcity`);
  }
  getAllDesignations(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllDesignations`);
  }


  getAllReligions(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllReligions`);
  }

  getAllMaritalStatuses(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllMaritalStatuses`);
  }

  getAllGenders(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllGenders`);
  }

  getAllEmployeeTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllEmployeeTypes`);
  }

  getAllEmployeeCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllEmployeeCategories`);
  }

  getAllDistricts(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllDistricts`);
  }

  getAllCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllEducationTypes`);
  }

  getCoursesByEducationType(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}Teacher/GetCoursesByEducationType/${id}`);
  }

  getAllCities(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllCities`);
  }

  getAllCasteCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllCasteCategories`);
  }

  getAllBloodGroups(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllBloodGroups`);
  }

  getAllApprovalTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllApprovalTypes`);
  }

  getAllDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}ProfileDetails/GetAllEmployeeTypes`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 500) {
      return throwError('Internal Server Error. Please try again later.');
    } else {
      return throwError('An unexpected error occurred.');
    }
  }



}
