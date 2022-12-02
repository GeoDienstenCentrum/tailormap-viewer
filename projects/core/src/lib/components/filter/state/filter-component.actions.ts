import { createAction, props } from '@ngrx/store';
import { FilterTypeEnum } from '../../../filter/models/filter-type.enum';
import { SpatialFilterGeometry, SpatialFilterModel } from '../../../filter/models/spatial-filter.model';
import { FilterGroupModel } from '../../../filter/models/filter-group.model';

const filterComponentActionsPrefix = '[FilterComponent]';

export const createFilter = createAction(
  `${filterComponentActionsPrefix} Create Filter`,
  props<{ filterType: FilterTypeEnum }>(),
);

export const closeForm = createAction(`${filterComponentActionsPrefix} Close Filter Form`);

export const setSelectedFilterGroup = createAction(
  `${filterComponentActionsPrefix} Set Selected Filter Group`,
  props<{ filterGroup: FilterGroupModel<SpatialFilterModel> }>(),
);

export const setSelectedLayers = createAction(
  `${filterComponentActionsPrefix} Set Selected Layers`,
  props<{ layers: number[] }>(),
);

export const addGeometry = createAction(
  `${filterComponentActionsPrefix} Add Geometry`,
  props<{ geometry: SpatialFilterGeometry }>(),
);

export const removeGeometry = createAction(
  `${filterComponentActionsPrefix} Remove Geometry`,
  props<{ id: string }>(),
);

export const setBuffer = createAction(
  `${filterComponentActionsPrefix} Set Buffer`,
  props<{ buffer: number | undefined }>(),
);
