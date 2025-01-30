import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
import { getFileName, getOrdinalSuffix, getTruncatedFileName } from 'src/app/utils/utilsHelper/utilsHelperFunctions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-promotion-relinquishment',
  templateUrl: './promotion-relinquishment.component.html',
  styleUrls: ['./promotion-relinquishment.component.scss']
})
export class PromotionRelinquishmentComponent implements OnInit {
  isSidebarClosed: boolean = false;
  selectedTeacher: any
  teacherDropdownData: any[] = []
  fileSize: any;
  fileName: any;
  relinquishmentForm!: FormGroup

  currentDate:any=new Date()
  nextYear: Date = new Date(this.currentDate.getFullYear() + 1, 11, this.currentDate.getDate());

  // Convert dates to ISO string format (YYYY-MM-DD)
  currentDateISO: string = this.currentDate.toISOString().split('T')[0];
  nextYearISO: string = this.nextYear.toISOString().split('T')[0];

  getTruncatedFileName = getTruncatedFileName;
  getFileName = getFileName;
  getOrdinalSuffix = getOrdinalSuffix;

  teacherDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'employeeID',
    textField: 'employeeName',
    selectAllText: 'Select All',
    closeDropDownOnSelection: true,
    unSelectAllText: 'UnSelect All',

    itemsShowLimit: 1,
    allowSearchFilter: true,

  };
  file!: File;
  previewUrl!: string;
  apiUrl: any = environment.imageBaseUrl

  constructor(private fb: FormBuilder, private dataService: DataService, private toastr: ToastrService,private router:Router) {

  }
  ngOnInit(): void {
    this.loadDropDownData()
    this.relinquishmentForm = this.fb.group({
      teacher: [''],
      date: [''],
      document: [''],
      designation:['']
    })

  }

  onTeacherChange(event:any) {
    console.log("event,",event)
    let url=`Promotion/GetPromotedDesignationByEmployeeID/${event[0].employeeID}`
     this.dataService.getDropdownData(url).subscribe({
      next:(response:any)=>{
        console.log("response",response.designationName)
        this.relinquishmentForm.get("designation")?.patchValue(response.designationName)

      },
      error:(error:any)=>{
        
      }
     })
  }

  loadDropDownData() {
    let url: any = "Teacher/GetPromotionEligibleEmployeeList"
    this.dataService.getDropdownData(url).subscribe({
      next: (response: any) => {
        if (response) {
          console.log("r", response)
          this.teacherDropdownData = response;
        }
      },
      error: (error: any) => {

      }
    })
  }





  handleDocumentFileChange(file: File) {

    if (file) {

      this.fileName = file.name;
      console.log("FILE", this.fileName)
      let totalBytes = file.size;
      if (totalBytes < 1000000) {
        this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
      } else {
        this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
      }


      this.file = file;
      // this.educations.at(index).get('certificate')?.patchValue({documentID:null,documentName:file.name});
      const reader = new FileReader();
      reader.onload = () => {
        console.log("open");

        this.previewUrl = reader.result as string;

        let photoIdControl = this.relinquishmentForm.get('document');
        console.log("photoIdControl", photoIdControl)
        let photoId = photoIdControl?.value?.photoID || null;
        photoIdControl?.patchValue({
          documentId: null, documentName: file.name, file: file,
        })
        console.log("photoIdControl2", photoIdControl)


      };
      reader.readAsDataURL(file);



    }
  }

  onDocumentChange(event: any) {
    const file: File = event.target.files[0];
    this.handleDocumentFileChange(file)
  }




  onDragOver(event: any) {
    event.preventDefault();
  }


  onDropSuccess(event: any) {
    event.preventDefault();

    const file: File = event.dataTransfer.files[0]
    this.handleDocumentFileChange(file);

  }

  getDocument() {
    let result = '';

    let image = this.relinquishmentForm.get('document')?.value?.documentName;
    if (
      this.relinquishmentForm.get('document')?.value?.documentName === 'No Document' ||
      this.relinquishmentForm.get('document')?.value?.documentName === null ||
      this.relinquishmentForm.get('document')?.value?.documentName === ''
    ) {
      image = '';
    }

    if (this.apiUrl && image) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + image.replace(/^\/+/, '');
    }


    this.fileName = this.getFileName(result); // Get the file name

    return result;
  }

  removeLeaveApplicationDocument() {

    this.relinquishmentForm.get('document')?.setValue('')
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


  get generateYears() {
    const currentYear = new Date().getFullYear();
    let years = [currentYear, currentYear + 1];
    return years
  }

  onSubmit() {
    console.log("form", this.relinquishmentForm.value);

    if (this.relinquishmentForm.valid) {
      console.log('Form data:', this.relinquishmentForm.value);
      let formValue = this.relinquishmentForm.value;

      // Call the upload API to get the document ID first

      let uploadFile = formValue.document?.file
      let uploadFileType = "RelinquishmentFile"
      this.dataService.uploadDocumentByDocumentType(uploadFile, uploadFileType).subscribe({
        next: (uploadResponse: any) => {
          console.log("upload", uploadResponse)
          if (uploadResponse.documentID) {
            let documentID = uploadResponse.documentID;

            // Prepare the data after getting the document ID
            let data: any = {
              "employeeID": formValue.teacher[0].employeeID,
              "relinquishmentYear": formValue.date,
              "documentID": documentID // Use the retrieved document ID here
            };
            console.log("data", data)

            // Call the relinquishment API after getting the document ID
            this.dataService.createRelinquishment(data).subscribe({
              next: (response: any) => {
                console.log('Update response:', response);
                if (response.statusCode === 200) {

                  this.toastr.success('Saved successfully!', 'Success', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500
                  });
                  this.router.navigate(['dashboard'])
                } else {
                  this.toastr.error('Failed. Please try again.', 'Error', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500
                  });
                }
              },
              error: (error: any) => {
                this.toastr.error('Failed. Please try again.', 'Error', {
                  closeButton: true,
                  progressBar: true,
                  positionClass: 'toast-top-left',
                  timeOut: 4500
                });
              }
            });
          } else {
            this.toastr.error('Failed to upload document. Please try again.', 'Error', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500
            });
          }
        },
        error: (error: any) => {
          this.toastr.error('Failed to upload document. Please try again.', 'Error', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-left',
            timeOut: 4500
          });
        }
      });
    } else {
      this.relinquishmentForm.markAllAsTouched(); // Highlight invalid fields
      this.toastr.warning('Invalid Form', 'Warning', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-left',
        timeOut: 4500
      });
    }
  }

  overlayClick() {


  }
}
