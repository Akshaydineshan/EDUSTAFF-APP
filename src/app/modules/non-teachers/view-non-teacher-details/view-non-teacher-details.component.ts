import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-non-teacher-details',
  templateUrl: './view-non-teacher-details.component.html',
  styleUrls: ['./view-non-teacher-details.component.scss']
})
export class ViewNonTeacherDetailsComponent {
  isSidebarClosed: boolean = false;

  currentTeacher!: any
  apiUrl = environment.imageBaseUrl;
  itemId: any


  constructor(private route: ActivatedRoute, private dataService: DataService,private router:Router,private ngZone: NgZone) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params:any) => {
      let itemId = params['id'];
      this.itemId = itemId;
      this.loadItemDetails(itemId);
    });
  }

  loadItemDetails(teacherId: any) {
    this.dataService.getTeacherById(teacherId).subscribe({
      next: (response:any) => {
        console.log(response)
        this.currentTeacher = response

      },
      error: (error:any) => {
      

      },
      complete: () => {

      }
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
   editClick(){
    this.ngZone.run(() => {
      this.router.navigate(['/non-teachers/add',this.itemId])
    })
  }
   

 
  get getImage() {
    let result = '';

    let image=this.currentTeacher?.photoDTO.photoName;
    if(this.currentTeacher?.photoDTO.photoName=='No Photo assigned' || null || '') image=""

    if (this.apiUrl && image) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + this.currentTeacher?.photoDTO.photoName.replace(/^\/+/, '');
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


}
