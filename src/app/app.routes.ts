import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';

import { VentasComponent } from './component/ventas/ventas.component';
import { FacturasComponent } from './component/facturas/facturas.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'facturas', component: FacturasComponent },
]
