import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
  relinquishmentForm!:FormGroup


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
  file!: File;
  previewUrl!: string;
  apiUrl: any=environment.imageBaseUrl

  constructor(private fb:FormBuilder){

  }
  ngOnInit(): void {
    this.relinquishmentForm=this.fb.group({
      teacher:[''],
      date:[''],
      document:['']
    })
  
  }

  onTeacherFilterChange() {

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

    const file: File =  event.dataTransfer.files[0]
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
    console.log("resiult", this.fileName)
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

  onSubmit(){
    console.log("form",this.relinquishmentForm.value)
  }

  overlayClick() {


  }
}
