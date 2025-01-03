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
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-git-selection',
  templateUrl: './git-selection.component.html',
  styleUrls: ['./git-selection.component.scss']
})
export class GitSelectionComponent implements OnInit {
  GitSelectionForm: FormGroup;
  submitted = false;
  activated = false;
  Reset = false;
  activationBtn = false;
  isReadonly = false;
  backbtn: string;

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
    this.GitSelectionForm = this.formBuilder.group(
      {
        GITID: [0],
        project_id: ["", Validators.required],
        ProjectName: ["", Validators.required],
        // remoteDirectory: ["", Validators.required],
        git_user: ["", Validators.required],
        repoUrl: ["", Validators.required],
        token: ["",[ Validators.required]], 
        // , Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`])[A-Za-z\d!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]{10,}$/)],
        repository: ["", Validators.required],
        User_Token: localStorage.getItem("User_Token"),
        user_Token: localStorage.getItem("User_Token"),
        CreatedBy: localStorage.getItem("UserID"),
      }
    )
    
    let _PID = localStorage.getItem('_PID');

    if (Number(_PID) > 0) {
      this.GitSelectionForm.controls['project_id'].setValue(localStorage.getItem('_PID'));
      this.GitSelectionForm.controls['ProjectName'].setValue(localStorage.getItem('_ProjectName'));
      this.GitSelectionForm.controls['GITID'].setValue(localStorage.getItem('_Config_TypeId'));
    }

    if(this.GitSelectionForm.controls['GITID'].value !== 0 && this.GitSelectionForm.controls['GITID'].value !== null){
      this.getGITDetails();
    }
    // else if(this.GitSelectionForm.controls['GITID'].value !== 0 && this.GitSelectionForm.controls['GITID'].value !== null && this.backbtn === "ActivationCompleted"){
    //   this.getSFTPDetailsForEdit();
    // }
  }

  get f() {
    return this.GitSelectionForm.controls;
  }

  getGITDetails(){
    const apiUrl = this._global.baseAPIUrl + "Git/GetDetailsByID?Id=" + this.GitSelectionForm.get('GITID').value + "&user_Token=" + this.GitSelectionForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
      this.GitSelectionForm.controls['git_user'].setValue(data[0].git_user);
      this.GitSelectionForm.controls['repoUrl'].setValue(data[0].repoUrl);
      this.GitSelectionForm.controls['token'].setValue(data[0].token);
      this.GitSelectionForm.controls['repository'].setValue(data[0].repository);
      this.GitSelectionForm.controls['remoteDirectory'].setValue(data[0].remoteDirectory);
    });
    this.activationBtn = true;
    this.isReadonly = true;
  }

  // getSFTPDetailsForEdit(){
  //   const apiUrl = this._global.baseAPIUrl + "SFTP/GetDetailsBySFTPID?Id=" + this.GitSelectionForm.get('GITID').value + "&user_Token=" + this.GitSelectionForm.get('User_Token').value
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
  //     this.GitSelectionForm.controls['git_user'].setValue(data[0].git_user);
  //     this.GitSelectionForm.controls['repoUrl'].setValue(data[0].repoUrl);
  //     this.GitSelectionForm.controls['token'].setValue(data[0].token);
  //     this.GitSelectionForm.controls['repository'].setValue(data[0].repository);
  //     this.GitSelectionForm.controls['remoteDirectory'].setValue(data[0].remoteDirectory);
  //   });
  // }

  OnBack() {
    localStorage.removeItem('_PID');
    localStorage.removeItem('_ProjectName');
    localStorage.removeItem('_Config_TypeId');
    this.router.navigate(['/master/escrow']);
  }

  onSubmit() {
    this.submitted = true;

    this.GitSelectionForm.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'Git/Create';
    this._onlineExamService.postData(this.GitSelectionForm.value, apiUrl)
      .subscribe(data => {
          this.ShowMessage(data);
      });
    this.activationBtn = true;
    this.isReadonly = true;
  }

  onActivateBtn(){
    this.activated = true;

    this.GitSelectionForm.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'Git/GitActivation';
    this._onlineExamService.postData(this.GitSelectionForm.value, apiUrl)
      .subscribe(data => {
        if(data === "Login failed or repository does not exist."){
          this.ShowErrormessage(data);
        }
        else{
          this.ShowMessage(data);
        }
      });
    localStorage.removeItem('_PID');
    localStorage.removeItem('_ProjectName');
    localStorage.removeItem('_Config_TypeId');
    this.router.navigate(['/master/escrow']);
  }

  OnReset(): void {
    this.GitSelectionForm.controls['git_user'].setValue("");
    this.GitSelectionForm.controls['repoUrl'].setValue("");
    this.GitSelectionForm.controls['token'].setValue("");
    this.GitSelectionForm.controls['repository'].setValue("");
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
