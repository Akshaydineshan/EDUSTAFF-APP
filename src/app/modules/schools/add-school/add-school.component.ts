import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../school.service';
import { SchoolData } from '../models/add-school';
import { forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { getFileName, getOrdinalSuffix, getTruncatedFileName } from 'src/app/utils/utilsHelper/utilsHelperFunctions';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RomanPipe } from 'src/app/shared/pipes/roman.pipe';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
  providers: [
    RomanPipe, 
  ],
})
export class AddSchoolComponent implements OnInit {
  isSidebarClosed: boolean = false;
  schoolDetailsForm!: FormGroup;
  submitted: boolean = false; //  form submit flag in your component
  apiImageBaseURL: any = environment.imageBaseUrl;
  submitting: boolean = false;
  getTruncatedFileName = getTruncatedFileName;
  getFileName = getFileName;
  getOrdinalSuffix=getOrdinalSuffix;

  schoolTypes: any[] = []
  cities: any[] = [
    { cityID: 1, cityName: "dhfgdfh" }
  ]
  divisions: any[] = []
  isEdited!: boolean;
  schoolId: any;
  school: any;
  flag: boolean = false
  apiUrl: any = environment.imageBaseUrl
  fileName: any;
  fileSize!: any;
  file: any;
  divisionCount: any[] = []
  divisionArray: { division: any; studentCount: any; }[] = [];
  standardData: any = []
  currentIndex: number = 0;

  schoolTypeDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'schoolTypeID',
    textField: 'schoolTypeName',
    selectAllText: 'Select All',
    closeDropDownOnSelection: true,
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,

  };
  errorMsgForEmptyDivision: any[] = [];
  errorMsgForInvalidDivision: any[] = [];
  constructor(private fb: FormBuilder, private schoolService: SchoolService, private dataService: DataService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute,private romanPipe:RomanPipe) {

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

    this.schoolDetailsForm.get("schoolTypeID")?.valueChanges.subscribe((data: any) => {
      this.changeSchoolType(data)
      console.log("3333333333", data)
    })

    // this.divisions.forEach((item: any) => this.addDivision())

  }

  loadSchoolData(id: number) {
    debugger
    this.schoolService.getSchoolById(id).subscribe({
      next: (response) => {
        if (response) {
          if (response) {
            console.log("response", response)
            this.school = response
            this.setValuesForEdit()
          }

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

      const schoolData = {

        schoolName: this.school.schoolName,
        schoolTypeID: [this.schoolTypes.find((item: any) => item.schoolTypeID === this.school.schoolTypeID)],
        address: this.school.address,
        email: this.school.email,
        phone: this.school.phone,
        cityID: this.cities.find((item: any) => item.cityID === this.school.cityID),
        state: this.school.state,
        pincode: this.school.pincode,
        photoID: { photoID: this.school.photoID, photoImageName: this.school.photo }

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
        photoID: schoolData.photoID


      });

      let data: any = []
      this.school.getClasses.map((item: any) => {
        data.push({
          "standard": item.class,
          "divisionData": item.getDivisions
        })
      })
      this.standardData = data
      console.log("edit ")

      // this.schoolDetailsForm.setControl("divisions", this.fb.array(
      //   this.school.getDivisions.map((item: any) => {
      //     return this.fb.group({
      //       studentCount: item.studentCount
      //     });
      //   })
      // ));


    });

  }


  // Method to initialize School Details Form
  private initSchoolDetailsForm(): void {
    this.schoolDetailsForm = this.fb.group({
      schoolName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]+(?:[.,'-]?[a-zA-Z\s]+)*$/)]],  // School name is required and limited to 100 characters
      schoolTypeID: ['', Validators.required], // School type is required
      address: ['', [Validators.required, Validators.maxLength(255)]],
      cityID: ['', Validators.required],  // City ID is required
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],  // State is required
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      photoID: [null],

      // divisions: this.fb.array([])
      // statusID: ['', Validators.required],
      // principalID: ['', Validators.required],
      // vicePrincipalID: ['', Validators.required]
    });

  }





  onSubmit(): void {
    this.errorMsgForEmptyDivision = []
    this.errorMsgForInvalidDivision = []

    // let classDivisionData: any = this.standardData.map((item: any) => {

    //   if (!item.divisionData.length) {
    //     alert("Each standard must have at least one division. Please add a division.");
    //     return;
    //   } else if (!item.divisionData.division || !item.divisionData.studentCount) {
    //     alert("Please ensure each division has a valid name and student count.");
    //     return;
    //   }

    //   return {
    //     "class": item.standard,
    //     [this.isEdited ? "updateDivisions" : "addDivisions"]: item.divisionData
    //   }
    // })



    let classDivisionData: any = this.standardData.map((item: any, index: number) => {
      debugger

      if (!item.divisionData.length) {
       this.errorMsgForEmptyDivision.push(`${getOrdinalSuffix(item.standard)} `);
        return
      } else if (!item.divisionData.every((div: any) => div.division && div.studentCount)) {
         this.errorMsgForInvalidDivision.push(`${getOrdinalSuffix(item.standard)} `);
        return
      }


      return {
        class: item.standard,
        [this.isEdited ? "updateDivisions" : "addDivisions"]: item.divisionData
      };
    });



    if (this.errorMsgForInvalidDivision.length > 0) {
      // alert(`Please ensure that each division in standards ${this.errorMsgForInvalidDivision.join(",")} has a valid name and student count`);
      return
    }


    if (this.errorMsgForEmptyDivision.length > 0) {
      // alert(`Standard ${this.errorMsgForEmptyDivision.join(",")} are missing divisions. Please add at least one division`);
      return;
    }




    if (window.confirm("Are you sure you want to save the school details")) {
      this.submitted = true;
      this.submitting = true
      if (this.schoolDetailsForm.valid) {
        debugger
        let formDataValue: any = this.schoolDetailsForm.value;
        console.log("formDa", formDataValue)
        let schoolTypeIds: any = formDataValue.schoolTypeID.map((item: any) => item.schoolTypeID)
        const data: SchoolData = {
          schoolName: formDataValue.schoolName,
          schoolTypeID: formDataValue.schoolTypeID[0].schoolTypeID,
          address: formDataValue.address,
          cityID: formDataValue.cityID.cityID,
          state: formDataValue.state,
          pincode: formDataValue.pincode,
          email: formDataValue.email,
          phone: formDataValue.phone,
          photoID: formDataValue.photoID?.photoID ? formDataValue.photoID?.photoID : null,
          principalID: this.isEdited ? this.school.principalID : null,
          vicePrincipalID: this.isEdited ? this.school.vicePrincipalID : null,
          // [this.isEdited ? "updateDivisions" : "addClasses"]: formDataValue.divisions.map((item: any, index: number) => {
          //   return { division: index + 1, studentCount: parseInt(item.studentCount) }
          // }),
  
          [this.isEdited ? "updateClasses" : "addClasses"]: classDivisionData,
  
  
  
        }
        debugger;
  
        if (this.isEdited) {
          data.photoID = formDataValue.photoID.photoID ? formDataValue.photoID.photoID : this.school.photoId
  
          this.schoolService.updateSchool(data, this.school.schoolID)
            .subscribe({
              next: (response) => {
  
                // Reset form and submitted flag if needed
                this.schoolDetailsForm.reset();
                this.submitted = false;
                this.submitting = false;
                this.toastr.success('School Updated !', 'Success', {
                  closeButton: true,
                  progressBar: true,
                  positionClass: 'toast-top-left',
                  timeOut: 4500,
                });
  
                this.router.navigate(['/schools/school-list'])
              },
              error: (err) => {
                this.submitted = false
                this.submitting = false
                console.error('Error adding school:', err);
                this.toastr.error('Teacher Update', 'Failed', {
                  closeButton: true,
                  progressBar: true,
                  positionClass: 'toast-top-left',
                  timeOut: 4500,
                });
              },
              complete: () => {
                this.submitted = false
                this.submitting = false
  
              }
            });
  
        } else {
          this.schoolService.addSchool(data)
            .subscribe({
              next: (response) => {
  
                // Reset form and submitted flag if needed
                this.schoolDetailsForm.reset();
                this.submitted = false
                this.submitting = false
                this.toastr.success('School Added !', 'Success', {
                  closeButton: true,
                  progressBar: true,
                  positionClass: 'toast-top-left',
                  timeOut: 4500,
                });
  
                this.router.navigate(['/schools/school-list'])
              },
              error: (err) => {
                this.submitted = false
                this.submitting = false
                console.error('Error adding school:', err);
                this.toastr.error('Teacher Add', 'Failed', {
                  closeButton: true,
                  progressBar: true,
                  positionClass: 'toast-top-left',
                  timeOut: 4500,
                });
              },
              complete: () => {
  
                this.submitted = false
                this.submitting = false
              }
            });
  
        }
  
      } else {
        this.submitting = false
        console.log('Form is invalid');
      }
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



  get getSchoolImage() {
    let result = '';
    let image = this.schoolDetailsForm.get('photoID')?.value?.photoImageName;
    if (this.schoolDetailsForm.get('photoID')?.value?.photoImageName == 'No Photo assigned' || null || '') image = ""

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

        this.schoolTypes = results.schoolTypes;
        this.cities = results.cities;

      },
      error: (error) => {
        console.error('Error loading dropdown data', error);

      },
    });
  }


  // changeSchoolType(event: any) {
  //   this.flag = false;
  //   this.currentIndex = 0
  //   //  this.standardData = []
  //   let divisions: any[] = []
  //   let schoolTypeId: any[] = this.schoolDetailsForm.get('schoolTypeID')?.value

  //   this.schoolService.getDivisionDetailsBySchoolType(schoolTypeId).subscribe({
  //     next: (response: any) => {

  //       if (response) {


  //         if (this.isEdited && this.standardData) {
  //           let classes: any = response.classes;
  //           let standardArray = this.standardData


  //           const dataMap = new Map(standardArray.map((item: any) => [item.standard, item]));
  //           const result = classes.map((cls: any) => {
  //             return dataMap.has(cls)
  //               ? dataMap.get(cls)
  //               : { standard: cls, divisionData: [] };
  //           });




  //           this.standardData = result
  //         } else {
  //           this.currentIndex = 0
  //           this.standardData = []
  //           divisions = []


  //           divisions = response.classes;

  //           divisions.map((item: any, index: number) => {
  //             this.standardData.push({ standard: item, divisionData: [] })
  //             //  if(!this.standardData[index]?.divisionData.length) this.addDivisionInClass(index)
  //           })


  //           this.divisions = divisions
  //         }


  //         // this.divisions.forEach((item: any) => {
  //         //   debugger
  //         //   let len = (this.schoolDetailsForm.get("divisions") as FormArray).length
  //         //   if (len < this.divisions.length) this.addDivision()
  //         // })
  //       }

  //     },
  //     error: (error: any) => {

  //     },
  //     complete: () => {

  //     }

  //   })


  // }
  changeSchoolType(event: any) {

    this.flag = false;
    this.currentIndex = 0;

    const schoolTypeId = this.schoolDetailsForm.get('schoolTypeID')?.value;

    // Ensure `schoolTypeId` is defined before making the service call
    if (!schoolTypeId.length) {
      this.standardData = []
      console.error('School Type ID is required.');
      return;
    }


    this.schoolService.getDivisionDetailsBySchoolType(schoolTypeId).subscribe({
      next: (response: any) => {
        if (response) {
          const classes = response.classes || [];
          if (this.isEdited && this.standardData) {
            // Map existing `standardData` by standard for efficient lookup
            const dataMap = new Map(
              this.standardData.map((item: any) => [item.standard, item])
            );

            // Merge existing data with fetched classes
            this.standardData = classes.map((cls: any) =>
              dataMap.has(cls) ? dataMap.get(cls) : { standard: cls, divisionData: [] }
            );
          } else {
            // Initialize new standardData with empty divisionData
            this.currentIndex = 0;
            this.standardData = [];
            this.standardData = classes.map((item: any) => ({
              standard: item,
              divisionData: []
            }));

            // Update the `divisions` property
            // this.divisions = [...classes];
          }
        }
      },
      error: (error: any) => {
        console.error('Error fetching division details:', error);
      },
      complete: () => {
        console.log('Division details fetch completed.');
      }
    });
  }


  get divisionsFormArray() {
    return this.schoolDetailsForm.get("divisions") as FormArray;
  }


  addDivision() {
    this.divisionsFormArray.push(
      this.fb.group({
        // division: [''],
        studentCount: ['', [Validators.required]]
      })
    );
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }




  onCertificateUploadChange(event: any): void {
    event.preventDefault();
    event.preventDefault()
    this.fileName = event.target.files[0]?.name;
    let totalBytes = event.target.files[0]?.size;
    if (totalBytes < 1000000) {
      this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
    }

    const file = event.target.files[0];
    if (file) {
      this.file = file;
      // this.educations.at(index).get('documentFile')?.setValue(file);
    }
    this.uploadCertificate()
  }
  onCertificateUploadDragAndDrop(event: any): void {
    this.fileName = event.dataTransfer.files[0]?.name;
    let totalBytes = event.dataTransfer.files[0]?.size;
    if (totalBytes < 1000000) {
      this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
    }

    const file = event.dataTransfer.files[0];
    if (file) {
      this.file = file;
    }
    this.uploadCertificate()
  }

  uploadCertificate(): void {
    debugger
    if (this.file) {

      let file = this.file
      this.dataService.uploadProfilePhoto(file).subscribe(
        (response: any) => {
          console.log('File uploaded successfully', response);
          this.schoolDetailsForm.patchValue({ photoID: response });
        },
        (error: any) => {
          console.error('Error uploading file', error);
        }
      );


    } else {
      console.error('No file selected');
    }
  }


  onDragOver(event: any) {
    event.preventDefault();
  }


  onDropSuccess(event: any) {
    event.preventDefault();


    this.onCertificateUploadDragAndDrop(event);

  }

  getDocument() {
    let result = '';

    let image = this.schoolDetailsForm.get('photoID')?.value?.photoImageName;
    if (
      this.schoolDetailsForm.get('photoID')?.value?.photoImageName === 'No Document' ||
      this.schoolDetailsForm.get('photoID')?.value?.photoImageName === null ||
      this.schoolDetailsForm.get('photoID')?.value?.photoImageName === ''
    ) {
      image = '';
    }

    if (this.apiUrl && image) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + image.replace(/^\/+/, '');
    }


    this.fileName = this.getFileName(result); // Get the file name

    return result;
  }

  transform(url: any): string {

    const fileTypeIcons: { [key: string]: string } = {
      pdf: "../../../../assets/icons/pdf-ic.png",
      jpg: "../../../../assets/icons/img-ic.png",
      jpeg: "../../../../assets/icons/img-ic.png",
      png: "../../../../assets/icons/docs-ic.png",
      doc: "../../../../assets/icons/docs-ic.png",
      docx: "../../../../assets/icons/docs-ic.png",
      default: "../../../../assets/icons/docs-ic.png",
    };
    const extension = url.split('.').pop()?.toLowerCase() || '';
    let result: any = fileTypeIcons[extension] || fileTypeIcons['default'];

    return result;
  }
  removeLeaveApplicationDocument() {

    this.schoolDetailsForm.get('photoID')?.setValue('')
  }


  updateDivisions(index: number) {

    if (this.divisionCount[index] > 26) {
      alert('You can only have up to 26 divisions (A to Z).');
      this.divisionArray = []
      this.standardData[index].divisionData = []
      this.divisionCount[index] = null
      return;
    }

    let divisionArray = []

    for (let i = 0; i < this.divisionCount[index]; i++) {
      divisionArray.push(
        {
          division: String.fromCharCode(65 + i),
          studentCount: ""
        }
      )
    }

    this.divisionArray = divisionArray
    this.standardData[index].divisionData = divisionArray

  }

  change() {
    console.log("arrayyyyyyyyyyyyy", this.divisionArray, this.standardData)
  }

  // Show the previous standard
  showPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  // Show the next standard
  showNext() {
    if (this.currentIndex < this.standardData.length - 1) {
      this.currentIndex++;
    }
  }

  addDivisionInClass(index: number) {
    this.standardData[index].divisionData.push({
      division: String.fromCharCode(65 + this.standardData[index].divisionData.length),
      studentCount: ""
    })

  }

}















