import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnChanges {
  @Input() tableData: any[] = [];
  @Input() displayedColumns: string[] = [];

  sortedColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedData: any[] = [];

  ngOnChanges() {
    this.tableData = this.tableData.map(row => ({
      ...row,
      documentStatus: this.getDocumentStatus(row.documentCount, row.error)
    }));
    this.updatePaginatedData();
  }

  getDocumentStatus(documentCount: number, error: any): any {
    if (documentCount !== 0 && error && error.length !== 0) {
      return { icon: 'fas fa-exclamation-triangle text-warning', text: documentCount };
    } else if (documentCount !== 0 && (!error || error.length === 0)) {
      return { icon: 'fas fa-file-alt text-primary', text: documentCount };
    } else if (documentCount === 0) {
      return { icon: '', text: '0' };
    }
    return { icon: '', text: '0' };
  }

  sortColumn(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.tableData = this.tableData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;

      if (this.sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.tableData.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.tableData.length) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  get totalPages() {
    return Math.ceil(this.tableData.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
