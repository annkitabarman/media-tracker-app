import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-toast-component',
  imports: [],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.scss',
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  get allToasts() {
    return this.toastService.toasts();
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
