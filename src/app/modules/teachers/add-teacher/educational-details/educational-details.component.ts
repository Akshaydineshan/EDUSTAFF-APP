import { environment } from './../../../../../environments/environment';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { getFileName, getTruncatedFileName } from 'src/app/utils/utilsHelper/utilsHelperFunctions';
import { dateRangeValidator, minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';


@Component({
  selector: 'app-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent implements OnInit, OnChanges {
  @Input() educationForm!: FormGroup;
  educations!: FormArray;
  @Input() allEducationTypes!: any[];
  @Input() coursesByEducation!: any[];
  @Input() submitted: boolean = false;
  @Output() educationFormChange = new EventEmitter<any>();

  maxDate!: string;
  minDate: any = new Date('1900-01-01');
  selectedEducationType!: string;
  getTruncatedFileName = getTruncatedFileName
  getFileName = getFileName

  filteredCoursesByEducation: any[] = []; // this is for courseName select list value storing index wice by education type
  file: any;
  profileImage: string | ArrayBuffer | null = null;
  educationValueChangesSubscription: any;
  apiBaseUrl: any = environment.imageBaseUrl
  schoolUniversityNotification: boolean = false;
  fileName: any = [];
  fileSize: any = [];
  apiUrl: any = environment.imageBaseUrl;
  files: { [index: number]: File } = {};
  previewUrls: { [index: number]: string } = {};

  constructor(
    private fb: FormBuilder,
    private dataService: DataService) {

  }

  ngOnInit(): void {
    this.educationForm.disable()
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.educations = this.educationForm.get('educations') as FormArray;

    this.populateCoursesForSavedEducationTypes()
    this.educationForm.enable()

  }


  ngOnChanges(changes: SimpleChanges): void {

    debugger
    if (changes['educationForm']) {
      debugger
      this.educations = this.educationForm.get('educations') as FormArray;
      this.populateCoursesForSavedEducationTypes()

    }
  }


  addCourse() {
    debugger
    const courseGroup = this.fb.group({
      educationType: ['', Validators.required],
      courseName: ['', Validators.required],
      courseNameOther: [''],
      schoolName: ['',],
      fromDate: [''],
      toDate: ['', [minAndMaxDateValidator('1900-01-01', true, true), Validators.required]],
      certificate: ['',Validators.required]
    },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );

    this.educations.push(courseGroup);

  }

  // onCourseNameSelectOtherToAddValidation(): void {
  //   debugger

  //   this.educationForm.get('educations')?.valueChanges.pipe(distinctUntilChanged()).subscribe((educationArray:any) => {
  //     debugger
  //     console.log(educationArray)

  //     const educations = this.educationForm.get('educations') as FormArray;

  //     educationArray.forEach((education: any, index: number) => {

  //       const educationGroup = educations.at(index) as FormGroup;
  //       const courseNameControl = educationGroup.get('courseName');
  //       const courseNameOtherControl = educationGroup.get('courseNameOther');

  //       if (courseNameControl?.value.courseName === 'Others') {
  //         // Add 'required' validator to courseNameOther if courseName is 'Others'
  //         courseNameOtherControl?.setValidators([Validators.required]);
  //       } else {
  //         // Remove 'required' validator from courseNameOther
  //         courseNameOtherControl?.clearValidators();
  //       }
  //       debugger

  //       // Recalculate validation status
  //       courseNameOtherControl?.updateValueAndValidity();
  //     });

  //     debugger
  //   });
  // }




  // getCoursesByIndex(index: number): any[] {
  //   return this.filteredCoursesByEducation[index] || [];
  // }

  removeCourse(index: number): void {
    this.educations.removeAt(index);
  }

  // onCertificateUpload(event: Event, index: number) {
  //   debugger
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     this.educations.at(index).patchValue({ certificate: file });
  //   }
  // }



  onCertificateUpload(event: any, index: number): void {
    debugger
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
        // this.teacherService.setProfileImage(this.profileImage)
      };
      reader.readAsDataURL(file);
    }
    this.uploadFile(index)
  }

  uploadFile(index: number): void {
    debugger
    if (this.file) {

      let file = this.file
      this.dataService.uploadDocument(file).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          const educations = this.educationForm.get('educations') as FormArray;
          educations.at(index).get('certificate')?.patchValue(response)
        },
        (error) => {
          console.error('Error uploading file', error);
        }
      );


    } else {
      console.error('No file selected');
    }
  }


  // Triggered when education type is changed, and also when navigating back
  onEducationTypeChange(event: any, index: number) {
    debugger
    this.educations.at(index).patchValue({ courseName: '' });
    const educationGroup = this.educations.at(index) as FormGroup;

    if (educationGroup) {
      educationGroup.get('fromDate')?.reset();
      educationGroup.get('toDate')?.reset();
      educationGroup.get('schoolName')?.reset();
    }

    const selectedType = Number(event.educationTypeID);
    if (selectedType) {
      this.getCoursesByEducationType(selectedType, index);

    }
    if (event.educationTypeID !== 5) {
      this.schoolUniversityNotification = false;
      const educationsFormArray = this.educationForm.get('educations') as FormArray;
      const educationGroup = educationsFormArray.at(index) as FormGroup;
      educationGroup.get('fromDate')?.setValidators([minAndMaxDateValidator('1900-01-01', true, true), Validators.required]);
      educationGroup.get('schoolName')?.setValidators([Validators.required])
      educationGroup.get('fromDate')?.updateValueAndValidity();
      educationGroup.get('schoolName')?.updateValueAndValidity();

    } else if (event.educationTypeID === 5) {
      this.schoolUniversityNotification = true;
      const educationsFormArray = this.educationForm.get('educations') as FormArray;
      const educationGroup = educationsFormArray.at(index) as FormGroup;
      educationGroup.get('fromDate')?.clearValidators();
      educationGroup.get('schoolName')?.clearValidators();
      educationGroup.get('fromDate')?.updateValueAndValidity();
      educationGroup.get('schoolName')?.updateValueAndValidity();

    }
  }

  // Fetch the courses for the selected education type
  getCoursesByEducationType(educationTypeId: number, index: number): void {
    debugger
    this.dataService.getCoursesByEducationType(educationTypeId).subscribe((data: any) => {
      this.filteredCoursesByEducation[index] = data;



    }, (error) => {
      this.filteredCoursesByEducation[index] = [];
      console.error('Error fetching courses:', error);
    });
  }

  getCoursesByIndex(index: number): any[] {
    return this.filteredCoursesByEducation[index] || [];
  }

  // This function will be called when navigating back to ensure the courses are populated
  populateCoursesForSavedEducationTypes(): void {

    this.educations.controls.forEach((control, index) => {
      const selectedEducationType = control.get('educationType')?.value.educationTypeID;
      if (selectedEducationType) {
        if (selectedEducationType !== 5) {

          control.get('fromDate')?.setValidators([minAndMaxDateValidator('1900-01-01', true, true), Validators.required])
          control.get('schoolName')?.setValidators([Validators.required])
        } else {
          control.get('fromDate')?.clearValidators();
          control.get('schoolName')?.clearValidators();
        }
        control.get("schoolName")?.updateValueAndValidity()
        control.get("fromDate")?.updateValueAndValidity()
        this.getCoursesByEducationType(selectedEducationType, index);
      }
    });

  }
  compareCourses(course1: any, course2: any): boolean {
    debugger
    return course1 && course2 ? course1.courseID === course2.courseID : course1 === course2;
  }
  getCertificate(certificate: any) {
    let result = this.apiBaseUrl.replace(/\/+$/, '') + '/' + certificate.replace(/^\/+/, '');
    return result;
  }

  pdfClick(url: any) {
    window.open(this.getCertificate(url), "_blank")
    //  window.location.href= this.getCertificate(url)
  }
  dateChange(index: number) {
    const toDateArray = this.educationForm.get('educations') as FormArray;
    const dobControl = toDateArray.at(index).get("fromDate");

    dobControl?.updateValueAndValidity();  // Manually trigger validation
  }
  dateChangeTo(index: number) {

    const toDateArray = this.educationForm.get('educations') as FormArray;
    const dobControl = toDateArray.at(index).get("toDate")
    dobControl?.updateValueAndValidity();  // Manually trigger validation
  }



  EducationTypeChange(event: any, index: number) {

    // const selectedType = Number(event.courseID); 
    // if (selectedType) {
    //   this.dataService.getCoursesByEducationType(selectedType).subscribe((data: any) => {
    //     this.coursesByEducation = data.courses; 
    //     console.log(this.coursesByEducation);

    //     this.educations.at(index).patchValue({ courseName: '' });
    //   }, (error) => {
    //     this.coursesByEducation = [];
    //     console.error('Error fetching courses:', error);
    //   });
    // }
  }



  onDragOver(event: any) {
    event.preventDefault();
  }


  // UploadFile Related funs
  // onCertificateUploadChange(event: any, index: number): void {

  //   this.fileName[index] = event.target.files[0]?.name;
  //   let totalBytes = event.target.files[0]?.size;
  //   if (totalBytes < 1000000) {
  //     this.fileSize[index] = Math.floor(totalBytes / 1000) + 'KB';
  //   } else {
  //     this.fileSize[index] = Math.floor(totalBytes / 1000000) + 'MB';
  //   }

  //   const file = event.target.files[0];
  //   if (file) {
  //     this.file = file;
    
  //   }
  //   this.uploadCertificate(index)
  // }

  handleCertificateFileChange(file: File, index: number) {

    if (file) {
      this.fileName[index] = file.name;
      let totalBytes = file.size;
      if (totalBytes < 1000000) {
        this.fileSize[index] = Math.floor(totalBytes / 1000) + 'KB';
      } else {
        this.fileSize[index] = Math.floor(totalBytes / 1000000) + 'MB';
      }


      this.files[index] = file;
      // this.educations.at(index).get('certificate')?.patchValue({documentID:null,documentName:file.name});

      const educations = this.educationForm.get('educations') as FormArray;
      const certificateIdControl = educations.at(index).get('certificate');
      const certificateID = certificateIdControl?.value?.documentID || null;
      certificateIdControl?.patchValue({
        documentName: file.name,
        documentID: certificateID,
        file: file
      });
      console.log("onFile changed", this.educations.at(index).get('certificate')?.value)
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls[index] = reader.result as string;

      };
      reader.readAsDataURL(file);
    }
  }

  onFileChanged(event: any, index: number) {
    const file: File = event.target.files[0];
    this.handleCertificateFileChange(file, index)
  }

  onCertificateUploadDragAndDrop(event: any, index: number) {
    const file = event.dataTransfer.files[0];
    this.handleCertificateFileChange(file, index)

  }
  // onCertificateUploadDragAndDropee(event: any, index: number): void {
  //   this.fileName[index] = event.dataTransfer.files[0]?.name;
  //   let totalBytes = event.dataTransfer.files[0]?.size;
  //   if (totalBytes < 1000000) {
  //     this.fileSize[index] = Math.floor(totalBytes / 1000) + 'KB';
  //   } else {
  //     this.fileSize[index] = Math.floor(totalBytes / 1000000) + 'MB';
  //   }

  //   const file = event.dataTransfer.files[0];
  //   if (file) {
  //     this.file = file;
  //   }
  //   this.uploadCertificate(index)
  // }

  uploadCertificate(index: any): void {
    debugger
    if (this.file) {

      let file = this.file
      this.dataService.uploadDocument(file).subscribe(
        (response: any) => {
          console.log('File uploaded successfully', response);
          const educations = this.educationForm.get('educations') as FormArray;
          educations.at(index).get('certificate')?.patchValue(response)
        },
        (error: any) => {
          console.error('Error uploading file', error);
        }
      );


    } else {
      console.error('No file selected');
    }
  }

  // From drag and drop
  onDropSuccess(event: any, index: number) {
    event.preventDefault();
    this.onCertificateUploadDragAndDrop(event, index);

  }








  getDocument(index: any) {
    let result = '';

    let image = this.educations.at(index)?.get('certificate')?.value?.documentName;
    if (
      this.educations.at(index)?.get('certificate')?.value?.documentName === 'No Document' ||
      this.educations.at(index)?.get('certificate')?.value?.documentName === null ||
      this.educations.at(index)?.get('certificate')?.value?.documentName === ''
    ) {
      image = '';
    }

    if (this.apiUrl && image) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + image.replace(/^\/+/, '');
    }


    this.fileName[index] = this.getFileName(result); // Get the file name
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
  removeLeaveApplicationDocument(index: number) {

    this.educations.at(index)?.get('certificate')?.setValue("")
  }


}
// import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DataService } from 'src/app/core/service/data/data.service';

