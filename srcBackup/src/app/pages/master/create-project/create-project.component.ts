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
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  UserList: any;
  _UserList: any;
  _UserL: any;
  _BeneficiaryL: any;
  _DepositorL: any;
  _PermissionL: any;
  _UploadTypeL: any;
  _FilteredList: any;
  _FilteredListFolder: any;
  _RoleList: any;
  AddProjectForm: FormGroup;
  submitted = false;
  Reset = false;
  activationBtn = false;
  showAlert = false;
  isReadonly = false;
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
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

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
    const currentDate = new Date(); // Get current date
    const oneYearFromNow = new Date(currentDate); // Clone current date
    oneYearFromNow.setFullYear(currentDate.getFullYear() + 1); // Add 1 year

    this.AddProjectForm = this.formBuilder.group(
      {
        PID: [""],
        ProjectName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z\-\s]+$/),],],
        UserIDS: [""],
        UserID: [""],
        StartDate: [currentDate, Validators.required],
        EndDate: [oneYearFromNow, Validators.required],
        User_Token: localStorage.getItem("User_Token"),
        user_Token: localStorage.getItem("User_Token"),
        CreatedBy: localStorage.getItem("UserID"),
        BeneficiaryID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
        DepositorID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
        UploadTypeID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
        VerificationID: ["", [Validators.required, Validators.pattern(/^(?!0$)/)]],
        SizeAllocation: ["", [Validators.required]]
      }
    );

    let _PID = localStorage.getItem('_PID');

    if (Number(_PID) > 0) {
      this.getValues();
      this.User = "escrow";
    }
    else {
      this.AddProjectForm.controls["VerificationID"].setValue(0);
      this.AddProjectForm.controls["BeneficiaryID"].setValue(0);
      this.AddProjectForm.controls["DepositorID"].setValue(0);
      this.AddProjectForm.controls["UploadTypeID"].setValue(0);
    }

    this.GetUploadTypes();
    this.getOrganizationList();
    this.User = "escrow";
    this.Getpagerights();
    this.geRoleList();

  }

  getValues() {
    const storedEndDate = localStorage.getItem('_EndDate');
    const storedStartDate = localStorage.getItem('_StartDate');
    if (storedEndDate) {
      const [day, month, year] = storedEndDate.split('-').map(Number);
      const _EndDate = new Date(year, month - 1, day);
      this.AddProjectForm.controls['EndDate'].setValue(_EndDate);
    }
    if (storedStartDate) {
      const [day, month, year] = storedStartDate.split('-').map(Number);
      const _StartDate = new Date(year, month - 1, day);
      this.AddProjectForm.controls['StartDate'].setValue(_StartDate);
    }
    this.AddProjectForm.controls['PID'].setValue(localStorage.getItem('_PID'));
    this.AddProjectForm.controls['ProjectName'].setValue(localStorage.getItem('_ProjectName'));
    this.AddProjectForm.controls['BeneficiaryID'].setValue(localStorage.getItem('_BeneficiaryID'));
    this.AddProjectForm.controls['SizeAllocation'].setValue(localStorage.getItem('_SizeAllocation'));
    this.AddProjectForm.controls['DepositorID'].setValue(localStorage.getItem('_DepositorID'));
    this.AddProjectForm.controls['UploadTypeID'].setValue(localStorage.getItem('_UploadTypeID'));
    this.AddProjectForm.controls['VerificationID'].setValue(localStorage.getItem('_VerificationID'));
  }

  getOrganizationList() {
    const apiUrl = this._global.baseAPIUrl + "Master/GetOrganizationList?user_Token=" + this.AddProjectForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
      const Beneficiary = data.filter(item => item.OrganizationTypeID === "1");
      const Depositor = data.filter(item => item.OrganizationTypeID === "2");
      this._BeneficiaryL = Beneficiary;
      this._DepositorL = Depositor;
    });
  }

  GetUploadTypes() {
    const apiUrl = this._global.baseAPIUrl + "Master/GetUploadTypes?user_Token=" + this.AddProjectForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UploadTypeL = data;
    });
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

  onBack() {
    localStorage.removeItem('_PID');
    localStorage.removeItem('_ProjectName');
    localStorage.removeItem('_StartDate');
    localStorage.removeItem('_EndDate');
    localStorage.removeItem('_BeneficiaryID');
    localStorage.removeItem('_DepositorID');
    localStorage.removeItem('_UploadTypeID');
    localStorage.removeItem('_VerificationID');
    this.router.navigateByUrl('/master/escrow');
  }

  get f() {
    return this.AddProjectForm.controls;
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  geRoleList() {
    const userToken =
      this.AddProjectForm.get("User_Token").value ||
      localStorage.getItem("User_Token");
    const apiUrl =
      this._global.baseAPIUrl + "Role/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
    });
  }

  OnReset() {
    this.Reset = true;
    this.activationBtn = false;
    this.AddProjectForm.controls['ProjectName'].setValue("");
    this.AddProjectForm.controls['StartDate'].setValue("");
    this.AddProjectForm.controls['EndDate'].setValue("");
    this.AddProjectForm.controls['SizeAllocation'].setValue("");
    this.AddProjectForm.controls['BeneficiaryID'].setValue(0);
    this.AddProjectForm.controls['DepositorID'].setValue(0);
    this.AddProjectForm.controls['UploadTypeID'].setValue(0);
    this.AddProjectForm.controls['VerificationID'].setValue(0);
    this.User = "escrow";
  }

  onSubmit() {
    this.submitted = true;
    this.AddProjectForm.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'Master/AddEditProject';
    this._onlineExamService.postData(this.AddProjectForm.value, apiUrl)
      .subscribe(data => {
        if (data === "Project already exists with the Depositor and Beneficiary.") {
          this.ShowErrormessage(data);
        }
        else {
          this.ShowMessage(data);
        }
      });
    if (this.AddProjectForm.get("UploadTypeID").value === '2') {
      this.OnReset();
      this.onBack();
    }
    else {
      this.isReadonly = true;
      this.AddProjectForm.controls['BeneficiaryID'].disable();
      this.AddProjectForm.controls['DepositorID'].disable();
      this.AddProjectForm.controls['UploadTypeID'].disable();
      this.AddProjectForm.controls['VerificationID'].disable();
    }
  }

  enableActivationBtn(): void {
    const selectedValue = this.AddProjectForm.get("UploadTypeID").value
    if (selectedValue === '0' || selectedValue === '2') {
      this.activationBtn = false;
    }
    else {
      this.activationBtn = true;
    }
  }

  onButtonClick() {
    localStorage.setItem('_PID', this.AddProjectForm.get("PID").value);
    localStorage.setItem('_ProjectName', this.AddProjectForm.get("ProjectName").value);
    this.router.navigateByUrl('/master/configuration');
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
      severity: "success", summary: "Success", detail: data,
    });
  }

  showmessage(data: any) {
    this.messageService.add({
      severity: "success", summary: "Success", detail: data,
    });
  }
}
