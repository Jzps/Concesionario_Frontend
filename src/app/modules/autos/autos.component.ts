import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface Auto {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  vin: string;
  anio: number;
  color: string;
  estado: 'DISPONIBLE' | 'VENDIDO'; 
}



@Component({
  selector: 'app-autos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autos.component.html',
  styleUrls: ['./autos.component.scss'] 
})
export class AutosComponent {
  filtro = '';
 
  mostrandoVendidos: boolean = false; 

  
  todosLosAutos: Auto[] = [
    { id: 'A1', marca: 'Toyota', modelo: 'Corolla', placa: 'XYZ123', vin: '1A987B654C321D', anio: 2020, color: 'Gris', estado: 'DISPONIBLE' },
    { id: 'A2', marca: 'Nissan', modelo: 'Versa', placa: 'ABC456', vin: '2B123C456D789E', anio: 2022, color: 'Blanco', estado: 'DISPONIBLE' },
    { id: 'A3', marca: 'Mazda', modelo: '3', placa: 'DEF789', vin: '3C456D789E123F', anio: 2021, color: 'Rojo', estado: 'VENDIDO' }, // Auto vendido
  ];

 
  get autosMostrados(): Auto[] {
    if (this.mostrandoVendidos) {
      
      return this.todosLosAutos.filter(a => a.estado === 'VENDIDO');
    }
    
    return this.todosLosAutos.filter(a => a.estado === 'DISPONIBLE');
  }

  

  buscar() { 
    console.log('Buscando auto por VIN o Placa:', this.filtro);
  }

  comprarAuto() { 
    alert('Función Comprar Auto (POST)');
  }

  editarAuto(id: string) { 
    alert(`Editar auto con ID: ${id}`);
  }

  eliminarAuto(id: string) { 
    const confirmar = confirm('¿Seguro que deseas eliminar este auto?');
    if (confirmar) {
        this.todosLosAutos = this.todosLosAutos.filter(a => a.id !== id);
    }
  }

  venderAuto(id: string) { 
    const auto = this.todosLosAutos.find(a => a.id === id);
    if (auto) {
        auto.estado = 'VENDIDO';
        alert(`Auto con ID: ${id} marcado como VENDIDO.`);
    }
  }

  
  
  alternarVista() {
    this.mostrandoVendidos = !this.mostrandoVendidos;
    this.filtro = ''; 
    console.log(`Cambiando a vista: ${this.mostrandoVendidos ? 'Vendidos' : 'Disponibles'}`);
  }
}