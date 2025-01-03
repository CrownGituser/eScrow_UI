import { Component, OnInit,TemplateRef } from "@angular/core";

import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { DxiConstantLineModule } from "devextreme-angular/ui/nested";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  providers: [BsModalService,MessageService]
})
export class ConfigurationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  NavigateToGitSelection(){
    this.router.navigate(['/master/git-selection']);
  }

  NavigateToGitLabSelection(){
    this.router.navigate(['/master/git-lab-selection'])
  }

  NavigateToSFTPSelection(){
    this.router.navigate(['/master/sftp-selection'])
  }

  OnBack(){
    this.router.navigate(['/master/escrow']);
  }
}
