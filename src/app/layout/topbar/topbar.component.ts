import { TopbarService } from './topbar.service';
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
  isMenuOpen:boolean=false;

  constructor(
    private tokenStore: TokenStoreService,
    private router: Router,public topbarService:TopbarService
  ) {
    this.topbarService.getPopupToggle().subscribe((res:any)=>{
      this.isMenuOpen=res
    })
   }
  toggleSidebar() {
    debugger
    this.toggleSidebarEvent.emit();
  }


  profileDropdownToggle(){
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
    this.router.navigate(['/auth']);
  }
 
}
