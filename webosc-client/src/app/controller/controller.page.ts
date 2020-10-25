import { Component, HostListener, OnInit } from '@angular/core';

import * as convert from 'color-convert';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.page.html',
  styleUrls: ['./controller.page.scss'],
})
export class ControllerPage implements OnInit {

  color: string = '#fff';
  osc = (<any>window).osc;
  oscPort;
  oscPortReady:boolean = false;
  clipSelection:number = 1;

  touchCoords = {
    x: null,
    y: null
  }

  constructor() {
  }

  ngOnInit() {

    this.oscPort = new this.osc.WebSocketPort({
      url: 'ws://192.168.8.102:8080',
      metadata: true
    });

    this.oscPort.on("ready", () => {
      this.oscPortReady = true;

      this.oscPort.on("message", function (oscMsg) {
        console.log("An OSC message just arrived!", oscMsg);
      });
    });

    
  }

  send(){
    this.oscPort.open();

    let RGB = convert.hex.rgb(this.color);
    console.log(RGB);
    if(this.oscPortReady){
      this.oscPort.send({
        address: '/composition/layers/1/clips/'+ this.clipSelection + '/connect',
        args: [
          {
              type: "i",
              value: 1
          }
        ]
      })
      this.oscPort.send({
        address: '/composition/layers/1/clips/'+ this.clipSelection + '/video/effects/solidcoloreffect/effect/color',
        args: [
          {
            type: "r",
            value: {
              r: RGB[0],
              g: RGB[1],
              b: RGB[2],
              a: 1.0
            }
          }
        ]
      });
    }
  }

  handleTouch(event:TouchEvent){
    this.touchCoords = {
      x: event.changedTouches[0].pageX,
      y: event.changedTouches[0].pageY
    }

    this.color = '#' + convert.rgb.hex(
      this.convert(this.touchCoords.x, 0, 375, 0, 255),
      this.convert(this.touchCoords.y, 0, 812, 0, 255),
      100
    );
    this.send();
    console.log(this.color);

  }

  convert(oldValue, oldMin, oldMax, newMin, newMax){
    return ( (oldValue - oldMin) / (oldMax - oldMin) ) * (newMax - newMin) + newMin;
  }

}
