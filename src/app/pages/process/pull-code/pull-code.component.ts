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
  NgForm,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService, TreeNode } from "primeng/api";
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import swal from "sweetalert2";

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-pull-code',
  templateUrl: './pull-code.component.html',
  styleUrls: ['./pull-code.component.scss']
})
export class PullCodeComponent implements OnInit {

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
  ProjectCodePullForm: FormGroup;
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
  finalMessage = false
  projectName: any
  IntegrationType: any
  projectInfo: any
  selectedFilePath: any;
  events: any
  files: any[] = []; // This will hold the tree data
  selectionMode: string;
  entries: number = 10;
  SelectionType = SelectionType;
  isReadonly = true;
  // ViewSourceCode = false;
  _IndexList: any;
  CodeBrowseForm: FormGroup;
  BranchList: any;
  sMsg: string = "";
  activeTabIndex: number = 0;
  selectedFile!: TreeNode;


  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.ProjectCodePullForm = this.formBuilder.group({
      PID: [''],
      project_id: [''],
      ProjectName: [''],

      //FOR GIT 
      repoUrl: [''],
      git_user: [''],
      token: [''],

      //FOR SFTP
      host_name: [''],
      port: [''],
      user_password: [''],
      user_name: [''],
      remoteDirectory: [''],

      FileNo: [""],
      Filepath: [""],
      Comment: ['', Validators.required],
      Config_TypeId: [''],
      IntegrationType: [''],
      User_Token: localStorage.getItem("User_Token"),
      user_Token: localStorage.getItem("User_Token"),
      CodePull_by: localStorage.getItem("UserID"),
      CreatedBy: localStorage.getItem("UserID"),
      Status: ['']
    });

    let _PID = localStorage.getItem('_PID');

    if (Number(_PID) > 0) {
      this.ProjectCodePullForm.controls['PID'].setValue(localStorage.getItem('_PID'));
      this.ProjectCodePullForm.controls['project_id'].setValue(localStorage.getItem('_project_id'));
      this.ProjectCodePullForm.controls['ProjectName'].setValue(localStorage.getItem('_ProjectName'));
      this.ProjectCodePullForm.controls['IntegrationType'].setValue(localStorage.getItem('_IntegrationType'));
      this.ProjectCodePullForm.controls['Config_TypeId'].setValue(localStorage.getItem('_Config_TypeId'));
      this.projectName = this.ProjectCodePullForm.controls['ProjectName'].value
    }

    if (this.ProjectCodePullForm.controls['IntegrationType'].value === "GIT") {
      this.getGITDetails(this.ProjectCodePullForm.controls['Config_TypeId'].value);
      this.IntegrationType = this.ProjectCodePullForm.controls['IntegrationType'].value;
    }

    else if (this.ProjectCodePullForm.controls['IntegrationType'].value === "SFTP") {
      this.getSFTPDetails(this.ProjectCodePullForm.controls['Config_TypeId'].value);
      this.IntegrationType = this.ProjectCodePullForm.controls['IntegrationType'].value;
    }

