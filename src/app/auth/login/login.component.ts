import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  dateOfBirth!: string;
  newPassword!: string;
  confirmPassword!: string;
  resetEmail!: string;
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  forgotPasswordMode: boolean = false;
  registerMode: boolean = false;
  rememberMe: boolean = false;
  errorMessage!: string;
  roleID!: number;

  forgotPasswordForm !: FormGroup

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
    { id: 3, name: 'Manager' }
  ];

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private tokenStore: TokenStoreService, private userService: UserService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    // if (this.tokenStore.getToken()) {
    //   this.router.navigate(['dashboard'])
    // }
  }

  toggleForgotPassword() {
    this.forgotPasswordMode = !this.forgotPasswordMode;
    this.registerMode = false;
  }

  toggleRegister() {
    this.registerMode = !this.registerMode;
    this.forgotPasswordMode = false;
  }

  toggleLogin() {
    this.registerMode = false;
    this.forgotPasswordMode = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onResetSubmit() {
    let formValue = this.forgotPasswordForm.value
    let data = {
      "email": formValue.email,
      "clientURl": "https://edustaff-sys-adm.netlify.app/profile/reset-password/<token>"
    }
    console.log("data",data)
    this.authService.forgotPassword(data).subscribe({
      next: (response: any) => {
        console.log("forgot response", response)
        this.forgotPasswordMode=false;
        this.registerMode=false;
      },
      error: (error: any) => {
        this.forgotPasswordMode=false;
        this.registerMode=false;
      },
      complete: () => {

      }
    })

  }

  // onLogin() {
  //   if (this.email && this.password) {
  //     this.authService.login(this.email, this.password, this.rememberMe).subscribe(
  //       response => {
  //         if (response) {

  //           this.authService.getProfile().subscribe({
  //             next: (response: any) => {
  //               if (response) {
  //                 let loggedUser: any = response;
  //                 this.userService.setUserDetails(loggedUser)
  //                 this.errorMessage = '';
  //                 this.router.navigate(['/dashboard']);
  //               }

  //             },
  //             error: (error: any) => {
  //               this.errorMessage = 'Something went wrong. Please try again later.';
  //               console.error('Error loading profile:', error);

  //             },
  //             complete: () => {

  //             }
  //           })

  //         }
  //       },
  //       error => {
  //         debugger
  //         // console.error('Login failed', error);
  //         // this.errorMessage = 'Login failed. Please check your credentials.';
  //         // this.router.navigate(['auth/login']);
  //         if (error.status === 401 && error.error.message === 'Invalid credentials') {
  //           this.errorMessage = 'Invalid credentials. Please try again.';
  //         } else {
  //           this.errorMessage = 'Something went wrong. Please try again later.';
  //         }

  //         this.router.navigate(['auth/login']);
  //       }
  //     );
  //   } else {
  //     this.errorMessage = 'Username and password are required.';
  //   }
  // }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }
  
    this.authService
      .login(this.email, this.password, this.rememberMe)
      .pipe(
        switchMap(() => this.authService.getProfile()), // Switch to getProfile after login
        catchError((error) => {
          this.handleLoginError(error);
          return throwError(() => error); // Re-throw to stop execution
        })
      )
      .subscribe({
        next: (profile: any) => {
          this.userService.setUserDetails(profile); // Set user details globally
          this.errorMessage = '';
          this.router.navigate(['/dashboard']); // Navigate to dashboard
        },
        error: (error: any) => {
          this.handleProfileError(error); // Handle profile-specific errors
        },
      });
  }
  
  // Separate error handling for login errors
  private handleLoginError(error: any): void {
    if (error.status === 401 && error.error.message === 'Invalid credentials') {
      this.errorMessage = 'Invalid credentials. Please try again.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again later.';
    }
    console.error('Login error:', error);
    this.router.navigate(['auth/login']);
  }
  
  // Separate error handling for profile errors
  private handleProfileError(error: any): void {
    this.errorMessage = 'Something went wrong while fetching user details. Please try again later.';
    console.error('Profile fetch error:', error);
  }
  

  onRegister() {
    this.authService.register(
      this.username,
      this.newPassword,
      this.confirmPassword,
      this.firstName,
      this.lastName,
      this.email,
      this.dateOfBirth,
      this.roleID
    ).subscribe({
      next: (response) => {

        this.router.navigate(['/auth/login']);
      },
      error: (error) => {

        this.errorMessage = 'Registration failed. Please check your input and try again.';  // More general error message
      }
    });
  }


}
