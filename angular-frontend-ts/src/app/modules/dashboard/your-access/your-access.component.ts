import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CoachAppsTVstudioComponent } from '../coach-apps-tvstudio/coach-apps-tvstudio.component'

@Component({
  selector: 'app-your-access',
  templateUrl: './your-access.component.html',
  styleUrls: ['./your-access.component.scss']
})
export class YourAccessComponent implements OnInit {

  constructor(
    public dialogService: DialogService,
  ) {

   }

  ngOnInit(): void {
  }

  selectStudio(isCoach = false): void {
    const ref = this.dialogService.open(CoachAppsTVstudioComponent, {
      width: '100%',
      styleClass: '',
      showHeader: false,
      data: {
        isCoach
      }
    });
  }
}
