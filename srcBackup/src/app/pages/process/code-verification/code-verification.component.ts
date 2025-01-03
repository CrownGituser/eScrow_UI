import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { LoadingService } from './../../../Services/loading.service'
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
  selector: 'app-code-verification',
  templateUrl: './code-verification.component.html',
  styleUrls: ['./code-verification.component.scss']
})
export class CodeVerificationComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  modalRef: BsModalRef;
  UserList: any;
  _UserL: any;
  _FilteredList: any;
  _FilteredListFolder: any;
  _RoleList: any;
  checkingActivation = false
  _UsertypeList: any;
  AddUserForm: FormGroup;
  AddpasswordReset: FormGroup;
  submitted = false;
  Reset = false;
  _SingleUser: any = [];
  User: any;
  first = 0;
  rows = 10;
  firstFolder = 0;
  rowsFolder = 10;
  initilizerLoaderOn: any
  projectName: any
  projectInfo: any
  events: any

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.AddUserForm = this.formBuilder.group(
      {
        id: [""],
        comment: ["", Validators.required],
        User_Token: localStorage.getItem("User_Token"),
        project_id: [""],
        CodePull_by: localStorage.getItem("UserID"),
        Status: [""]
      }
    );


    this.Getpagerights();
    this.GetProjectList();
    this.getUserType();
    this.User = "Add User";
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
      { field: "CodeLastPullAt", header: "LATEST PULL DATE", index: 5 },
      { field: "VerificationLevel", header: "VERIFICATION LEVEL", index: 8 },

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
        CodeLastPullAt: el.CodeLastPullAt
      });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  paginateFolder(e) {
    this.firstFolder = e.first;
    this.rowsFolder = e.rows;
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

  onDownloadExcelFile(_filename: string) {
    this.exportToExcel(this.formattedData, _filename);
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

  OnClose() {
    this.modalService.hide(1);
  }

  OnReset() {
    this.Reset = true;
    this.AddUserForm.reset();
    this.User = "Add User";
  }

  getUserType() {
    const apiUrl = this._global.baseAPIUrl + 'Department/GetList?user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UsertypeList = data;
      this.AddUserForm.controls['usetType'].setValue(0);
    });
  }

  modal1: any

  onSubmit(AddUserForm: any) {
    this.submitted = true;
    this.AddUserForm.value.UserID = this.AddUserForm.value.userid;
    if (this.AddUserForm.valid) {
      console.log("Form Submitted:", this.AddUserForm.value);
      // Handle your form submission logic here
    } else {
      console.log("Form is invalid");
      this.AddUserForm.markAllAsTouched(); // Marks all fields as touched to trigger validation messages
    }
    if (this.AddUserForm.value.User_Token == null) {
      this.AddUserForm.value.User_Token = localStorage.getItem("User_Token");
    }

    this.AddUserForm.patchValue({
      project_id: this.projectInfo.PID,
      comment: AddUserForm.value.comment,
      Status: ""
    })
    const apiUrl = this._global.baseAPIUrl + "Git/SubmitGitClone";
    this._onlineExamService
      .postData(this.AddUserForm.value, apiUrl)
      .subscribe((data) => {

        this.ShowMessage("Record Updated Successfully..");
        this.modalService.hide(1);
        this.OnReset();
        console.log("this is the called")
        this.modal1 = "modal"
      });
  }

  Getpagerights() {
    var pagename = "Add User";
    const apiUrl =
      this._global.baseAPIUrl + "Admin/Getpagerights?userid=" + localStorage.getItem("UserID") + " &pagename=" + pagename + "&user_Token=" + localStorage.getItem("User_Token");
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
      if (data <= 0) {
        localStorage.clear();
        this.router.navigate(["/Login"]);
      }
    });
  }

  geRoleList() {
    const userToken =
      this.AddUserForm.get("User_Token").value ||
      localStorage.getItem("User_Token");
    const apiUrl = this._global.baseAPIUrl + "Role/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
    });
    this.AddUserForm.controls['roleName'].setValue(0);
  }

  get f() {
    return this.AddUserForm.controls;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
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

  showSuccessmessage(data: any) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: data,
    });
  }

  pullGitCode() {
    localStorage.setItem('loadingOff', 'false')
    this.initilizerLoaderOn = true
    const apiUrl = this._global.baseAPIUrl + "Git/GitCloneRequest?User_Token=" + localStorage.getItem("User_Token");;

    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.UserList = data;
      this._UserL = data;
      this.initilizerLoaderOn = false
      localStorage.setItem('loadingOff', '')
    });
  }

  GetProjectList() {
    this.formattedData = [];
    this.headerList = [];
    const apiUrl = this._global.baseAPIUrl + "Master/GetProjectList?user_Token=" + localStorage.getItem("User_Token");
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
      this.prepareTableData(this._RoleList, this._FilteredList);
    });
  }


  ViewRepo(projectdetails: any) {
    this.projectInfo = projectdetails
    this.projectName = projectdetails.ProjectName
    console.log(" this.projectName", this.projectInfo)
    localStorage.setItem('loadingOff', 'false')
    const apiUrl = this._global.baseAPIUrl + "Git/GetAuditLogByProjectID?User_Token=" + localStorage.getItem("User_Token") + "&project_id=" + projectdetails.PID

    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.UserList = data;
      this.events = data;
      console.log("data", data)

      localStorage.setItem('loadingOff', '')


    });

  }

  ProjectDetails(row: any) {
    this.router.navigateByUrl("/process/project-dashboard-screen");
  }

  uploadNavigation() {
    this.router.navigate(["/upload/file-upload"]);
  }
}
