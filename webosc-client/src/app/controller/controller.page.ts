import { Component, HostListener, OnInit } from '@angular/core';

import * as convert from 'color-convert';

import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.page.html',
  styleUrls: ['./controller.page.scss'],
})
export class ControllerPage implements OnInit {

  @HostListener('window:compassneedscalibration', ['$event'])
  onCalibrationMessage(event) {
    this.message = event;
  }

  @HostListener('window:devicemotion', ['$event'])
  onMotionMessage(e:DeviceMotionEvent) {
    this.sensorData.acceleration.x = Math.round(e.acceleration.x);
    this.sensorData.acceleration.y = Math.round(e.acceleration.y);
    this.sensorData.acceleration.z = Math.round(e.acceleration.z);
    if(this.sensorData.acceleration.x > this.sensorData.acceleration.max.x){
      this.sensorData.acceleration.max.x = this.sensorData.acceleration.x;
    }
    if(this.sensorData.acceleration.y > this.sensorData.acceleration.max.y){
      this.sensorData.acceleration.max.y = this.sensorData.acceleration.y;
    }
    if(this.sensorData.acceleration.z > this.sensorData.acceleration.max.z){
      this.sensorData.acceleration.max.z = this.sensorData.acceleration.z;
    }
    if(
      this.sensorData.acceleration.max.x > this.threshold.x &&
      this.sensorData.acceleration.max.z > this.threshold.z
    ){
      window.navigator.vibrate(200);
      this.sensorData.acceleration.max = {
        x: 0,
        y: 0,
        z: 0
      }
      this.send();
    }
  }

  @HostListener('window:deviceorientation', ['$event'])
  onOrientationMessage(e:DeviceOrientationEvent) {
    this.sensorData.orientation.alpha = Math.round(e.alpha);
    this.sensorData.orientation.beta = Math.round(e.alpha);
    this.sensorData.orientation.gamma = Math.round(e.alpha);
  }

  color: string = '#fff';
  osc = (<any>window).osc;
  oscPort;
  oscPortReady:boolean = false;
  clipSelection:number = 1;

  touchCoords = {
    x: null,
    y: null
  }

  threshold = {
    x: 15,
    y: 0,
    z: 15
  }

  message;
  sensorData = {
    orientation: {
      alpha: 0,
      beta: 0,
      gamma: 0
    },
    acceleration: {
      x: 0,
      y: 0,
      z: 0,
      max: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  };

  constructor(
  ) {
  }

  ngOnInit() {

    this.oscPort = new this.osc.WebSocketPort({
      url: 'wss://192.168.1.102:8080',
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
        address: '/composition/layers/1/clips/'+ this.clipSelection + '/video/source/solidcolor/color',
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
