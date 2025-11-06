import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Admin, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './admin.component.html',
  styleUrls: ['../clientes/clientes.component.scss'],
})
export class AdminComponent implements OnInit {
  filtro = '';
  adminForm!: FormGroup;
  messageModalText: string = '';
  adminIdToDelete: string | null = null;

  admins: Admin[] = [];
  filteredAdmins: Admin[] = [];

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.cargarAdmins();
  }

  crearAdmin() {
    this.guardarAdmin();
  }

  cargarAdmins(): void {
    this.adminService.listarAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.filteredAdmins = [...this.admins];
      },
      error: (err) => {
        console.error('Error al cargar administradores:', err);
      },
    });
  }

  filtrarAdmins() {
    const term = this.filtro.toLowerCase().trim();
    if (!term) {
      this.filteredAdmins = [...this.admins];
      return;
    }
    this.filteredAdmins = this.admins.filter(
      (a) =>
        a.username.toLowerCase().includes(term) ||
        (a.nombre && a.nombre.toLowerCase().includes(term))
    );
  }

  guardarAdmin() {
    if (this.adminForm.valid) {
      const nuevoAdmin: Admin = {
        username: this.adminForm.value.username,
        password: this.adminForm.value.password,
        nombre: this.adminForm.value.username,
      };

      this.adminService.crearAdmin(nuevoAdmin).subscribe({
        next: (res) => {
          this.showMessageModal('Administrador creado exitosamente.');
          this.cargarAdmins();
          this.adminForm.reset();
        },
        error: (err) => {
          console.error('Error al crear administrador:', err);
          this.showMessageModal('Error al crear administrador.');
        },
      });
    } else {
      this.adminForm.markAllAsTouched();
    }
  }

  confirmarEliminar() {
    if (this.adminIdToDelete) {
      this.adminService.eliminarAdmin(this.adminIdToDelete).subscribe({
        next: () => {
          this.showMessageModal(`Administrador eliminado correctamente.`);
          this.cargarAdmins();
          this.adminIdToDelete = null;
        },
        error: (err) => {
          console.error('Error al eliminar administrador:', err);
          this.showMessageModal('Error al eliminar administrador.');
        },
      });
    }
  }

  eliminarAdmin(id: string) {
    this.adminIdToDelete = id;
    this.showConfirmModal();
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    console.log(`[Message Modal] ${message}`);
  }

  private showConfirmModal(): void {
    console.log(
      `[Confirm Modal] Eliminación solicitada para ${this.adminIdToDelete}`
    );
  }
}
