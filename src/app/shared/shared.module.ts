import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerOverviewComponent } from './partner-overview/partner-overview.component';
import { StockRecordComponent } from './stock-record/stock-record.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { UnauthorizedInterceptor } from '../interceptors/unauthorized.interceptor';
import { appInitializer } from '../services/app-initializer';
import { AuthService } from '../services/auth.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NocommaPipe } from './pipes/nocomma.pipe';
import {MatCardModule} from '@angular/material/card';
import { AddStockDialogComponent } from './add-stock-dialog/add-stock-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [PartnerOverviewComponent, StockRecordComponent, NocommaPipe, AddStockDialogComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    PartnerOverviewComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule { }
