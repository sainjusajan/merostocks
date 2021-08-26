import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CreatePartnerComponent} from './create-partner/create-partner.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {path: 'create', component: CreatePartnerComponent},
]


@NgModule({
  declarations: [CreatePartnerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ]
})
export class PartnerModule { }
