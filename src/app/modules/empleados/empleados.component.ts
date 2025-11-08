import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Empleado,
  EmpleadosService,
  Tecnico,
  Vendedor,
} from '../../services/empleados.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['../clientes/clientes.component.scss'],
})
export class EmpleadosComponent implements OnInit {
  filtro = '';
  vistaActual: 'TODOS' | 'VENDEDORES' | 'TECNICOS' = 'TODOS';
  empleadoForm: any;
  empleados: Empleado[] = [];
  modalTitle = 'Registrar Empleado';
  messageModalText = '';
  empleadoIdSeleccionado: string | null = null;

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fecha_contratacion: ['', Validators.required],
    });

    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadosService.listarEmpleados().subscribe({
      next: (data) => (this.empleados = data),
      error: () => this.showMessageModal('Error al cargar empleados'),
    });
  }

  get empleadosMostrados() {
    const t = this.filtro.toLowerCase();
    return this.empleados.filter(
      (e) =>
        e.nombre?.toLowerCase().includes(t) ||
        e.apellido?.toLowerCase().includes(t) ||
        e.dni?.includes(t)
    );
  }

  cambiarVista(vista: 'TODOS' | 'VENDEDORES' | 'TECNICOS') {
    this.vistaActual = vista;

    if (vista === 'VENDEDORES') {
      this.empleadosService.listarVendedores().subscribe({
        next: (data) => {
          console.log('Respuesta vendedores:', data);
          this.empleados = data;
        },
        error: () => this.showMessageModal('Error cargando vendedores'),
      });
    } else if (vista === 'TECNICOS') {
      this.empleadosService.listarTecnicos().subscribe({
        next: (data) => {
          this.empleados = data;
        },
        error: () => this.showMessageModal('Error cargando técnicos'),
      });
    } else {
      this.cargarEmpleados();
    }
  }

  nuevoEmpleado() {
    this.modalTitle = 'Registrar Empleado';
    this.empleadoForm.reset();
  }

  guardarEmpleado() {
    if (this.empleadoForm.invalid) return;

    const data = this.empleadoForm.value;

    this.empleadosService.crearEmpleado(data).subscribe({
      next: () => {
        this.showMessageModal('Empleado registrado con éxito');
        this.cargarEmpleados();
      },
      error: () => this.showMessageModal('Error registrando empleado'),
    });
  }

  editarEmpleado(id: string) {
    this.empleadosService.obtenerEmpleadoPorId(id).subscribe({
      next: (empleado) => {
        this.modalTitle = 'Editar Empleado';
        this.empleadoForm.patchValue(empleado);
        this.empleadoIdSeleccionado = id;
      },
      error: () => this.showMessageModal('No fue posible cargar los datos'),
    });
  }

  abrirAsignarRolModal(id: string) {
    this.empleadoIdSeleccionado = id;
    this.showModal('rolModal');
  }

  asignarVendedor() {
    if (!this.empleadoIdSeleccionado) return;
    const data: Vendedor = { empleado_id: this.empleadoIdSeleccionado };

    this.empleadosService.registrarVendedor(data).subscribe({
      next: () => {
        this.showMessageModal('Empleado asignado como vendedor');
        this.cargarEmpleados();
      },
      error: () => this.showMessageModal('Error asignando rol'),
    });
  }

  asignarTecnico() {
    if (!this.empleadoIdSeleccionado) return;
    const data: Tecnico = { empleado_id: this.empleadoIdSeleccionado };

    this.empleadosService.registrarTecnico(data).subscribe({
      next: () => {
        this.showMessageModal('Empleado asignado como técnico');
        this.cargarEmpleados();
      },
      error: () => this.showMessageModal('Error asignando rol'),
    });
  }

  eliminarEmpleado(id: string) {
    if (!confirm('¿Eliminar empleado?')) return;

    this.empleadosService.eliminarEmpleado(id).subscribe({
      next: () => {
        this.showMessageModal('Empleado eliminado');
        this.cargarEmpleados();
      },
      error: () => this.showMessageModal('Error eliminando empleado'),
    });
  }

  private showModal(id: string) {
    const el = document.getElementById(id);
    if (el) {
      (window as any).bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  private showMessageModal(msg: string) {
    this.messageModalText = msg;
    const el = document.getElementById('messageModal');
    (window as any).bootstrap.Modal.getOrCreateInstance(el).show();
  }
}
