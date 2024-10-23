import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherDataService {
  private profileImage: BehaviorSubject<string | null | undefined> = new BehaviorSubject<string | null | undefined>(null);

  $profileImage :Observable<string | null | undefined >=this.profileImage.asObservable()
  constructor() { }

  getProfileImage(){
    return this.$profileImage;

  }

  setProfileImage(image:any){
    debugger
    this.profileImage.next(image)
  }
}
