import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FolderStructureService } from '../../services/folder-structure.service';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  errorMessage: string | null = null;

  constructor(private folderStructureService: FolderStructureService,
    private loaderService: LoaderService,
    private routerService: Router) {

  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.loaderService.setIsLoading(true);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.readFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onChange(files: any) {
    this.loaderService.setIsLoading(true);
    if (files && files.length > 0) {
      const file = files[0];
      this.readFile(file);
    }
  }

  onDivClick() {
    this.fileInput.nativeElement.click();
  }

  async readFile(file: File) {
    const reader = new FileReader();
    reader.onload = await ((e) => {
      try {
        this.setJsonData(JSON.parse(e.target?.result as string));
        this.errorMessage = null; // Clear any previous errors
      } catch (error) {
        this.errorMessage = 'Invalid JSON file. Please try again.';
        this.setJsonData('');
      }
    });
    reader.readAsText(file);
  }

  setJsonData(data: Object) {
    this.folderStructureService.setJsonData(data);
    this.loaderService.setIsLoading(false);
    this.redirectToTable();
  }

  redirectToTable() {
    this.routerService.navigate(['/table']);
  }

}
