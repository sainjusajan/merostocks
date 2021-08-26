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
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.refreshData(true);
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  handleReloadToggler(ev: MatSlideToggleChange) {
    if (!ev.checked) {
      clearInterval(this.interval);
    } else {
      this.interval = this.getRefreshTimer();
    }
  }
  getRefreshTimer() {
    return setInterval(() => {
      this.refreshData(false);
    }, 10000);
  }

  refreshData(init = false): void {
    this.loading = true;

    this.authService.user$.pipe(
      switchMap((x: IApplicationUser) => {
        return this.partnerService.getPartners(init);
      })
    )
      .subscribe(partners => {
        this.loading = false;
        this.total = 0;
        this.prevTotal = 0;
        this.initPartners(partners);

      });
  }

  initPartners(partners: any[]) {
    for (const partner of partners) {
      partner['records'] = partner.ownerships.reduce((a: any, c: any) => {
        return a.concat({ ...c.record, balance: c.balance });
      }, []);
      this.total += partner['records'].reduce((a: any, c: any) => {
        return a += (parseFloat(c.stock_close) * c.balance);
      }, 0);
      this.prevTotal += partner['records'].reduce((a: any, c: any) => {
        return a += (parseFloat(c.previous_close) * c.balance);
      }, 0);

    }
    this.partners = partners;
    this.updateTotalDiff();
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
