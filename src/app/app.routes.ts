import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import("./components/file-upload/file-upload.component").then((m) => m.FileUploadComponent) },
  { path: 'table', loadComponent: () => import("./components/file-table/file-table.component").then((m) => m.FileTableComponent) },
  { path: 'table/:id', loadComponent: () => import("./components/file-table/file-table.component").then((m) => m.FileTableComponent) },
];

