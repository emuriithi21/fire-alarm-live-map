import { Component, Input, OnInit } from '@angular/core';
import { EventService, Realtime } from '@c8y/ngx-components/api';
import * as L from 'leaflet';
import { IEvent } from '@c8y/client';

@Component({
    templateUrl: './demo-widget.component.html',
    styles: [ `.text { transform: scaleX(-1); font-size: 3em ;}` ]
})
export class WidgetDemo implements OnInit {

    public mymap: L.map = null;
    public marker: L.marker = null;
    public marker_added:boolean = false
    
      public defaultIcon = L.icon({
        iconUrl: require("~styles/marker-icon.png"),
        // ...
     });
      
    constructor(
      
        private eventService: EventService,
        private realtime:Realtime 
      

        ) {}

        ngOnInit(): void {


            this.mymap = L.map('mapid').setView([25.0694489560748, 55.1361319439252], 7);

            console.log('Loaded Map for Moro Live Map')
    
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'sk.eyJ1IjoiY2V3OTc2NSIsImEiOiJja3N1aGpvZHIwMjloMm9wdDh2ZnNkbWtiIn0.kmUh2ED3rl3LQAygquxr3w'
            }).addTo(this.mymap);

            let events_channel: string = "/events/16997973"

            const subscription = this.realtime.subscribe(events_channel, (data) => {
                console.log("Got an Event")
                console.log(data.data.data); // logs all alarm CRUD changes
                let event: IEvent = data.data.data 
                
                if (event.type=='add_marker')

                {   if(this.marker_added)
                    {
                        this.marker.remove()
                    }
                    let marker_location = event.position
                    this.mymap.setView([marker_location.lat, marker_location.lng], 16);
                    this.marker = L.marker([marker_location.lat, marker_location.lng], {icon: this.defaultIcon})
                    this.marker.addTo(this.mymap)
                    this.marker_added = true

                }

                else if(event.type=='remove_marker')

                {
                    if(this.marker_added)
                    {
                        this.marker.remove()
                        this.marker_added = false
                    }


                }
                
                
                            
              });

            

           
        }

       
    
}
