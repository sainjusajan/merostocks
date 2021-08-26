import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {finalize} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent implements OnInit {
  busy = false;
  successMessage = ''
  loginError = false;
  createPartnerForm !: FormGroup
  showOptionalFields = false;
  startDate = new Date(1993, 1, 1)
  registerErr = {
    email: '',
    password: ''
  };
  submitted = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.createPartnerForm = this.fb.group({
      name: ['', Validators.required],
      dmat_number: [''],
      crn_number: [''],
      citizenship_number: [''],
      date_of_birth: [''],
      contact_number: [''],
      father_name: [''],
      grandfather_name: [''],
      account_number: [''],
      account_title: [''],
      email_address: ['', [Validators.email]],
      beneficiary_bank: [''],
    })
  }

  get f() {
    return this.createPartnerForm.controls;
  }

  register() {
    console.log(this.createPartnerForm.value);
    this.submitted = true
    if (this.createPartnerForm.valid) {
      this.busy = true;
      console.log('do sth')
      const birthDate = new Date(this.createPartnerForm.controls.date_of_birth.value)
      console.log(birthDate)
      this.authService
        .createPartner({...this.createPartnerForm.value, date_of_birth: birthDate.toISOString().split('T')[0]})
        .pipe(finalize(() => (this.busy = false)))
        .subscribe(
          () => {
            this.successMessage = 'Partner Created Successfully!'
            this.toastr.success('Partner Created Successfully!')
            this.router.navigate(['/']);
          },
          (err) => this.errHandler(err)
        );
    }
  }


  errHandler(err: any) {
    this.busy = false;
    this.resetErr();
    console.log(err)
  }

  resetErr() {
    this.registerErr.email = '';
    this.registerErr.password = '';
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
