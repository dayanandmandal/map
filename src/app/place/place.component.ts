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
  isInitialLoad: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService,
    private mapCoreService: MapCoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToGetMapInstance();
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
        this.subscribeToPlaceDetailsChange();
      });
  }

  subscribeToPlaceDetailsChange() {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const placeDetailsParam = params.get('placeDetails');
        let newDetails: OrsPlaceModel = null;

        if (placeDetailsParam && placeDetailsParam !== 'null') {
          newDetails = this.utilService.parsePlaceDetails(placeDetailsParam);
        }

        this.placeDetails = newDetails;

        this.removeMarker();

        if (this.map && this.placeDetails) {
          this.addMarker(this.placeDetails);
          // when user comes to this direct with placDetails, view is set by view component
          // based on query params longitude, latitude, zoom.
          // here we only want to change view when user serach and select new place
          if (!this.isInitialLoad) this.setView(this.placeDetails);
        }

        this.isInitialLoad = false;
      });
  }

  removeMarker() {
    if (this.markerLayer) {
      this.markerLayer.remove();
      this.markerLayer = null;
    }
  }

  addPlaceDetailsInUrl(placeDetails: OrsPlaceModel) {
    const formattedDetails = this.utilService.formatPlaceDetails(placeDetails);
    const path = `/place/${formattedDetails}`;
    this.route(path);
  }

  route(path: string) {
    this.router.navigate([path], {
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });
  }

  setView(placeDetails: OrsPlaceModel) {
    if (!placeDetails) return;

    const coordinates: [number, number] = [
      placeDetails.latitude,
      placeDetails.longitude,
    ];
    this.map?.setView(coordinates, 15);
  }

  addMarker(placeDetails: OrsPlaceModel) {
    if (!placeDetails) return;

    const locatinPoint: GeoPoint = {
      latitude: placeDetails.latitude,
      longitude: placeDetails.longitude,
      accuracy: null,
    };

    this.markerLayer = this.mapCoreService.markLocation(
      this.map!,
      locatinPoint,
      placeDetails.name,
      false
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
