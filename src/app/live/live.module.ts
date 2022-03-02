import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveComponent } from './live.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  {path: '', component: LiveComponent, pathMatch: 'full'},
];


@NgModule({
  declarations: [LiveComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ]
})
export class LiveModule { }
