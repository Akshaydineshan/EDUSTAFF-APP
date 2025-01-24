import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { getFileName, getOrdinalSuffix, getTruncatedFileName } from 'src/app/utils/utilsHelper/utilsHelperFunctions';

@Component({
  selector: 'app-promotion-relinquishment',
  templateUrl: './promotion-relinquishment.component.html',
  styleUrls: ['./promotion-relinquishment.component.scss']
})
export class PromotionRelinquishmentComponent {
  isSidebarClosed: boolean = false;
  selectedTeacher: any
  teacherDropdownData: any[] = []
  fileSize:any;
  fileName:any;

    getTruncatedFileName = getTruncatedFileName;
    getFileName = getFileName;
    getOrdinalSuffix = getOrdinalSuffix;

  teacherDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'schoolId',
    textField: 'schoolName',
    selectAllText: 'Select All',
    closeDropDownOnSelection: true,
    unSelectAllText: 'UnSelect All',

    itemsShowLimit: 2,
    allowSearchFilter: true,

  };

  onTeacherFilterChange() {

  }


  onCertificateUploadChange(event: any): void {
    // event.preventDefault();
    // event.preventDefault()
    // this.fileName = event.target.files[0]?.name;
    // let totalBytes = event.target.files[0]?.size;
    // if (totalBytes < 1000000) {
    //   this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
    // } else {
    //   this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
    // }

    // const file = event.target.files[0];
    // if (file) {
    //   this.file = file;
    //   // this.educations.at(index).get('documentFile')?.setValue(file);
    // }
    // this.uploadCertificate()
  }
  onCertificateUploadDragAndDrop(event: any): void {
    // this.fileName = event.dataTransfer.files[0]?.name;
    // let totalBytes = event.dataTransfer.files[0]?.size;
    // if (totalBytes < 1000000) {
    //   this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
    // } else {
    //   this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
    // }

    // const file = event.dataTransfer.files[0];
    // if (file) {
    //   this.file = file;
    // }
    // this.uploadCertificate()
  }


  handleCertificateFileChange(file: File) {

    // if (file) {

    //   this.fileName = file.name;
    //   console.log("FILE", this.fileName)
    //   let totalBytes = file.size;
    //   if (totalBytes < 1000000) {
    //     this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
    //   } else {
    //     this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
    //   }


    //   this.file = file;
    //   // this.educations.at(index).get('certificate')?.patchValue({documentID:null,documentName:file.name});
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     console.log("open");

    //     this.previewUrl = reader.result as string;

    //     let photoIdControl = this.schoolDetailsForm.get('photoID');
    //     console.log("photoIdControl", photoIdControl)
    //     let photoId = photoIdControl?.value?.photoID || null;
    //     photoIdControl?.patchValue({
    //       photoID: photoId, photoImageName: file.name, file: file,
    //     })


    //   };
    //   reader.readAsDataURL(file);



    // }
  }

  onSchoolImageChange(event: any) {
    const file: File = event.target.files[0];
    this.handleCertificateFileChange(file)
  }

  uploadCertificate(): void {
    // debugger
    // if (this.file) {

    //   let file = this.file
    //   this.dataService.uploadProfilePhoto(file).subscribe(
    //     (response: any) => {
    //       console.log('File uploaded successfully', response);
    //       this.schoolDetailsForm.patchValue({ photoID: response });
    //     },
    //     (error: any) => {
    //       console.error('Error uploading file', error);
    //     }
    //   );


    // } else {
    //   console.error('No file selected');
    // }
  }


  onDragOver(event: any) {
    event.preventDefault();
  }


  onDropSuccess(event: any) {
    event.preventDefault();


    this.onCertificateUploadDragAndDrop(event);

  }

  getDocument() {
    // let result = '';

    // let image = this.schoolDetailsForm.get('photoID')?.value?.photoImageName;
    // if (
    //   this.schoolDetailsForm.get('photoID')?.value?.photoImageName === 'No Document' ||
    //   this.schoolDetailsForm.get('photoID')?.value?.photoImageName === null ||
    //   this.schoolDetailsForm.get('photoID')?.value?.photoImageName === ''
    // ) {
    //   image = '';
    // }

    // if (this.apiUrl && image) {
    //   result = this.apiUrl.replace(/\/+$/, '') + '/' + image.replace(/^\/+/, '');
    // }


    // this.fileName = this.getFileName(result); // Get the file name
    // console.log("resiult", this.fileName)
    // return result;
  }

  removeLeaveApplicationDocument() {

    // this.schoolDetailsForm.get('photoID')?.setValue('')
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


  overlayClick() {


  }
}
