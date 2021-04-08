import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerOverviewComponent } from './partner-overview/partner-overview.component';
import { StockRecordComponent } from './stock-record/stock-record.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { UnauthorizedInterceptor } from '../interceptors/unauthorized.interceptor';
import { appInitializer } from '../services/app-initializer';
import { AuthService } from '../services/auth.service';



@NgModule({
  declarations: [PartnerOverviewComponent, StockRecordComponent],
  imports: [
    CommonModule
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
