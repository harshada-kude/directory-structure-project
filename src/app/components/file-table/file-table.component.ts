import { Component, Input } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import { takeWhile } from 'rxjs';
import { FolderStructureService } from '../../services/folder-structure.service';
import { FileInfoModel } from '../../models/file-info.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-table',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, CommonModule, MatExpansionModule],
  templateUrl: './file-table.component.html',
  styleUrl: './file-table.component.scss'
})
export class FileTableComponent {
  columnsToDisplay: string[] = ['filename', 'occurrences', 'latestDate', 'expandOccurence'];
  compActive: boolean  = true;
  dataSource: MatTableDataSource<FileInfoModel[]> = new MatTableDataSource();
  expandedElement: FileInfoModel | null = null;
  element: any;

  constructor(private folderStructureService: FolderStructureService) {}

  ngOnInit(): void {
    this.subscribeTableData();
  }

  ngOnDestroy(): void {
      this.compActive = false;
  }

  subscribeTableData() {
    console.log(this.dataSource);
    this.folderStructureService.getTableData().pipe(takeWhile(() => this.compActive)).subscribe((data : any) => {
      this.dataSource.data = data ;
      console.log(this.dataSource);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleExpansion(element: any) {
    element.expanded = !element.expanded;
  }
}
