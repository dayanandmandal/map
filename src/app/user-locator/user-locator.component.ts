import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { MapModel } from '../model/model';
import { MapIconService } from '../services/map-icon.service';

@Component({
  selector: 'map-user-locator',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-locator.component.html',
  styleUrl: './user-locator.component.scss',
})
export class UserLocatorComponent {
  @Input() map: MapModel = null;
  private currentLocationCircle: L.Circle | null = null;
  private currentLocationMarker: L.Marker | null = null;

  constructor(private mapIconService: MapIconService) {}

  focusOnLocation(): void {
    if (this.map) {
      this.map.stop();

      this.map.locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true,
      });

      this.map.on('locationfound', (e: L.LocationEvent) => {
        if (this.currentLocationCircle) {
          this.currentLocationCircle.remove();
        }

        const radius = e.accuracy;
        const newCircle = L.circle(e.latlng, { radius: radius });
        newCircle.addTo(this.map!);
        this.currentLocationCircle = newCircle;

        if (this.currentLocationMarker) {
          this.currentLocationMarker.remove();
        }

        const newMarker = L.marker(e.latlng, {
          icon: this.mapIconService.currentLocationIcon,
        });
        newMarker.addTo(this.map!).bindPopup('Your Current Location');
        this.currentLocationMarker = newMarker;
      });

      // Handle error (location denied or unavailable)
      this.map.on('locationerror', (e: L.ErrorEvent) => {
        alert(e.message);
        console.error('Location error:', e.message);
      });
    } else {
      console.error('Map is not initialized.');
    }
  }
}
