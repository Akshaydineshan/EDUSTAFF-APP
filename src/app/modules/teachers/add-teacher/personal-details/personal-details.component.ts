import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/service/data/data.service';

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

  profileImage: string | ArrayBuffer | null = null;
  file!: File | null;

  constructor(private fb: FormBuilder,private dataService:DataService) { }

  ngOnInit(): void {
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
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
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
    this.file = null;
    this.profileImage = null;
  }
}
