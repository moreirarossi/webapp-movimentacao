import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { MovimentoComponent } from 'app/Movimentos/movimento.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: HomeComponent },
    { path: 'movimento',        component: MovimentoComponent },
];
