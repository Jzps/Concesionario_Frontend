import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

// Importaciones CoreUI
import {
  ButtonModule,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownModule,
  DropdownToggleDirective,
  HeaderModule,
  HeaderTogglerDirective,
  NavModule,
  SidebarTogglerDirective,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-default-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None, // 🔹 Esto permite aplicar los estilos globalmente
  imports: [
    CommonModule,
    HeaderModule,
    ButtonModule,
    DropdownModule,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownHeaderDirective,
    DropdownDividerDirective,
    NavModule,
    SidebarTogglerDirective,
    HeaderTogglerDirective,
    ContainerComponent,
    IconDirective,
  ],
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
})
export class DefaultHeaderComponent {
  constructor(private router: Router) {}

  // Simulación de cierre de sesión
  logout(): void {
    console.log('Cierre de sesión...');
    this.router.navigate(['/login']);
  }
}
