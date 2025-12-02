import { Component, OnDestroy } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastContainer implements OnDestroy {
  toasts: Toast[] = [];
  private sub: Subscription;

  constructor(private toast: ToastService) {
    this.sub = this.toast.toasts$.subscribe(list => (this.toasts = list));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(id: number) {
    this.toast.dismiss(id);
  }
}
