import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { UserLocatorComponent } from '../user-locator/user-locator.component';
import { SearchComponent } from '../search/search.component';
import { DirectionComponent } from '../direction/direction.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MapCoreService } from '../services/map-core.service';
import { MapModel, MapQueryParams } from '../model/model';
import { filter, Subject, takeUntil } from 'rxjs';

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
        this.addMapMoveListener();
      });
  }

  private addMapMoveListener(): void {
    if (this.map) {
      this.map.on('moveend', () => {
        this.updateUrlWithMapView();
      });
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
      relativeTo: this.activatedRoute,
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
