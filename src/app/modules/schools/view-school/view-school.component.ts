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

 constructor(private route:ActivatedRoute,private schoolService:SchoolService,private router:Router){}

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
      
        this.currentSchool = response

      },
      error: (error) => {
       

      },
      complete: () => {

      }
    })

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
}
