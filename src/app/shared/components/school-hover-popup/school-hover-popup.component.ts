import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-school-hover-popup',
  templateUrl: './school-hover-popup.component.html',
  styleUrls: ['./school-hover-popup.component.scss']
})
export class SchoolHoverPopupComponent {
  @Input() position:any
  @Input() showToggle:boolean=false;
  @Input() selectedSchool:any;
  API_BASE_IMAGE: any = environment.imageBaseUrl;




  get getschoolImage() {
    let result = '';
    if (this.API_BASE_IMAGE && this.selectedSchool?.photo && this.selectedSchool?.photo !== 'null') {
      result = this.API_BASE_IMAGE.replace(/\/+$/, '') + '/' + this.selectedSchool?.photo.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }

  get getPrincipalImage() {
    let result = '';
    if (this.API_BASE_IMAGE && this.selectedSchool?.principalPhotoPath && this.selectedSchool?.principalPhotoPath !== 'null') {
      result = this.API_BASE_IMAGE.replace(/\/+$/, '') + '/' + this.selectedSchool?.principalPhotoPath.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }

  get getVicePrincipalImage() {
    let result = '';
    if (this.API_BASE_IMAGE && this.selectedSchool?.vicePrincipalPhotoPath && this.selectedSchool?.vicePrincipalPhotoPath !== 'null') {
      result = this.API_BASE_IMAGE.replace(/\/+$/, '') + '/' + this.selectedSchool?.vicePrincipalPhotoPath.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }
}
