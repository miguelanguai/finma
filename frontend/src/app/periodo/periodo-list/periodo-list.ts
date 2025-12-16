import { Component } from '@angular/core';
import { PeriodoService } from '../periodo-service';

@Component({
  selector: 'app-periodo-list',
  imports: [],
  templateUrl: './periodo-list.html',
  styleUrl: './periodo-list.css',
})
export class PeriodoList {

  constructor(private periodoService: PeriodoService) { }

  ngOnInit() {
    this.getPeriodos();

  }

  getPeriodos() {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
