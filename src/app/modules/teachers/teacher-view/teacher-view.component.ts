import { Component, OnInit } from '@angular/core';
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


  constructor(private route: ActivatedRoute, private dataService: DataService,private router:Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      debugger
      let itemId = params['id'];
      this.itemId = itemId;
      this.loadItemDetails(itemId);
     
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
