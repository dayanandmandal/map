import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrsSearchService } from '../services/ors-search.service';
import { MapModel, OrsPlace } from '../model/model';
import * as L from 'leaflet';
import { SerchResultListComponent } from '../shared/serch-result-list/serch-result-list.component';

@Component({
  selector: 'map-search',
  standalone: true,
  imports: [CommonModule, FormsModule, SerchResultListComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input() map: MapModel = null;
  searchTerm: string = '';
  searchResult: Array<OrsPlace> = [];
  @Output('searchResult') searchResultEmitter: EventEmitter<Array<OrsPlace>> =
    new EventEmitter<Array<OrsPlace>>();
  @Input() showResults: boolean = true;
  @Input() set value(value: string | undefined) {
    this.searchTerm = value || '';
  }

  constructor(public searchService: OrsSearchService) {}

  async search() {
    this.searchResult = await this.searchService.searchPlaces(this.searchTerm);
    this.searchResultEmitter.emit(this.searchResult);
  }

  setInputValue(selectedResult: OrsPlace) {
    this.searchTerm = selectedResult.name || selectedResult.label;
  }

  addMarker(selectedResult: OrsPlace) {
    const coordinates = selectedResult.coordinates;
    this.map?.setView(coordinates, 13);

    L.marker(coordinates)
      .addTo(this.map!)
      .bindPopup(selectedResult.name || selectedResult.label)
      .openPopup();

    this.clearSearch();
  }

  clearSearch() {
    this.searchResult = [];
  }
}
