import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from '@coreui/angular';
import {
  Empleado,
  EmpleadosService,
  Tecnico,
  Vendedor,
} from '../../services/empleados.service';

type FormularioTipo = 'GENERAL' | 'VENDEDOR' | 'TECNICO';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './empleados.component.html',
  styleUrls: ['../clientes/clientes.component.scss'],
})
export class EmpleadosComponent implements OnInit {
  filtro = '';
  vistaActual: 'TODOS' | 'VENDEDORES' | 'TECNICOS' = 'TODOS';
  empleadoForm!: FormGroup;
  formTipo: FormularioTipo = 'GENERAL';
  modalTitle: string = 'Registrar Empleado';
  messageModalText: string = '';

  empleados: Empleado[] = [];

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fecha_contratacion: [this.getTodayDate(), [Validators.required]],
      salario: [null, [Validators.required, Validators.min(100000)]],
      concesionario_id: [
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        [Validators.required],
      ],
    });

    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.empleadosService.listarEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        console.log('Empleados cargados:', data);
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
        this.showMessageModal('Error al obtener la lista de empleados.');
      },
    });
  }

  get empleadosMostrados(): Empleado[] {
    let listaFiltrada = this.empleados;
    if (this.vistaActual === 'VENDEDORES') {
      listaFiltrada = this.empleados.filter((e) => e.cargo === 'VENDEDOR');
    } else if (this.vistaActual === 'TECNICOS') {
      listaFiltrada = this.empleados.filter((e) => e.cargo === 'TECNICO');
    }

    const term = this.filtro.toLowerCase().trim();
    if (term) {
      listaFiltrada = listaFiltrada.filter(
        (e) =>
          e.nombre.toLowerCase().includes(term) ||
          e.apellido.toLowerCase().includes(term) ||
          e.dni.includes(term)
      );
    }
    return listaFiltrada;
  }

  cambiarVista(vista: 'TODOS' | 'VENDEDORES' | 'TECNICOS') {
    this.vistaActual = vista;
    this.filtro = '';

    if (vista === 'VENDEDORES') {
      this.empleadosService.listarVendedores().subscribe({
        next: (data) => (this.empleados = data),
        error: () => this.showMessageModal('Error al listar vendedores.'),
      });
    } else if (vista === 'TECNICOS') {
      this.empleadosService.listarTecnicos().subscribe({
        next: (data) => (this.empleados = data),
        error: () => this.showMessageModal('Error al listar técnicos.'),
      });
    } else {
      this.cargarEmpleados();
    }
  }

  registrarEmpleado(tipo: FormularioTipo) {
    this.formTipo = tipo;
    this.empleadoForm.reset({
      fecha_contratacion: this.getTodayDate(),
      concesionario_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      salario: tipo === 'GENERAL' ? 0 : null,
    });

    this.modalTitle =
      tipo === 'VENDEDOR'
        ? 'Registrar Vendedor'
        : tipo === 'TECNICO'
        ? 'Registrar Técnico'
        : 'Registrar Empleado General';

    this.showModal('empleadoModal');
  }

  guardarEmpleado() {
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      return;
    }

    const formValue = this.empleadoForm.value;
    const nuevoEmpleado: Empleado = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      dni: formValue.dni,
      correo: formValue.correo,
      telefono: formValue.telefono,
    };

    this.empleadosService.crearEmpleado(nuevoEmpleado).subscribe({
      next: (empleadoCreado) => {
        console.log('Empleado creado:', empleadoCreado);

        if (this.formTipo === 'VENDEDOR') {
          const vendedor: Vendedor = { empleado_id: empleadoCreado.id! };
          this.empleadosService.registrarVendedor(vendedor).subscribe();
        } else if (this.formTipo === 'TECNICO') {
          const tecnico: Tecnico = { empleado_id: empleadoCreado.id! };
          this.empleadosService.registrarTecnico(tecnico).subscribe();
        }

        this.showMessageModal('Empleado registrado exitosamente.');
        this.cargarEmpleados();
        this.hideModal('empleadoModal');
      },
      error: (err) => {
        console.error('Error al registrar empleado:', err);
        this.showMessageModal('Error al registrar el empleado.');
      },
    });
  }

  editarEmpleado(id: string) {
    this.empleadosService.obtenerEmpleadoPorId(id).subscribe({
      next: (empleado) => {
        this.empleadoForm.patchValue(empleado);
        this.showMessageModal(`Editando empleado con ID: ${id}`);
        this.showModal('empleadoModal');
      },
      error: () => this.showMessageModal('Error al cargar datos del empleado.'),
    });
  }

  eliminarEmpleado(id: string) {
    if (confirm('¿Seguro que deseas eliminar este empleado?')) {
      this.empleadosService.eliminarEmpleado(id).subscribe({
        next: () => {
          this.showMessageModal(`Empleado con ID ${id} eliminado.`);
          this.cargarEmpleados();
        },
        error: () => this.showMessageModal('Error al eliminar el empleado.'),
      });
    }
  }

  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private showModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(
        modalElement
      )?.show();
    }
  }

  private hideModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(
        modalElement
      )?.hide();
    }
  }

  private showMessageModal(message: string): void {
    this.messageModalText = message;
    console.log(`[Message Modal] ${message}`);
  }
}
