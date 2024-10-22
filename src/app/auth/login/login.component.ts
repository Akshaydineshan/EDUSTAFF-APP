import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
    { id: 3, name: 'Manager' }
  ];

  constructor(private authService: AuthService, private router: Router) { }

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
    console.log(this.resetEmail);

    console.log(this.newPassword);
    console.log(this.confirmPassword);
  }

  onLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, this.rememberMe).subscribe(
        response => {
          if (response) {
            console.log('Login successful!');
            this.errorMessage = '';
            this.router.navigate(['/dashboard']);
          }
        },
        error => {
          console.error('Login failed', error);
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.router.navigate(['auth/login']);
        }
      );
    } else {
      this.errorMessage = 'Username and password are required.';
    }
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
        console.log('Registration successful:', response);
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed. Please check your input and try again.';  // More general error message
      }
    });
  }
  

}
