import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../settings.service';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  showPassword: boolean = false;
  showOldPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private settingsService: SettingsService, private toastr: ToastrService,private tokenService:TokenStoreService,private router:Router) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\S]{8,20}$/)]],
      confirmPassword: ['', Validators.required,],
      // email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/)]],
      oldPassword:['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\S]{8,20}$/)]]
     
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
  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
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
        newPassword: formValue.password,
        confirmNewPassword: formValue.confirmPassword,
        // email: formValue.email,
        // token: token,
        oldPassword:formValue.oldPassword
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
            this.tokenService.clearToken()
          this.router.navigate(['/auth/login'])


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

  goToLogin(){
    this.tokenService.clearToken()
    this.router.navigate(['auth/login'])
  }






}