// @Component({
//   selector: 'app-educational-details',
//   templateUrl: './educational-details.component.html',
//   styleUrls: ['./educational-details.component.scss']
// })
// export class EducationalDetailsComponent implements OnInit, OnChanges {
//   @Input() educationForm!: FormGroup;
//   educations!: FormArray;
//   @Input() allEducationTypes!: any[];
//   @Input() coursesByEducation!: any[];
//   @Output() educationFormChange = new EventEmitter<any>();

//   filteredCoursesByEducation: any[] = []; // Store filtered courses by index for each education type

//   constructor(
//     private fb: FormBuilder,
//     private dataService: DataService) { }

//   ngOnInit(): void {
//     this.educations = this.educationForm.get('educations') as FormArray;
//     this.populateCoursesForSavedEducationTypes(); // Populate courses when the component initializes
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['educationForm']) {
//       this.educations = this.educationForm.get('educations') as FormArray;
//     }
//   }

//   // This function will be called when navigating back to ensure the courses are populated
//   populateCoursesForSavedEducationTypes(): void {
//     this.educations.controls.forEach((control, index) => {
//       const selectedEducationType = control.get('educationType')?.value.courseID;
//       if (selectedEducationType) {
//         this.getCoursesByEducationType(selectedEducationType, index);
//       }
//     });
//   }

//   addCourse() {
//     const courseGroup = this.fb.group({
//       educationType: ['', Validators.required],
//       courseName: ['', Validators.required],
//       schoolName: ['', Validators.required],
//       fromDate: ['', Validators.required],
//       toDate: ['', Validators.required],
//       certificate: ['']
//     });
//     this.educations.push(courseGroup);
//   }

//   removeCourse(index: number): void {
//     this.educations.removeAt(index);
//   }

//   onCertificateUpload(event: Event, index: number) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files[0]) {
//       const file = input.files[0];
//       this.educations.at(index).patchValue({ certificate: file });
//     }
//   }

//   // Triggered when education type is changed, and also when navigating back
//   onEducationTypeChange(event: any, index: number) {
//     const selectedType = Number(event.courseID);
//     if (selectedType) {
//       this.getCoursesByEducationType(selectedType, index);
//     }
//   }

//   // Fetch the courses for the selected education type
//   getCoursesByEducationType(educationTypeId: number, index: number): void {
//     this.dataService.getCoursesByEducationType(educationTypeId).subscribe((data: any) => {
//       this.filteredCoursesByEducation[index] = data.courses;
//       this.educations.at(index).patchValue({ courseName: '' });
//     }, (error) => {
//       this.filteredCoursesByEducation[index] = [];
//       console.error('Error fetching courses:', error);
//     });
//   }

//   getCoursesByIndex(index: number): any[] {
//     return this.filteredCoursesByEducation[index] || [];
//   }
// }


