import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-transfer-request-list',
  templateUrl: './transfer-request-list.component.html',
  styleUrls: ['./transfer-request-list.component.scss'],
  providers: [DatePipe]
})
export class TransferRequestListComponent implements OnInit {

  isSidebarClosed = false;
  displayColumns: any[] = [{ headerName: 'name', field: 'employeeName' }, { headerName: 'From School', field: 'fromSchoolName' }, { headerName: 'To School', field: 'toSchoolName' }, { headerName: 'Requested Date', field: 'requestDate' }, { headerName: 'Approval Date', field: 'approvalDate' }, { headerName: 'Comment', field: 'comment' },{ headerName: 'Status', field: 'status' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  transferList: any[] = [];
  transferTableRows: any;
  transferTableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

 constructor(private dataService:DataService,private datePipe:DatePipe){


 }

  ngOnInit(): void {
    this.loadtransferRequestList()
   
  }

  loadtransferRequestList(){

    this.dataService.getTransferRequestData().subscribe(
      (data:any) => {
        debugger
        this.transferList = data;
        console.log("school list data", this.transferList);
        this.transferTableRows = this.transferList
        this.transferTableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
              valueFormatter: column.field === 'requestDate'  || column.field === 'approvalDate'
          ? (params: any) => this.datePipe.transform(params.value, 'MM/dd/yyyy')
          : undefined, 
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'name', // For example, only these columns have floating filters
          ... (column.field === 'name' ? {
            cellRenderer: (params: any) => `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>`,
            width:300
          } : {})
        }));



      },
      (error:any) => {
        console.error('Error fetching school data:', error);
      }
    );

  }
}
