import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tm-admin-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPageComponent {

  constructor() { }

}
