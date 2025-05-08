import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { ClienteComponent } from 'app/Clientes/cliente-listar/cliente.component';
import { MovimentoComponent } from 'app/Movimentos/movimento.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: HomeComponent },
    { path: 'cliente',        component: ClienteComponent },
    { path: 'movimento',        component: MovimentoComponent },
];
