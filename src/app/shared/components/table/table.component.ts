import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, GridOptions, IRowNode, MouseEnterEvent } from 'ag-grid-community'; // Column Definition Type Interface
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  // Row Data: The data to be displayed.
  @Input() rowData!: any[]
  @Input() colDefs!: any[]
  @Input() paginationConfig!: PagonationConfig
  @Output() OnRowMouseOverEvent: any = new EventEmitter()
  @Output() OnRowMouseOutEvent: any = new EventEmitter()
  @Output() onCellClickedEvent: any = new EventEmitter()
  @Output() BtnClickedEvent: any = new EventEmitter()

  //  gridOptions: GridOptions = {
  //   onCellMouseOver: this.rowMouseEnter.bind(this) , // Bind the cell mouse over event
  //   onCellMouseOut: this.onCellMouseOut.bind(this)
  // };

  ngOnInit(): void {
    debugger

  }



  onRowMouseEnter(event: any): void {
    debugger
    this.OnRowMouseOverEvent.emit(event)
  }
  onCellMouseOut(event: any): void {
    // const rowNode: IRowNode = event.node;  // Get the row node
    // const rowData = rowNode.data;          // Get the row data
    // console.log('Mouse left row:', rowData);
    this.OnRowMouseOutEvent.emit(event)
  }
  onCellClicked(event: any) {

    this.onCellClickedEvent.emit(event)
  }

  BtnClick(data: any) {
    debugger
   
    this.BtnClickedEvent.emit(data)
  }
  onGridReady(params:any) {
    params.api.sizeColumnsToFit(); // Fit all columns within the grid's width

    // Automatically adjust only the "name" column based on content length
    params.columnApi.autoSizeColumn('name');
  }


}
