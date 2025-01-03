import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-git-lab-selection',
  templateUrl: './git-lab-selection.component.html',
  styleUrls: ['./git-lab-selection.component.scss']
})
export class GitLabSelectionComponent implements OnInit {
  GitSelectionForm: FormGroup;

  constructor(
    private router : Router,
    private formBuilder : FormBuilder,
  )  {}

  ngOnInit() {
    this.GitSelectionForm = this.formBuilder.group(
      {
        id:[""],
        projectname:["",Validators.required],
      //  name:["",[Validators.required, Validators.pattern(/^[a-zA-Z\-\s]+$/)],],
        gitUser:["",Validators.required],
        pwd:["",[Validators.required,  Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/), ],],
        repositoryname:["",Validators.required],
        token:["",Validators.required]

      }
    )
  }

  get f() {
    return this.GitSelectionForm?.controls;
  }
  

  OnBack(){
    this.router.navigate(['/master/configuration']);
  }

  
  onSubmit()
  {
    if (this.GitSelectionForm.valid){
      
    }
  }

  OnReset(): void{
    this.GitSelectionForm.reset();

  }


}
