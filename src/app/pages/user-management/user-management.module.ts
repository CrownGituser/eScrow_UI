import { OnlineExamServiceService } from "./../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
//import { TooltipModule,BsDatepickerModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsersComponent } from "./users/users.component";
import { RouterModule } from "@angular/router";
import { UsersRoutes } from "./user-management.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RoleComponent } from "./role/role.component";
import { AddRoleComponent } from "./addrole/addrole.component";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import {TabViewModule} from 'primeng/tabview';
import {TooltipModule} from 'primeng/tooltip';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { AddpermissionComponent } from './addpermission/addpermission.component';

@NgModule({
  declarations: [UsersComponent,RoleComponent,AddRoleComponent, ChangePasswordComponent, AddpermissionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule,
    ModalModule.forRoot(),
    NgxPrintModule,
    NgxCaptchaModule,
    TableModule ,
    ToastModule,
    TabViewModule,
    ToggleButtonModule
  ]
})
export class UserManagementModule {}
