import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  monthCurrent: any=[];
  title: string;
  total: any=0;
  let formatter = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0
  });

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public events: Events,
    private storage: Storage) {
    // if( 1==1 ) {
    //   this.storage.clear();
    // }
  }

  ionViewDidEnter() {
    this.updateList();
  }

  updateList() {
    let month = moment().format('YYYYMM');
    this.title = this.capitalizeFirstLetter(moment().locale('es').format('MMMM/YYYY'));
    this.storage.get(month).then((data) => {
      this.monthCurrent = data != null ? data : [];
      this.total = 0;
      for (let i of this.monthCurrent) {
        this.total += Number(i.value);
      }
      this.total = this.formatter.format(this.total);//.replace(/^(\D+)/, '$1 ');
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  edit(item){
    let alert = this.alertCtrl.create({
        title: 'Editar',
        inputs: [
          {
            name: 'description',
            placeholder: 'Descripción',
            value: item.description
          },
          {
            name: 'valor',
            placeholder: 'Valor',
            type: 'number',
            value: item.value
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Guardar',
            handler: data => {
              if ( data.description && data.valor ) {
                this.editItem(item.id, data.description, data.valor );
              } else {
                let alert = this.alertCtrl.create({
                  subTitle: 'La descripción y el valor son obligatorios',
                  buttons: ['OK']
                });
                alert.present();
              }
            }
          }
        ]
      });
      alert.present();
  }

  editItem(id, description, value){
    let month = moment().format('YYYYMM');
    this.storage.get(month).then((data) => {
      for (let i in data) {
        if (data[i].id == id){
          data[i].description = description;
          data[i].value = value;
          break;
        }
      }
      this.storage.set(month, data).then(()=>{
        this.updateList();
      });
    });
  }

  remove(item){
    let alert = this.alertCtrl.create({
        title: 'Confirmar',
        message: '¿Desea eliminar \'' + item.description + '\'?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Eliminar',
            handler: () => {
              for (let i in this.monthCurrent) {
                if (this.monthCurrent[i].id == item.id) {
                  this.monthCurrent.splice(i, 1);
                  break;
                }
              }
              let month = moment().format('YYYYMM');
              this.storage.set(month, this.monthCurrent).then(() => {
                this.updateList();
              });
              //this.events.publish('saveMonth', this.monthCurrent );

            }
          }
        ]
      });
      alert.present();
  }

}
