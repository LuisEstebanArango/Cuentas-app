import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events,
    private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      events.subscribe('saveItem', (description, value) => {
        return this.saveItem(description, value);
      });

      events.subscribe('saveMonth', (value) => {
        return this.saveMonth(value);
      });

      events.subscribe('getMonth', () => {

      });

    });
  }

  saveItem(description, value) {
    let month = moment().format('YYYYMM');
    let item = {
      id : 0,
      description : description,
      value : value,
      date : moment().format('DD hh:mm a')
    };

    this.storage.get(month).then((data) => {
      console.log(data);
      if (data != null && data.length != 0) {
        item.id = data[data.length - 1].id + 1;
        data.push(item);
        this.storage.set(month, data);
      } else {
        item.id = 1;
        let array = [];
        array.push(item);
        this.storage.set(month, array);
      }
    });
    return true;
  }

  saveMonth(value){
    let month = moment().format('YYYYMM');
    this.storage.set(month, value);
  }

  getMonth(){
    let month = moment().format('YYYYMM');
    this.storage.get(month).then((data) => {
      console.log(data);
      return data != null ? data : [];
    });
  }
}
