import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../school.service';
import { SchoolData } from '../models/add-school';
import { forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss']
})
export class AddSchoolComponent implements OnInit {
  isSidebarClosed: boolean = false;
  schoolDetailsForm!: FormGroup;
  submitted: boolean = false; //  form submit flag in your component
  apiImageBaseURL:any=environment.imageBaseUrl;
  submitting: boolean = false; 
  

  schoolTypes: any[] = []
  cities: any[] = [
    { cityID: 1, cityName: "dhfgdfh" }
  ]
  divisions: any[] = []
  isEdited!: boolean;
  schoolId: any;
  school: any;
  flag: boolean = false

  constructor(private fb: FormBuilder, private schoolService: SchoolService, private dataService: DataService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.initSchoolDetailsForm()
    this.loadDropdownData()

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdited = true;
        this.schoolId = id;
        // this.professionalForm.get("fromDate")?.disable()
        // this.professionalForm.get("toDate")?.disable()

        this.loadSchoolData(this.schoolId);

      }
    });

    // this.divisions.forEach((item: any) => this.addDivision())

  }

  loadSchoolData(id: number) {
    debugger
    this.schoolService.getSchoolById(id).subscribe({
      next: (response) => {
        if (response) {
          console.log(response)
          this.school = response
          this.setValuesForEdit()
        }

      },
      error: (error) => {
        // this.router.navigate(['teachers/view-teacher', this.employeeId])

      },
      complete: () => {

      }
    })
  }

  setValuesForEdit() {
    debugger
    forkJoin({
      schoolTypes: this.schoolService.getSchoolTypes(),
      cities: this.schoolService.getCities(),

    }).subscribe((results: any) => {
      debugger
      this.schoolTypes = this.schoolTypes
      this.cities = this.cities
      console.log(this.divisionsFormArray)

      const schoolData = {

        schoolName: this.school.schoolName,
        schoolTypeID: this.schoolTypes.find((item: any) => item.schoolTypeID === this.school.schoolTypeID),
        address: this.school.address,
        email: this.school.email,
        phone: this.school.phone,
        cityID: this.cities.find((item: any) => item.cityID === this.school.cityID),
        state: this.school.state,
        pincode: this.school.pincode,
        photoID:{photoID:this.school.photoID, photoImageName:this.school.photo}

      };


      this.schoolDetailsForm.patchValue({
        schoolName: schoolData.schoolName,
        schoolTypeID: schoolData.schoolTypeID,
        address: schoolData.address,
        cityID: schoolData.cityID,
        state: schoolData.state,
        pincode: schoolData.pincode,
        email: schoolData.email,
        phone: schoolData.phone,
        photoID:schoolData.photoID


      });

      this.schoolDetailsForm.setControl("divisions", this.fb.array(
        this.school.getDivisions.map((item: any) => {
          return this.fb.group({
            studentCount: item.studentCount
          });
        })
      ));


      console.log(this.schoolDetailsForm)

      debugger



    });

  }


  // Method to initialize School Details Form
  private initSchoolDetailsForm(): void {
    this.schoolDetailsForm = this.fb.group({
      schoolName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern('^[a-zA-Z ]+$')]],  // School name is required and limited to 100 characters
      schoolTypeID: ['', Validators.required], // School type is required
      address: ['', [Validators.required, Validators.maxLength(255)]],
      cityID: ['', Validators.required],  // City ID is required
      state: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],  // State is required
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      email: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      photoID: [null],

      divisions: this.fb.array([])
      // statusID: ['', Validators.required],
      // principalID: ['', Validators.required],
      // vicePrincipalID: ['', Validators.required]
    });

  }





  onSubmit(): void {
    debugger
    this.submitted = true;  // Set submitted to true when the form is submitted
    this.submitting=true

    if (this.schoolDetailsForm.valid) {
      debugger
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
        photoID: formDataValue.photoID?.photoID,
        principalID: this.isEdited ? this.school.principalID :null,
        vicePrincipalID:  this.isEdited ? this.school.vicePrincipalID:null,
        [this.isEdited ? "updateDivisions" : "addDivisions"]: formDataValue.divisions.map((item: any, index: number) => {
          return { division: index + 1, studentCount: parseInt(item.studentCount) }
        }),

      }
      debugger;

      if (this.isEdited) {
        data.photoID=formDataValue.photoID.photoID ? formDataValue.photoID.photoID : this.school.photoId

        this.schoolService.updateSchool(data, this.school.schoolID)
          .subscribe({
            next: (response) => {
             
              // Reset form and submitted flag if needed
              this.schoolDetailsForm.reset();
              this.submitted = false;
              this.submitting=false;
              this.toastr.success('School Updated !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });

              this.router.navigate(['/schools/school-list'])
            },
            error: (err) => {
              this.submitted=false
              this.submitting=false
              console.error('Error adding school:', err);
              this.toastr.error('Teacher Update', 'Failed', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });
            },
            complete: () => {
              this.submitted=false
              this.submitting=false
              console.log('Request complete');
            }
          });

      } else {
        this.schoolService.addSchool(data)
          .subscribe({
            next: (response) => {
              console.log('School added successfully', response);
              // Reset form and submitted flag if needed
              this.schoolDetailsForm.reset();
              this.submitted=false
              this.submitting=false
              this.toastr.success('School Added !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });

              this.router.navigate(['/schools/school-list'])
            },
            error: (err) => {
              this.submitted=false
              this.submitting=false
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
              this.submitted=false
              this.submitting=false
            }
          });

      }

    } else {
      this.submitting=false
      console.log('Form is invalid');
    }
  }




  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {


      this.dataService.uploadProfilePhoto(file).subscribe({
        next: (response: any) => {
          this.schoolDetailsForm.patchValue({ photoID: response });
          console.log("form->",this.schoolDetailsForm)

        },
        error: (error: any) => {

        },
        complete: () => {
          console.log('Request complete');
        }
      })



    }
  }



  get getSchoolImage(){
    let result = '';
    let image=this.schoolDetailsForm.get('photoID')?.value?.photoImageName;
    if(this.schoolDetailsForm.get('photoID')?.value?.photoImageName=='No Photo assigned' || null || '') image=""
    
    if (this.apiImageBaseURL && image) {
      result = this.apiImageBaseURL.replace(/\/+$/, '') + '/' + this.schoolDetailsForm.get('photoID')?.value?.photoImageName?.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }


  loadDropdownData() {

    forkJoin({
      schoolTypes: this.schoolService.getSchoolTypes(),
      cities: this.schoolService.getCities(),
    }).subscribe({
      next: (results) => {
        console.log("result",results)
        this.schoolTypes = results.schoolTypes;
        this.cities = results.cities;

      },
      error: (error) => {
        console.error('Error loading dropdown data', error);

      },
    });
  }


  changeSchoolType(event: any) {
    this.flag = false;
    (this.schoolDetailsForm.get("divisions") as FormArray).clear()
    debugger

    let schoolTypeId: number = event.schoolTypeID
    this.schoolService.getDivisionDetailsBySchoolType(schoolTypeId).subscribe({
      next: (response: any) => {
        debugger
        console.log("response", response)

        let divisions: any[] = response[0].divisions
        console.log("divisions", divisions)
        this.divisions = divisions

        this.divisions.forEach((item: any) => {
          debugger
          let len = (this.schoolDetailsForm.get("divisions") as FormArray).length
          if (len < this.divisions.length) this.addDivision()
        })








      },
      error: (error: any) => {

      },
      complete: () => {

      }

    })


  }

  get divisionsFormArray() {
    return this.schoolDetailsForm.get("divisions") as FormArray;
  }


  addDivision() {
    this.divisionsFormArray.push(
      this.fb.group({
        // division: [''],
        studentCount: ['',[Validators.required]]
      })
    );
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }




}















