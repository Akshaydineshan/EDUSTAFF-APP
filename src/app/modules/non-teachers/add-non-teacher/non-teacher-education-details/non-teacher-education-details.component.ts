import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/service/data/data.service';
import { dateRangeValidator, minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';

@Component({
  selector: 'app-non-teacher-education-details',
  templateUrl: './non-teacher-education-details.component.html',
  styleUrls: ['./non-teacher-education-details.component.scss']
})
export class NonTeacherEducationDetailsComponent {
  @Input() educationForm!: FormGroup;
  educations!: FormArray;
  @Input() allEducationTypes!: any[];
  @Input() coursesByEducation!: any[];
  @Input() submitted: boolean = false;
  @Output() educationFormChange = new EventEmitter<any>();

  selectedEducationType!: string;

  maxDate!: string;
  minDate: any=new Date('1900-01-01');

  filteredCoursesByEducation: any[] = []; // this is for courseName select list value storing index wice by education type
  file: any;
  profileImage: string | ArrayBuffer | null = null;
  educationValueChangesSubscription: any;
  schoolUniversityNotification: boolean=false;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService) { 
     
    }

  ngOnInit(): void {

    this.educations = this.educationForm.get('educations') as FormArray;
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    console.log(this.allEducationTypes);
    console.log(this.coursesByEducation);
    this.educationForm.disable();
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
      schoolName: ['', ],
      fromDate: [''],
      toDate: ['',[minAndMaxDateValidator('1900-01-01',true,true), Validators.required]],
      certificate: ['']
    },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );

    this.educations.push(courseGroup);
  
  }


  dateChange(index:number){
    const toDateArray = this.educationForm.get('educations') as FormArray;
    const dobControl = toDateArray.at(index).get("fromDate");
    console.log("controolll",index,dobControl)
    dobControl?.updateValueAndValidity();  // Manually trigger validation
  }
  dateChangeTo(index:number){
   
    const toDateArray = this.educationForm.get('educations') as FormArray;
    const dobControl = toDateArray.at(index).get("toDate")
    dobControl?.updateValueAndValidity();  // Manually trigger validation
  }





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
        (response:any) => {
          console.log('File uploaded successfully', response);
          const educations = this.educationForm.get('educations') as FormArray;
          educations.at(index).get('certificate')?.patchValue(response)
        },
        (error:any) => {
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
      console.log("EVT",event.educationTypeID)
    }
    if(event.educationTypeID !== 5){
      this.schoolUniversityNotification=false;
      const educationsFormArray = this.educationForm.get('educations') as FormArray;
      const educationGroup = educationsFormArray.at(index) as FormGroup;
      educationGroup.get('fromDate')?. setValidators([minAndMaxDateValidator('1900-01-01',true,true),Validators.required]);
      educationGroup.get('schoolName')?. setValidators([Validators.required])
      educationGroup.get('fromDate')?.updateValueAndValidity(); 
      educationGroup.get('schoolName')?.updateValueAndValidity(); 
     
    }else if(event.educationTypeID === 5){
      this.schoolUniversityNotification=true;
      const educationsFormArray = this.educationForm.get('educations') as FormArray;
      const educationGroup = educationsFormArray.at(index) as FormGroup;
      educationGroup.get('fromDate')?.clearValidators();
      educationGroup.get('schoolName')?.clearValidators();
      educationGroup.get('fromDate')?.updateValueAndValidity(); 
      educationGroup.get('schoolName')?.updateValueAndValidity();
      console.log(educationGroup)
    }
  }

  // Fetch the courses for the selected education type
  getCoursesByEducationType(educationTypeId: number, index: number): void {
    debugger
    this.dataService.getCoursesByEducationType(educationTypeId).subscribe((data: any) => {
      this.filteredCoursesByEducation[index] = data;
    


    }, (error:any) => {
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
        if(selectedEducationType !==5){
          
          control.get('fromDate')?.setValidators([minAndMaxDateValidator('1900-01-01',true,true),Validators.required])
          control.get('schoolName')?.setValidators([Validators.required])
        }else{
          control.get('fromDate')?.clearValidators();
          control.get('schoolName')?.clearValidators();
        }
        control.get("schoolName")?.updateValueAndValidity()
        control.get("fromDate")?.updateValueAndValidity()
        this.getCoursesByEducationType(selectedEducationType, index);
      }
    });
    console.log("educationsss->",this.educations)
  }
  compareCourses(course1: any, course2: any): boolean {
    debugger
    return course1 && course2 ? course1.courseID === course2.courseID : course1 === course2;
  }




 
}
