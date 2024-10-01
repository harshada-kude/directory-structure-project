export interface FolderStructureModel {
    name: string;
    type: 'directory' | 'file'; // Add type property
    children?: FolderStructureModel[]; // Optional for files
  }
  