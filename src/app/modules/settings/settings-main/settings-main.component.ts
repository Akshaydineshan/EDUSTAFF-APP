import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent {
  isSidebarClosed: boolean = false;
   tabs = ['Reset Password', 'Edit Profile', 'Edit Profile Picture',]; // Tab labels
  activeTabIndex = 0; // Tracks the active tab index
  indicatorWidth = 175; // Width of the tab indicator
  indicatorLeft = 30; // Left offset of the tab indicator

  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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

  onSubmit() {
    debugger
    if (this.resetPasswordForm.valid) {
      console.log("inside")
      console.log(this.resetPasswordForm.value);
      let formValue=this.resetPasswordForm.value;

      let data={
        "password": formValue.password,
        "confirmPassword": formValue.confirmPassword,
        "email": formValue.email,
        "token": formValue
      }

      // Handle form submission
    } else {
      this.resetPasswordForm.markAllAsTouched();
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
