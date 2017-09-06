import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public price1: string = '';
  public price2: string = '';

  public label1: string = '';
  public label2: string = '';

  public sloDisplay1: string = '';
  public sloDisplay2: string = '';

  public origem: string = '';
  public destino: string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.price1 = this.navParams.get('price1');
    this.price2 = this.navParams.get('price2');

    this.label1 = this.navParams.get('label1');
    this.label2 = this.navParams.get('label2');

    this.sloDisplay1 = this.navParams.get('sloDisplay1');
    this.sloDisplay2 = this.navParams.get('sloDisplay2');

    this.origem = this.navParams.get('origem');
    this.destino = this.navParams.get('destino');
  }

}