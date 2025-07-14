import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserI } from 'src/app/models/app-interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  users: UserI[] = []
  originalUsers: UserI[] = []
  changes: Boolean = false;

  fUsers: UserI[] = []

  filter: Boolean = false;
  gStatusFilter: string = '';
  tStatusFilter: string = '';

  modal: Boolean = false;
  id = 0;

  async ngOnInit(): Promise<void> {
    this.users = await this.appService.getAllUsers();
    console.log("USERS: ", this.users)
    this.originalUsers = JSON.parse(JSON.stringify(this.users));
  }

  onRegister() {
    this.router.navigate(['main'])
  }

  onCheckboxChange() {
    this.changes = JSON.stringify(this.users) !== JSON.stringify(this.originalUsers);
  }

  updateUsers() {
    this.appService.updateUsers(this.users);
    this.originalUsers = JSON.parse(JSON.stringify(this.users));
    this.changes = false;
  }

  cleanTable() {
    this.users = JSON.parse(JSON.stringify(this.originalUsers));
    this.changes = false;
  }

  apply() {
    this.filter = this.gStatusFilter !== "" || this.tStatusFilter !== "";

    this.fUsers = this.originalUsers.filter(user => {
      const generalMatch = this.gStatusFilter === '' || String(user.generalOnbStatus) === this.gStatusFilter;
      const techMatch = this.tStatusFilter === '' || String(user.techOnbStatus) === this.tStatusFilter;
      return generalMatch && techMatch;
    });

    this.users = this.filter ? this.fUsers : this.originalUsers;
  }

  return() {
    this.modal = false;
  }

  async confirm() {
    await this.appService.deleteUser(this.id);
    this.users = this.originalUsers.filter(user => {
      return user.id !== this.id;
    });
    this.modal = false;
  }

  delete(id: any) {
    this.id = id;
    this.modal = true
  }
}
