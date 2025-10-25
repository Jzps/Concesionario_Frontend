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

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  cargo: 'VENDEDOR' | 'TECNICO' | 'ADMINISTRATIVO';
  correo: string;
  telefono: string;
  salario: number;
  fecha_contratacion: string;
  concesionario_id: string;
}

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

  todosLosEmpleados: Empleado[] = [
    {
      id: 'E1',
      nombre: 'Sofía',
      apellido: 'Rojas',
      dni: '9876543210',
      cargo: 'TECNICO',
      correo: 'sofia@corp.com',
      telefono: '3101234567',
      salario: 2500000,
      fecha_contratacion: '2022-08-15',
      concesionario_id: 'C1',
    },
    {
      id: 'E2',
      nombre: 'Ricardo',
      apellido: 'Méndez',
      dni: '1234567890',
      cargo: 'VENDEDOR',
      correo: 'ricardo@corp.com',
      telefono: '3129876543',
      salario: 1800000,
      fecha_contratacion: '2023-01-20',
      concesionario_id: 'C1',
    },
    {
      id: 'E3',
      nombre: 'Marta',
      apellido: 'Perez',
      dni: '1112223334',
      cargo: 'ADMINISTRATIVO',
      correo: 'marta@corp.com',
      telefono: '3151112223',
      salario: 2000000,
      fecha_contratacion: '2021-05-10',
      concesionario_id: 'C1',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],

      dni: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      fecha_contratacion: [
        this.getTodayDate(),
        [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],
      ],

      salario: [
        null as number | null,
        [Validators.required, Validators.min(100000)],
      ],

      concesionario_id: [
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        [Validators.required],
      ],
    });
  }

  private getNextId(): string {
    const maxIdNumber = this.todosLosEmpleados.reduce((max, empleado) => {
      const idNumber = parseInt(empleado.id.replace(/[A-Z]/g, ''), 10);
      return isNaN(idNumber) ? max : Math.max(max, idNumber);
    }, 0);
    return 'E' + (maxIdNumber + 1);
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get empleadosMostrados(): Empleado[] {
    let listaFiltrada = this.todosLosEmpleados;

    if (this.vistaActual === 'VENDEDORES') {
      listaFiltrada = this.todosLosEmpleados.filter(
        (e) => e.cargo === 'VENDEDOR'
      );
    } else if (this.vistaActual === 'TECNICOS') {
      listaFiltrada = this.todosLosEmpleados.filter(
        (e) => e.cargo === 'TECNICO'
      );
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
  }

  registrarEmpleado(tipo: FormularioTipo) {
    this.formTipo = tipo;
    this.empleadoForm.reset({
      fecha_contratacion: this.getTodayDate(),
      concesionario_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      salario: tipo === 'GENERAL' ? 0 : null,
    });

    const salarioControl = this.empleadoForm.get('salario');
    if (tipo !== 'GENERAL') {
      salarioControl?.setValidators([
        Validators.required,
        Validators.min(100000),
      ]);
      this.modalTitle = `Registrar ${
        tipo === 'VENDEDOR' ? 'Vendedor' : 'Técnico'
      }`;
    } else {
      salarioControl?.setValidators([Validators.min(0)]);
      this.modalTitle = 'Registrar Empleado General';
    }
    salarioControl?.updateValueAndValidity();

    this.showModal('empleadoModal');
  }

  guardarEmpleado() {
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      return;
    }

    const formValue = this.empleadoForm.value;

    let cargoAsignado: Empleado['cargo'];
    if (this.formTipo === 'VENDEDOR') {
      cargoAsignado = 'VENDEDOR';
    } else if (this.formTipo === 'TECNICO') {
      cargoAsignado = 'TECNICO';
    } else {
      cargoAsignado = 'ADMINISTRATIVO';
    }

    const nuevoEmpleado: Empleado = {
      id: this.getNextId(),
      ...formValue,
      cargo: cargoAsignado,

      salario:
        this.formTipo === 'GENERAL'
          ? formValue.salario || 0
          : formValue.salario,
    };

    this.todosLosEmpleados.push(nuevoEmpleado);
    this.empleadoForm.reset();
    this.hideModal('empleadoModal');
    alert(
      `Empleado (${cargoAsignado}) creado exitosamente con ID ${nuevoEmpleado.id}.`
    );
  }

  editarEmpleado(id: string) {
    alert(`Función de edición pendiente para el empleado con ID: ${id}`);
  }

  eliminarEmpleado(id: string) {
    const confirmar = confirm('¿Seguro que deseas eliminar este empleado?');
    if (confirmar) {
      this.todosLosEmpleados = this.todosLosEmpleados.filter(
        (e) => e.id !== id
      );
      alert(`Empleado con ID ${id} eliminado.`);
    }
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
}
