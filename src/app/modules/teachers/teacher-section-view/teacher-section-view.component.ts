import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval, map, take } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';

@Component({
  selector: 'app-teacher-section-view',
  templateUrl: './teacher-section-view.component.html',
  styleUrls: ['./teacher-section-view.component.scss']
})
export class TeacherSectionViewComponent {
  isSidebarClosed = false;

  dashboardStats: any = {
    activeTeachers: 0,
    openSchools: 0,
    vacantPositions: 0,
    promotionEligible: 0
  };
  error: string | null = null;

  constructor(
    private tokenStore: TokenStoreService,
    private dataService: DataService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.loadDashboardStats();
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
