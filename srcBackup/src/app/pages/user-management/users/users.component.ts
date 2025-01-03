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
  selector: "app-users",
  templateUrl: "users.component.html",
  styleUrls: ["users.component.css"],
})
export class UsersComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _CSVData: any;
  UserList: any;
  _UserList: any;
  _UserL: any;
  _FilteredList: any;
  _FilteredListFolder: any;
  _RoleList: any;
  _UsertypeList: any;
  AddUserForm: FormGroup;
  UploadCSVForm: FormGroup;
  AddpasswordReset: FormGroup;
  _EntityList: any;
  submitted = false;
  Reset = false;
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
  checked = true;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.AddUserForm = this.formBuilder.group(
      {
        id: [""],
        name: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z\-\s]+$/)],
        ],
        userid: ["", Validators.required],
        UserIDS: ["", Validators.required],
        UserID: ["", Validators.required],
        pwd: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
            ),
          ],
        ],
        confirmPass: ["", Validators.required],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ],
        ],
        mobile: ["", Validators.required],
        usetType: ["", Validators.required],
        roleName: ["", Validators.required],
        User_Token: localStorage.getItem("User_Token"),
        CreatedBy: localStorage.getItem("UserID"),
      },
      {
        validator: this.ConfirmedValidator("pwd", "confirmPass"),
      }
    );
    this.AddpasswordReset = this.formBuilder.group(
      {
        Users: ["", Validators.required],
        Rpwd: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
            ),
          ],
        ],
        RconfirmPass: ["", Validators.required],
        User_Token: localStorage.getItem("User_Token"),
        CreatedBy: localStorage.getItem("UserID"),
      },
      {
        validator: this.ConfirmedValidator("Rpwd", "RconfirmPass"),
      }
    );

    this.Getpagerights();
    this.geRoleList();
    this.geUserList();
    this.getUserType();
    this.User = "Add User";
  }

  geUserList() {
    const userToken =
      this.AddUserForm.get("User_Token").value || localStorage.getItem("User_Token");
    const apiUrl = this._global.baseAPIUrl + "Admin/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.UserList = data;
      this._UserL = data;
      this.AddUserForm.controls["UserID"].setValue(0);
      this.AddUserForm.controls["UserIDS"].setValue(0);
      this._FilteredList = data;
      this.prepareTableData(this.UserList, this._FilteredList);
    });
  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: "srNo", header: "SR NO", index: 1 },
      { field: "name", header: "NAME", index: 3 },
      { field: "userid", header: "USER ID", index: 2 },
      { field: "email", header: "EMAIL ID", index: 3 },
      { field: "mobile", header: "MOBILE", index: 3 },
      { field: "Organization", header: "ORGANIZATION", index: 3 },
      { field: "Role", header: "ROLE", index: 3 },
      { field: "creationDate", header: "CREATED DATE", index: 3 },
    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        srNo: parseInt(index + 1),
        id: el.id,
        name: el.name,
        userid: el.userid,
        email: el.email,
        mobile: el.mobile,
        Organization: el.Organization,
        Role: el.Role,
        creationDate: el.creationDate,
        ISACTIVE: el.ISACTIVE == "Y" ? "Active" : "In-Active",
        checked: el.ISACTIVE === "Y" ? false : true,
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

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  getUserType() {
    const apiUrl = this._global.baseAPIUrl + 'Department/GetList?user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UsertypeList = data;
      this.AddUserForm.controls['usetType'].setValue(0);
    });
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.AddUserForm.value.usetType <= 0) {
      this.ShowErrormessage("Select UserType");
      return;
    }

    if (this.AddUserForm.value.userid.trim() == "") {
      this.ShowErrormessage("Please enter user ID");
      return;
    }
    if (this.AddUserForm.value.name.trim() == "") {
      this.ShowErrormessage("Please enter user");
      return;
    }

    this.AddUserForm.value.UserID = this.AddUserForm.value.userid;

    if (this.AddUserForm.value.User_Token == null) {
      this.AddUserForm.value.User_Token = localStorage.getItem("User_Token");
    }
    
    if (this.AddUserForm.get("id").value) {
      const apiUrl = this._global.baseAPIUrl + "Admin/Update";
      this._onlineExamService
        .postData(this.AddUserForm.value, apiUrl)
        .subscribe((data) => {
          if (data != null) {
            this.ShowMessage("Record Updated Successfully..");
            this.modalService.hide(1);
            this.OnReset();
            this.geUserList();
          } else {
          }
        });
    } else {
      const apiUrl = this._global.baseAPIUrl + "Admin/Create";
      this._onlineExamService
        .postData(this.AddUserForm.value, apiUrl)
        .subscribe((data) => {
          if (data == 1) {
            this.ShowMessage("Record Saved Successfully..");
            this.OnReset();
            this.geUserList();
            this.modalService.hide(1);
          } else {
            this.ShowErrormessage("User already exists.");
          }
        });
    }
  }


  deleteEmployee(id: any) {
    var temp: any;
    if(id.ISACTIVE === "Active"){
      temp = "In-Active"
    }
    else{
      temp = "Active"
    }

    if (id.roleName == "Admin") {
      this.ShowErrormessage("You can not delete admin role account");
      return;
    }

    if (id != localStorage.getItem("UserID")) {
      swal
        .fire({
          title: "Are you sure?",
          text: "You want to " + temp + " the User ?",
          type: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonClass: "btn dangerbtn",
          confirmButtonText: "Yes " + temp + " it !",
          cancelButtonClass: "btn successbtn",
        })
        .then((result) => {
          if (result.value) {
            this.AddUserForm.patchValue({
              id: id.id,
              User_Token: localStorage.getItem("User_Token"),
            });

            const apiUrl = this._global.baseAPIUrl + "Admin/Delete";
            this._onlineExamService
              .postData(this.AddUserForm.value, apiUrl)
              .subscribe((data) => {
                swal.fire({
                  title: temp + "d !",
                  text: "User has been " + temp + "d !",
                  type: "success",
                  buttonsStyling: false,
                  confirmButtonClass: "btn successbtn",
                });
                this.geUserList();
              });
          }
        });
    } else {
      this.ShowErrormessage("Your already log in so you can not delete!");
    }
    
    this.geUserList();
  }

  Getpagerights() {
    var pagename = "Add User";
    const apiUrl =
      this._global.baseAPIUrl + "Admin/Getpagerights?userid=" + localStorage.getItem("UserID") + " &pagename=" + pagename +"&user_Token=" + localStorage.getItem("User_Token");
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
    const apiUrl =
      this._global.baseAPIUrl + "Role/GetList?user_Token=" + userToken;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
    });
    this.AddUserForm.controls['roleName'].setValue(0);
  }

  editEmployee(template: TemplateRef<any>, value: any) {
    this.User = "Edit User Details";
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetDetails?ID=" +
      value.id +
      "&user_Token=" +
      localStorage.getItem("User_Token");
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      var that = this;
      that._SingleUser = data;
      this.AddUserForm.patchValue({
        id: that._SingleUser.id,
        name: that._SingleUser.name,
        userid: that._SingleUser.userid,
        pwd: that._SingleUser.pwd,
        confirmPass: that._SingleUser.pwd,
        email: that._SingleUser.email,
        mobile: that._SingleUser.mobile,
        usetType: that._SingleUser.UsertypeID,
        roleName: that._SingleUser.sysRoleID
      });
    });
    this.modalRef = this.modalService.show(template);
  }

  addUser(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.AddUserForm.patchValue({
      name: "",
      userid: "",
      pwd: "",
      confirmPass: "",
      email: "",
      userType: 0,
      roleName: 0,
      mobile: "",
      Remarks: "",
      id: "",
    });
    this.User = "Add User";
  }
  geEntityListByUserID(userid: number) {
    this.AddpasswordReset.get("id").setValue(userid);
  }

  get f() {
    return this.AddUserForm.controls;
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

  closePopup() {

  }

  showSuccessmessage(data: any) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: data,
    });
  }

}
