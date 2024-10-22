import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {
  isSidebarClosed = false;
  displayColumns: string[] = ['schoolID', 'schoolName', 'address', 'cityName', 'state', 'pincode', 'email', 'contactNumber', 'principalName', 'vicePrincipalName'];

  schoolList: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadSchoolList();
  }

  loadSchoolList(): void {
    this.dataService.getSchoolData().subscribe(
      (data) => {
        this.schoolList = data;
        console.log(this.schoolList);
      },
      (error) => {
        console.error('Error fetching school data:', error);
      }
    );
  }

}
