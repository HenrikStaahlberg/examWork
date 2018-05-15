import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


@Component({
    selector: 'dialog-required-user-action',
    templateUrl: 'dialog-required-user-action.component.html',
  })
  export class DialogRequiredUserAction {
  
    constructor(
      public dialogRef: MatDialogRef<DialogRequiredUserAction>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }
  
    onOkClick(): void {
      this.dialogRef.close();
    }
  
  }