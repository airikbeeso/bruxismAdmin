import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  page = 0;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    
  }
  setPage(np: number) {
    this.page = np;

  }
  async dataExport() {

  }

}
