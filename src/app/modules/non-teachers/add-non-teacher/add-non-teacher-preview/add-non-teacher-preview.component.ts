import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-non-teacher-preview',
  templateUrl: './add-non-teacher-preview.component.html',
  styleUrls: ['./add-non-teacher-preview.component.scss']
})
export class AddNonTeacherPreviewComponent {
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
    
    let image=this.fullFormData?.photoId?.photoImageName;
    if(this.fullFormData?.photoId?.photoImageName =='No Photo assigned' || null || '') image=""

    if (this.apiUrl && image) {
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

  getCertificate(certificate:any){
    let  result = this.apiUrl.replace(/\/+$/, '') + '/' + certificate.replace(/^\/+/, ''); 
    return result;
   }
   
   pdfClick(url:any){
    //  window.location.href= this.getCertificate(url)
     window.open(this.getCertificate(url),"_blank")
   }
}
