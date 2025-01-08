import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-details-edit',
  templateUrl: './profile-details-edit.component.html',
  styleUrls: ['./profile-details-edit.component.scss']
})
export class ProfileDetailsEditComponent implements OnInit {

    profileEditForm!: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private profileService: ProfileService,
      private toastr: ToastrService
    ) {}
  
    ngOnInit(): void {
      this.initializeForm();
      this.loadProfileDetails();
    }
  
    /**
     * Initialize the profile edit form with default values and validations.
     */
    initializeForm(): void {
      this.profileEditForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        dob: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]]
      });
    }
  
    /**
     * Load profile details and patch the form with the received data.
     */
    loadProfileDetails(): void {
      this.profileService.getProfile().subscribe({
        next: (response: any) => {
          if (response) {
            this.patchForm(response);
          
          } else {
        
          }
        },
        error: (error: any) => {
          console.error('Error loading profile:', error);
        
        }
      });
    }
  
    /**
     * Patch the form with the profile details.
     * @param data The profile data to patch.
     */
    patchForm(data: any): void {
      this.profileEditForm.patchValue({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dob: data.dob || '',
        email: data.email || ''
      });
    }
  
    /**
     * Handle form submission to update the profile.
     */
    onSubmit(): void {
      if (this.profileEditForm.valid) {
        console.log('Form data:', this.profileEditForm.value);
        this.profileService.updateUser().subscribe({
          next: (response: any) => {
            console.log('Update response:', response);
            this.toastr.success('Profile updated successfully!', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500
            });
          },
          error: (error: any) => {
            console.error('Error updating profile:', error);
            this.toastr.error('Failed to update profile. Please try again.', 'Error', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500
            });
          }
        });
      } else {
        this.profileEditForm.markAllAsTouched(); // Highlight invalid fields
        this.toastr.warning('Invalid Form', 'Warning', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-left',
          timeOut: 4500
        });
      }
    }
  
    /**
     * Helper to check if a form control is invalid and touched.
     * @param controlName The name of the form control.
     */
  //   isFieldInvalid(controlName: string): boolean {
  //     const control = this.profileEditForm.get(controlName);
  //     return !!control && control.invalid && control.touched;
  //   }
  // }
  

}
