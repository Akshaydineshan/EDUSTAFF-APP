import { Component } from '@angular/core';
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


  constructor(private route: ActivatedRoute, private dataService: DataService,private router:Router) {

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

 
  get getImage() {
    let result = '';
    if (this.apiUrl && this.currentTeacher?.photoDTO.photoName) {
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
