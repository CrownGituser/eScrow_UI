import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef, EventEmitter, Output } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { Alert } from "selenium-webdriver";
import { MessageService } from 'primeng/api';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-fileupload",
  templateUrl: "fileupload.component.html",
  styleUrls: ["fileupload.component.css"]
})
export class FileUploadComponent implements OnInit {
  resetFiles(_t33: any) {
    throw new Error('Method not implemented.');
  }
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _FilteredList: any;
  _DeptList: any;
  _IndexList: any;
  EntityList: any;
  _DepartmentList: any;
  _DSConfigList: any;
  BranchList: any;
  _Records: any;
  _StatusList: any;
  FileUPloadForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = '';
  public progress: number;
  public message: string;
  _TemplateList: any;
  myFiles: string[] = [];
  _FileDetails: string[][] = [];
  first = 0;
  rows = 10;
  filesSelected: boolean = false;
  @Output() public onUploadFinished = new EventEmitter();


  constructor(
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private httpService: HttpClient,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.FileUPloadForm = this.formBuilder.group({

      PID: [''],
      project_id: [''],
      ProjectName: [''],
      User_Token: localStorage.getItem('User_Token'),
      UserID: localStorage.getItem('UserID'),
      id: [0],
      CSVData: ""
    });

    let _PID = localStorage.getItem('_PID');

    if (Number(_PID) > 0) {
      this.FileUPloadForm.controls['PID'].setValue(localStorage.getItem('_PID'));
      this.FileUPloadForm.controls['project_id'].setValue(localStorage.getItem('_PID'));
      this.FileUPloadForm.controls['ProjectName'].setValue(localStorage.getItem('_ProjectName'));
    }

    this.BindHeader(this._IndexList, this._IndexList);
  }

  Getpagerights() {
    var pagename = "File Upload";
    const apiUrl = this._global.baseAPIUrl + 'Admin/Getpagerights?userid=' + localStorage.getItem('UserID') + ' &pagename=' + pagename + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
  OnReset() {
    this.Reset = true
  }

  OnBack() {
    localStorage.removeItem('_PID');
    localStorage.removeItem('_project_id');
    localStorage.removeItem('_ProjectName');
    this.router.navigate(['/process/code-verification']);
  }
  ClearTableData(){
    let x = [];
    this.getFileDetails(x);
  }

  getFileDetails(e) {
    this.formattedData = [];
    this.headerList = [];
    var maxsize = 0;
    this.myFiles = [];
    this.filesSelected = e.files.length > 0;
    if (e.files.length >= 1000) {
      this.showmessage("You can not upload more than 1000 files.");
      return;
    }
    for (var i = 0; i < e.files.length; i++) {
      this.myFiles.push(e.files[i]);
    }
    this._IndexList = e.files;
    this.prepareTableData(this.myFiles, this.myFiles);
    this.FileSizeValidation();
  }

  FileSizeValidation() {
    let allFilesSize = 0;
    for (var i = 0; i < this.myFiles.length; i++) {
      allFilesSize += this.myFiles[i]['size'];
    }
    if ((allFilesSize / (1024 * 1024)) > 500) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Maximum 500MB is allowed to upload' });
      return;
    }
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    if (this.validation() == false) {
      return;
    }
    let filesToUpload: File[] = files;
    const formData = new FormData();
    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file' + index, file, file.name);
    });

    formData.append('PID', this.FileUPloadForm.controls['PID'].value);
    formData.append('project_id', this.FileUPloadForm.controls['project_id'].value);
    formData.append('ProjectName', this.FileUPloadForm.controls['ProjectName'].value);
    formData.append('UserID', localStorage.getItem('UserID'));
    const apiUrl = this._global.baseAPIUrl + 'FileUpload/UploadEscrowFiles';
    this.http.post(apiUrl, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)

          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        } else {
          this.message = 'in Else Event' + event.type;
        }
      });
  }

  uploadFiles(fileUpload) {
    if (this.myFiles.length >= 1000) {
      this.showmessage("You can not upload more than 1000 files.");
      return;
    }
    let allFilesSize = 0;
    for (var i = 0; i < this.myFiles.length; i++) {
      allFilesSize += this.myFiles[i]['size'];
    }
    if ((allFilesSize / (1024 * 1024)) > 500) {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Maximum 500MB is allowed to upload' });
      return;
    }

    if (this.FileUPloadForm.invalid) {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select Branch Department Document Type before uploading!' });
    } else {
      const frmData = new FormData();
      for (var i = 0; i < this.myFiles.length; i++) {
        frmData.append("fileUpload", this.myFiles[i]);
      }
      frmData.append('PID', this.FileUPloadForm.controls['PID'].value);
      frmData.append('project_id', this.FileUPloadForm.controls['project_id'].value);
      frmData.append('ProjectName', this.FileUPloadForm.controls['ProjectName'].value);
      frmData.append('UserID', localStorage.getItem('UserID'));
      const apiUrl = this._global.baseAPIUrl + 'FileUpload/UploadEscrowFiles';
      this.httpService.post(apiUrl, frmData).subscribe(
        data => {
          fileUpload.clear();
          this.myFiles = [];
          let strmsg = JSON.stringify(data);
          let x = strmsg.split(',');

          this.messageService.add({ severity: 'success', summary: 'Success', detail: x[0] });
          this.downloadFile(data);
          this.OnReset();
          this.OnBack();
          this.myFiles = [];
        },
      );
    }
  }
  downloadFile(strmsg: any) {
    const filename = 'File upload status';
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

  showmessage(data: any) {

    this.messageService.add({ severity: 'error', summary: 'Error', detail: data });

  }
  validation() {
    // if (this.FileUPloadForm.get('DeptID').value <= 0) {
    //   this.showmessage("Please Select Department");
    // }
    return true;
  }

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    this.formattedData = [];
    this.headerList = [];
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'name', header: 'File Name', index: 3 },
      { field: 'size', header: 'File Size', index: 2 },
      { field: 'type', header: 'File Type', index: 3 },
    ];
    console.log("this.formattedData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'name': el.name,
        'size': el.size,
        'type': el.type,
      });
    });

    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  BindHeader(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'name', header: 'File Name', index: 3 },
      { field: 'size', header: 'File Size', index: 2 },
      { field: 'type', header: 'File Type', index: 3 },
    ];
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
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

  onDownloadExcelFile(_filename: string) {
    this.exportToExcel(this.formattedData, _filename);
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
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

}