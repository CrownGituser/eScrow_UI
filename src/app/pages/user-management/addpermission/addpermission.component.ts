import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { MessageService } from 'primeng/api'; 
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-addpermission',
  templateUrl: './addpermission.component.html',
  styleUrls: ['./addpermission.component.scss']
})
export class AddpermissionComponent implements OnInit {

  AddRoleForm: FormGroup;
  submitted = false;
  Reset = false;
  isReadOnly = false;
  sMsg: string = '';
  UserList: any;
  _PageList: any;
  PageViewList: any;
  _RightList: any;
  _UserList: any;
  myFiles: string[] = [];
  _pageRights: any;
  Role: any;

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private http: HttpClient,
    private httpService: HttpClient
  ) { }

  get rf() { return this.AddRoleForm; }
  get roles() { return this.AddRoleForm.get('Roles') as FormArray; }
  get _PageRight() { return this.AddRoleForm.get('_PageRight') as FormArray; }

  ngOnInit() {
    this.AddRoleForm = this.formBuilder.group({
      permissionName: ['', Validators.required],
      remarks: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      Permissions: this.formBuilder.array([]),
      SelectAll: [false],
      SelectAllRights: [false],
      _PageIDAndChk: "",
      pageRights: "",
      _PageRight: this.formBuilder.array([]),
    });



    let _PermissionID = localStorage.getItem('_PermissionID');

    if (Number(_PermissionID) > 0) {
      this.getRightList(Number(_PermissionID));
      this.AddRoleForm.controls['permissionName'].setValue(localStorage.getItem('_PermissionName'));
      this.AddRoleForm.controls['remarks'].setValue(localStorage.getItem('_PermissionRemark'));
      this.isReadOnly = true;
      this.Role = "Edit Role";
    }
    else {
      this.getRightList(0);
      this.Role = "Create Role";

    }

    this.Getpagerights();
  }


  Getpagerights() {

    var pagename = "Add Role";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID') + ' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
      if (data <= 0) {
        localStorage.clear();
        this.router.navigate(["/Login"]);

      }

    });
  }

  getRightList(TID: number) {
    const apiUrl = this._global.baseAPIUrl + 'Role/GetRightList?ID=' + TID + '&user_Token=' + this.AddRoleForm.get('User_Token').value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RightList = data;
      this._RightList.forEach(item => {
        let fg = this.formBuilder.group({
          page_right: [item.page_right],
          isChecked: [item.isChecked],
          id: [item.id],
        })
        this._PageRight.push(fg)
      })

    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.AddRoleForm.value.permissionName.trim() == "") {
      this.ShowErrormessage("Please enter Permission Name");
      return;
    }

    let __pageRights = "";
    for (let i = 0; i < this.AddRoleForm.value._PageRight.length; i++) {

      if (this.AddRoleForm.value._PageRight[i].isChecked) {
        __pageRights += String(this.AddRoleForm.value._PageRight[i].id) + ','
      }

    }

    if (__pageRights.length <= 0 || __pageRights === "") {
      this.ShowErrormessage("Please select rights ");
      return;
    }

    this.AddRoleForm.patchValue({
      CreatedBy: 1,
      User_Token: localStorage.getItem('User_Token'),
      pageRights: __pageRights
    });

    const apiUrl = this._global.baseAPIUrl + 'Role/AddPermission';
    const rights = this.AddRoleForm.value._PageRight;
    this._onlineExamService.postData(this.AddRoleForm.value, apiUrl)
      .subscribe(data => {
        this.MessageBox(data);
        this.OnReset();
        setTimeout(() => {
          this._onlineExamService.roleChanged();
        }, 50);
        rights.forEach(element => {
          localStorage.setItem(element.page_right, element.isChecked);
        });
      });
      this.OnBack();
  }

  ShowErrormessage(data: any) {
    this.messageService.add({ severity: 'error', summary: '', detail: data });
  }

  ShowMessage(data: any) {
    this.messageService.add({ severity: 'success', summary: '', detail: data });
  }

  onCheckChild(role) {
    setTimeout(() => {
      let oneFalseFound = role
        .get("subItems")
        .controls.every((r) => r.get("isChecked").value == true);
      oneFalseFound
        ? role.patchValue({ isChecked: true })
        : role.patchValue({ isChecked: false });
    }, 100);
  }

  onCheckParent(role: any) {
    let _bool = role.get("isChecked").value;
    if (_bool) {
      role.get("subItems").controls.forEach((elm) => {
        elm.patchValue({ isChecked: false });
      });
    } else {
      role.get("subItems").controls.forEach((elm) => {
        elm.patchValue({ isChecked: true });
      });
    }
  }

  OnSelectRightAll() {
    let _bool = this.AddRoleForm.controls["SelectAllRights"].value; // role.get('SelectAll').value == true;
    this._PageRight.controls.forEach((role) => {
      role.patchValue({ isChecked: _bool });
    });
  }


  OnReset() {
    this.AddRoleForm.controls['permissionName'].setValue("");
    this.AddRoleForm.controls['remarks'].setValue("");

    let _bool = false; // role.get('SelectAll').value == true;
    this.roles.controls.forEach((role) => {
      role.patchValue({ isChecked: _bool });
      let subItems = role.get("subItems") as FormArray;
      subItems.controls.forEach((elm) => {
        elm.patchValue({ isChecked: _bool });
      });
    });
    this._PageRight.controls.forEach((role) => {
      role.patchValue({ isChecked: false });
    });


  }

  OnBack() {
    localStorage.removeItem('_PermissionID');
    localStorage.removeItem('_PermissionName');
    localStorage.removeItem('_PermissionRemark');
    this.router.navigate(['/usermanagement/roles']);
  }


  MessageBox(msg: any) {
    this.messageService.add({ severity: 'success', summary: '', detail: msg });
  }
}