import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings/settings.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';

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
  token: string = '';
  // email: any;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private tokenStore: TokenStoreService, private router: Router,
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\S]{8,20}$/), // Add complexity
          ],
        ],
        confirmPassword: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/),
          ],
        ],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    console.log("this.tokenStore.getToken()",this.tokenStore.getToken())
    if (this.tokenStore.getToken()) {
      this.toastr.warning('You are already logged in.', 'Warning', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-left',
        timeOut: 4500,
        extendedTimeOut: 2000,
        tapToDismiss: true,

        easeTime: 300,
      });
      this.router.navigate(['dashboard'])


    }
    // Retrieve the token from the URL params and validate it
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      // this.email = params['email'] || '';
      console.log('Token:', this.token);
    });
    console.log("token", this.token)
    if (!this.token) {
      this.toastr.error('Invalid or expired token!', 'Error', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-left',
        timeOut: 4500,
      });
      return;
    }
    console.log('Reset Token:', this.token);
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

    if (this.resetPasswordForm.valid) {
      const formValue = this.resetPasswordForm.value;

      // Verify that the token is valid on the backend before proceeding
      if (!this.token) {
        console.error('No token found in URL.');
        return;
      }

      // Prepare data payload
      const data = {
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        email: formValue.email,
        token: this.token, // Token from URL
      };

      console.log('Submitting data:', data);

      // Call the password reset service
      this.settingsService.passwordResetWithEmail(data).subscribe({
        next: (response: any) => {
          if (response) {
            this.toastr.success('Password Reset Successful!', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            this.tokenStore.clearToken()
            this.router.navigate(['/auth/login'])

            // Optionally redirect to login page after success
          } else {
            console.warn('Password reset failed:', response?.message || 'Unknown error.');
            this.toastr.error('Password Reset Failed!', 'Error', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
          }
        },
        error: (error: any) => {
          this.toastr.success('Password Reset Successful!', 'Success', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-left',
            timeOut: 4500,
          });
          this.tokenStore.clearToken()
          this.router.navigate(['/auth/login'])
          // this.toastr.error('An error occurred during password reset.', 'Error', {
          //   closeButton: true,
          //   progressBar: true,
          //   positionClass: 'toast-top-left',
          //   timeOut: 4500,
          // });
        },
        complete: () => {
          console.log('Password reset process completed.');
        },
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.resetPasswordForm.markAllAsTouched();
      console.warn('Form is invalid. Please correct the errors and try again.');
    }
  }

  goToLogin() {
    this.tokenStore.clearToken()
    this.router.navigate(['auth/login'])
  }

  // Sidebar functionality
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  get getSidebarToggle() {
    return this.isSidebarClosed;
  }
}


