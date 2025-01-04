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
  @Input() isEdited: boolean = false;
  @Output() documentFormChange = new EventEmitter<any>();
  @Output() FileChange = new EventEmitter<any>();
  @Input() submitted: boolean = false;
  getTruncatedFileName = getTruncatedFileName;
  getFileName = getFileName;
  files: { [index: number]: File } = {};
  previewUrls: { [index: number]: string } = {};;

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








  uploadFiles() {

    this.documents.controls.map((doc: any, index: number) => {
      const file = this.files[index];
      if (file) {

        let documentType = doc.get('documentType')?.value

        this.dataService.uploadDocumentByDocumentType(file, documentType).subscribe(
          (response: any) => {
            console.log('File uploaded successfully11', response);
            const documents = this.documentForm.get('documents') as FormArray;
            documents.at(index).get('documentFile')?.patchValue(response)
          },
          (error: any) => {
            console.error('Error uploading file', error);
          }
        );


      } else {

      }
    });



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
    this.uploadCertificate(index, documentType)
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
    this.uploadCertificate(index, documentType)
  }

  //new 
  // onFileSelected(event: any, index: number): void {
  //  debugger
  //   const file = event.target.files[0];

  //   if (file) {
  //     this.files[index] = file;
  //     this.fileName[index] = event.target.files[0]?.name;
  //     let totalBytes = event.target.files[0]?.size;
  //     if (totalBytes < 1000000) {
  //       this.fileSize[index] = Math.floor(totalBytes / 1000) + 'KB';
  //     } else {
  //       this.fileSize[index] = Math.floor(totalBytes / 1000000) + 'MB';
  //     }

  //     const documents = this.documentForm.get('documents') as FormArray;
  //     console.log("docuemnt",documents)
  //     if(!documents.at(index).get('documentFile')?.value?.documentID){
  //       documents.at(index).get('documentFile')?.patchValue({ documentName: this.files[index].name, documentID: null })
  //     }else{
  //       documents.at(index).get('documentFile')?.patchValue({ documentName: this.files[index].name, documentID: documents.at(index).get('documentFile')?.value.documentID })
  //     }
     
  //     // Generate preview URL
  //     console.log("files", this.files);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.previewUrls[index] = reader.result as string;
  //       console.log("preview", this.previewUrls)
  //     };
  //     reader.readAsDataURL(file);

  //     this.FileChange.emit({ files: this.files, previewUrl: this.previewUrls })


  //   }
  // }
  // onFileSelectedDragAndDrop(event: any, index: number): void {
  //   debugger
  //   const file = event.dataTransfer.files[0];

  //   if (file) {
  //     this.files[index] = file;
  //     this.fileName[index] = event.dataTransfer.files[0]?.name;
  //     let totalBytes = event.dataTransfer.files[0]?.size;
  //     if (totalBytes < 1000000) {
  //       this.fileSize[index] = Math.floor(totalBytes / 1000) + 'KB';
  //     } else {
  //       this.fileSize[index] = Math.floor(totalBytes / 1000000) + 'MB';
  //     }

  //     // const documents = this.documentForm.get('documents') as FormArray;
  //     // documents.at(index).get('documentFile')?.patchValue({ documentName: this.files[index].name, documentID: null })

  //     const documents = this.documentForm.get('documents') as FormArray;
  //     console.log("docuemnt",documents)
  //     if(!documents.at(index).get('documentFile')?.value?.documentID){
  //       documents.at(index).get('documentFile')?.patchValue({ documentName: this.files[index].name, documentID: null })
  //     }else{
  //       documents.at(index).get('documentFile')?.patchValue({ documentName: this.files[index].name, documentID: documents.at(index).get('documentFile')?.value.documentID })
  //     }

  //     // Generate preview URL
  //     console.log("files", this.files);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.previewUrls[index] = reader.result as string;
  //       console.log("preview", this.previewUrls)
  //     };
  //     reader.readAsDataURL(file);

  //     this.FileChange.emit({ files: this.files, previewUrl: this.previewUrls })


  //   }
  // }


  private handleFileSelection(file: File, index: number, sourceType: string): void {
    if (file) {
      this.files[index] = file;
      this.fileName[index] = file.name;
  
      // Calculate file size
      let totalBytes = file.size;
      this.fileSize[index] = totalBytes < 1000000
        ? Math.floor(totalBytes / 1000) + 'KB'
        : Math.floor(totalBytes / 1000000) + 'MB';
  
      // Update FormArray with file details
      const documents = this.documentForm.get('documents') as FormArray;
      const documentFileControl = documents.at(index).get('documentFile');
      const documentID = documentFileControl?.value?.documentID || null;
      documentFileControl?.patchValue({
        documentName: file.name,
        documentID: documentID
      });

      console.log("file select",documents)
  
      // Generate preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls[index] = reader.result as string;
        console.log(`${sourceType} preview`, this.previewUrls);
      };
      reader.readAsDataURL(file);
  
      // Emit event with updated files and preview URLs
      this.FileChange.emit({ files: this.files, previewUrl: this.previewUrls });
    }
  }
  
  onFileSelected(event: any, index: number): void {
    debugger;
    const file = event.target.files[0];
    this.handleFileSelection(file, index, 'onFileSelected');
  }
  
  onFileSelectedDragAndDrop(event: any, index: number): void {
    debugger;
    const file = event.dataTransfer.files[0];
    this.handleFileSelection(file, index, 'onFileSelectedDragAndDrop');
  }
  

  uploadCertificate(index: any, documentType: any): void {
    debugger
    if (this.file) {

      let file = this.file
      this.dataService.uploadDocumentByDocumentType(file, documentType).subscribe(
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


    this.onFileSelectedDragAndDrop(event, index);

  }

  getDocument(index: any) {
    let result = '';
    debugger
    // console.log("DOCUMENTFILE", this.documents.at(index)?.get('documentFile')?.value?)

    let image = this.documents.at(index)?.get('documentFile')?.value?.documentName;
    console.log("image",image)
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
    this.documents.at(index)?.get('documentFile')?.setValue('')
  }
}
