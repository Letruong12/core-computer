import { Routes } from "@angular/router";
import { RoleGuard } from "../middleware/check-role";
import { CategoryComputerListComponent } from "../admin/category-computer/category-computer-list.component";
import { ComputerListComponenr } from "../admin/computer/computer-list";
import { UserComponent } from "../admin/user/user.component";


export const adminRoutes: Routes = [
  {
    path: 'category-list',
    component: CategoryComputerListComponent,
    canActivate: [RoleGuard],
    data: { role: ['Administrator'] }
  },
  {
    path: 'product-list',
    component: ComputerListComponenr,
    canActivate: [RoleGuard],
    data: { role: ['Administrator'] }
  },
  {
    path: 'user-list',
    component: UserComponent,
    canActivate: [RoleGuard],
    data: { role: ['Administrator'] }
  }
];
