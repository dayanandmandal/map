import { Injectable } from '@angular/core';
import { OrsPlace, OrsPlaceModel } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  public parsePlaceDetails(detailsString: string): OrsPlaceModel {
    return JSON.parse(decodeURIComponent(detailsString));
  }

  public formatPlaceDetails(place: OrsPlace): string {
    if (!place) {
      return '';
    }
    return encodeURIComponent(JSON.stringify(place));
  }
}
