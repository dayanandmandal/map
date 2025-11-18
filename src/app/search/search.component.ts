import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrsSearchService } from '../services/ors-search.service';
import { OrsPlace } from '../model/model';
import * as L from 'leaflet';

@Component({
  selector: 'map-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchTerm: string = '';
  searchResult: Array<OrsPlace> = [];
  @Input() map: L.Map | undefined;

  constructor(public searchService: OrsSearchService) {}

  async search() {
    this.searchResult = await this.searchService.searchPlaces(this.searchTerm);
  }

  addMarker(selectedResult: OrsPlace) {
    const coordinates = selectedResult.coordinates;
    this.map?.setView([coordinates[1], coordinates[0]], 13);

    L.marker([coordinates[1], coordinates[0]])
      .addTo(this.map!)
      .bindPopup('Searched Location')
      .openPopup();

    this.clearSearch();
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResult = [];
  }
}
