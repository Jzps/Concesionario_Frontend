import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from '@coreui/angular'; // Necesario para el menú desplegable (si usas CoreUI)

// Nueva Interfaz de Datos
interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  cargo: 'VENDEDOR' | 'TECNICO' | 'ADMINISTRATIVO'; // Tipos de empleado
  telefono: string;
  salario: number;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  // Asegúrate de importar DropdownModule si usas las clases de CoreUI para el menú
  imports: [CommonModule, FormsModule, CurrencyPipe, DropdownModule], 
  templateUrl: './empleados.component.html',
  // Reutilizamos el estilo de tabla/contenedor
  styleUrls: ['../clientes/clientes.component.scss'] 
})
export class EmpleadosComponent {
  filtro = '';
  // Opciones de vista: 'TODOS', 'VENDEDORES', 'TECNICOS'
  vistaActual: 'TODOS' | 'VENDEDORES' | 'TECNICOS' = 'TODOS'; 

  // Datos de prueba
  todosLosEmpleados: Empleado[] = [
    { id: 'E1', nombre: 'Sofía', apellido: 'Rojas', dni: '987654321', cargo: 'TECNICO', telefono: '3101234567', salario: 2500000 },
    { id: 'E2', nombre: 'Ricardo', apellido: 'Méndez', dni: '123456789', cargo: 'VENDEDOR', telefono: '3129876543', salario: 1800000 },
    { id: 'E3', nombre: 'Marta', apellido: 'Perez', dni: '111222333', cargo: 'ADMINISTRATIVO', telefono: '3151112223', salario: 2000000 },
  ];

  // Propiedad que la tabla usa para iterar
  get empleadosMostrados(): Empleado[] {
    // 1. Filtrar por vista actual (GET /empleados/vendedores, GET /empleados/tecnicos)
    let listaFiltrada = this.todosLosEmpleados;
    if (this.vistaActual === 'VENDEDORES') {
      listaFiltrada = this.todosLosEmpleados.filter(e => e.cargo === 'VENDEDOR');
    } else if (this.vistaActual === 'TECNICOS') {
      listaFiltrada = this.todosLosEmpleados.filter(e => e.cargo === 'TECNICO');
    }
    
    // 2. Aplicar filtro de búsqueda (si lo hubiera, implementando lógica real)
    if (this.filtro && this.vistaActual === 'TODOS') {
        // En un caso real, la búsqueda se haría en la API (GET /empleados/{empleado_id})
        return listaFiltrada.filter(e => 
          e.nombre.toLowerCase().includes(this.filtro.toLowerCase()) || 
          e.dni.includes(this.filtro)
        );
    }

    return listaFiltrada;
  }

  // --- Funciones Mapeadas a Métodos HTTP ---

  buscar() { // Mapea a GET /empleados/{empleado_id}
    console.log('Buscando empleado:', this.filtro);
  }

  // Mapea a POST /empleados, POST /vendedores, POST /tecnicos
  registrarEmpleado(tipo: 'GENERAL' | 'VENDEDOR' | 'TECNICO') { 
    alert(`Abriendo formulario para registrar ${tipo} (POST)`);
  }

  editarEmpleado(id: string) { // Mapea a PUT /empleados/{empleado_id}
    alert(`Editar empleado con ID: ${id} (PUT)`);
  }

  eliminarEmpleado(id: string) { // Mapea a DELETE /empleados/{empleado_id}
    const confirmar = confirm('¿Seguro que deseas eliminar este empleado?');
    if (confirmar) {
      this.todosLosEmpleados = this.todosLosEmpleados.filter(e => e.id !== id);
    }
  }

  // --- Función de Vista Alterna ---
  
  cambiarVista(vista: 'TODOS' | 'VENDEDORES' | 'TECNICOS') {
    this.vistaActual = vista;
    this.filtro = ''; // Limpiar filtro al cambiar de vista
    console.log(`Cambiando a vista: ${vista}`);
  }
}