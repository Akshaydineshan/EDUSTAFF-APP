import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { DataService } from 'src/app/core/service/data/data.service';
import { UserService } from 'src/app/core/service/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent {
 isSidebarClosed: boolean = false;

 currentUser!: any
  apiUrl = environment.imageBaseUrl;
  itemId: any


  constructor(private route: ActivatedRoute, private dataService: DataService,private router:Router, private ngZone: NgZone,private userService:UserService,private authService:AuthService) {

  }

  ngOnInit(): void {
    // this.route.params.subscribe(params => {
    //   debugger
    //   let itemId = params['id'];
    //   this.itemId = itemId;
      this.loadItemDetails();
     
    // });
  }

  loadItemDetails() {
    debugger
    this.authService.getProfile().subscribe({
      next: (response:any) => {
        console.log(response)
        this.currentUser = response

      },
      error: (error) => {
        

      },
      complete: () => {

      }
    })

  }

  get getImage() {
    let result = '';

    //  let image=this.currentUser?.photoDTO.photoName;
    // if(this.currentUser?.photoDTO.photoName=='No Photo assigned' || null || '') image=""

    // if (this.apiUrl && image ) {
    //   result = this.apiUrl.replace(/\/+$/, '') + '/' + this.currentUser?.photoDTO.photoName.replace(/^\/+/, '');
    // }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }




editClick(){
  this.router.navigate(['/profile/edit'])
}

 getCertificate(certificate:any){
 let  result = this.apiUrl.replace(/\/+$/, '') + '/' + certificate.replace(/^\/+/, ''); 
 return result;
}

pdfClick(url:any){
  // window.location.href= this.getCertificate(url)
  window.open(this.getCertificate(url),"_blank")
}


  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }
  print(){
    window.print()
  }
}
