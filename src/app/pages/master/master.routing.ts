import { Routes } from "@angular/router";
import { DepartmentComponent } from "./department/department.component";
import { BranchMappingComponent } from './branch-mapping/branch-mapping.component';
import { BranchComponent } from "./branch/branch.component";
import { TemplateComponent } from "./template/template.component";
import { DocumentTypeComponent } from "./document-type/document-type.component";
import { DocTypeMappingComponent } from "./doctype-mapping/doctype-mapping.component";
import { ViewCustomFormComponent } from "./view-customform/view-customform.component";
import { TemplateMappingComponent } from "./template-mapping/template-mapping.component";
import { AddFieldComponent } from "./addfield/addfield.component";
import { TemplateconfigComponent } from "./templateconfig/templateconfig.component"; 
import { RegionMappingComponent } from "./region-mapping/region-mapping.component";
import { EntityComponent } from "./entity/entity.component";
import { EntityMappingComponent } from "./entity-mapping/entity-mapping.component";
import { DSConfigComponent } from "./DSConfig/DSConfig.component";
import { NotificationComponent } from "./notification/notification.component";
import { ClientMasterComponent } from "./client-master/client-master.component";
import { EscrowComponent } from "./escrow/escrow.component";
import { CreateProjectComponent } from "./create-project/create-project.component";
import { OrganizationComponent } from "./organization/organization.component";
import { ProjectMappingComponent } from "./project-mapping/project-mapping.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { GitSelectionComponent } from "./git-selection/git-selection.component";
import { GitLabSelectionComponent } from "./git-lab-selection/git-lab-selection.component";
import { SFTPSelectionComponent } from "./sftp-selection/sftp-selection.component";
export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "cabinet",
        component: DepartmentComponent
      },
      {
        path: "folder-mapping",
        component: BranchMappingComponent
      },
      {
        path: "folder",
        component: BranchComponent
      },
      {
        path: "template",
        component: TemplateComponent
      },
      {
        path: "template-mapping",
        component: TemplateMappingComponent
      },
      {
        path: "document-type",
        component:  DocumentTypeComponent

      },
      {
        path: "document-type-mapping",
        component:  DocTypeMappingComponent
      },
      {
        path: "view-custom-form",
        component:  ViewCustomFormComponent
      },
      {
        path: "addfield",
        component:  AddFieldComponent
      },
      {
        path: "Notification",
        component:  NotificationComponent
      },
      {
        path: "cabinet-mapping",
        component: RegionMappingComponent
      },
      {
        path: "sub-folder",
        component: EntityComponent
      },   
      {
        path: "subfolder-mapping",
        component: EntityMappingComponent
      }
      ,   
      {
        path: "DSConfig",
        component: DSConfigComponent
      },
      {
        path: "client-master",
        component: ClientMasterComponent
      },
      {
        path: "escrow",
        component: EscrowComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: "create-project",
        component: CreateProjectComponent
      },
      {
        path: "organization",
        component: OrganizationComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: "project-mapping",
        component: ProjectMappingComponent
      },
      {
        path: "configuration",
        component: ConfigurationComponent
      },
      {
        path: "git-selection",
        component: GitSelectionComponent
      },
      {
        path: "git-lab-selection",
        component: GitLabSelectionComponent
      },
      {
        path: "sftp-selection",
        component: SFTPSelectionComponent
      }
    ]
  }
];
