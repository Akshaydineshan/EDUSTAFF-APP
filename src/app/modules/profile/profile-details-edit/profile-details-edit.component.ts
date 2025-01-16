import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-profile-details-edit',
  templateUrl: './profile-details-edit.component.html',
  styleUrls: ['./profile-details-edit.component.scss']
})
export class ProfileDetailsEditComponent implements OnInit {

  profileEditForm!: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService,private dataService:DataService,private authService:AuthService,private userService:UserService
  ) { }

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
          console.log("get profile", response)
          this.user = response;
          let patchValue = {
            "firstName": this.user.firstName,
            "lastName": this.user.lastName,
            "email": this.user.email,
            "dob": this.dataService.formatDateToLocal(this.user.dateOfBirth),
          }
          this.patchForm(patchValue);

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
      let formValue = this.profileEditForm.value
      let userId:any=this.user.userID;
      let data: any = {
        "firstName": formValue.firstName,
        "lastName": formValue.lastName,
        "email": formValue.email,
        "dateOfBirth": formValue.dob
      }
      this.profileService.updateUser(userId,data).subscribe({
        next: (response: any) => {
          if(response.status == 200){

            this.authService.getProfile().subscribe({
              next:(response:any)=>{
              this.userService.setUserDetails(response)
              },
              error:(error:any)=>{

              }
            })
            console.log('Update response:', response);
            this.toastr.success('Profile updated successfully!', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500
            });
          }else{
            this.toastr.error('Failed to update profile. Please try again.', 'Error', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500
            });
          }
         
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
