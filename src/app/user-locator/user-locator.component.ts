import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'map-user-locator',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-locator.component.html',
  styleUrl: './user-locator.component.scss',
})
export class UserLocatorComponent {
  @Input() map: L.Map | undefined;

  focusOnLocation(): void {
    if (this.map) {
      // Clear any existing focus/marker before finding a new one
      this.map.stop();

      // Use Leaflet's locate method
      this.map.locate({
        setView: true, // Automatically pan the map to the found location
        maxZoom: 16, // Set a maximum zoom level upon location
        enableHighAccuracy: true, // Request the best possible location data
      });

      // Handle success (location found)
      this.map.on('locationfound', (e: L.LocationEvent) => {
        // Remove old marker if it exists (for subsequent clicks)
        // You'll need to manage the marker as a class property for this

        // Add a circle marker to show accuracy radius
        const radius = e.accuracy;
        L.circle(e.latlng, { radius: radius }).addTo(this.map!);

        // Add a basic location marker
        L.marker(e.latlng)
          .addTo(this.map!)
          .bindPopup('Your Current Location')
          .openPopup();
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
