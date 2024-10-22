import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherFilterService {
  private apiUrl = '/api/Teacher/GetTeachersFilterList';

  constructor(private http: HttpClient) { }

  getFilteredTeachers(
    subjectFilter: string,
    retiringInMonths: number | null,
    schoolNameFilter: string,
    includeDocumentsWithError: boolean,
    minExperienceYear: number | null,
    maxExperienceYear: number | null
  ): Observable<any> {
    let params = new HttpParams();

    if (subjectFilter) {
      params = params.set('subjectFilter', subjectFilter);
    }
    if (retiringInMonths !== null) {
      params = params.set('retiringInMonths', retiringInMonths.toString());
    }
    if (schoolNameFilter) {
      params = params.set('schoolNameFilter', schoolNameFilter);
    }
    params = params.set('includeDocumentsWithError', includeDocumentsWithError.toString());

    if (minExperienceYear !== null) {
      params = params.set('minExperienceYear', minExperienceYear.toString());
    }
    if (maxExperienceYear !== null) {
      params = params.set('maxExperienceYear', maxExperienceYear.toString());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
}
