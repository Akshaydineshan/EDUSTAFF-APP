import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/service/data/data.service';
import { dateRangeValidator } from 'src/app/utils/validators/date-range-validator';

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
  @Input() submitted:boolean=false;
  @Output() educationFormChange = new EventEmitter<any>();

  selectedEducationType!: string;
  
  filteredCoursesByEducation: any[] = []; // this is for courseName select list value storing index wice by education type

  constructor(
    private fb: FormBuilder,
    private dataService: DataService) { }

  ngOnInit(): void {

    this.educations = this.educationForm.get('educations') as FormArray;
    console.log(this.allEducationTypes);
    console.log(this.coursesByEducation);
    this.populateCoursesForSavedEducationTypes()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['educationForm']) {
      this.educations = this.educationForm.get('educations') as FormArray;
    }
  }

  addCourse() {
    const courseGroup = this.fb.group({
      educationType: ['', Validators.required],
      courseName: ['', Validators.required],
      schoolName: ['', Validators.required],
      fromDate: ['',Validators.required],
      toDate: ['', Validators.required],
      certificate: ['']
    },
    { validators: dateRangeValidator('fromDate', 'toDate') });

    this.educations.push(courseGroup);
  }
  
  // getCoursesByIndex(index: number): any[] {
  //   return this.filteredCoursesByEducation[index] || [];
  // }

  removeCourse(index: number): void {
    this.educations.removeAt(index);
  }

  onCertificateUpload(event: Event, index: number) {
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.educations.at(index).patchValue({ certificate: file });
    }
  }

  // Triggered when education type is changed, and also when navigating back
  onEducationTypeChange(event: any, index: number) {
    this.educations.at(index).patchValue({ courseName: '' });
    debugger
    const selectedType = Number(event.educationTypeID);
    if (selectedType) {
      this.getCoursesByEducationType(selectedType, index);
    }
  }

  // Fetch the courses for the selected education type
  getCoursesByEducationType(educationTypeId: number, index: number): void {
    debugger
    this.dataService.getCoursesByEducationType(educationTypeId).subscribe((data: any) => {
      this.filteredCoursesByEducation[index] = data.courses;
      

       // Ensure the previously selected course is set in the FormControl
    // const selectedCourse = this.educations.at(index).get('courseName')?.value;
    // this.educations.at(index).patchValue({ courseName: '' });
    
    // Check if the previously selected course exists in the new course list
    // if (selectedCourse && data.courses.some((course: any) => course.courseName === selectedCourse.courseName)) {
    //   this.educations.at(index).patchValue({ courseName: selectedCourse });
    // } else {
      
    //   this.educations.at(index).patchValue({ courseName: '' });
    // }
   
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
    debugger
    this.educations.controls.forEach((control, index) => {
      const selectedEducationType = control.get('educationType')?.value.educationTypeID;
      if (selectedEducationType) {
        this.getCoursesByEducationType(selectedEducationType, index);
      }
    });
  }
  compareCourses(course1: any, course2: any): boolean {
    debugger
    return course1 && course2 ? course1.courseID === course2.courseID : course1 === course2;
  }




  // onEducationTypeChange(event: any, index: number) {
  //   debugger
  //   const selectedType = Number(event.courseID); 
  //   if (selectedType) {
  //     this.dataService.getCoursesByEducationType(selectedType).subscribe((data: any) => {
  //       this.coursesByEducation = data.courses; 
  //       console.log(this.coursesByEducation);

  //       this.educations.at(index).patchValue({ courseName: '' });
  //     }, (error) => {
  //       this.coursesByEducation = [];
  //       console.error('Error fetching courses:', error);
  //     });
  //   }
  // }
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
