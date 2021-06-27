import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  busy = false;
  loginError = false;
  registerForm !: FormGroup
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
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get f() {
    return this.registerForm.controls;
  }

  register() {
    console.log(this.registerForm.value);
    this.submitted = true
    if (this.registerForm.valid){
      this.busy = true;
      console.log('do sth')

      this.authService
        .register(this.registerForm.value)
        .pipe(finalize(() => (this.busy = false)))
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          (err) => this.errHandler(err)
        );
    }
  }

  errHandler(err: any) {
    this.busy = false;
    this.resetErr();
    if (err.email) {
      this.registerErr.email = (err.email as []).reduce((a, c) => {
        return a + ' ' + c;
      }, '');
    }
    if (err.password) {
      this.registerErr.password = (err.password as []).reduce((a, c) => {
        return a + ' ' + c;
      }, '');
    }
  }

  resetErr() {
    this.registerErr.email = '';
    this.registerErr.password = '';
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
