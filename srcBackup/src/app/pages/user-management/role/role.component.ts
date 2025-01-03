import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { ToastrService } from "ngx-toastr";
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-role",
  templateUrl: "role.component.html",
  styleUrls: ["role.component.css"]
})
export class RoleComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _FilteredList: any;
  _RoleList: any;
  RoleForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _SingleUser: any = [];
  myFiles: string[] = [];
  first = 0;
  rows = 10;


  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastrService,
    private messageService: MessageService,
    private http: HttpClient,
    private httpService: HttpClient
  ) { }
  ngOnInit() {
    this.RoleForm = this.formBuilder.group({
      id: [0],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
    });

    this.getRoleList();
    this.geRoleList();
    this.getPermissionsList();

  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this._FilteredList = this._RoleList.filter(function (d) {
      for (var key in d) {
        if (key == "roleName" || key == "remarks") {
          if (d[key].toLowerCase().indexOf(val.toLowerCase()) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  geRoleList() {
    this.formattedData = [];
    this.headerList = [];
    const apiUrl = this._global.baseAPIUrl + "Role/GetList?user_Token=" + this.RoleForm.get('User_Token').value
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

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    this.headerList = [];
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'roleName', header: 'ROLE NAME', index: 3 },
      { field: 'remarks', header: 'REMARKS', index: 2 },
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'id': el.id,
        'roleName': el.roleName,
        'remarks': el.remarks,
      });

    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  getPermissionsList() {
    this.formattedDataForPermissions = [];
    this.headerListForPermissions = [];
    const apiUrl = this._global.baseAPIUrl + "Role/GetPermissions?user_Token=" + this.RoleForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
      this.prepareTableDataForPermissions(this._RoleList, this._FilteredList);
    });
  }

  formattedDataForPermissions: any = [];
  headerListForPermissions: any;
  immutableFormattedDataForPermissions: any;
  prepareTableDataForPermissions(tableData, headerList) {
    this.formattedDataForPermissions = [];
    this.headerListForPermissions = [];
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'permissionName', header: 'PERMISSION NAME', index: 3 },
      { field: 'remarks', header: 'REMARKS', index: 2 },
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'id': el.id,
        'permissionName': el.permissionName,
        'remarks': el.remarks,
      });

    });
    this.headerListForPermissions = tableHeader;
    this.immutableFormattedDataForPermissions = JSON.parse(JSON.stringify(formattedData));
    this.formattedDataForPermissions = formattedData;
    this.loading = false;
  }

  searchTable($event) {
    let val = $event.target.value;
    if (val == '') {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach(el => {
            if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
              if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
                filteredArr.push(d);
              }
            }
          });
        }
      });
      this.formattedData = filteredArr;
    }
  }

  searchTableForPermission($event) {
    let val = $event.target.value;
    if (val == '') {
      this.formattedDataForPermissions = this.immutableFormattedDataForPermissions;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedDataForPermissions = this.immutableFormattedDataForPermissions.filter(function (d) {
        for (var key in d) {
          strArr.forEach(el => {
            if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
              if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
                filteredArr.push(d);
              }
            }
          });
        }
      });
      this.formattedDataForPermissions = filteredArr;
    }
  }

  OnReset() {
    this.Reset = true;
    this.RoleForm.reset({ User_Token: localStorage.getItem('User_Token') });
  }

  OnDelete(id: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn dangerbtn",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn successbtn",
      })
      .then((result) => {
        if (result.value) {
          const roleId = id.id ? id.id : id;
          this.RoleForm.patchValue({
            id: roleId, // Send only the numeric ID
            User_Token: localStorage.getItem('User_Token'),
          });
          console.log(this.RoleForm.value);
          const apiUrl = this._global.baseAPIUrl + "Role/Delete";

          // Call the API to delete the role

          this._onlineExamService
            .postData(this.RoleForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Role has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geRoleList();
            });
        }
      });
  }

  getRoleList() {
    const apiUrl = this._global.baseAPIUrl + 'Role/GetList?user_Token=' + this.RoleForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
    });
  }

  OnEdit(RoleL: any) {
    localStorage.setItem('_RoleID', RoleL.id);
    localStorage.setItem('_RoleName', RoleL.roleName);
    localStorage.setItem('_RoleRemark', RoleL.roleName);
    this.router.navigate(['/usermanagement/addrole']);
  }

  OnAddPermission(PermissionL: any) {
    localStorage.setItem('_PermissionID', PermissionL.id);
    localStorage.setItem('_PermissionName', PermissionL.permissionName);
    localStorage.setItem('_PermissionRemark', PermissionL.remarks);
    this.router.navigate(['/usermanagement/addpermission']);
  }

  AddRole() {
    this.router.navigate(['/usermanagement/addrole']);
  }

  AddPermission() {
    this.router.navigate(['/usermanagement/addpermission']);
  }


  ShowErrormessage(data: any) {
    this.messageService.add({ severity: 'error', summary: '', detail: data });
  }

  ShowMessage(data: any) {
    this.messageService.add({ severity: 'success', summary: '', detail: data });
  }

  onDownloadExcelFile(_filename: string) {
    this.exportToExcel(this.formattedData, _filename);
  }

  onDownloadExcelFileForPermission(_filename: string) {
    this.exportToExcel(this.formattedDataForPermissions, _filename);
  }

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = fileName + '.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
