import { Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { RoleComponent } from "./role/role.component";
import { AddRoleComponent } from "./addrole/addrole.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { AddpermissionComponent } from "./addpermission/addpermission.component";

export const UsersRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "users",
        component: UsersComponent
      },
      {
        path: "roles",
        component: RoleComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: "change-password",
        component: ChangePasswordComponent
      },
      {
        path: "addrole",
        component: AddRoleComponent
      }
      ,
      {
        path: "addpermission",
        component: AddpermissionComponent
      }
    ]
  }
];
