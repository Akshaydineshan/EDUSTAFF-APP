import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.scss']
})
export class TeacherDetailsComponent {
  @Input() detailViewForm!: FormGroup;
  @Input() showTopbarAndSidebar: boolean = true;
  @Output() detailViewFormChange = new EventEmitter<any>();
  @Output() EditBtnClickPreview = new EventEmitter<any>();
  isSidebarClosed = false;
  teacherRegister: boolean = true;
  @Input() fullFormData: any
  apiUrl = environment.imageBaseUrl;
  emptyImage: any = '../../../../assets/icons/user.png'

  // showTopbarAndSidebar = true


  ngOnInit() {

  }
  get getImage() {
    let result = '';
    if (this.apiUrl && this.fullFormData?.photoId?.photoImageName) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + this.fullFormData.photoId.photoImageName.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }


  onFormChange() {
    this.detailViewFormChange.emit(this.detailViewForm);
  }


  editClick() {
    this.EditBtnClickPreview.emit()
  }



}
