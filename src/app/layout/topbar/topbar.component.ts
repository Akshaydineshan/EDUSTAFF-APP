import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(
    private tokenStore: TokenStoreService,
    private router: Router
  ) { }
  toggleSidebar() {
    debugger
    this.toggleSidebarEvent.emit();
  }


  logout() {
    this.tokenStore.logout();
    this.router.navigate(['/auth']);
  }
}
