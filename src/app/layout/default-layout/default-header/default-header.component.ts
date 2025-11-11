import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-default-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
})
export class DefaultHeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  user: User | null = null;
  sub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((u) => (this.user = u));
    if (!this.user) this.user = this.authService.getCurrentUser();
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  get displayName(): string {
    if (!this.user) return 'Usuario';
    return this.user.nombre || this.user.username || 'Usuario';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
