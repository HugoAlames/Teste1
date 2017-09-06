import { Component } from '@angular/core';
import { NavController, LoadingController  } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ContactPage } from '../contact/contact';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public origem: string = '';
  public origemLat: number = 0;
  public origemLong: number = 0;

  public destino: string = '';

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
    this.fetchContent();
  }

  fetchContent(): void{
    this.geolocation.getCurrentPosition().then((resp) => {
      this.origemLat = resp.coords.latitude;
      this.origemLong = resp.coords.longitude;
      this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+this.origemLat+','+this.origemLong+'&sensor=true').map(res=>res.json()).subscribe(data => {
          var address = data.results[0];
          this.origem = address.formatted_address;
        });
    }).catch((error) => {
    console.log('Error getting location', error);
    });
  }

  saveOrder():void{
    this.http.get('http://maps.googleapis.com/maps/api/geocode/json?address='+this.destino).map(res=>res.json()).subscribe(data => {
      let destinoLat;
      let destinoLong;

      var address = data.results[0];
      destinoLat = address.geometry.location.lat;
      destinoLong = address.geometry.location.lng;

      var headers = new Headers();
      headers.append('Content-Type', 'application/json;charset=utf-8' );
      headers.append('Authorization','ApiKey gustavo.faque@gmail.com:6a6b8221d44112c546791173f758a9e5900ecb9d');
      let options = new RequestOptions({ headers: headers });
      var teste = '{"query":"query { estimateOrder( city: 1 transportType: moto points: [ { lat: ' + this.origemLat + ', lng: ' + this.origemLong + ' } { lat: ' + destinoLat + ', lng: ' + destinoLong + ', hasService: false } ] ) { routeOptimized prices { label description slo sloDisplay estimatedCost distance originalEta } waypoints { index indexDisplay originalIndex originalIndexDisplay outOfCityCover error } } } "}'

      this.http.post("https://staging.loggi.com/public-graphql", teste, options)
      .map(res=>res.json())
      .subscribe(dataLogg => {
        this.navCtrl.push(ContactPage, {
          price1: dataLogg.data.estimateOrder.prices[0].estimatedCost,
          price2: dataLogg.data.estimateOrder.prices[1].estimatedCost,

          label1: dataLogg.data.estimateOrder.prices[0].label,
          label2: dataLogg.data.estimateOrder.prices[1].label,

          sloDisplay1: dataLogg.data.estimateOrder.prices[0].sloDisplay,
          sloDisplay2: dataLogg.data.estimateOrder.prices[1].sloDisplay,

          origem: this.origem,
          destino: this.destino
        });
       }, error => {
         console.log('err');
        console.log(error);// Error getting the data
      });

    });
  }
}