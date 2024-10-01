import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import { FolderStructureService } from '../../services/folder-structure.service';
import { takeWhile } from 'rxjs';
import { FolderStructureModel } from '../../models/folder-structure.model';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [MatIconModule, MatTreeModule, MatButtonModule],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss'
})
export class TreeViewComponent implements OnInit, OnDestroy {

  jsonData : string | null = null;

  compActive: boolean = true;

  dataSource: MatTreeNestedDataSource<any> = new MatTreeNestedDataSource();

  constructor(private folderStructureService: FolderStructureService) {

  }

  ngOnInit(): void {
    this.subscribeTreeData();
  }

  ngOnDestroy(): void {
      this.compActive = false;
  }

  subscribeTreeData() {
    this.folderStructureService.getTreeData().pipe(takeWhile(() => this.compActive)).subscribe((data : any) => {
      this.dataSource.data = data;
    });
  }

  childrenAccessor = (node: FolderStructureModel) => node.children ?? [];

  hasChild = (_: number, node: FolderStructureModel) => !!node.children && node.children.length > 0;
}
