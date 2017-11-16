import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  description:any;
  value:any;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public events: Events,
    public toastCtrl: ToastController) {
  }

  logEvent(event) {
    if ( this.description && this.value ) {
      let saved = this.events.publish('saveItem', this.description, this.value );
      if (saved) {
        var toast = this.toastCtrl.create({
          message: 'Datos guardados',
          duration: 3000
        });
        this.description = "";
        this.value = "";
      } else {
        var toast = this.toastCtrl.create({
          message: 'Ocurrio un problema al guardar',
          duration: 3000
        });
      }
      toast.present();
    } else {
      let alert = this.alertCtrl.create({
        subTitle: 'La descripción y el valor son obligatorios',
        buttons: ['OK']
      });
      alert.present();
    }

  }

}
