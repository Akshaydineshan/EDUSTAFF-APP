import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/service/data/data.service';
import { TeacherDataService } from '../../teacher-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit, OnChanges {
  @Input() personalDetailsForm!: FormGroup;
  @Input() religions!: any[];
  @Input() casteCategories!: any[];
  @Input() bloodGroups!: any[];
  @Input() genders!: any[];
  @Input() submitted:boolean=false;
  @Input() maritalStatuses!: any[];
  @Output() personalDetailsFormChange = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input

  profileImage: string | ArrayBuffer | null = null;
  file!: File | null;
  apiImageBaseURL:any=environment.imageBaseUrl;

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

  onFormValueChange() {
    if (this.personalDetailsForm) {
      this.personalDetailsFormChange.emit(this.personalDetailsForm);
    }
  }

  onFileSelected(event: any): void {
    debugger
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.profileImage = reader.result;
      //   this.teacherService.setProfileImage(this.profileImage)
      // };
      // reader.readAsDataURL(file);
    }
    this.uploadFile()
  }

  uploadFile(): void {
    debugger
    if (this.file) {
     
      let file=this.file
      this.dataService.uploadProfilePhoto(file).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          this.personalDetailsForm.get('photoId')?.setValue(response)
        },
        (error) => {
          console.error('Error uploading file', error);
        }
      );

      
    } else {
      console.error('No file selected');
    }
  }

  removeImage() {
    this.fileInput.nativeElement.value = ''; // Clear the input value
    this.file = null;
    this.profileImage = null;
    // this,this.teacherService.setProfileImage("")
  }

  get getprofileImage(){
    let result = '';
    
    if (this.apiImageBaseURL && this.personalDetailsForm.get('photoId')?.value.photoImageName) {
      result = this.apiImageBaseURL.replace(/\/+$/, '') + '/' + this.personalDetailsForm.get('photoId')?.value?.photoImageName?.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }
}
