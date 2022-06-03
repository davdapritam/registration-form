import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  user: any;
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) { }
  activeURL: string = '';

  ngOnInit(): void {
    this.user = JSON.parse(this.auth.getUserDetails());
    console.log(this.router.url);
    this.activeURL = this.router.url;
  }

  selectMenu(selection: string): void{
    this.activeURL = selection;
  }


  logoutEvent(): void{
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  profile(): void{
    this.router.navigate(['/seller/profile']);
  }
}
