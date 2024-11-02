import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../school.service';
import { SchoolData } from '../models/add-school';
import { forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss']
})
export class AddSchoolComponent implements OnInit {
  isSidebarClosed: boolean = false;
  schoolDetailsForm!: FormGroup;
  submitted: boolean = false; //  form submit flag in your component

  schoolTypes: any[] = [
    { schoolTypeID: 1, schoolTypeName: "schoolType1" },
    { schoolTypeID: 2, schoolTypeName: "schoolType2" },
    { schoolTypeID: 3, schoolTypeName: "schoolType3" }
  ]
  cities: any[] = [
    { cityID: 1, cityName: "dhfgdfh" }
  ]

  constructor(private fb: FormBuilder, private schoolService: SchoolService, private dataService: DataService,private router:Router,private toastr:ToastrService) {

  }

  ngOnInit(): void {
    this.initSchoolDetailsForm()
    this.loadDropdownData()

  }



  // Method to initialize School Details Form
  private initSchoolDetailsForm(): void {
    this.schoolDetailsForm = this.fb.group({
      schoolName: ['', [Validators.required, Validators.maxLength(100)]],  // School name is required and limited to 100 characters
      schoolTypeID: ['', Validators.required], // School type is required
      address: ['', [Validators.required, Validators.maxLength(255)]],
      cityID: ['', Validators.required],  // City ID is required
      state: ['', Validators.required],  // State is required
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      photoID: [null],
      // statusID: ['', Validators.required],
      // principalID: ['', Validators.required],
      // vicePrincipalID: ['', Validators.required]
    });

  }





  onSubmit(): void {
    debugger
    this.submitted = true;  // Set submitted to true when the form is submitted

    if (this.schoolDetailsForm.valid) {
      let formDataValue: any = this.schoolDetailsForm.value;

      const data: SchoolData = {
        schoolName: formDataValue.schoolName,
        schoolTypeID: formDataValue.schoolTypeID.schoolTypeID,
        address: formDataValue.address,
        cityID: formDataValue.cityID.cityID,
        state: formDataValue.state,
        pincode: formDataValue.pincode,
        email: formDataValue.email,
        phone: formDataValue.phone,
        photoID:formDataValue?.photoID?.photoID,
        principalID: null,
        vicePrincipalID: null,

      }


      this.schoolService.addSchool(data)
        .subscribe({
          next: (response) => {
            console.log('School added successfully', response);
            // Reset form and submitted flag if needed
            this.schoolDetailsForm.reset();
            this.submitted = false;
            this.toastr.success('School Added !', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            
            this.router.navigate(['/schools/school-list'])
          },
          error: (err) => {
            console.error('Error adding school:', err);
            this.toastr.error('Teacher Add', 'Failed', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
          },
          complete: () => {
            console.log('Request complete');
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }




  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {


      this.dataService.uploadProfilePhoto(file).subscribe({
        next: (response: any) => {
          this.schoolDetailsForm.patchValue({ photoID: response });

        },
        error: (error: any) => {

        },
        complete: () => {
          console.log('Request complete');
        }
      })



    }
  }





  loadDropdownData() {

    forkJoin({
      schoolTypes: this.schoolService.getSchoolTypes(),
      cities: this.schoolService.getCities(),
    }).subscribe({
      next: (results) => {
        this.schoolTypes = results.schoolTypes;
        this.cities = results.cities;

      },
      error: (error) => {
        console.error('Error loading dropdown data', error);

      },
    });
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }




}















