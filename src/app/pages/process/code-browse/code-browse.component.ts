import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService, TreeNode } from "primeng/api";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';

// import { Listboxclass } from '../../../Helper/Listboxclass';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-code-browse",
  templateUrl: "code-browse.component.html",
  styleUrls: ["code-browse.component.css"],
})
export class CodeBrowseComponent implements OnInit {
  files: any[] = []; // This will hold the tree data
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  isReadonly = true;
  _IndexList: any;
  CodeBrowseForm: FormGroup;
  submitted = false;
  BranchList: any;
  Reset = false;
  sMsg: string = "";
  first = 0;
  rows = 10;
  selectedFilePath:any;

  // files!: TreeNode[];

  selectedFile!: TreeNode;

  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit() {
 
    this.CodeBrowseForm = this.formBuilder.group({
      FileNo: ["", Validators.required],
      Filepath: ["", Validators.required],
      project_id: ["", Validators.required],
      User_Token: localStorage.getItem("User_Token"),
      CreatedBy: localStorage.getItem("UserID"),
    });

    let _PID = localStorage.getItem('_PID');

    if (Number(_PID) > 0) {
      this.CodeBrowseForm.controls['project_id'].setValue(localStorage.getItem('_PID'));
    }

    this.loadHTML();
    this.getBranchList();
  }

  safeHtmlContent: string = '';
  contentLines: string[] = [];
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
    const apiUrl = this._global.baseAPIUrl + 'Git/GetSourceCodeDetails?ProjectID=' + this.CodeBrowseForm.controls['project_id'].value + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data) => {
         this.files = this.transformToTreeNodes(data);
    });
  }
  
  onNodeSelect(event: any) {
 
    const selectedNode = event.node;
  //  alert(selectedNode.data.filePath);
    // Check if it is a file and display its file path
    if (selectedNode.data && selectedNode.data.filePath) {
      this.selectedFilePath = selectedNode.data.filePath;
    }
    //this.GetFileFomServer(this.selectedFilePath); 
    this.validateFile(this.selectedFilePath); 
  }

  OnReset() {
    this.Reset = true;
    this.CodeBrowseForm.reset();
    this.isReadonly = false;
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
  
 
GetFileFomServer(filepath:string) {
  this.CodeBrowseForm.patchValue({
    Filepath: filepath,
    User_Token: localStorage.getItem('User_Token'), 
     
  });

  const that = this;
  const apiUrl = this._global.baseAPIUrl + 'Git/GetFileFomServer';
  this._onlineExamService.postData(this.CodeBrowseForm.value,apiUrl)     
  .subscribe( data => { 
  
    this.contentLines = data.replace(/\t/g, '\\t').split('\n');
  });
}

validateFile(file:string) {
  const validExtensions = ['.txt', '.html', '.cs', '.css', '.ts', '.vb', '.js', '.scss', '.json', '.md', '.xml', '.yml'];
  const validMimeTypes = [
    'text/plain', 'text/html', 'text/css', 'application/javascript',
    'application/json', 'text/markdown', 'text/xml', 'application/x-yaml',
    'application/vnd.ms-excel', 'application/vnd.ms-powerpoint',
    'application/octet-stream', 'text/x-scss', 'text/x-vbscript'
  ];
  // const fileExtension = file.name.split('.').pop()?.toLowerCase();

  const fileExt = file.substring(file.lastIndexOf('.'),file.length);

  //  const fileType = file.type;
  // const fileName = file.name.trim(); // Ensure no leading/trailing spaces
  const fileExtension =fileExt; // fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : null;
 
  if (validExtensions.includes(fileExtension!) ) {
    
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

  onBack(){
    localStorage.removeItem('_PID');
    this.router.navigate(['/process/code-verification']);
  }

  hidepopup() {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    document.body.classList.remove("data-entry");
  }

  ErrorMessage(msg: any) {this.messageService.add({severity: "error",summary: "error",detail: msg,});
  }

  Message(msg: any) {this.messageService.add({severity: "success",summary: "Success",detail: msg,});
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  downloadSCFile() {
    this.CodeBrowseForm.patchValue({
      User_Token: localStorage.getItem('User_Token'),
      userID: localStorage.getItem('UserID')
    });
   
    const apiUrl = this._global.baseAPIUrl + 'Git/DownloadSCode';    
    this._onlineExamService.BulkDownload(this.CodeBrowseForm.value, apiUrl).subscribe( res => {
      if (res) {      
          saveAs(res, "Source Code" + '.zip');         
      }
      // console.log("Final FP-- res ", res);  
    });
  
  }

}
