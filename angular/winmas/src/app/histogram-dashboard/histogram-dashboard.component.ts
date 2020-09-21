import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { EspInfo } from '../models/esp-info';
import { ScatterService } from '../scatter.service';
import { Dates } from '../models/dates';
import { Device } from '../models/device';
import { DeviceDates } from '../models/device-dates';
import { DeviceInfo } from '../models/device-info';

@Component({
  selector: 'app-histogram-dashboard',
  templateUrl: './histogram-dashboard.component.html',
  styleUrls: ['./histogram-dashboard.component.css']
})
export class HistogramDashboardComponent implements OnInit {

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Most frequent devices', cols: 2, rows: 2, chart: true },
          //{ title: 'Table Positions', cols: 2, rows: 2, table: true },
          //{ title: 'Date selection', cols: 2, rows: 1, config: true },
          { title: 'Device Details', cols: 2, rows: 2, details: false },
        ];
      }

      return [
        { title: 'Most frequent devices', cols: 3, rows: 3, chart: true, visibility: true },
        //{ title: 'Date selection', cols: 1, rows: 1, config: true, visibility: true},
        //{ title: 'Table Positions', cols: 1, rows: 2, table: true, visibility: false },
        { title: 'Device Details', cols: 2, rows: 2, details: false, visibility: false },
      ];
    })
  );

  esps: EspInfo[] = []
  devicesDates: DeviceDates
  devices: Device[] = []
  cards2 = [
    { title: 'Most frequent devices', cols: 3, rows: 3, chart: true, visibility: true },
    //{ title: 'Date selection', cols: 1, rows: 1, config: true, visibility: true},
    //{ title: 'Table Positions', cols: 1, rows: 2, table: true, visibility: false },
    { title: 'Device Details', cols: 2, rows: 2, details: true, visibility: false },
  ]
  deviceIdDetails: number
  deviceInfo: DeviceInfo = new DeviceInfo()

  constructor(private breakpointObserver: BreakpointObserver, private scatterService: ScatterService) { }

  ngOnInit() {
    this.scatterService.getEsps().subscribe((esps: EspInfo[]) => {
      //console.log(esps)
      this.esps = []
      this.esps = esps
    });
  }

  public getDates(dates: Dates){
    console.log('submit dates from child ', dates)
    this.scatterService.getActiveDevices(dates).subscribe((devicesDates: DeviceDates) => {
      this.devicesDates = devicesDates
      console.log(devicesDates)
    })
    this.deviceInfo = new DeviceInfo()
    this.cards2[1].visibility = true
  }

  public getDevicesTable(devices: Device[]){
    console.log('submit devices from child ', devices)
    this.devices = devices
    
  }

  public getDeviceDetails(id:number){
    this.deviceIdDetails = id
    this.scatterService.getDeviceInfo(id).subscribe((data: DeviceInfo) => {
      this.deviceInfo = data
      console.log("device info: ", this.deviceInfo)
    })
    this.cards2[1].visibility = true
  }

}
