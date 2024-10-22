import { Component, Input, OnInit } from '@angular/core';
import { SpinnerServiceService } from './spinner-service.service';

@Component({
  selector: 'app-material-spinner',
  templateUrl: './material-spinner.component.html',
  styleUrls: ['./material-spinner.component.scss']
})
export class MaterialSpinnerComponent implements OnInit {
  // @Input() isLoading!:boolean
  isLoading:any=false
  constructor(private spinnerService:SpinnerServiceService){
    
  }


  
ngOnInit(): void {
  this.spinnerService.spinnerVisible$.subscribe((visible) => {
    this.isLoading = visible; // Update loading state based on the observable
  });
}

  // show() {
  //   this.isLoading = true;
  // }

  // hide() {
  //   this.isLoading = false;
  // }

}
