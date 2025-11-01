import { Routes } from '@angular/router';
import { Calendar } from './componentes/calendar/calendar';
import { LoginComponent } from './componentes/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Calendar
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
