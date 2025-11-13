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

  /**
   * Inicializa el formulario y carga la lista de empleados.
   */
  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{7,10}$')],
      ],
      fecha_contratacion: ['', Validators.required],
    });

    this.cargarEmpleados();
  }

  /**
   * Obtiene todos los empleados desde el servicio.
   */
  cargarEmpleados() {
    this.empleadosService.listarEmpleados().subscribe({
      next: (data) => (this.empleados = data),
      error: () => this.showMessageModal('Error al cargar empleados'),
    });
  }

  /**
   * Filtra los empleados según el texto de búsqueda.
   */
  get empleadosMostrados() {
    const t = this.filtro.toLowerCase();
    return this.empleados.filter(
      (e) =>
        e.nombre?.toLowerCase().includes(t) ||
        e.apellido?.toLowerCase().includes(t) ||
        e.dni?.includes(t)
    );
  }

  /**
   * Cambia la vista entre todos, vendedores o técnicos.
   * @param vista Tipo de vista seleccionada.
   */
  cambiarVista(vista: 'TODOS' | 'VENDEDORES' | 'TECNICOS') {
    this.vistaActual = vista;

    if (vista === 'VENDEDORES') {
      this.empleadosService.listarVendedores().subscribe({
        next: (data) => {
          this.empleados = Array.isArray(data) ? data : [];
        },
        error: () => this.showMessageModal('Error cargando vendedores'),
      });
    } else if (vista === 'TECNICOS') {
      this.empleadosService.listarTecnicos().subscribe({
        next: (data) => {
          this.empleados = Array.isArray(data) ? data : [];
        },
        error: () => this.showMessageModal('Error cargando técnicos'),
      });
    } else {
      this.cargarEmpleados();
    }
  }

  /**
   * Prepara el formulario para registrar un nuevo empleado.
   */
  nuevoEmpleado() {
    this.modalTitle = 'Registrar Empleado';
    this.empleadoForm.reset();
    this.empleadoIdSeleccionado = null;
  }

  /**
   * Guarda los datos del empleado nuevo o actualizado.
   */
  guardarEmpleado() {
    if (this.empleadoForm.invalid) return;

    const data = this.empleadoForm.value;

    if (this.empleadoIdSeleccionado) {
      this.empleadosService
        .actualizarEmpleado(this.empleadoIdSeleccionado, data)
        .subscribe({
          next: () => {
            this.showMessageModal('Empleado actualizado con éxito');
            this.cargarEmpleados();
          },
          error: () => this.showMessageModal('Error actualizando empleado'),
        });
    } else {
      this.empleadosService.crearEmpleado(data).subscribe({
        next: () => {
          this.showMessageModal('Empleado creado con éxito');
          this.cargarEmpleados();
        },
        error: () => this.showMessageModal('Error creando empleado'),
      });
    }
  }

  /**
   * Carga los datos de un empleado para su edición.
   * @param id ID del empleado a editar.
   */
  editarEmpleado(id: string) {
    this.empleadosService.obtenerEmpleadoPorId(id).subscribe({
      next: (empleado) => {
        this.modalTitle = 'Editar Empleado';
        this.empleadoForm.patchValue(empleado);
        this.empleadoIdSeleccionado = id;
        this.showModal('empleadoModal');
      },
      error: () => this.showMessageModal('Error cargando datos del empleado'),
    });
  }

  /**
   * Abre el modal para asignar un rol al empleado.
   * @param id ID del empleado seleccionado.
   */
  abrirAsignarRolModal(id: string) {
    this.empleadoIdSeleccionado = id;
    this.showModal('rolModal');
  }

  /**
   * Asigna el rol de vendedor al empleado seleccionado.
   */
  asignarVendedor() {
    if (!this.empleadoIdSeleccionado) return;
    const data: Vendedor = { empleado_id: this.empleadoIdSeleccionado };

    this.empleadosService.registrarVendedor(data).subscribe({
      next: () => {
        this.showMessageModal('Empleado asignado como vendedor');
        this.cargarEmpleados();
      },
      error: () => this.showMessageModal('Error asignando rol de vendedor'),
    });
  }

  /**
   * Asigna el rol de técnico al empleado seleccionado.
   */
  asignarTecnico() {
    if (!this.empleadoIdSeleccionado) return;
    const data: Tecnico = { empleado_id: this.empleadoIdSeleccionado };

    this.empleadosService.registrarTecnico(data).subscribe({
      next: () => {
        this.showMessageModal('Empleado asignado como técnico');
        this.cargarEmpleados();
      },
      error: () => this.showMessageModal('Error asignando rol de técnico'),
    });
  }

  empleadoAEliminar: string | null = null;

  /**
   * Abre el modal de confirmación antes de eliminar un empleado.
   * @param id ID del empleado a eliminar.
   */
  pedirConfirmacion(id: string) {
    this.empleadoAEliminar = id;
    this.showModal('confirmModal');
  }

  /**
   * Confirma la eliminación del empleado seleccionado.
   */
  confirmarEliminar() {
    if (!this.empleadoAEliminar) return;
    this.empleadosService.eliminarEmpleado(this.empleadoAEliminar).subscribe({
      next: () => {
        this.showMessageModal('Empleado eliminado con éxito');
        this.cargarEmpleados();
      },
      error: () => this.showMessageModal('Error eliminando empleado'),
    });
  }

  /**
   * Muestra un modal en pantalla.
   * @param id ID del modal a mostrar.
   */
  private showModal(id: string) {
    const el = document.getElementById(id);
    if (el) {
      (window as any).bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  /**
   * Muestra un modal con un mensaje de alerta.
   * @param msg Texto a mostrar en el modal.
   */
  private showMessageModal(msg: string) {
    this.messageModalText = msg;
    const el = document.getElementById('messageModal');
    if (el) {
      (window as any).bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }
}
