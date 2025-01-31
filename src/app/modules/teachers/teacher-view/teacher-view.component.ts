import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teacher-view',
  templateUrl: './teacher-view.component.html',
  styleUrls: ['./teacher-view.component.scss']
})
export class TeacherViewComponent implements OnInit {
  isSidebarClosed: boolean = false;

  currentTeacher!: any
  apiUrl = environment.imageBaseUrl;
  itemId: any
  historyTableData: any=[];


  constructor(private route: ActivatedRoute, private dataService: DataService,private router:Router, private ngZone: NgZone) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      debugger
      let itemId = params['id'];
      this.itemId = itemId;
      this.loadItemDetails(itemId);
      this.loadTeacherHistory(itemId)


     
    });
  }

  loadItemDetails(teacherId: any) {
    debugger
    this.dataService.getTeacherById(teacherId).subscribe({
      next: (response) => {
        console.log(response)
        this.currentTeacher = response

      },
      error: (error) => {
        this.router.navigate(['/teachers/teacher-list'])

      },
      complete: () => {

      }
    })

  }


  loadTeacherHistory(teacherId: any) {
    debugger
    this.dataService.getTeacherHistoryById(teacherId).subscribe({
      next: (response) => {
        console.log(response)
        this.historyTableData = response
        console.log("History",this.historyTableData)

      },
      error: (error) => {
        // this.router.navigate(['/teachers/teacher-list'])

      },
      complete: () => {

      }
    })

  }

  get getImage() {
    let result = '';

     let image=this.currentTeacher?.photoDTO.photoName;
    if(this.currentTeacher?.photoDTO.photoName=='No Photo assigned' || null || '') image=""

    if (this.apiUrl && image ) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + this.currentTeacher?.photoDTO.photoName.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }




editClick(){
  this.ngZone.run(() => {
    this.router.navigate(['/teachers/add-teacher',this.itemId])
  })

 
}

 getCertificate(certificate:any){
 let  result = this.apiUrl.replace(/\/+$/, '') + '/' + certificate.replace(/^\/+/, ''); 
 return result;
}

pdfClick(url:any){
  // window.location.href= this.getCertificate(url)
  window.open(this.getCertificate(url),"_blank")
}


  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }
  print(){
    window.print()
  }
}
