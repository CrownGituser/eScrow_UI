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
  selector: 'app-sftp-selection',
  templateUrl: './sftp-selection.component.html',
  styleUrls: ['./sftp-selection.component.scss']
})
export class SFTPSelectionComponent implements OnInit {
  SFTPform: FormGroup;
  submitted = false;
  activated = false;
  Reset = false;
  activationBtn = false;
  isReadonly = false;
  scheduleractivity = false;
  backbtn: string;
  isMeridian = false;
  readonly = true;
  myTime = new Date();
  schedulerType: string = '';

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
    this.SFTPform = this.formBuilder.group(
      {
        SFTPID: [0],
        project_id: ["", Validators.required],
        ProjectName: ["", Validators.required],
        remoteDirectory: ["", Validators.required],
        host_name: ["", Validators.required],
        port: ["", Validators.required],
        user_password: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`])[A-Za-z\d!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]{10,}$/)],],
        user_name: ["", Validators.required],
        Scheduler: [0, [Validators.required, Validators.pattern(/^(?!0$)/)]],
        SchedulerFrequency: ['', [Validators.required]],
        IsVerification: [''],
        DailyTime: [''],
        WeeklyDay: [''],
        WeeklyTime: [''],
        MonthlyDate: ['', [Validators.min(1), Validators.max(31)]],
        MonthlyTime: [''],

        User_Token: localStorage.getItem("User_Token"),
        user_Token: localStorage.getItem("User_Token"),
        CreatedBy: localStorage.getItem("UserID")
      }
    )

    let _PID = localStorage.getItem('_PID');

    if (Number(_PID) > 0) {
      this.SFTPform.controls['project_id'].setValue(localStorage.getItem('_PID'));
      this.SFTPform.controls['ProjectName'].setValue(localStorage.getItem('_ProjectName'));
      this.SFTPform.controls['SFTPID'].setValue(localStorage.getItem('_Config_TypeId'));
    }

    if (this.SFTPform.controls['SFTPID'].value !== 0 && this.SFTPform.controls['SFTPID'].value !== null) { // && this.backbtn === "ActivationPending"
      this.getSFTPDetails();
      this.SchedulerFrequency();
    }
    // else if(this.SFTPform.controls['SFTPID'].value !== 0 && this.SFTPform.controls['SFTPID'].value !== null && this.backbtn === "ActivationCompleted"){
    //   this.getSFTPDetailsForEdit();
    // }
  }

  get f() {
    return this.SFTPform.controls;
  }

  getSFTPDetails() {
    const apiUrl = this._global.baseAPIUrl + "SFTP/GetDetailsBySFTPID?Id=" + this.SFTPform.get('SFTPID').value + "&user_Token=" + this.SFTPform.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
      this.SFTPform.patchValue({
        host_name: data[0].host_name,
        port: data[0].port,
        user_password: data[0].user_password,
        user_name: data[0].user_name,
        remoteDirectory: data[0].remoteDirectory,
        Scheduler: data[0].Scheduler,
        SchedulerFrequency: data[0].SchedulerFrequency,
        DailyTime: data[0].DailyTime,
        WeeklyDay: data[0].WeeklyDay,
        WeeklyTime: data[0].WeeklyTime,
        MonthlyDate: data[0].MonthlyDate,
        MonthlyTime: data[0].MonthlyTime,
        IsVerification: data[0].IsVerification,
      });
      console.log(data[0]);

      if (this.SFTPform.controls['IsVerification'].value === "N" || this.SFTPform.controls['IsVerification'].value === null) {
        this.activationBtn = true;
      }

      if (this.SFTPform.controls['Scheduler'].value === "Y") {
        this.scheduleractivity = true;
      }

      if (this.SFTPform.controls['SchedulerFrequency'].value === "Daily") {
        this.schedulerType = this.SFTPform.controls['SchedulerFrequency'].value;
      }
      else if (this.SFTPform.controls['SchedulerFrequency'].value === "Weekly") {
        this.schedulerType = this.SFTPform.controls['SchedulerFrequency'].value;
      }
      else if (this.SFTPform.controls['SchedulerFrequency'].value === "Monthly") {
        this.schedulerType = this.SFTPform.controls['SchedulerFrequency'].value;
      }
      else {
        this.schedulerType = "";
      }
    });
    this.isReadonly = true;
  }

  // getSFTPDetailsForEdit(){
  //   const apiUrl = this._global.baseAPIUrl + "SFTP/GetDetailsBySFTPID?Id=" + this.SFTPform.get('SFTPID').value + "&user_Token=" + this.SFTPform.get('User_Token').value
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
  //     this.SFTPform.controls['host_name'].setValue(data[0].host_name);
  //     this.SFTPform.controls['port'].setValue(data[0].port);
  //     this.SFTPform.controls['user_password'].setValue(data[0].user_password);
  //     this.SFTPform.controls['user_name'].setValue(data[0].user_name);
  //     this.SFTPform.controls['remoteDirectory'].setValue(data[0].remoteDirectory);
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

    this.SFTPform.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'SFTP/Create';
    this._onlineExamService.postData(this.SFTPform.value, apiUrl)
      .subscribe(data => {
        this.ShowMessage(data);
      });
    this.activationBtn = true;
    this.isReadonly = true;
  }

  onActivateBtn() {
    this.activated = true;

    this.SFTPform.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'SFTP/SFTPVerification';
    this._onlineExamService.postData(this.SFTPform.value, apiUrl)
      .subscribe(data => {
        if (data === "SFTP Connecting Error..") {
          this.ShowErrormessage(data);
        }
        else {
          this.ShowMessage(data);
        }
      });
    localStorage.removeItem('_PID');
    localStorage.removeItem('_ProjectName');
    localStorage.removeItem('_Config_TypeId');
    this.router.navigate(['/master/escrow']);
  }

  OnReset(): void {
    this.SFTPform.controls['host_name'].setValue("");
    this.SFTPform.controls['port'].setValue("");
    this.SFTPform.controls['user_password'].setValue("");
    this.SFTPform.controls['remoteDirectory'].setValue("");
    this.SFTPform.controls['DailyTime'].setValue("");
    this.SFTPform.controls['WeeklyDay'].setValue("");
    this.SFTPform.controls['WeeklyTime'].setValue("");
    this.SFTPform.controls['MonthlyDate'].setValue("");
    this.SFTPform.controls['MonthlyTime'].setValue("");
    this.SFTPform.controls['Scheduler'].setValue(0);
    this.SFTPform.controls['SchedulerFrequency'].setValue(0);
    this.SFTPform.controls['user_name'].setValue("");
  }

  Scheduler(value: any) {
    if (value === "Y") {
      this.scheduleractivity = true;
      this.SFTPform.patchValue({
        SchedulerFrequency: 0
      });
    } else {
      this.scheduleractivity = false;
      this.schedulerType = '',
        this.SFTPform.patchValue({
          SchedulerFrequency: 0,
          DailyTime: '',
          WeeklyDay: '',
          WeeklyTime: '',
          MonthlyDate: '',
          MonthlyTime: ''
        });
    }
  }

  SchedulerFrequency() {
    this.schedulerType = this.SFTPform.get('SchedulerFrequency')?.value;
    this.SFTPform.patchValue({
      DailyTime: '',
      WeeklyDay: 0,
      WeeklyTime: '',
      MonthlyDate: '',
      MonthlyTime: ''
    });
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
