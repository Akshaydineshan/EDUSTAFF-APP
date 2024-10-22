import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data/data.service';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
        this.dashboardStats = stats;
        console.log(this.dashboardStats);
      },
      error: (err) => {
        this.error = err;
        console.error('Error fetching dashboard stats:', err);
      }
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
