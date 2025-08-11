import { Routes } from '@angular/router';
import { HomeComponent } from '../view/home/home';
import { CartComponent } from '../view/cart/cart';
import { RoleGuard } from '../middleware/check-role';
import { ProfileComponent } from '../view/profile/profile.component';

export const viewRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { 
    path: 'cart', 
    component: CartComponent, 
    canActivate: [RoleGuard], 
    data: { role: ['Administrator', 'Customer'] } 
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [RoleGuard],
    data: { role: ['Administrator', 'Customer'] }
  }
];
