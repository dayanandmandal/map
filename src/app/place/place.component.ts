import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeoPoint, MapModel, OrsPlace, OrsPlaceModel } from '../model/model';
import { UtilService } from '../services/util.service';
import { MapCoreService } from '../services/map-core.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { SearchComponent } from '../search/search.component';
import { ResultValuePipe } from '../shared/pipes/result-value.pipe';

@Component({
  selector: 'map-place',
  standalone: true,
  templateUrl: './place.component.html',
  styleUrl: './place.component.scss',
  imports: [SearchComponent, ResultValuePipe],
})
export class PlaceComponent implements OnInit, OnDestroy {
  placeDetails: OrsPlaceModel = null;
  map: MapModel = null;
  markerLayer: L.Marker | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService,
    private mapCoreService: MapCoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToGetMapInstance();
    this.getPlaceDetailsFromUrl();
  }

  subscribeToGetMapInstance() {
    this.mapCoreService
      .getMapInstance$()
      .pipe(
        filter((mapInstance) => !!mapInstance),
        takeUntil(this.destroy$)
      )
      .subscribe((mapInstance) => {
        this.map = mapInstance;
      });
  }

  getPlaceDetailsFromUrl() {
    const placeDetails =
      this.activatedRoute.snapshot.paramMap.get('placeDetails');

    if (placeDetails) {
      this.placeDetails = this.utilService.parsePlaceDetails(placeDetails);
    }

    if (this.placeDetails) {
      this.addMarker(this.placeDetails);
    }
    console.log('Parsed Place Details:', this.placeDetails);
  }

  addPlaceDetailsInUrl(placeDetails: OrsPlace) {
    const formattedDetails = this.utilService.formatPlaceDetails(placeDetails);
    const path = `/place/${formattedDetails}`;

    this.router.navigate([path], {
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });
  }

  setView(placeDetails: OrsPlace) {
    const coordinates: [number, number] = [
      placeDetails.latitude,
      placeDetails.longitude,
    ];
    this.map?.setView(coordinates, 15);
  }

  addMarker(placeDetails: OrsPlace) {
    const locatinPoint: GeoPoint = {
      latitude: placeDetails.latitude,
      longitude: placeDetails.longitude,
      accuracy: null,
    };

    this.markerLayer?.remove();
    this.markerLayer = this.mapCoreService.markLocation(
      this.map!,
      locatinPoint,
      placeDetails.name
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
