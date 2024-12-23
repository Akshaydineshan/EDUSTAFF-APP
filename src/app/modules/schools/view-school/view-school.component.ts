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

  standards:any[] = [
    {
      standard: '1st Standard',
      divisions: [
        { name: 'A', count: 20 },
        { name: 'B', count: 18 },
        { name: 'C', count: 22 },
        { name: 'D', count: 22 }
      ]
    },
    {
      standard: '2nd Standard',
      divisions: [
        { name: 'A', count: 25 },
        { name: 'B', count: 24 },
        { name: 'C', count: 23 },
        { name: 'D', count: 25 },
        { name: 'E', count: 24 },
        { name: 'F', count: 23 }
      ]
    },
    {
      standard: '3rd Standard',
      divisions: [
        { name: 'A', count: 30 },
        { name: 'B', count: 28 },
        { name: 'C', count: 29 }
      ]
    }
  ];
  currentIndex:number=0;
  printMode: boolean=false;



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

        this.currentSchool = response

      },
      error: (error) => {


      },
      complete: () => {

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
