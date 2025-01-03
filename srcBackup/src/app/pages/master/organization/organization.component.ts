import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { ToastrService } from "ngx-toastr";
import { MessageService } from 'primeng/api';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _FilteredList: any;
  _RoleList: any;
  AddOrganizationMapping: FormGroup;
  AddOrganizationForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  _SingleUser: any = [];
  myFiles: string[] = [];
  first = 0;
  rows = 10;
  _UserList: any;
  _UserL: any;
  _OrganizationTypeL: any;
  checkbox_list = [];
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  __checkedList: string = "";
  get checklistArray() { return this.AddOrganizationMapping.get('checklist') as FormArray; }


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
    this.AddOrganizationMapping = this.formBuilder.group({
      Id: [0],
      OrganizationName: ["", Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      UserIDS: [0, Validators.required],
      UserID: [0, Validators.required],

      checkedList: [""],
      SelectItem: [""],
      checklist: this.formBuilder.array([]),
      selectAll: [false],
    });

    this.AddOrganizationForm = this.formBuilder.group({
      OrganizationName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\-\s]+$/)]],
      MobileNo: ['', [Validators.pattern(/^\d{10}$/)]],
      EmailID: ["", Validators.email],
      Location: [""],
      User_Token: localStorage.getItem('User_Token'),
      user_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      OrganizationTypeID: ["",[Validators.required, Validators.pattern(/^(?!0$)/)]],
      Id: [0]
    });

    this.getRoleList();
    this.getOrgaizationList();
    this.getOrgaizationMappingList();
    this.getOrganizationTypeList();
    this.getUserList();
    this.getOrganization(0);
  }

  getOrganization(userid: number) {
    const apiUrl = this._global.baseAPIUrl + "Master/GetOrganizationMappingUser?UserID=" + userid + "&user_Token=" + this.AddOrganizationMapping.get("User_Token").value;;
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          Id: [item.Id],
          OrganizationName: [item.OrganizationName],
          ischecked: [item.ischecked]
        })
        this.checklistArray.push(fg)
        console.log("branchlist", this.checklistArray)
      });
    });
  }

  getBranchForUser(userid: number) {
    this.getOrganization(userid)
  }

  master_change() {
    let _bool = this.AddOrganizationMapping.controls['selectAll'].value;
    this.checklistArray.controls.forEach(role => {
      role.patchValue({ ischecked: _bool })
    });
  }

  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  getEntityForUser(userid: number) {
    this.getEntity(userid);
  }

  getEntity(userid: number) {
    const apiUrl = this._global.baseAPIUrl + "Master/GetOrganizationMappingUser?UserID=" + userid + "&user_Token=" + this.AddOrganizationMapping.get("User_Token").value;
    this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
      this.checkbox_list = [];
      this.checkbox_list = res;
      this.checklistArray.clear()
      this.checkbox_list.forEach(item => {
        let fg = this.formBuilder.group({
          Id: [item.Id],
          OrganizationName: [item.OrganizationName],
          ischecked: [item.ischecked]
        })
        this.checklistArray.push(fg)
      });
    });
  }

  onAddOrganizationMapping(template: TemplateRef<any>) {
    this.getBranchForUser(0);
    this.AddOrganizationMapping.controls["UserID"].setValue(0);
    this.modalRef = this.modalService.show(template);
  }

  onOrganizationMapping() {
    this.submitted = true;

    this.__checkedList = "";
    var _chkstatus = false;
    for (let value of this.checklistArray.value) {
      if (value.ischecked) {
        this.__checkedList += value.Id + "#";
        _chkstatus = true;
      }
    }

    if (_chkstatus == false) {
      console.log("_chkstatus", _chkstatus);
      this.ShowErrormessage("Please select at lease one branch");
      return;
    }
    this.AddOrganizationMapping.patchValue({
      checkedList: this.__checkedList,
      CreatedBy: 1,
      UserID: this.AddOrganizationMapping.get('UserID').value,
    });
    var objectToSend = {
      id: 0,
      User_Token: this.AddOrganizationMapping.get('User_Token').value,
      UserID: this.AddOrganizationMapping.get('UserID').value,
      checkedList: this.AddOrganizationMapping.get('checkedList').value,
      CreatedBy: this.AddOrganizationMapping.get('CreatedBy').value
    }
    const apiUrl = this._global.baseAPIUrl + "Master/OrganizationMapping";
    this._onlineExamService
      .postData(this.AddOrganizationMapping.value, apiUrl)
      .subscribe((data) => {
        this.getOrganization(0);
        this.getUserList();
        this.ShowMessage(data);
        this.OnReset();
        this.OnClose();
        this.getOrgaizationMappingList();
        this.AddOrganizationMapping.controls["UserID"].setValue(0);
      });
  }

  editOrganizationMapping(template: TemplateRef<any>, row: any) {
    debugger
    this.modalRef = this.modalService.show(template);
    this.checklistArray.clear();
    this.AddOrganizationMapping.patchValue({ UserID: row.UserID })
    this.getEntity(row.UserID);
  }

  load() {
    window.location.reload();
  }

  getUserList() {
    const apiUrl = this._global.baseAPIUrl + "Admin/GetList?user_Token=" + this.AddOrganizationMapping.get("User_Token").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UserL = data;
      this.AddOrganizationMapping.controls["UserID"].setValue(0);
      this.AddOrganizationMapping.controls["UserIDS"].setValue(0);
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  get f() {
    return this.AddOrganizationForm.controls;
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  getOrgaizationList() {
    this.formattedData = [];
    this.headerList = [];
    const apiUrl = this._global.baseAPIUrl + "Master/GetOrganizationList?user_Token=" + this.AddOrganizationForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
      this.prepareTableData(this._RoleList, this._FilteredList);
    });
  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    this.headerList = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'OrganizationName', header: 'ORGANIZATION NAME', index: 3 },
      { field: 'OrganizationType', header: 'ORGANIZATION TYPE', index: 3 },
      { field: 'EmailID', header: 'MAIL ID', index: 2 },
      { field: 'MobileNo', header: 'MOBILE NO', index: 2 },
      { field: 'Location', header: 'LOCATION NAME', index: 2 },
      { field: 'CreatedBy', header: 'CREATED BY', index: 2 },
      { field: 'CreatedAt', header: 'CREATED DATE', index: 2 },
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'Id': el.Id,
        'OrganizationName': el.OrganizationName,
        'OrganizationType': el.OrganizationType,
        'OrganizationTypeID': el.OrganizationTypeID,
        'EmailID': el.EmailID,
        'MobileNo': el.MobileNo,
        'Location': el.Location,
        'CreatedBy': el.CreatedBy,
        'CreatedAt': el.CreatedAt,
      });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  getOrgaizationMappingList() {
    this.formattedDataForOrgaizationMapping = [];
    this.headerListForOrgaizationMapping = [];
    const apiUrl = this._global.baseAPIUrl + "Master/GetOrganizationMappingList?user_Token=" + this.AddOrganizationMapping.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
      this.prepareTableDataForOrgaizationMapping(this._RoleList, this._FilteredList);
    });
  }

  formattedDataForOrgaizationMapping: any = [];
  headerListForOrgaizationMapping: any;
  immutableFormattedDataForOrgaizationMapping: any;
  prepareTableDataForOrgaizationMapping(tableData, headerListForOrgaizationMapping) {
    let formattedData = [];
    this.headerListForOrgaizationMapping = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'OrganizationName', header: 'ORGANIZATION NAME', index: 3 },
      { field: 'OrganizationType', header: 'ORGANIZATION TYPE', index: 3 },
      { field: 'Username', header: 'USER NAME', index: 2 },
      { field: 'MappedBy', header: 'MAPPED BY', index: 2 },
      { field: 'MappedDate', header: 'MAPPED DATE', index: 2 },
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'Id': el.Id,
        'OrganizationName': el.OrganizationName,
        'OrganizationType': el.OrganizationType,
        'Username': el.Username,
        'UserID': el.UserID,
        'MappedBy': el.MappedBy,
        'MappedDate': el.MappedDate,
      });
    });
    this.headerListForOrgaizationMapping = tableHeader;
    this.immutableFormattedDataForOrgaizationMapping = JSON.parse(JSON.stringify(formattedData));
    this.formattedDataForOrgaizationMapping = formattedData;
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

  searchTableForOrganizationMapping($event) {
    let val = $event.target.value;
    if (val == '') {
      this.formattedDataForOrgaizationMapping = this.immutableFormattedDataForOrgaizationMapping;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedDataForOrgaizationMapping = this.immutableFormattedDataForOrgaizationMapping.filter(function (d) {
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
      this.formattedDataForOrgaizationMapping = filteredArr;
    }
  }

  getOrganizationTypeList() {
    const apiUrl = this._global.baseAPIUrl + "Master/GetOrganizationTypeList?user_Token=" + this.AddOrganizationForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._OrganizationTypeL = data;
      this.AddOrganizationForm.controls["OrganizationTypeID"].setValue(0);
    });
  }

  AddOrganization(template: TemplateRef<any>) {
    this.OnReset();
    this.modalRef = this.modalService.show(template);
  }

  createOrganization() {
    this.submitted = true;

    this.AddOrganizationForm.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'Master/AddEditOrganization';
    this._onlineExamService.postData(this.AddOrganizationForm.value, apiUrl)
      .subscribe(data => {
        if (data === "Organization Already Exists.") {
          this.ShowErrormessage(data);
          this.getOrgaizationList();
        }
        else {
          this.ShowMessage(data);
          this.getOrgaizationList();
        }
      });
    this.OnReset();
    this.OnClose();
  }

  OnEditOrganization(template: TemplateRef<any>, RoleL: any) {
    this.modalRef = this.modalService.show(template);
    this.AddOrganizationForm.controls['Id'].setValue(RoleL.Id);
    this.AddOrganizationForm.controls['OrganizationName'].setValue(RoleL.OrganizationName);
    this.AddOrganizationForm.controls['OrganizationTypeID'].setValue(RoleL.OrganizationTypeID);
    this.AddOrganizationForm.controls['MobileNo'].setValue(RoleL.MobileNo);
    this.AddOrganizationForm.controls['EmailID'].setValue(RoleL.EmailID);
    this.AddOrganizationForm.controls['Location'].setValue(RoleL.Location);
  }

  OnReset() {
    this.AddOrganizationForm.controls['Id'].setValue(0);
    this.AddOrganizationForm.controls['OrganizationTypeID'].setValue(0);
    this.AddOrganizationForm.controls['OrganizationName'].setValue('');
    this.AddOrganizationForm.controls['MobileNo'].setValue('');
    this.AddOrganizationForm.controls['EmailID'].setValue("");
    this.AddOrganizationForm.controls['Location'].setValue("");
    this.AddOrganizationMapping.controls['UserID'].setValue("");
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

  onDownloadExcelFileForOrganizationMapping(_filename: string) {
    this.exportToExcel(this.formattedDataForOrgaizationMapping, _filename);
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

  OnClose() {
    this.modalRef.hide();
  }

  getRoleList() {
    const apiUrl = this._global.baseAPIUrl + 'Role/GetList?user_Token=' + this.AddOrganizationMapping.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
    });
  }
}
