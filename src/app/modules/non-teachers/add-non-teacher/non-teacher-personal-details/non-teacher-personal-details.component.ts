import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/core/service/data/data.service';
import { TeacherDataService } from 'src/app/modules/teachers/teacher-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-non-teacher-personal-details',
  templateUrl: './non-teacher-personal-details.component.html',
  styleUrls: ['./non-teacher-personal-details.component.scss']
})
export class NonTeacherPersonalDetailsComponent {
  @Input() personalDetailsForm!: FormGroup;
  @Input() religions!: any[];
  @Input() casteCategories!: any[];
  @Input() bloodGroups!: any[];
  @Input() genders!: any[];
  @Input() submitted:boolean=false;
  @Input() maritalStatuses!: any[];
  @Output() personalDetailsFormChange = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input
  previewUrls!: string;

  profileImage: string | ArrayBuffer | null = null;
  file!: File | null;
  apiImageBaseURL:any=environment.imageBaseUrl;
  isUploadImage:boolean=false;
  maxSizeExceeded: boolean=false;

  constructor(private fb: FormBuilder,private dataService:DataService,private teacherService:TeacherDataService) { }

  ngOnInit(): void {
  
  
    // this.teacherService.$profileImage.subscribe((data:any)=>{
    //  this.profileImage=data;
    //   debugger
    // })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personalDetailsForm']) {
      this.personalDetailsFormChange.emit(this.personalDetailsForm);
    }
  }
  dobChange(){
   const dobControl = this.personalDetailsForm.get('dob');
    dobControl?.updateValueAndValidity();  // Manually trigger validation
  }

  onFormValueChange() {
    if (this.personalDetailsForm) {
      this.personalDetailsFormChange.emit(this.personalDetailsForm);
    }
  }

  // onFileSelected(event: any): void {
  //   debugger
  //   const file = event.target.files[0];
  //   if (file) {
  //     const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
  //     if (file.size > maxSize) {
  //       this.maxSizeExceeded = true; // Show the error message
    
  //       return;
  //     }

     
  //     this.file = file;

  //   }
  //   this.uploadFile()
  // }
  onFileSelected(event: any): void {
    debugger
    const file = event.target.files[0];
    if (file) {

      this.file = file;

      const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
      if (file.size > maxSize) {
        this.maxSizeExceeded = true; // Show the error message

        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls = reader.result as string;

        let photoIdControl = this.personalDetailsForm.get('photoId');
        console.log("PHOTO ID COntrol",photoIdControl)
        let photoId = photoIdControl?.value?.photoId || null;
        photoIdControl?.patchValue({
          photoId: photoId, photoImageName: file.name, file: file, profilePreview: this.previewUrls
        })

      };
      reader.readAsDataURL(file);


    }

  }

 
  uploadFile(): void {
    debugger
    this.isUploadImage=true
    if (this.file) {
     
      let file=this.file
      this.dataService.uploadProfilePhoto(file).subscribe(
        (response) => {
        
          this.personalDetailsForm.get('photoId')?.setValue({photoId:response.photoID,photoImageName:response.photoImageName})
        
          this.isUploadImage=false
      
        },
        (error) => {
          this.isUploadImage=false;
          console.error('Error uploading file', error);
        }
      );

      
    } else {
      console.error('No file selected');
      this.isUploadImage=false
    }
  }

  removeImage() {
    this.fileInput.nativeElement.value = ''; // Clear the input value
    this.file = null;
    this.profileImage = null;
    this.personalDetailsForm.get("photoId")?.setValue({})
    // this,this.teacherService.setProfileImage("")
  }

  // get getprofileImage(){
  //   let result = '';

  //    let image=this.personalDetailsForm.get('photoId')?.value.photoImageName;
  //   if(this.personalDetailsForm.get('photoId')?.value.photoImageName=='No Photo assigned' || null || '') image=""
    
  //   if (this.apiImageBaseURL && image) {
  //     result = this.apiImageBaseURL.replace(/\/+$/, '') + '/' + this.personalDetailsForm.get('photoId')?.value?.photoImageName?.replace(/^\/+/, '');
  //   }
  //   // If the result is an empty string, it will fallback to emptyImage in the template
  //   return result;
  // }
  get getprofileImage() {
    this.previewUrls=this.personalDetailsForm.get('photoId')?.value.profilePreview;
    if (this.previewUrls) {
      return this.previewUrls;
    }

    let result = '';
    let image = this.personalDetailsForm.get('photoId')?.value.photoImageName;
    if (this.personalDetailsForm.get('photoId')?.value.photoImageName == 'No Photo assigned' || null || '') image = ""

    if (this.apiImageBaseURL && image) {
      result = this.apiImageBaseURL.replace(/\/+$/, '') + '/' + this.personalDetailsForm.get('photoId')?.value?.photoImageName?.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    console.log("result", result)
    return result;
  }


}
