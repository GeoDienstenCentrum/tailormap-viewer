import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog';
import { SnackBarMessageComponent } from './snackbar-message';
import { SharedImportsModule } from '../shared-imports.module';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { TreeComponent } from './tree';
import { SplitButtonComponent } from './split-button/split-button.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { IconPickerComponent } from './icon-picker/icon-picker.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PanelResizerComponent } from './panel-resizer';
import { SliderComponent } from './slider/slider.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { LanguageToggleComponent } from './language-toggle/language-toggle.component';

@NgModule({
  declarations: [
    DialogComponent,
    SnackBarMessageComponent,
    ErrorMessageComponent,
    TreeComponent,
    SplitButtonComponent,
    ColorPickerComponent,
    IconPickerComponent,
    ConfirmDialogComponent,
    PanelResizerComponent,
    SliderComponent,
    LoginFormComponent,
    AboutDialogComponent,
    LanguageToggleComponent,
  ],
  imports: [
    SharedImportsModule,
    SharedDirectivesModule,
  ],
  exports: [
    DialogComponent,
    SnackBarMessageComponent,
    ErrorMessageComponent,
    TreeComponent,
    SplitButtonComponent,
    ColorPickerComponent,
    IconPickerComponent,
    PanelResizerComponent,
    SliderComponent,
    LoginFormComponent,
    LanguageToggleComponent,
  ],
})
export class SharedComponentsModule {
}
