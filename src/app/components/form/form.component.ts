import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserI } from 'src/app/models/app-interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  userI: UserI = {
    fullname: '',
    email: '',
    date: '',
    generalOnbStatus: false,
    techOnbStatus: false,
    techOnbDate: "null"
  }
  userList: UserI[] = [];
  modalData = {
    modal: false,
    title: '',
    btnText1: 'Regresar',
    btnText2: '',
    navigateTo: '',
    hide: true
  }

  async onRegister() {

    const response = await this.appService.createUser(this.userI);
    console.log(response.status);
    this.modalData.modal = !!response.status;
    if (response.status === 200) {
      this.modalData.title = '¡Se creó el usuario!';
      this.modalData.btnText2 = 'Ver usuarios';
      this.modalData.hide = false;
    }
    else if (response.status === 409) {
      this.modalData.title = 'El colaborador ya existe';
      this.modalData.btnText2 = '';
    }
  }

  modalNav(option: string) {
    console.log("option", option);
    const path = option === '/details' ? [option, 'dashboard'] : [option];
    console.log("path", path);

    this.router.navigate(path);
    this.modalData.modal = false;
  }
}
