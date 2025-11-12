import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  ContainerComponent,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarTogglerDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { NgScrollbar } from 'ngx-scrollbar';
import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
  ],
})
export class DefaultLayoutComponent {
  public navItems = [...navItems];
  isSidebarUnfoldable = false;

  toggleSidebar(): void {
    this.isSidebarUnfoldable = !this.isSidebarUnfoldable;
  }
}
