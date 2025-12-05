import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrsSearchService } from '../services/ors-search.service';
import { GeoPoint, MapModel, OrsPlace } from '../model/model';
import { SerchResultListComponent } from '../shared/serch-result-list/serch-result-list.component';
import { UtilService } from '../services/util.service';
import { MapCoreService } from '../services/map-core.service';

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
  @Output('selectedResult') selectedResultEmitter: EventEmitter<OrsPlace> =
    new EventEmitter<OrsPlace>();
  @Input() showResults: boolean = true;
  @Input() set value(value: string | undefined) {
    this.searchTerm = value || '';
  }

  constructor(
    public searchService: OrsSearchService,
    public utilService: UtilService,
    private mapCoreService: MapCoreService
  ) {}

  async search() {
    this.searchResult = await this.searchService.searchPlaces(this.searchTerm);
    this.searchResultEmitter.emit(this.searchResult);
  }

  setInputValue(selectedResult: OrsPlace) {
    this.searchTerm = selectedResult.name || selectedResult.label;
    this.selectedResultEmitter.emit(selectedResult);
  }

  setViewAndAddMarker(selectedResult: OrsPlace) {
    const coordinates: [number, number] = [
      selectedResult.latitude,
      selectedResult.longitude,
    ];
    this.map?.setView(coordinates, 14);

    const locationPoint: GeoPoint = {
      latitude: selectedResult.latitude,
      longitude: selectedResult.longitude,
      accuracy: null,
    };

    this.mapCoreService.markLocation(
      this.map!,
      locationPoint,
      selectedResult.name
    );

    this.clearSearch();
  }

  clearSearch() {
    this.searchResult = [];
  }
}
