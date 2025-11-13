import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Admin, AdminService } from '../../services/admin.service';

declare var bootstrap: any;

/**
 * Componente que gestiona los administradores del sistema.
 * Permite crear, listar, filtrar y eliminar administradores.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  /**
   * Inicializa el formulario de administradores y carga la lista inicial.
   */
  ngOnInit(): void {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.cargarAdmins();
  }

  /**
   * Obtiene la lista de administradores desde el servicio.
   */
  cargarAdmins(): void {
    this.adminService.listarAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.filteredAdmins = [...data];
      },
      error: () => this.showMessageModal('Error al cargar administradores.'),
    });
  }

  /**
   * Filtra la lista de administradores según el término ingresado.
   */
  filtrarAdmins(): void {
    const term = this.filtro.toLowerCase().trim();
    this.filteredAdmins = term
      ? this.admins.filter(
          (a) =>
            a.username?.toLowerCase().includes(term) ||
            a.email?.toLowerCase().includes(term)
        )
      : [...this.admins];
  }

  /**
   * Abre el modal para crear un nuevo administrador.
   */
  crearAdmin() {
    this.adminForm.reset();
    const modal = document.getElementById('adminModal');
    if (modal) new bootstrap.Modal(modal).show();
  }

  /**
   * Guarda un nuevo administrador mediante el servicio.
   * Valida el formulario antes de enviarlo.
   */
  guardarAdmin() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const nuevoAdmin: Admin = {
      username: this.adminForm.value.username,
      password: this.adminForm.value.password,
      email: `${this.adminForm.value.username}@example.com`,
      rol: 'ADMIN',
      nombre: this.adminForm.value.username,
    };

    this.adminService.crearAdmin(nuevoAdmin).subscribe({
      next: () => {
        this.showMessageModal('Administrador creado exitosamente.');
        this.cargarAdmins();
      },
      error: () => this.showMessageModal('Error al crear administrador.'),
    });
  }

  /**
   * Abre el modal de confirmación para eliminar un administrador.
   * @param id ID del administrador a eliminar.
   */
  eliminarAdmin(id: string) {
    this.adminIdToDelete = id;
    const modal = document.getElementById('confirmModal');
    if (modal) new bootstrap.Modal(modal).show();
  }

  /**
   * Confirma la eliminación del administrador seleccionado.
   */
  confirmarEliminar() {
    if (!this.adminIdToDelete) return;

    this.adminService.eliminarAdmin(this.adminIdToDelete).subscribe({
      next: () => {
        this.showMessageModal('Administrador eliminado correctamente.');
        this.cargarAdmins();
        this.adminIdToDelete = null;
      },
      error: () => this.showMessageModal('Error al eliminar administrador.'),
    });
  }

  /**
   * Muestra un modal con un mensaje informativo.
   * @param message Texto a mostrar en el modal.
   */
  private showMessageModal(message: string): void {
    this.messageModalText = message;
    const modal = document.getElementById('messageModal');
    if (modal) new bootstrap.Modal(modal).show();
  }
}
