import { Injectable, signal } from '@angular/core';

export interface ToastModel {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  leaving?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private id = 0;
  toasts = signal<ToastModel[]>([]);

  show(message: string, type: ToastModel['type'] = 'info', duration = 3000) {
    const toast = {
      id: this.id++,
      message,
      type,
    };

    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: number) {
    this.toasts.update((list) =>
      list.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      ),
    );

    setTimeout(() => {
      this.toasts.update((list) => list.filter((toast) => toast.id !== id));
    }, 300);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}
