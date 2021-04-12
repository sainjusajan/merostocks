import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IApplicationUser } from '../models/application-user';
import { AuthService } from '../services/auth.service';
import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  loading = false;
  accessToken: any;
  refreshToken: any;
  usr$: Observable<IApplicationUser>;
  partners: any[] = [];
  total = 0;
  prevTotal = 0;
  diff = '';
  formatter = new Intl.NumberFormat('hi', {
    style: 'currency',
    currency: 'NPR',
  });
  interval = this.getRefreshTimer();
  constructor(
    private readonly partnerService: PartnerService,
    private readonly authService: AuthService) {
    this.usr$ = authService.user$;
  }
  ngOnDestroy(): void {
    console.log('ng on destroy: Homecomponent');

    clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.refreshData(true);
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  handleReloadToggler(ev: MatSlideToggleChange) {
    console.log(ev.checked);
    if (!ev.checked) {
      console.log('clearing interval');

      clearInterval(this.interval);
    } else {
      this.interval = this.getRefreshTimer();
    }
  }
  getRefreshTimer() {
    return setInterval(() => {
      this.refreshData();
    }, 10000);
  }

  refreshData(init = false): void {
    this.loading = true;

    this.authService.user$.pipe(
      switchMap((x: IApplicationUser) => {
        return this.partnerService.getPartners(init, x.id);
      })
    )
    .subscribe(data => {
      this.loading = false;
      this.total = 0;
      this.prevTotal = 0;
      for (const item of data) {
        for (const ownership of item.partner.stock_ownerships) {
          const recs = [];
          for (const rec of item.records) {
            if (ownership.company.symbol === rec.company_symbol) {
              recs.push(rec);
            }
          }
          ownership['records'] = recs;
        }

        for (const ownership of item.partner.stock_ownerships) {
          this.total += parseFloat(ownership.records[0].stock_close) * ownership.balance;
          this.prevTotal += parseFloat(ownership.records[0].previous_close) * ownership.balance;
        }


      }
      this.partners = data;
      console.log(this.partners);

      this.updateTotalDiff();

    });
  }

  updateTotalDiff(): void {
    const formatter = new Intl.NumberFormat('hi', {
      style: 'currency',
      currency: 'NPR',
    });

    this.diff =
      this.total > this.prevTotal ?
        `+ ${formatter.format(this.total - this.prevTotal)}`
        : `- ${formatter.format(this.prevTotal - this.total)}`;
  }

}
