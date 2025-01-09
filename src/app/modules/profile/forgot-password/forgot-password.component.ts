import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings/settings.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  isSidebarClosed: boolean = false;
 resetPasswordForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  token: string =''

  constructor(private fb: FormBuilder, private settingsService: SettingsService, private toastr: ToastrService,private route:ActivatedRoute) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      confirmPassword: ['', Validators.required,],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/)]],
     
    },
      { validator: this.passwordMatchValidator });
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ||'';
    console.log('Reset Token:',this.token);
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
      const token = this.token;
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




  // topBar-sidebar 
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }
}
