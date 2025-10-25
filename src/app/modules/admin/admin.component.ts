import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Admin {
  id: string;
  username: string;
  password: string;
  email: string;
  rol: string;
  fechaCreacion: string;
}

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

  admins: Admin[] = [
    {
      id: 'AD1',
      username: 'marco_admin',
      password: '••••••••',
      email: 'marco.admin@empresa.com',
      rol: 'SuperAdmin',
      fechaCreacion: '2024-01-15',
    },
    {
      id: 'AD2',
      username: 'luisa_g',
      password: '••••••••',
      email: 'luisa.g@empresa.com',
      rol: 'Administrador',
      fechaCreacion: '2024-03-01',
    },
  ];

  filteredAdmins: Admin[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.filteredAdmins = [...this.admins];
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
        a.email.toLowerCase().includes(term)
    );
  }

  private getNextId(): string {
    const maxId = this.admins.reduce((max, a) => {
      const num = parseInt(a.id.replace('AD', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `AD${maxId + 1}`;
  }

  crearAdmin() {
    this.adminForm.reset();
  }

  guardarAdmin() {
    if (this.adminForm.valid) {
      const nuevoAdmin: Admin = {
        id: this.getNextId(),
        username: this.adminForm.value.username,
        password: this.adminForm.value.password,
        email: `${this.adminForm.value.username}@empresa.com`,
        rol: 'Administrador',
        fechaCreacion: new Date().toISOString().split('T')[0],
      };

      this.admins.push(nuevoAdmin);
      this.filtrarAdmins();
      this.showMessageModal('Administrador creado exitosamente.');
      this.adminForm.reset();
    } else {
      this.adminForm.markAllAsTouched();
    }
  }

  eliminarAdmin(id: string) {
    this.adminIdToDelete = id;
    this.showConfirmModal();
  }

  confirmarEliminar() {
    if (this.adminIdToDelete) {
      this.admins = this.admins.filter((a) => a.id !== this.adminIdToDelete);
      this.filtrarAdmins();
      this.showMessageModal(
        `Administrador con ID ${this.adminIdToDelete} eliminado.`
      );
      this.adminIdToDelete = null;
    }
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
