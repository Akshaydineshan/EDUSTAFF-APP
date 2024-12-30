import { forkJoin, Subject } from 'rxjs';
import { DataService } from './../../../core/service/data/data.service';
import { SchoolService } from './../school.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-school',
  templateUrl: './view-school.component.html',
  styleUrls: ['./view-school.component.scss']
})
export class ViewSchoolComponent implements OnInit {
  isSidebarClosed: boolean = false;
  currentSchool!: any
  apiUrl = environment.imageBaseUrl;
  itemId: any;

  standards:any[] =[]
  currentIndex:number=0;
  printMode: boolean=false;
  teacherTableData: any[]=[];
  nonTeacherTableData: any[]=[];



  constructor(private route: ActivatedRoute, private schoolService: SchoolService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      debugger
      let itemId = params['id'];
      this.itemId = itemId;
      this.loadItemDetails(itemId);

    });
  }

  loadItemDetails(schoolId: any) {
    debugger
    this.schoolService.getSchoolById(schoolId).subscribe({
      next: (response) => {
        if(response){
          this.loadTeacherDataBySchool(schoolId)

          console.log("response",response)
          this.currentSchool = response

         if( this.currentSchool.getClasses.length){
          let data:any = []
          this.currentSchool.getClasses.map((item: any) => {
            data.push({
              "standard": item.class,
              "divisionData": item.getDivisions
            })
          })
          this.standards=data
         }
        

        }

    
      },
      error: (error) => {


      },
      complete: () => {

      }
    })

  }

  loadTeacherDataBySchool(id:number){
     let teacherUrl=`Teacher/GetAllTeacherBySchoolID/${id}`;
     let nonTeacherUrl=`NonTeacher/GetAllNonTeacherBySchoolID/${id}`;
      forkJoin({
        teachers:this.schoolService.getTableListData(teacherUrl),
        nonTeachers:this.schoolService.getTableListData(nonTeacherUrl),
      }).subscribe({
      next:(response:any)=>{
        console.log("res",response)
        if(response){
          this.teacherTableData=response.teachers;
          this.nonTeacherTableData=response.nonTeachers;
        }

      },
      error:()=>{

      },
      complete:()=>{

      }
    })
  }

  

  // Show the previous standard
  showPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  // Show the next standard
  showNext() {
    if (this.currentIndex < this.standards.length - 1) {
      this.currentIndex++;
    }
  }




  get getImage() {
    let result = '';
    if (this.apiUrl && this.currentSchool?.photo) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + this.currentSchool?.photo.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }



  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }

  print() {
    this.printMode = true; // Enable print mode
    setTimeout(() => window.print(), 100); // Print the page
    setTimeout(() => (this.printMode = false), 1000); // Reset after printing
    
    // window.print()
    
  }
}
