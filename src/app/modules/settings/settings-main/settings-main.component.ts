import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent {
  isSidebarClosed: boolean = false;
  tabs = ['Reset Password', 'Edit Profile', 'Email Config','Remove Account',]; // Tab labels
  activeTabIndex = 0; // Tracks the active tab index
  indicatorWidth = 239; // Width of the tab indicator
  indicatorLeft = 30; // Left offset of the tab indicator

  resetPasswordForm: FormGroup;
  showPassword: boolean=false;
  showConfirmPassword: boolean=false;

  constructor(private fb: FormBuilder, private settingsService: SettingsService,private toastr:ToastrService) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      confirmPassword: ['', Validators.required,],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/)]],
      // token: ['', Validators.required]
    },
      { validator: this.passwordMatchValidator });
  }

  // Custom Validator for Password Match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    // Debugger to pause execution during development
    debugger;
  
    if (this.resetPasswordForm.valid) {
      const formValue = this.resetPasswordForm.value;
  
      // Retrieve token from local storage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage.");
        return;
      }
  
      // Prepare data payload
      const data = {
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        email: formValue.email,
        token: token
      };
  
      console.log("Submitting data:", data);
  
      // Call the password reset service
      this.settingsService.passwordResetWithEmail(data).subscribe({
        next: (response: any) => {
        
  
          if (response) {
            this.toastr.success('Password Reset !', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            
          
          } else {
           
            console.warn("Password reset failed:", response.message || "Unknown error.");
          }
        },
        error: (error: any) => {
          this.toastr.error('Password Reset  !', 'Failed', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-left',
            timeOut: 4500,
          });
       
        },
        complete: () => {
         
          console.log("Password reset process completed.");
        }
      });
  
    } else {
      // Mark all fields as touched to trigger validation messages
      this.resetPasswordForm.markAllAsTouched();
      console.warn("Form is invalid. Please correct the errors and try again.");
    }
  }
  




  onTabClick(event: MouseEvent, index: number) {
    // Update the active tab index
    this.activeTabIndex = index;

    // Calculate indicator width and position
    const target = event.target as HTMLElement;
    this.indicatorWidth = target.offsetWidth;
    this.indicatorLeft = target.offsetLeft;
  }


  // topBar-sidebar 
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }
}