    this.loadHTML();
    this.getBranchList();
    this.ViewAuditLog();
    this.User = "Add User";
  }

  ViewAuditLog() {
    localStorage.setItem('loadingOff', 'false')
    const apiUrl = this._global.baseAPIUrl + "Git/GetAuditLogByProjectID?User_Token=" + localStorage.getItem("User_Token") + "&project_id=" + this.ProjectCodePullForm.controls['PID'].value;

    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      this.UserList = data;
      this.events = data && data.length > 0 ? data : null;
      localStorage.setItem('loadingOff', '')
    });
  }


  getGITDetails(Config_TypeId: any) {
    const apiUrl = this._global.baseAPIUrl + "Git/GetDetailsByID?Id=" + Config_TypeId + "&user_Token=" + this.ProjectCodePullForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
      this.ProjectCodePullForm.patchValue({
        PID: data[0].project_id,
        project_id: data[0].project_id,
        ProjectName: data[0].ProjectName,
        repoUrl: data[0].repoUrl,
        git_user: data[0].git_user,
        token: data[0].token,
      });
    });
  }

  getSFTPDetails(Config_TypeId: any) {
    const apiUrl = this._global.baseAPIUrl + "SFTP/GetDetailsBySFTPID?Id=" + Config_TypeId + "&user_Token=" + this.ProjectCodePullForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any[]) => {
      this.ProjectCodePullForm.patchValue({
        PID: data[0].project_id,
        project_id: data[0].project_id,
        ProjectName: data[0].ProjectName,
        host_name: data[0].host_name,
        port: data[0].port,
        user_password: data[0].user_password,
        user_name: data[0].user_name,
        remoteDirectory: data[0].remoteDirectory
      });
    });
  }

  pullGitCode() {
    debugger
    this.initilizerLoaderOn = true
    this.submitted = true;
    localStorage.setItem('loadingOff', 'false')

    this.ProjectCodePullForm.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'Git/GitCloneRequest';
    this._onlineExamService.postData(this.ProjectCodePullForm.value, apiUrl)
      .subscribe(data => {
        this.ShowMessage(data);
        this.initilizerLoaderOn = false;
        this.finalMessage = true;
      });
    localStorage.setItem('loadingOff', '')
  }


  DownloadSFTPCode() {
    this.initilizerLoaderOn = true
    this.submitted = true;
    localStorage.setItem('loadingOff', 'false')

    this.ProjectCodePullForm.patchValue({
      CreatedBy: localStorage.getItem('UserID'),
      User_Token: localStorage.getItem('User_Token'),
    });

    const apiUrl = this._global.baseAPIUrl + 'FileUpload/SFTPConnect';
    this._onlineExamService.postData(this.ProjectCodePullForm.value, apiUrl)
      .subscribe(data => {
        this.downloadStatusFile(data);
        this.initilizerLoaderOn = false;
        this.finalMessage = true;
        // this.initilizerLoaderOn = 'Completed'
      });
    localStorage.setItem('loadingOff', '')
  }

  downloadStatusFile(strmsg: any) {
    const filename = 'SFTP File Download Status';
    let blob = new Blob(['\ufeff' + strmsg], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;

    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }


  OnReset() {
    this.ProjectCodePullForm.controls['Comment'].setValue('');
  }

  onBack() {
    localStorage.removeItem('_PID');
    localStorage.removeItem('_project_id');
    localStorage.removeItem('_ProjectName');
    localStorage.removeItem('_IntegrationType');
    localStorage.removeItem('_Config_TypeId');
    this.router.navigate(['/process/code-verification']);
  }

  safeHtmlContent: string = '';
  contentLines: string[] = [];
  downloadSCFile() {
    this.ProjectCodePullForm.patchValue({
      User_Token: localStorage.getItem('User_Token'),
      userID: localStorage.getItem('UserID')
    });

    const apiUrl = this._global.baseAPIUrl + 'Git/DownloadSCode';
    this._onlineExamService.BulkDownload(this.ProjectCodePullForm.value, apiUrl).subscribe(res => {
      if (res) {
        saveAs(res, "Source Code" + '.zip');
      }
    });
  }

  onNodeSelect(event: any) {
    const selectedNode = event.node;
    // Check if it is a file and display its file path
    if (selectedNode.data && selectedNode.data.filePath) {
      this.selectedFilePath = selectedNode.data.filePath;
    }
    //this.GetFileFomServer(this.selectedFilePath); 
    this.validateFile(this.selectedFilePath);
  }

  validateFile(file: string) {
    const validExtensions = ['.txt', '.html', '.cs', '.css', '.ts', '.vb', '.js', '.scss', '.json', '.md', '.xml', '.yml'];
    const validMimeTypes = [
      'text/plain', 'text/html', 'text/css', 'application/javascript',
      'application/json', 'text/markdown', 'text/xml', 'application/x-yaml',
      'application/vnd.ms-excel', 'application/vnd.ms-powerpoint',
      'application/octet-stream', 'text/x-scss', 'text/x-vbscript'
    ];
    // const fileExtension = file.name.split('.').pop()?.toLowerCase();

    const fileExt = file.substring(file.lastIndexOf('.'), file.length);

    //  const fileType = file.type;
    // const fileName = file.name.trim(); // Ensure no leading/trailing spaces
    const fileExtension = fileExt; // fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : null;

    if (validExtensions.includes(fileExtension!)) {
      this.GetFileFomServer(this.selectedFilePath);
      console.log('Valid file type:', file);
    } else {
      console.log('Invalid file type.');
    }
  }

  // Expand all nodes
  expandAll() {
    this.toggleNodes(this.files, true);
  }

  // Collapse all nodes
  collapseAll() {
    this.toggleNodes(this.files, false);
  }
  // Toggle node expansion
  toggleNodes(nodes: any[], expand: boolean) {
    nodes.forEach((node) => {
      node.expanded = expand;
      if (node.children) {
        this.toggleNodes(node.children, expand);
      }
    });
  }

  GetFileFomServer(filepath: string) {
    this.ProjectCodePullForm.patchValue({
      Filepath: filepath,
      User_Token: localStorage.getItem('User_Token'),

    });

    const that = this;
    const apiUrl = this._global.baseAPIUrl + 'Git/GetFileFomServer';
    this._onlineExamService.postData(this.ProjectCodePullForm.value, apiUrl)
      .subscribe(data => {

        this.contentLines = data.replace(/\t/g, '\\t').split('\n');
      });
  }

  getFile(event) {

    //   const selectedNode = event.node;  

    //   // Check if it is a file and display its file path
    //   // if (selectedNode.data && selectedNode.data.filePath) {
    //   //   this.selectedFilePath = selectedNode.data.filePath;
    //   // }
    //  // alert(this.selectedFilePath );

    //  const file: File = this.selectedFilePath.files[0];
    //  console.log('Selected File:', file.name);
    //  console.log('File Path:', file.webkitRelativePath || file.name);

    // this.GetFileFomServer(this.selectedFilePath);

  }

  loadHTML(): void {
    this.http.get('assets/sample.js', { responseType: 'text' }).subscribe({
      next: (data: string) => {
        // Split the content by '\n' into an array of lines
        //  this.contentLines = data.replace(/\t/g, '\\t').split('\n');
      },
      error: (error) => {
        console.error('Error fetching the file:', error);
      },
    });
  }

  editorOptions = {
    theme: "vs-dark",
    language: "javascript", // Set the language mode
    readOnly: true,
  };
  code: string = `
  // Sample JavaScript code
  function greet() {
    console.log('Hello, Monaco Editor!');
  }
`;

  getBranchList() {
    const apiUrl = this._global.baseAPIUrl + 'Git/GetSourceCodeDetails?ProjectID=' + this.ProjectCodePullForm.controls['project_id'].value + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
      this.files = this.transformToTreeNodes(data);
      // this.ViewSourceCode = true;
    });
  }

  hidepopup() {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    document.body.classList.remove("data-entry");
  }

  transformToTreeNodes(node: any): any[] {
    const children: any[] = [];

    // Process SubFolders
    if (node.SubFolders) {
      for (const subFolder of node.SubFolders) {
        children.push(...this.transformToTreeNodes(subFolder));
      }
    }

    // Process Files
    if (node.Files) {
      for (const file of node.Files) {
        children.push({
          label: file.FileName,
          icon: "pi pi-file",
          data: { filePath: file.FilePath } // Store file path in data
        });
      }
    }

    // Return the current node in PrimeNG format
    return [
      {
        label: node.FolderName || "Root",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: children,
      }
    ];
  }

  SourceValidator(event: any): void {
    debugger
    if (event.index === 1) {
      this.loadHTML();
      this.getBranchList();
    }
  }

  onSubmit() {
    this.submitted = true;

    this.ProjectCodePullForm.value.User_Token = localStorage.getItem("User_Token");

    this.ProjectCodePullForm.patchValue({
      project_id: this.ProjectCodePullForm.controls['PID'].value,
      Status: ""
    })
    const apiUrl = this._global.baseAPIUrl + "Git/SubmitGitClone";
    this._onlineExamService
      .postData(this.ProjectCodePullForm.value, apiUrl)
      .subscribe((data) => {

        this.ShowMessage(data);
        this.modalService.hide(1);
        this.OnReset();
        this.ViewAuditLog();
        this.modal1 = "modal"
        this.loadHTML();
        this.getBranchList();
      });
    this.finalMessage = false;
    // this.ViewSourceCode = true;
    this.initilizerLoaderOn = false;
  }

  getUserType() {
    const apiUrl = this._global.baseAPIUrl + 'Department/GetList?user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._UsertypeList = data;
      this.ProjectCodePullForm.controls['usetType'].setValue(0);
    });
  }

  modal1: any

  resetForm(form: NgForm) {
    form.reset();
  }

  get f() {
    return this.ProjectCodePullForm.controls;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  ShowErrormessage(data: any) {
    this.toastr.error(data);
  }

  ShowMessage(data: any) {
    this.toastr.success(data);
  }

  showSuccessmessage(data: any) {
    this.toastr.success(data);
  }
}
