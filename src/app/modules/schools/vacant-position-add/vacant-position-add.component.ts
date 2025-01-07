import { forkJoin, Subject } from 'rxjs';
import { DataService } from './../../../core/service/data/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchoolService } from '../school.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacant-position-add',
  templateUrl: './vacant-position-add.component.html',
  styleUrls: ['./vacant-position-add.component.scss']
})
export class VacantPositionAddComponent implements OnInit {

  isSidebarClosed: boolean = false;
  designations: any[] = [];
  subjects: any[] = [];
  schools: any[] = [];
  vacantAddForm!: FormGroup;

  constructor(private dataService: DataService, private fb: FormBuilder,private schoolService:SchoolService,private toastr:ToastrService,private router:Router) {
this.addVacantFormInit()
  }

  ngOnInit(): void {
    this.loadDropDownDatas()
  }

  addVacantFormInit() {

    this.vacantAddForm = this.fb.group({
        designation:[''],
        subject:[''],
        school:[''],
    })
  }

  loadDropDownDatas() {
    forkJoin({
      subjects: this.dataService.getAllSubjects(),
      schools: this.dataService.getAllSchools(),
      designations: this.dataService.getAllDesignations(),
    }).subscribe({
      next: (response: any) => {
        this.designations = response.designations;
        this.subjects = response.subjects;
        this.schools = response.schools;
      },
      error: (error: any) => {

      },
      complete: () => {

      }
    })

  }

  onSubmit(){
    console.log("form ",this.vacantAddForm.value)
    let formValue=this.vacantAddForm.value

    let data:any={
      "designationID": formValue.designation.designationID,
      "subjectID": formValue.subject.subjectID,
      "schoolID":formValue.school.schoolId
    }

    this.schoolService.addVacantPosition(data).subscribe({
      next: (response: any) => {
       console.log("added",response)
       if(response.statusCode===200){
        this.toastr.success('Vacancy Added!', 'Success', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-left',
          timeOut: 4500,
        });
        this.router.navigate(['/schools/vacant-positions'])

       }
      },
      error: (error: any) => {
        this.toastr.error(' Vacancy Addition Failed !', 'Failed', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-left',
          timeOut: 4500,
        });

      },
      complete: () => {

      }
    })


  }







  // topBar-sidebar 
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }
}
