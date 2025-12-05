import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrsPlace } from '../../model/model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'map-serch-result-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './serch-result-list.component.html',
  styleUrl: './serch-result-list.component.scss',
})
export class SerchResultListComponent {
  @Input() results: Array<OrsPlace> = [];
  @Output() selectedResult = new EventEmitter<OrsPlace>();

  emitResult(result: OrsPlace) {
    this.selectedResult.emit(result);
  }
}
