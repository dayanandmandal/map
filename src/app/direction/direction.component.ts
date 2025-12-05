import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MapModel, OrsPlace } from '../model/model';
import { SerchResultListComponent } from '../shared/serch-result-list/serch-result-list.component';
import { ResultValuePipe } from '../shared/pipes/result-value.pipe';

@Component({
  selector: 'map-direction',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    SerchResultListComponent,
    ResultValuePipe,
  ],
  templateUrl: './direction.component.html',
  styleUrl: './direction.component.scss',
})
export class DirectionComponent {
  @Input() map: MapModel = null;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  searchResults: Array<OrsPlace> = [];
  selectedResults: Array<OrsPlace> = [];
  activeInputIndex: number = 0;

  setSearchResults(results: Array<OrsPlace>) {
    this.searchResults = results;
  }

  handleSearchResults(selectedResult: OrsPlace) {
    this.selectedResults[this.activeInputIndex] = selectedResult;
    this.searchResults = [];
    console.log(this.selectedResults);
  }

  closeDirection() {
    this.close.emit(true);
  }
}
