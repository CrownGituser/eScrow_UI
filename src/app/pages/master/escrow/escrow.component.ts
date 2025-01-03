import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import swal from "sweetalert2";
import * as XLSX from "xlsx";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-escrow",
  templateUrl: "./escrow.component.html",
  styleUrls: ["./escrow.component.scss"],
})
export class EscrowComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  UserList: any;
  _UserList: any;
  _UserL: any;
  _FilteredList: any;
  _FilteredListFolder: any;
  _RoleList: any;
  AddProjectDetailsForm: FormGroup;
  AddProjectForm: FormGroup;
  _EntityList: any;
  submitted = false;
  Reset = false;
  forusercheking = false;
  showAlert = false;
  sMsg: string = "";
  _SingleUser: any = [];
  _UserID: any;
  User: any;
  first = 0;
  rows = 10;
  firstFolder = 0;
  rowsFolder = 10;
  records: any;
  _ColNameList: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }
  ngOnInit() {
    this.AddProjectForm = this.formBuilder.group(
      {
        PID: [""],
        ProjectName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z\-\s]+$/),],],
        UserIDS: [""],
        UserID: [""],
        StartDate: ["", Validators.required],
        EndDate: ["", Validators.required],
        User_Token: localStorage.getItem("User_Token"),
        user_Token: localStorage.getItem("User_Token"),
        CreatedBy: localStorage.getItem("UserID"),
        BeneficiaryID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
        DepositorID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
        UploadTypeID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
        VerificationID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
      }
    );
    this.AddProjectDetailsForm = this.formBuilder.group(
      {
        PID: [""],
        ProjectName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z\-\s]+$/),],],
        UserIDS: [""],
        UserID: [""],
        StartDate: [""],
        DepositorName:[""],
        BeneficiaryName:[""],
        CodeLastPullAt:[""],
        CodeInitialPull:[""],
        BeneficiaryNo:[""],
        DepositorNo:[""],
        ManualLatestDate:[""],
        EndDate: ["", Validators.required],
        User_Token: localStorage.getItem("User_Token"),
        user_Token: localStorage.getItem("User_Token"),
        CreatedBy: localStorage.getItem("UserID"),

      }
    );

    this.Getpagerights();
    this.getRoleList();
    this.GetProjectList();
    this.User = "escrow";
  }

  Getpagerights() {
    var pagename = "escrow";
    const apiUrl = this._global.baseAPIUrl + "Admin/Getpagerights?userid=" + localStorage.getItem("UserID") + " &pagename=" + pagename + "&user_Token=" + localStorage.getItem("User_Token");
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
      if (data <= 0) {
        localStorage.clear();
        this.router.navigate(["/Login"]);
      }
    });
  }

  get f() {
    return this.AddProjectForm.controls;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  getRoleList() {
    const userToken =
      this.AddProjectForm.get("User_Token").value ||
      localStorage.getItem("User_Token");
    const apiUrl =
      this._global.baseAPIUrl + "Role/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
    });
  }

  GetProjectList() {
    this.formattedData = [];
    this.headerList = [];
    const apiUrl = this._global.baseAPIUrl + "Master/GetProjectList?user_Token=" + this.AddProjectForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
      this.prepareTableData(this._RoleList, this._FilteredList);
    });
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  paginateFolder(e) {
    this.firstFolder = e.first;
    this.rowsFolder = e.rows;
  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: "srNo", header: "SR NO", index: 1 },
      { field: "ProjectName", header: "PROJECT NAME", index: 2 },
      { field: "DepositorName", header: "DEPOSTIOR  NAME", index: 3 },
      { field: "BeneficiaryName", header: "BENEFICIARY NAME", index: 4 },
      { field: "UploadType", header: "DEPOSIT METHOD", index: 5 },
      { field: "StartDate", header: "START DATE", index: 6},
      { field: "EndDate", header: "END DATE", index: 7 },
      { field: "VerificationLevel", header: "VERIFICATION LEVEL", index: 8 },
      { field: "SizeAllocation", header: "ALLOCATED SIZE", index: 8 },
      { field: "CreatedBy", header: "CREATED BY", index: 10 },
      { field: "CreatedAt", header: "CREATED DATE", index: 11 },
      // { field: "Config_Status", header: "CONFIGURATION STATUS", index: 9 },
    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        srNo: parseInt(index + 1),
        PID: el.PID,
        ProjectName: el.ProjectName,
        DepositorName: el.DepositorName,
        BeneficiaryName: el.BeneficiaryName,
        UploadType: el.UploadType,
        StartDate: el.StartDate,
        EndDate: el.EndDate,
        VerificationLevel: el.VerificationLevel,
        CreatedBy: el.CreatedBy,
        CreatedAt: el.CreatedAt,
        DepositorID: el.DepositorID,
        BeneficiaryID: el.BeneficiaryID,
        UploadTypeID: el.UploadTypeID,
        VerificationID: el.VerificationID,
        Config_Type: el.Config_Type,
        Config_Status: el.Config_Status,
        Config_TypeId: el.Config_TypeId,
        SizeAllocation: el.SizeAllocation,
      });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  searchTable($event) {
    let val = $event.target.value;
    if (val == "") {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(",");
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach((el) => {
            if (
              d[key] &&
              el !== "" &&
              (d[key] + "").toLowerCase().indexOf(el.toLowerCase()) !== -1
            ) {
              if (filteredArr.filter((el) => el.srNo === d.srNo).length === 0) {
                filteredArr.push(d);
              }
            }
          });
        }
      });
      this.formattedData = filteredArr;
    }
  }

  OnReset() {
    this.Reset = true;
    this.AddProjectForm.reset(); 
    this.User = "escrow";
  }

  onClose(){
    this.modalService.hide(1)
  }

  userMappingForProject(MappingL) {
    localStorage.setItem('_PID', MappingL.PID);
    localStorage.setItem('_ProjectName', MappingL.ProjectName);
    localStorage.setItem('_DepositorID', MappingL.DepositorID);
    localStorage.setItem('_BeneficiaryID', MappingL.BeneficiaryID);
    localStorage.setItem('_SizeAllocation', MappingL.SizeAllocation);
    localStorage.setItem('_UploadTypeID', MappingL.UploadTypeID);
    localStorage.setItem('_StartDate', MappingL.StartDate);
    localStorage.setItem('_EndDate', MappingL.EndDate);
    localStorage.setItem('_VerificationID', MappingL.VerificationID);
    this.GetProjectList();
    this.router.navigateByUrl("/master/project-mapping");
  }

  createProject() {
    this.router.navigateByUrl("/master/create-project");
  }

  onEditProject(ProjectL: any) {
    localStorage.setItem('_PID', ProjectL.PID);
    localStorage.setItem('_ProjectName', ProjectL.ProjectName);
    localStorage.setItem('_DepositorID', ProjectL.DepositorID);
    localStorage.setItem('_BeneficiaryID', ProjectL.BeneficiaryID);
    localStorage.setItem('_SizeAllocation', ProjectL.SizeAllocation);
    localStorage.setItem('_UploadTypeID', ProjectL.UploadTypeID);
    localStorage.setItem('_StartDate', ProjectL.StartDate);
    localStorage.setItem('_EndDate', ProjectL.EndDate);
    localStorage.setItem('_VerificationID', ProjectL.VerificationID);
    this.GetProjectList();
    this.router.navigateByUrl("/master/create-project");
  }

  projectConfiguration(row: any){
    debugger;
    if(row.Config_Status === "Configuration Pending" && row.UploadType === "API"){
      localStorage.setItem('_PID', row.PID);
      localStorage.setItem('_ProjectName', row.ProjectName);
      this.router.navigateByUrl("/master/configuration");
    }
    else if(row.UploadType === "SFTP"){ //row.Config_Status === "Activation Pending" && 
      localStorage.setItem('_PID', row.PID);
      localStorage.setItem('_ProjectName', row.ProjectName);
      localStorage.setItem('_Config_TypeId', row.Config_TypeId);
      this.router.navigateByUrl("/master/sftp-selection")
    }
    else if(row.UploadType === "GIT"){ //row.Config_Status === "Activation Completed" && 
      localStorage.setItem('_PID', row.PID);
      localStorage.setItem('_ProjectName', row.ProjectName);
      localStorage.setItem('_Config_TypeId', row.Config_TypeId);
      this.router.navigateByUrl("/master/git-selection")
    }
  }

  ProjectDetails(template: TemplateRef<any>, row: any) {
   this.GetProjectDetailsByProjectId(template, row);
   this.GetProjectMappingList(row);
  }

  GetProjectDetailsByProjectId(template: TemplateRef<any>, row: any) {
    debugger
    this.modalRef = this.modalService.show(template);
    const apiUrl = this._global.baseAPIUrl + "Master/GetProjectDetailsByProjectId?user_Token=" + this.AddProjectDetailsForm.get('User_Token').value + "&PID=" + row.PID
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
      this.AddProjectDetailsForm.patchValue({
        PID:data[0].PID,
        ProjectName: data[0].ProjectName,
        BeneficiaryName:data[0].BeneficiaryName,
        DepositorName: data[0].DepositorName,
        StartDate:data[0].StartDate,
        EndDate:data[0].EndDate,
        BeneficiaryNo:data[0].BeneficiaryNo,
        DepositorNo:data[0].DepositorNo,
        CodeInitialPull:data[0].CodeInitialPull,
        CodeLastPullAt:data[0].CodeLastPullAt,
        ManualLatestDate:data[0].ManualLatestDate
      })
    });
  }

  GetProjectMappingList(row: any) {
    debugger
    this.formattedDataForProjectDetails = [];
    this.headerListForProjectDetails = [];
    const apiUrl = this._global.baseAPIUrl + "Master/GetProjectMappingList?PID=" + row.PID + "&user_Token=" + this.AddProjectDetailsForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
      this.prepareTableDataForProjectDetails(this._RoleList, this._FilteredList);
    });
  }

  formattedDataForProjectDetails: any = [];
  headerListForProjectDetails: any;
  immutableFormattedDataForProjectDetails: any;
  prepareTableDataForProjectDetails(tableData, headerList) {
    let formattedDataForProjectDetails = [];
    let tableHeader: any = [
      { field: "srNo", header: "SR NO", index: 1 },
      { field: "ProjectName", header: "PROJECT NAME", index: 3 },
      { field: "Username", header: "USER NAME", index: 2 },
      { field: "Permission", header: "PERMISSION", index: 3 },
      { field: "MappedBy", header: "MAPPED BY", index: 3 },
      { field: "MappedDate", header: "MAPPED DATE", index: 3 },
    ];

    tableData.forEach((el, index) => {
      formattedDataForProjectDetails.push({
        srNo: parseInt(index + 1),
        ProjectName: el.ProjectName,
        UserID: el.UserID,
        Username: el.Username,
        PermissionID: el.PermissionID,
        Permission: el.Permission,
        MappedBy: el.MappedBy,
        MappedDate: el.MappedDate,
      });
    });
    this.headerListForProjectDetails = tableHeader;
    this.immutableFormattedDataForProjectDetails = JSON.parse(JSON.stringify(formattedDataForProjectDetails));
    this.formattedDataForProjectDetails = formattedDataForProjectDetails;
    this.loading = false;
  }

  ShowErrormessage(data: any) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: data,
    });
  }

  ShowMessage(data: any) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: data,
    });
  }

  onDownloadExcelFile(_filename: string) {
    if (_filename === "Project List") {
      this.exportToExcel(this.formattedData, _filename);
    } else {
      this.exportToExcel(this.formattedData, "Project List");
    }

  }

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "csv",
      type: "array",
    });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: "application/vnd.ms-excel" });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement("a");
    a.href = url;
    a.download = fileName + ".csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  _HeaderList: any;

  showSuccessmessage(data: any) { this.messageService.add({ severity: "success", summary: "Success", detail: data, }); }

  showmessage(data: any) { this.messageService.add({ severity: "success", summary: "Success", detail: data, }) }
}
