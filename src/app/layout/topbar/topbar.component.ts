import { AuthService } from 'src/app/core/service/auth/auth.service';
import { TopbarService } from './topbar.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  @Output() toggleSidebarEvent = new EventEmitter<void>();
  isMenuOpen: boolean = false;
  loggedUserDetails: any;

  constructor(
    private tokenStore: TokenStoreService,
    private router: Router, public topbarService: TopbarService, private userService: UserService,private authService:AuthService
  ) {
    this.topbarService.getPopupToggle().subscribe((res: any) => {
      this.isMenuOpen = res
    })
    this.userService.getUserDetails$().subscribe((res:any)=>{
      this.loggedUserDetails=res;
    })
  }
  toggleSidebar() {
    debugger
    this.toggleSidebarEvent.emit();
  }


  profileDropdownToggle() {
    // this.topbarService.getPopupToggle().subscribe((res:any)=>{
    //   console.log("reee",res)
    this.topbarService.setPopupValue(!this.isMenuOpen)

    // })


    // this.isMenuOpen=!this.isMenuOpen

    window.scroll({
      top: 0,

      behavior: "smooth",
    });
  }

  logout() {
    this.tokenStore.logout();
    this.userService.clearUserDetails()
    this.router.navigate(['/auth']);
  }

}
