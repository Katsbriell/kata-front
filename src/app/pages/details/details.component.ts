import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  component: string | null = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.component = params.get('component');
    });
  }

}
