import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detail-dailog',
  templateUrl: './detail-dailog.component.html',
  styleUrls: ['./detail-dailog.component.scss']
})
export class DetailDailogComponent {
  @Input() teacherDetails: any;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  teacherList: any[] = [];
  schoolList: any[] = [];
  selectedTeacher: any = null;
  selectedSchool: any = null;
  showDialog: boolean = false;
  dialogType: 'teacher' | 'school' = 'teacher';
  schoolDetails: any;
  // teacherDetails: any;
  // visible: boolean = false;

  onTeacherHover(teacherId: number) {
    this.selectedTeacher = this.teacherList.find(teacher => teacher.teacherId === teacherId);
    this.dialogType = 'teacher';
    this.showDialog = true;
  }

  onSchoolHover(schoolId: number) {
    this.selectedSchool = this.schoolList.find(school => school.id === schoolId);
    this.dialogType = 'school';
    this.showDialog = true;
  }

  hideDialog() {
    this.visible = false;
    this.selectedTeacher = null;
    this.selectedSchool = null;
  }
}
