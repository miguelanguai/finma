import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-periodo-list',
  standalone: true,
  imports: [
    ButtonModule,
  ],
  templateUrl: './periodo-list.component.html',
  styleUrl: './periodo-list.component.css'
})
export class PeriodoListComponent {

}
