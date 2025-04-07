import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ data.title }}</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="image-container" mat-dialog-content>
        <img [src]="data.imageUrl" [alt]="data.title">
      </div>

      <div class="dialog-actions" mat-dialog-actions>
        <button mat-button mat-dialog-close>Close</button>
        <a mat-button [href]="data.imageUrl" download target="_blank">
          <mat-icon>download</mat-icon>
          Download
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
      }
    }

    .image-container {
      flex: 1;
      overflow: auto;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F8F8F8;

      img {
        max-width: 100%;
        max-height: calc(90vh - 130px);
        object-fit: contain;
        border-radius: 4px;
      }
    }

    .dialog-actions {
      padding: 8px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);

      button, a {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class ImagePreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
