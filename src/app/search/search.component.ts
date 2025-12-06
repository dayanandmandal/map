import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrsSearchService } from '../services/ors-search.service';
import { GeoPoint, MapModel, OrsPlace, OrsPlaceModel } from '../model/model';
import { SerchResultListComponent } from '../shared/serch-result-list/serch-result-list.component';
import { UtilService } from '../services/util.service';
import { MapCoreService } from '../services/map-core.service';
import { ResultValuePipe } from '../shared/pipes/result-value.pipe';

@Component({
  selector: 'map-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SerchResultListComponent,
  ],
  providers: [ResultValuePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input() map: MapModel = null;
  searchTerm: string = '';
  searchResult: Array<OrsPlace> = [];
  @Output('searchResult') searchResultEmitter: EventEmitter<Array<OrsPlace>> =
    new EventEmitter<Array<OrsPlace>>();
  @Output('selectedResult')
  selectedResultEmitter: EventEmitter<OrsPlace | null> =
    new EventEmitter<OrsPlace | null>();
  @Input() showResults: boolean = true;
  selectedPlace: OrsPlaceModel = null;
  @Input() set result(value: OrsPlaceModel) {
    if (value) {
      this.searchTerm = this.resultValuePipe.transform(value);
      this.selectedPlace = value;
    }
  }

  constructor(
    public searchService: OrsSearchService,
    public utilService: UtilService,
    private resultValuePipe: ResultValuePipe
  ) {}

  async search() {
    this.searchResult = await this.searchService.searchPlaces(this.searchTerm);
    this.searchResultEmitter.emit(this.searchResult);
  }

  setInputValue(selectedResult: OrsPlace) {
    this.searchTerm = selectedResult.name || selectedResult.label;
    this.selectedPlace = selectedResult;
    this.selectedResultEmitter.emit(selectedResult);
  }

  clearInput() {
    this.searchTerm = '';
    this.selectedPlace = null;
    this.selectedResultEmitter.emit(null);
  }

  clearSearch() {
    this.searchResult = [];
  }
}
