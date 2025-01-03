import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
// import { BsDropdownModule } from "ngx-bootstrap";
import { BsDropdownModule, BsDatepickerModule, TimepickerModule  } from "ngx-bootstrap";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import { DepartmentComponent } from "./department/department.component";
import { BranchMappingComponent } from "./branch-mapping/branch-mapping.component";
import { RouterModule } from "@angular/router";''
import { DepartmentRoutes } from "./master.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BranchComponent } from "./branch/branch.component";
import { DocumentTypeComponent } from "./document-type/document-type.component";
import { TemplateComponent } from "./template/template.component";
import { DocTypeMappingComponent } from "./doctype-mapping/doctype-mapping.component";
import { ViewCustomFormComponent } from "./view-customform/view-customform.component";
import { AddFieldComponent } from "./addfield/addfield.component";
import { TemplateMappingComponent } from "./template-mapping/template-mapping.component";
import { TemplateconfigComponent } from "./templateconfig/templateconfig.component"; //   ./templateconfig/templateconfig.component";
import { RegionMappingComponent } from "./region-mapping/region-mapping.component";
import { EntityComponent } from "./entity/entity.component";
import { EntityMappingComponent } from "./entity-mapping/entity-mapping.component";
import { DSConfigComponent } from "./DSConfig/DSConfig.component";
import { TableModule } from 'primeng/table';
import { NotificationComponent } from "./notification/notification.component";
import { ClientMasterComponent } from './client-master/client-master.component';
import { ToastModule } from 'primeng/toast';
import { EscrowComponent } from './escrow/escrow.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { TabViewModule } from 'primeng/tabview';
import { OrganizationComponent } from "./organization/organization.component";
import { ProjectMappingComponent } from './project-mapping/project-mapping.component';
import { ConfigurationComponent } from "./configuration/configuration.component";
import { GitSelectionComponent } from "./git-selection/git-selection.component";
import { GitLabSelectionComponent } from "./git-lab-selection/git-lab-selection.component";
import { SFTPSelectionComponent } from "./sftp-selection/sftp-selection.component";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
  declarations: [NotificationComponent , DepartmentComponent,DSConfigComponent,BranchMappingComponent,BranchComponent,EntityComponent,EntityMappingComponent,TemplateComponent,DocumentTypeComponent,DocTypeMappingComponent,ViewCustomFormComponent,AddFieldComponent,TemplateMappingComponent,TemplateconfigComponent,RegionMappingComponent, ClientMasterComponent, EscrowComponent, CreateProjectComponent, OrganizationComponent, ProjectMappingComponent, ConfigurationComponent, GitSelectionComponent, GitLabSelectionComponent, SFTPSelectionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule,
    TableModule,
    ToastModule,
    TabViewModule,
    NgxMaterialTimepickerModule
  ]
})
export class MasterModule {}