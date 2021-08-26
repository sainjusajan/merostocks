import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

export interface DialogData {
  partnerName: string;
  partnerId: number;
}

interface ICompany {
  value: number;
  viewValue: string;
}



@Component({
  selector: 'app-add-stock-dialog',
  templateUrl: './add-stock-dialog.component.html',
  styleUrls: ['./add-stock-dialog.component.scss']
})
export class AddStockDialogComponent implements OnInit {
  addStockForm!: FormGroup
  submitted = false;
  companies: ICompany[] = [
    {value: 1, viewValue: 'Steak'},
    {value: 2, viewValue: 'Pizza'},
    {value: 3, viewValue: 'Tacos'}
  ];


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.addStockForm = this.fb.group({
      company: ['', Validators.required],
      balance: [10, Validators.required],
      partner: [this.data.partnerId, Validators.required],
    })
    console.log(this.companies)
  }

  get f() {
    return this.addStockForm.controls;
  }

  addStockHandler() {
    console.log(this.addStockForm.getRawValue())
  }

}
