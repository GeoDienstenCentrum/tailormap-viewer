import { Component, OnInit, ChangeDetectionStrategy, inject, OnDestroy } from '@angular/core';
import { selectFilterableLayers } from '../../../map/state/map.selectors';
import { Observable, of, Subject } from 'rxjs';
import { AppLayerModel } from '@tailormap-viewer/api';
import { Store } from '@ngrx/store';
import { selectSelectedLayers } from '../state/filter-component.selectors';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { setSelectedLayers } from '../state/filter-component.actions';

@Component({
  selector: 'tm-spatial-filter-form-select-layers',
  templateUrl: './spatial-filter-form-select-layers.component.html',
  styleUrls: ['./spatial-filter-form-select-layers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpatialFilterFormSelectLayersComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();
  private store$ = inject(Store);

  public availableLayers$: Observable<AppLayerModel[]> = of([]);
  public selectedLayersControl = new FormControl<number[]>([], {
    nonNullable: true,
  });

  constructor() { }

  public ngOnInit(): void {
    this.availableLayers$ = this.store$.select(selectFilterableLayers);
    this.store$.select(selectSelectedLayers)
      .pipe(takeUntil(this.destroyed))
      .subscribe((layers) => {
        this.selectedLayersControl.patchValue(layers, { emitEvent: false });
      });
    this.selectedLayersControl.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((value) => {
        this.store$.dispatch(setSelectedLayers({ layers: value || [] }));
      });
  }

  public ngOnDestroy(): void {
    this.destroyed.next(null);
    this.destroyed.complete();
  }

}
