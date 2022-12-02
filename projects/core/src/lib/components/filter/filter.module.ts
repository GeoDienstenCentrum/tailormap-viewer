import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { FilterMenuButtonComponent } from './filter-menu-button/filter-menu-button.component';
import { MenubarModule } from '../menubar';
import { CreateFilterButtonComponent } from './create-filter-button/create-filter-button.component';
import { SharedModule } from '@tailormap-viewer/shared';
import { FilterListComponent } from './filter-list/filter-list.component';
import { FilterListItemComponent } from './filter-list-item/filter-list-item.component';
import { FilterModule as CoreFilterModule } from '../../filter/filter.module';
import { SpatialFilterFormComponent } from './spatial-filter-form/spatial-filter-form.component';
import { ApplicationMapModule } from '../../map/application-map.module';
import { StoreModule } from '@ngrx/store';
import { filterComponentStateKey } from './state/filter-component.state';
import { filterComponentReducer } from './state/filter-component.reducer';
import { SpatialFilterFormSelectLayersComponent } from './spatial-filter-form-select-layers/spatial-filter-form-select-layers.component';
import { SpatialFilterFormDrawGeometriesComponent } from './spatial-filter-form-draw-geometries/spatial-filter-form-draw-geometries.component';
import { SpatialFilterFormBufferComponent } from './spatial-filter-form-buffer/spatial-filter-form-buffer.component';
import { EffectsModule } from '@ngrx/effects';
import { FilterComponentEffects } from './state/filter-component.effects';



@NgModule({
  declarations: [
    FilterComponent,
    FilterMenuButtonComponent,
    CreateFilterButtonComponent,
    FilterListComponent,
    FilterListItemComponent,
    SpatialFilterFormComponent,
    SpatialFilterFormSelectLayersComponent,
    SpatialFilterFormDrawGeometriesComponent,
    SpatialFilterFormBufferComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(filterComponentStateKey, filterComponentReducer),
    EffectsModule.forFeature([FilterComponentEffects]),
    MenubarModule,
    SharedModule,
    CoreFilterModule,
    ApplicationMapModule,
  ],
  exports: [
    FilterComponent,
  ],
})
export class FilterModule { }
