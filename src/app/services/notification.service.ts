import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaz que define la estructura de una notificación
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Almacena las notificaciones activas en un BehaviorSubject
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  // Observable para que otros componentes puedan suscribirse a los cambios
  public notifications$ = this.notificationsSubject.asObservable();

  // Muestra una notificación de éxito
  showSuccess(message: string, duration: number = 4000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'success',
      message,
      duration,
    });
  }

  // Muestra una notificación de error
  showError(message: string, duration: number = 6000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'error',
      message,
      duration,
    });
  }

  // Muestra una notificación de advertencia
  showWarning(message: string, duration: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      message,
      duration,
    });
  }

  // Muestra una notificación informativa
  showInfo(message: string, duration: number = 4000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'info',
      message,
      duration,
    });
  }

  // Agrega una notificación a la lista y la elimina automáticamente si tiene duración
  private addNotification(notification: Notification): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(
        () => this.removeNotification(notification.id),
        notification.duration
      );
    }
  }

  // Elimina una notificación por su ID
  removeNotification(id: string): void {
    const updated = this.notificationsSubject.value.filter((n) => n.id !== id);
    this.notificationsSubject.next(updated);
  }

  // Elimina todas las notificaciones activas
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  // Genera un identificador único para cada notificación
  private generateId(): string {
    return `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  }
}
