import { Injectable } from '@angular/core';
import { OrsPlaceModel } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  public parsePlaceDetails(detailsString: string): OrsPlaceModel {
    return JSON.parse(decodeURIComponent(detailsString));
  }

  public formatPlaceDetails(place: OrsPlaceModel): string {
    if (!place) {
      return 'null';
    }
    return encodeURIComponent(JSON.stringify(place));
  }
}
