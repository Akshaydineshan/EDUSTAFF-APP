import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-hover-popup',
  templateUrl: './employee-hover-popup.component.html',
  styleUrls: ['./employee-hover-popup.component.scss']
})
export class EmployeeHoverPopupComponent {
@Input() position:any
@Input() showToggle:boolean=false;
@Input() selectedTeacher:any;
API_BASE_IMAGE: any = environment.imageBaseUrl



get getTeacherImage() {
  debugger
  let result = '';

  if (this.API_BASE_IMAGE && this.selectedTeacher?.photo && this.selectedTeacher?.photo !== 'null') {
    result = this.API_BASE_IMAGE.replace(/\/+$/, '') + '/' + this.selectedTeacher.photo?.replace(/^\/+/, '');
  }
  // If the result is an empty string, it will fallback to emptyImage in the template
  return result;
}




}
