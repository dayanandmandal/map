import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserLocatorComponent } from '../user-locator/user-locator.component';
import { SearchComponent } from '../search/search.component';
import { DirectionComponent } from '../direction/direction.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MapCoreService } from '../services/map-core.service';
import { MapModel, MapQueryParams } from '../model/model';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { NavigationStatusService } from '../services/navigation-status.service';

@Component({
  selector: 'map-view',
  standalone: true,
  imports: [
    UserLocatorComponent,
    SearchComponent,
    DirectionComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent implements OnInit, OnDestroy {
  map: MapModel = null;
  isDirectionalMode: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private mapCoreService: MapCoreService,
    private router: Router,
    private navigationStatusService: NavigationStatusService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.init();
    this.subscribeToGetMapInstance();
  }

  init() {
    this.mapCoreService.fetchUserLocation().subscribe((location) => {
      this.mapCoreService.initializeMap(
        document.getElementById('map-container') as HTMLElement,
        location
      );
    });
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
        this.readParamsAndSetView();
        this.addMapMoveListener();
        this.checkNavigationOngoingAndCallUpdateUrlMethod();
      });
  }

  private readParamsAndSetView(): void {
    this.activatedRoute.queryParams
      .pipe(
        filter((params) => params['latitude'] && params['longitude']),
        take(1)
      )
      .subscribe((params) => {
        const lat = parseFloat(params['latitude']);
        const lng = parseFloat(params['longitude']);
        const zoom = parseInt(params['zoom'], 10) || 15; // Default zoom to 15 if missing

        if (!isNaN(lat) && !isNaN(lng)) {
          this.map?.setView([lat, lng], zoom);
        }
      });
  }

  private addMapMoveListener(): void {
    if (this.map) {
      this.map.on('moveend', () => {
        this.checkNavigationOngoingAndCallUpdateUrlMethod();
      });
    }
  }

  checkNavigationOngoingAndCallUpdateUrlMethod(count: number = 0): void {
    // if angular recieves navigation request while other navigation is in progress,
    // it discard the previous navigation request
    // calling inside setTimeout to ensure navigation of child components completes
    // before our navigation to update the quryparams in url

    if (this.navigationStatusService.isNavigationOngoing && count < 10) {
      setTimeout(() => {
        this.checkNavigationOngoingAndCallUpdateUrlMethod(count + 1);
      }, 200);
    } else if (count >= 10) {
      console.warn(
        'Could not update URL with map view as navigation is ongoing for too long.'
      );
    } else {
      this.updateUrlWithMapView();
    }
  }

  private updateUrlWithMapView(): void {
    if (!this.map) return;

    const center = this.map.getCenter();
    const zoom = this.map.getZoom();

    const queryParams: MapQueryParams = {
      latitude: center.lat.toFixed(6),
      longitude: center.lng.toFixed(6),
      zoom: zoom.toString(),
    };

    // Update the URL using Angular Router
    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
