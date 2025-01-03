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
  first: any;
  rows: any;
  chartData: any;
  data: any;
  chartOptions: any;

  constructor(private fb: FormBuilder) {
    this.chartData = {
      labels: ['Used Space', 'Available Space'],
      datasets: [
        {
          data: [36, 64],
          backgroundColor: ['#66BB6A', '#C2C7CD'],
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

  ngOnInit(): void {
    // Initialize the form group
    this.AddUserForm = this.fb.group({
      projectname: [''], // Initialize the 'projectname' control
      beneficiaryOrg: [''],
      depositoryOrg: [''],
      agreementStartDate: [''],
      agreementEndDate: ['']
    });

    // Example to populate form with values (if required)
    this.AddUserForm.patchValue({
      projectname: 'Example Project',
      beneficiaryOrg: 'Organization A',
      depositoryOrg: 'Organization B',
      agreementStartDate: '2024-11-01',
      agreementEndDate: '2024-12-31'
    });
  }





  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
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
      { field: 'roleName', header: 'USER NAME', index: 3 },
      { field: '', header: 'ROLE', index: 2 },
      { field: '', header: 'PERMISSION', index: 2 },
      { field: '', header: 'CREATED DATE', index: 2 },

    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'id': el.id,
        'roleName': el.roleName,
        'remarks': el.remarks,
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
      { field: 'permissionName', header: 'UPLOADED FILES', index: 3 },
      { field: 'remarks', header: 'UPLOADED BY', index: 2 },
      { field: 'remarks', header: 'UPLOADED DATE', index: 2 },
      { field: 'remarks', header: 'SIZE', index: 2 },
    ];
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'id': el.id,
        'permissionName': el.permissionName,
        'remarks': el.remarks,
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
