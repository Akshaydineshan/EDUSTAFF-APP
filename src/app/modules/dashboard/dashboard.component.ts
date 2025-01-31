import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, map, take } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';
import { UserService } from 'src/app/core/service/user.service';
import { userRoles } from 'src/app/utils/constants/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSidebarClosed = false;

  Staff= userRoles.Staff;
  Manager= userRoles.Manager;
  Teacher=userRoles.Teacher;
  Admin=userRoles.Admin
  HeadMaster=userRoles.HeadMaster

  dashboardStats: any = {
    activeTeachers: 0,
    openSchools: 0,
    vacantPositions: 0,
    promotionEligible: 0
  };
  error: string | null = null;
  loggedUserDetails: any;

  constructor(
    private tokenStore: TokenStoreService,
    private dataService: DataService,
    private router: Router,
    private userService:UserService
  ) { }
  ngOnInit(): void {
    this.loadDashboardStats();
    this.userService.getUserDetails$().subscribe((res:any)=>{
      this.loggedUserDetails=res;
    })
  }

  loadDashboardStats(): void {
    this.dataService.getDashboardStats().subscribe({
      next: (stats) => {
       
        // this.dashboardStats = stats;
        this.animateStats(stats)
       
      },
      error: (err) => {
        this.error = err;
        console.error('Error fetching dashboard stats:', err);
      }
    });
  }

  animateStats(stats: any): void {
    const duration = 300;
    const frameRate = 280; 
    const totalFrames = (duration / 1000) * frameRate;

    Object.keys(stats).forEach((key) => {
      const targetValue = stats[key];
      interval(duration / frameRate)
        .pipe(
          take(totalFrames + 1),
          map((frame) => Math.min(targetValue, Math.floor((frame / totalFrames) * targetValue)))
        )
        .subscribe((value:any) => {
          this.dashboardStats[key] = value;
        });
    });
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  logout() {
    this.tokenStore.logout();
    this.router.navigate(['/login']);
  }
}
