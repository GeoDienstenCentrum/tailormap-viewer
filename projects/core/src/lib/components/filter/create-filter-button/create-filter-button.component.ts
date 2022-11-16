import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterTypeEnum } from '../../../filter/models/filter-type.enum';
import { Store } from '@ngrx/store';
import { createFilter } from '../state/filter-component.actions';

@Component({
  selector: 'tm-create-filter-button',
  templateUrl: './create-filter-button.component.html',
  styleUrls: ['./create-filter-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFilterButtonComponent {

  private store$ = inject(Store);
  public filterTypes = FilterTypeEnum;

  public createFilter(filterType: FilterTypeEnum) {
    this.store$.dispatch(createFilter({ filterType }));
  }

}
