import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';

import { ToastModule } from 'primeng/toast';
import { RouterModule } from "@angular/router";
import { DepartmentRoutes } from "./process.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { FileTaggingComponent } from './file-tagging/file-tagging.component';
import { EditIndexingComponent } from './EditIndexing/EditIndexing.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CheckerComponent } from './checker/checker.component';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { CodeVerificationComponent } from "./code-verification/code-verification.component";
//import { DataviewComponent } from './dataview/dataview.component';
import { TimelineModule } from 'primeng/timeline';
import { TabViewModule } from 'primeng/tabview';
import { ProjectDashboardScreenComponent } from "./project-dashboard-screen/project-dashboard-screen.component";
import { ChartModule } from 'primeng/chart';
import { CodeBrowseComponent } from "./code-browse/code-browse.component";
import {TreeModule} from 'primeng/tree';
import { PullCodeComponent } from "./pull-code/pull-code.component";
import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [DataEntryComponent,FileTaggingComponent,EditIndexingComponent,CheckerComponent,FileTaggingComponent,CodeVerificationComponent, ProjectDashboardScreenComponent, CodeBrowseComponent, PullCodeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPrintModule,
    CheckboxModule,
    TableModule,
    NgxExtendedPdfViewerModule,
    ToastModule,
    TimelineModule,
    TabViewModule,
    ChartModule,
    TreeModule,
    CardModule
  ]
})
export class ProcessModule {}
