import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/service/data/data.service';
import { getFileName, getTruncatedFileName } from 'src/app/utils/utilsHelper/utilsHelperFunctions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.scss']
})
export class DocumentsUploadComponent implements OnInit {
  file: any;
  fileName: any = [];
  fileSize: any = [];
  showValidations: boolean[] = [];
  apiUrl: any = environment.imageBaseUrl
  @Input() documentForm!: FormGroup;
  @Output() documentFormChange = new EventEmitter<any>();
  @Input() submitted: boolean = false;
  getTruncatedFileName = getTruncatedFileName;
  getFileName = getFileName;

  constructor(private dataService: DataService, private fb: FormBuilder) {
  }
  ngOnInit(): void {
    if (this.documentForm && this.documents.length == 0) {
      this.addDocument();
    }
  }


  // Getter for the FormArray
  get documents(): FormArray {
    return this.documentForm.get('documents') as FormArray;
  }


  // Add a new document entry
  addDocument(): void {
    const documentForm = this.fb.group({
      documentType: ['', Validators.required],
      documentFile: [null, Validators.required]
    });

    this.documents.push(documentForm);
  }

  // Remove a document entry
  removeDocument(index: number): void {
    this.documents.removeAt(index);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }


  onCertificateUploadChange(event: any, index: number): void {

    if (!this.documents.at(index)?.get("documentType")?.value) {
      this.showValidations[index] = true
      event.target.value = ""

      return
    } else {
      this.showValidations[index] = false;
    }
    let documentType: string = this.documents.at(index)?.get("documentType")?.value
    this.fileName[index] = event.target.files[0]?.name;
    let totalBytes = event.target.files[0]?.size;
    if (totalBytes < 1000000) {
      this.fileSize[index] = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      this.fileSize[index] = Math.floor(totalBytes / 1000000) + 'MB';
    }

    const file = event.target.files[0];
    if (file) {
      this.file = file;
      // this.educations.at(index).get('documentFile')?.setValue(file);
    }
    this.uploadCertificate(index,documentType)
  }
  onCertificateUploadDragAndDrop(event: any, index: number): void {
    this.fileName[index] = event.dataTransfer.files[0]?.name;
    let totalBytes = event.dataTransfer.files[0]?.size;
    if (totalBytes < 1000000) {
      this.fileSize[index] = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      this.fileSize[index] = Math.floor(totalBytes / 1000000) + 'MB';
    }
    let documentType: string = this.documents.at(index)?.get("documentType")?.value
    const file = event.dataTransfer.files[0];
    if (file) {
      this.file = file;
    }
    this.uploadCertificate(index,documentType)
  }

  uploadCertificate(index: any,documentType:any): void {
    debugger
    if (this.file) {

      let file = this.file
      this.dataService.uploadDocumentByDocumentType(file,documentType).subscribe(
        (response: any) => {
          console.log('File uploaded successfully', response);
          const documents = this.documentForm.get('documents') as FormArray;
          documents.at(index).get('documentFile')?.patchValue(response)
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

    let image = this.documents.at(index)?.get('documentFile')?.value?.documentName;
    if (
      this.documents.at(index)?.get('documentType')?.value?.documentName === 'No Document' ||
      this.documents.at(index)?.get('documentType')?.value?.documentName === null ||
      this.documents.at(index)?.get('documentType')?.value?.documentName === ''
    ) {
      image = '';
    }

    if (this.apiUrl && image) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + image.replace(/^\/+/, '');
    }


    this.fileName[index] = this.getFileName(result); // Get the file name
    console.log("result", result, this.fileName)
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

    // this.educations.at(index)?.get('certificate')?.setValue("")
  }
}
