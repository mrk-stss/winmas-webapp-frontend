import { Component, OnInit, Input } from '@angular/core';
import { DeviceInfo, Location } from '../models/device-info';
import { Sort } from '@angular/material/sort';
import * as _ from "lodash";

@Component({
  selector: 'app-histogram-details',
  templateUrl: './histogram-details.component.html',
  styleUrls: ['./histogram-details.component.css']
})
export class HistogramDetailsComponent implements OnInit {

  @Input() set deviceInfo(deviceInfo: DeviceInfo) {
    this.setDeviceInfo(deviceInfo)
  }  

  @Input() set locations(locations: Location[]) {
    this.setLocations(locations)
  }

  @Input() deviceId: number
  /*@Input() deviceInfo: DeviceInfo
  @Input() set locations(locations: Location[]) {
    this.setLocations(locations)
  }*/
  deviceInfo2: DeviceInfo = new DeviceInfo()

  setDeviceInfo(deviceInfo: DeviceInfo){
    this.deviceInfo2=deviceInfo
    let new_date = new Date(this.deviceInfo2.last_update)
    this.deviceInfo2.last_update=new_date.toLocaleString()
  }

  setLocations(locations: Location[]) {
    this.locations_list = _.uniqBy(locations, (location) => {
      let date = new Date(location.date)
      return date.setSeconds(0)
    })

    _.forEach(locations, location => {
      let new_date = new Date(location.date)
      location.date = new_date.toLocaleString()
    })
  }

  locations_list: Location[]
  constructor() { }

  ngOnInit(): void {
  }

  sortedData: Location[];

  sortData(sort: Sort) {
    //var data = this.deviceInfo.locations.slice();
    //if (!sort.active || sort.direction === '') {
    //  this.sortedData = this.deviceInfo.locations.slice();
    //  return;
    //}

    this.locations_list.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return compare(a.date.toString(), b.date.toString(), isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
