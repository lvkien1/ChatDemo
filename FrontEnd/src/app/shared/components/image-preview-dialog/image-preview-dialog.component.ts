import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  imageUrl: string;
  title?: string;
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
    <div class="image-preview-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <h2 *ngIf="data.title">{{ data.title }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Image Container -->
      <div class="image-container" 
           [class.zoomed]="isZoomed"
           (click)="toggleZoom()">
        <img [src]="data.imageUrl" 
             [alt]="data.title || 'Image preview'"
             [style.transform]="isZoomed ? 'scale(' + zoomLevel + ')' : 'none'"
             (wheel)="handleZoom($event)">
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <button mat-icon-button (click)="downloadImage()">
          <mat-icon>download</mat-icon>
        </button>
        <button mat-icon-button (click)="rotate()">
          <mat-icon>rotate_right</mat-icon>
        </button>
        <button mat-icon-button (click)="toggleZoom()">
          <mat-icon>{{ isZoomed ? 'zoom_out' : 'zoom_in' }}</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .image-preview-dialog {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: black;
      color: white;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.8);

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: normal;
      }
    }

    .image-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: zoom-in;
      position: relative;

      &.zoomed {
        cursor: zoom-out;
        overflow: auto;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
        transform-origin: center center;
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.8);
    }

    :host ::ng-deep {
      .mat-mdc-dialog-container {
        padding: 0;
      }

      .mat-icon-button {
        color: white;
      }
    }
  `]
})
export class ImagePreviewDialogComponent {
  isZoomed = false;
  zoomLevel = 1;
  rotation = 0;

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
    this.zoomLevel = this.isZoomed ? 2 : 1;
  }

  handleZoom(event: WheelEvent): void {
    if (this.isZoomed) {
      event.preventDefault();
      const delta = event.deltaY * -0.01;
      this.zoomLevel = Math.min(Math.max(1, this.zoomLevel + delta), 4);
    }
  }

  rotate(): void {
    this.rotation = (this.rotation + 90) % 360;
    const img = document.querySelector('.image-container img') as HTMLImageElement;
    if (img) {
      img.style.transform = `rotate(${this.rotation}deg) scale(${this.zoomLevel})`;
    }
  }

  downloadImage(): void {
    const link = document.createElement('a');
    link.href = this.data.imageUrl;
    link.download = this.data.title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
