import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  forgotPasswordForm !:FormGroup

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
    { id: 3, name: 'Manager' }
  ];

  constructor(private authService: AuthService, private router: Router,private fb:FormBuilder) { 
     this.forgotPasswordForm=this.fb.group({
      email:['',Validators.required]
     })
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
   let formValue=this.forgotPasswordForm.value
   let data={
    "email": formValue.email,
    "clientURl": "https://edustaff-sys-adm.netlify.app/profile/reset-password/<token>"
  }
  this.authService.forgotPassword(data).subscribe({
    next:(response:any)=>{
        console.log("forgot response",response)
    },
    error:(error:any)=>{

    },
    complete:()=>{

    }
  })

   }

  onLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, this.rememberMe).subscribe(
        response => {
          if (response) {
           
            this.errorMessage = '';
            this.router.navigate(['/dashboard']);
          }
        },
        error => {
          debugger
          // console.error('Login failed', error);
          // this.errorMessage = 'Login failed. Please check your credentials.';
          // this.router.navigate(['auth/login']);
          if (error.status === 401 && error.error.message === 'Invalid credentials') {
            this.errorMessage = 'Invalid credentials. Please try again.';
          } else {
            this.errorMessage = 'Something went wrong. Please try again later.';
          }
          
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

        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
       
        this.errorMessage = 'Registration failed. Please check your input and try again.';  // More general error message
      }
    });
  }
  

}
