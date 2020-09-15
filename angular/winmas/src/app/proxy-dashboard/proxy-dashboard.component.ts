import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProxyService } from '../proxy.service';
import { ProxyConfig } from '../models/proxy-config';
import { Observable, Subscription } from 'rxjs';
import { ProxyStatus } from '../models/proxy-status';

@Component({
  selector: 'app-proxy-dashboard',
  templateUrl: './proxy-dashboard.component.html',
  styleUrls: ['./proxy-dashboard.component.css']
})
export class ProxyDashboardComponent implements OnInit, OnDestroy {

  cards = [
    { title: 'Proxy config', cols: 3, rows: 1, chart: true, visibility: true },
    { title: 'Proxy Status', cols: 1, rows: 1, status: true, visibility: true},
    { title: 'Proxy Logger', cols: 4, rows: 2, logger: true, visibility: true},
  ]

  messages = []
  locations: Location[] = []
  new_locations: Location[] = []
  current_status: ProxyStatus
  location_subscription: Subscription
  status_subscription: Subscription
  constructor(private proxyService: ProxyService) { }

  ngOnInit(): void {

    // this.location_subscription = this.proxyService.getLocations().subscribe( locations => {
    //   console.log("location ricevuto: ", locations)
    //   //this.locations.push(location)
    //   this.new_locations = Array.from(this.locations)
    // })

    this.proxyService.getCurrentStatus().subscribe( (status:ProxyStatus) => {
      console.log("new status: ", status)
      this.current_status=status
      if (status.status == "on"){
        this.cards[2].visibility=true
      }else{
        this.cards[2].visibility=false
      }
    })

    this.location_subscription = this.proxyService.locations$.subscribe(locations => {
      this.new_locations = Array.from(locations)
    })

    this.status_subscription = this.proxyService.current_status$.subscribe(status => {
      this.current_status = status
    })
  }

  ngOnDestroy(): void{

    if (this.status_subscription){
      this.status_subscription.unsubscribe()
    }

    if (this.location_subscription){
      this.location_subscription.unsubscribe()
    }
    
  }

  public setProxyConf(proxyConf: ProxyConfig){
    console.log("ricevuto: ",proxyConf)

    this.proxyService.startProxy(proxyConf).subscribe( () =>{
      console.log("proxy acceso")
      this.cards[2].visibility = true
    })
  }

  public stopProxy(){
    console.log("stopping proxy")
    this.cards[2].visibility = false
    this.proxyService.stopProxy().subscribe(() => {
      console.log("proxy spento")
      
    })
  }
}
