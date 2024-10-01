import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { FileInfoModel } from '../models/file-info.model';
import { FolderStructureModel } from '../models/folder-structure.model';
import { OccurenceModel } from '../models/occurence.model';

@Injectable({
  providedIn: 'root'
})
export class FolderStructureService {

  jsonData: Subject<JSON | Object> = new Subject();

  treeData: Subject<FolderStructureModel[]> = new Subject();

  tableData: BehaviorSubject<FileInfoModel[]> = new BehaviorSubject<FileInfoModel[]>([]);

  constructor() { }

  getJsonData(): Observable<JSON | Object> {
    return this.jsonData.asObservable();
  }

  setJsonData(data : any): void {
    this.jsonData.next(data);
    this.setTableData(data);
    this.setTreeData(data);
  }

  setTreeData(data : FolderStructureModel[]): void {
    const result = this.transformToTree(data);
    this.treeData.next(result);
  }

  getTreeData(): Observable<FolderStructureModel[]> {
    return this.treeData.asObservable();
  }

  setTableData(data : FileInfoModel[]): void {
    const result = this.parseDirectoryStructure(data);
    this.tableData.next(result);
  }

  getTableData(): Observable<FileInfoModel[]> {
    return this.tableData.asObservable();
  }

  transformToTree(json: any): FolderStructureModel[] {
    const result: FolderStructureModel[] = [];

    function processNode(node: any, name: string): FolderStructureModel | null {
      if (node.type === 'directory') {
        const children: FolderStructureModel[] = [];

        // Process each child
        for (const key in node) {
          if (key !== 'type' && key !== 'modification_date') {
            const childNode = processNode(node[key], key);
            if (childNode) {
              children.push(childNode);
            }
          }
        }

        return { name, type: 'directory', children };
      } else if (node.type === 'file') {
        return { name, type: 'file' }; // For files, we don't need children
      }
      return null; // Return null for any unexpected node types
    }

    for (const key in json) {
      const node = processNode(json[key], key);
      if (node) {
        result.push(node);
      }
    }

    return result;
  }

  parseDirectoryStructure(folder: any, folderName = ''): FileInfoModel[] {
    const fileMap: { [key: string]: FileInfoModel } = {};

    // Helper function to process folders recursively
    function processFolder(folder: any, folderName: string) {
      const otherFilesCount = Object.keys(folder).filter(key => folder[key].type === 'file').length;

      Object.keys(folder).forEach(key => {
        const item = folder[key];

        // If the item is a file
        if (item.type === 'file') {
          const fileInfo = fileMap[key] || {
            filename: key,
            occurrences: 0,
            latestDate: '',
            expandOccurence: [],
            expanded: false
          };

          // Increment the occurrence count
          fileInfo.occurrences += 1;

          // Update to the latest date
          if (!fileInfo.latestDate || new Date(item.modification_date) > new Date(fileInfo.latestDate)) {
            fileInfo.latestDate = item.modification_date;
          }

          // Add an OccurenceModel for this occurrence
          const occurrence: OccurenceModel = {
            folderName,
            creationDate: item.modification_date,
            numberOfOtherFiles: otherFilesCount - 1 // Subtract the current file
          };

          // Add the occurrence to the fileInfo's expandOccurence array
          fileInfo.expandOccurence.push(occurrence);

          // Store back the updated fileInfo
          fileMap[key] = fileInfo;

        } else if (item.type === 'directory') {
          // If the item is a directory, recursively process it
          processFolder(item, key);
        }
      });
    }

    // Start processing the root folder
    processFolder(folder, folderName);

    // Convert the fileMap into an array of FileInfoModel objects
    return Object.values(fileMap);
  }
}