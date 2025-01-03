import { Component, OnInit,TemplateRef } from "@angular/core";
import { Globalconstants } from "../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../Services/online-exam-service.service";

import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import {AuthenticationService} from '../../Services/authentication.service';
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login-new',
  templateUrl: './login-new.component.html',
  styleUrls: ['./login-new.component.scss'],
  providers: [BsModalService,MessageService]
})
export class LoginNewComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  _LogData:any;
  fieldTextType:boolean;
  modalRef: BsModalRef;
lbl:any;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
  animal: string;
  name: string;
  config = {
    class: 'modal-dialog-centered'
  }
  constructor(
        
    private modalService: BsModalService,
        public toastr: ToastrService,
        private formBuilder: FormBuilder,
        private _onlineExamService: OnlineExamServiceService,
        private _global: Globalconstants,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private http: HttpClient,
        private httpService: HttpClient,
        private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required]),Validators.maxLength(50)],
      password: ['', Validators.required],
    //  recaptcha: ['', Validators.required]
    });

    localStorage.clear();
    this.lbl="estoragesupport@crownims.com";
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  HelpDailog(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.config);
  }
 
  // show(){
  //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  // }
  onSubmit() {
   // this.toastr.success('Hello world!', 'Toastr fun!');
    this.submitted = true;
     // stop here if form is invalid
  //    if (this.loginForm.invalid) {
  //     return;
  // }  

  const apiUrl = this._global.baseAPIUrl + 'UserLogin/Create';
    this.authService.userLogin(this.loginForm.value,apiUrl).subscribe( data => {
      
  //   console.log("that._LogData ",data);  
      if(data.length > 0  && data[0].id !=0)         
      {        
        var that = this;
        that._LogData =data[0];
     //  console.log("that._LogData ",that._LogData.Days);      
       if (that._LogData.Days <=15 )
       {
       console.log(that._LogData.Days);
       var mess= " Your password expires in  " + that._LogData.Days  + "  days. Change the password as soon as possible to prevent login problems"
         //var mess="Your password will be expired in  Days" 
        this.Message(mess);
       }

       
        localStorage.setItem('UserID',that._LogData.id) ;
        localStorage.setItem('currentUser',that._LogData.id) ;        
        localStorage.setItem('sysRoleID',that._LogData.sysRoleID) ;
        localStorage.setItem('User_Token',that._LogData.User_Token) ;
        localStorage.setItem('UserName',this.loginForm.get("username").value) ;
      
        if (this.loginForm.get("username").value == "admin")
        {
          this.router.navigate(['search/quick-search']); 
      }
      else if(this.loginForm.get("username").value == "upload") {
        this.router.navigate(['search/quick-search']); 
      } else {
        this.router.navigate(['search/quick-search']); 
      }

      }
    else
    {
      //this.toastr.error('Hello world!', 'Toastr fun!');
          this.ErrorMessage(data[0].userid);
//     alert("Invalid userid and password.");     
    }

  });
  }

  handleSuccess(data) {

  }

  get f(){
    return this.loginForm.controls;
  }

  ErrorMessage(msg:any)
  {
    this.messageService.add({severity:'error', summary: '', detail: 'Wrong Username & Password..!', sticky: false});
    // this.toastr.error('Wrong Username and Password!', '',{
    //   "closeButton": false,
    //   "progressBar": true,
    //   "positionClass": "toast-top-center",
    //   "toastClass":"ngx-toastr alert alert-danger alert-notify"
    // });
    // this.toastr.show(
    //   '<div class="alert-text"></div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"> '+msg+' </span></div>',
    //   "",
    //   {
    //     timeOut: 3000,
    //     closeButton: true,
    //     enableHtml: true,
    //     tapToDismiss: false,
    //     titleClass: "alert-title",
    //     positionClass: "toast-top-center",
    //     toastClass:
    //       "ngx-toastr toast"
    //   }
    // );
  }

  Message(msg:any)
  {

    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"></span> <span data-notify="message"><h4 class="text-white"> '+msg+' <h4></span></div>',
      "",
      {
        timeOut: 7000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-danger alert-notify"
      }
    );
  }  
  
}
