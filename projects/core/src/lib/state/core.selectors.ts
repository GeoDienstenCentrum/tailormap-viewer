import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoreState, coreStateKey, MapState } from './core.state';
import { AppLayerModel, ServiceModel } from '@tailormap-viewer/api';

const selectCoreState = createFeatureSelector<CoreState>(coreStateKey);
const selectApplicationState = createSelector(selectCoreState, state => state.application);
const selectMapState = createSelector(selectCoreState, state => state.map);

export const selectApplicationId = createSelector(selectApplicationState, state => state.id);
export const selectRouteBeforeLogin = createSelector(selectCoreState, state => state.routeBeforeLogin);
export const selectMapOptions = createSelector(
  selectMapState,
  (state: MapState) => {
    if (!state.crs) {
      return null;
    }
    return {
      projection: state.crs.code,
      projectionDefinition: state.crs.definition,
      maxExtent: state.maxExtent ? [
        state.maxExtent.minx,
        state.maxExtent.miny,
        state.maxExtent.maxx,
        state.maxExtent.maxy,
      ] : [],
      initialExtent: state.initialExtent ? [
        state.initialExtent.minx,
        state.initialExtent.miny,
        state.initialExtent.maxx,
        state.initialExtent.maxy,
      ] : [],
    };
  },
);

export const selectServices = createSelector(
  selectMapState,
  state => state.services,
);

const getLayersAndServices = (layers: AppLayerModel[], services: ServiceModel[]) => {
  return layers.map(layer => ({
    layer,
    service: services.find(s => s.id === layer.serviceId),
  }));
};

export const selectBaseLayers = createSelector(
  selectMapState,
  selectServices,
  (state, services: ServiceModel[]) => getLayersAndServices(state.baseLayers, services),
);
export const selectLayers = createSelector(
  selectMapState,
  selectServices,
  (state, services: ServiceModel[]) => getLayersAndServices(state.layers, services),
);
export const selectVisibleLayers = createSelector(
  selectLayers,
  layers => layers.filter(l => l.layer.visible),
);
export const selectUserDetails = createSelector(selectCoreState, state => state.security);
