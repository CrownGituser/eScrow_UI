import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
am4core.useTheme(dataviz);
am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-project-dashboard-screen',
  templateUrl: './project-dashboard-screen.component.html',
  styleUrls: ['./project-dashboard-screen.component.scss']
})
export class ProjectDashboardScreenComponent implements OnInit {
  AddUserForm: FormGroup;
  private _FilteredList: any;
  selected: any;
  activeRow: any;
  RoleForm: any;
  first: any =0;;
  rows: any;
  chartData: any;
  data: any;
  chartOptions: any;
  ProjectName:string;
  StartDate:string;
  EndDate:string;
  Status:string;
  Contributor:string;
  SizeAllocation:number;
  SizeUsed:number;
  _FilteredList_FU:any;

  constructor(private fb: FormBuilder,
 
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,

  ) {} 
  ngOnInit(): void {
    // Initialize the form group
    this.AddUserForm = this.fb.group({
      projectname: [''], // Initialize the 'projectname' control
      beneficiaryOrg: [''],
      depositoryOrg: [''],
      agreementStartDate: [''],
      agreementEndDate: ['']
    });
  
    this.GetProjectDetails();
    this.GetProjectUserDetails();
    this.getProjectFileUploadDetails(); 
  }
  LoadChart()
  {

    // alert(this.SizeUsed);
    // alert(this.SizeAllocation);
  
      this.chartData = {
        labels: ['Used Space', 'Available Space'],
        datasets: [
          {
            data: [this.SizeUsed, this.SizeAllocation],
            backgroundColor: ['#ea5545', '#bdcf32'], // Red for SizeUsed, Green for SizeAllocation
            hoverBackgroundColor: ['#57A65A', '#B3BCC4']
          }
        ]
      };
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            enabled: true
          }
        }
      }; 
  }

 
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  GetProjectDetails() {

    let  _ProjectID = 1;
     // let  __TempID = this.EditIndexingForm.controls['TemplateID'].value;  
      const apiUrl=this._global.baseAPIUrl+'Master/getProjectDetails?ProjectID='+_ProjectID+'&user_Token='+ localStorage.getItem('User_Token');
  
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {

        this.ProjectName =data[0].ProjectName;
        this.StartDate =data[0].StartDate;
        this.EndDate =data[0].EndDate;
        this.Status ="Active";
        this.Contributor="1";
        this.SizeUsed =data[0].SizeUsed;
        this.SizeAllocation =data[0].SizeAllocation; 
        this.LoadChart();

      });
  
      }

      GetProjectUserDetails() {

        let  _ProjectID = 1;
         // let  __TempID = this.EditIndexingForm.controls['TemplateID'].value;  
          const apiUrl=this._global.baseAPIUrl+'Master/getProjectUserDetails?ProjectID='+_ProjectID+'&user_Token='+ localStorage.getItem('User_Token');
      
          this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
          this._FilteredList = data;
          this.prepareTableData(this._FilteredList,this._FilteredList); 
          });
      
          }

          getProjectFileUploadDetails() {

            let  _ProjectID = 1;
             // let  __TempID = this.EditIndexingForm.controls['TemplateID'].value;  
              const apiUrl=this._global.baseAPIUrl+'Master/getProjectFileUploadDetails?ProjectID='+_ProjectID+'&user_Token='+ localStorage.getItem('User_Token');
          
              this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
         
                this._FilteredList_FU = data;
                this.prepareTableDataForPermissions(this._FilteredList_FU,this._FilteredList_FU);
        
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
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'Username', header: 'USER NAME', index: 3 },
      { field: 'ROLENAME', header: 'ROLE', index: 2 },
      { field: 'PERMISSIONNAME', header: 'PERMISSION', index: 2 },
      { field: 'CREATIONDATE', header: 'CREATED ON', index: 2 },

    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'Username': el.Username,
        'ROLENAME': el.ROLENAME,
        'PERMISSIONNAME': el.PERMISSIONNAME,
        'CREATIONDATE': el.CREATIONDATE,
      });

    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }



  formattedDataForPermissions: any = [];
  headerListForPermissions: any;
  immutableFormattedDataForPermissions: any;
  prepareTableDataForPermissions(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'File_Name', header: 'FILE NAME', index: 3 },
      { field: 'FileSize', header: 'SIZE', index: 2 },
      { field: 'Upload_By', header: 'UPLOAD BY', index: 2 },
      { field: 'Upload_Date', header: 'UPLOAD ON', index: 2 },
     
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'Upload_Date': el.Upload_Date,
        'File_Name': el.File_Name,
        'Upload_By': el.Upload_By,
        'FileSize': el.FileSize + ' MB',
      });

    });
    this.headerListForPermissions = tableHeader;
    this.immutableFormattedDataForPermissions = JSON.parse(JSON.stringify(formattedData));
    this.formattedDataForPermissions = formattedData;
    this.loading = false;
    console.log(this.formattedDataForPermissions);
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
  // ------------------------------







  // ------------------------------

}
