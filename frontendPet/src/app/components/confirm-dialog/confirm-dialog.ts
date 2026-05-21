import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [NgIf],
  template: `
    @if (visible) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="confirm-dialog" (click)="$event.stopPropagation()">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="dialog-actions">
            <button class="btn-secondary" (click)="onCancel()">Cancelar</button>
            <button class="btn-danger" (click)="onConfirm()">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(45, 62, 40, 0.7);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .confirm-dialog {
        background: #ffffff;
        border-radius: 16px;
        padding: 32px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(82, 122, 69, 0.3);
        border: 1px solid #d0e0c8;
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      h3 {
        margin: 0 0 16px 0;
        font-size: 22px;
        color: #2d3e28;
        font-weight: 700;
      }

      p {
        margin: 0 0 24px 0;
        font-size: 15px;
        color: #527a45;
        line-height: 1.6;
      }

      .dialog-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .btn-secondary {
        background-color: #ffffff;
        color: #2d3e28;
        border: 1px solid #d0e0c8;
        border-radius: 8px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-secondary:hover {
        background-color: #f5f3ee;
        border-color: #88a878;
      }

      .btn-danger {
        background-color: #ffffff;
        border: 1px solid #c25656;
        color: #c25656;
        border-radius: 8px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-danger:hover {
        background-color: #c25656;
        color: #ffffff;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  visible = false;
  title = '';
  message = '';
  confirmText = 'Confirmar';

  private resolvePromise!: (value: boolean) => void;

  show(title: string, message: string, confirmText = 'Confirmar'): Promise<boolean> {
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.visible = true;

    return new Promise((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  onConfirm() {
    this.visible = false;
    this.resolvePromise(true);
  }

  onCancel() {
    this.visible = false;
    this.resolvePromise(false);
  }
}
