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
    console.log(":in",this.fullFormData)

  }
  get getImage() {
    let previewUrls = this.fullFormData.photoId.profilePreview;
    if (previewUrls) {
      return previewUrls;
    }

    let result = '';
    let image = this.fullFormData.photoId.photoImageName;
    if (this.fullFormData.photoId.photoImageName == 'No Photo assigned' || null || '') image = ""

    if (this.apiUrl && image) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + this.fullFormData.photoId.photoImageName?.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    console.log("result", result)
    return result;
  }
  getCertificate(certificate:any){
    let  result = this.apiUrl.replace(/\/+$/, '') + '/' + certificate.replace(/^\/+/, ''); 
    return result;
   }
   
   pdfClick(url:any){
    console.log("url",url)
    //  window.location.href= this.getCertificate(url)
     window.open(this.getCertificate(url),"_blank")
   }


  onFormChange() {
    this.detailViewFormChange.emit(this.detailViewForm);
  }


  editClick() {
    this.EditBtnClickPreview.emit()
  }



}
