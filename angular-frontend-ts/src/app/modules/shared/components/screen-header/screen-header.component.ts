import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-screen-header',
  templateUrl: './screen-header.component.html',
  styleUrls: ['./screen-header.component.scss']
})
export class ScreenHeaderComponent implements OnInit {

  @Input() title: any = '';
  @Input() addBtn: any = null;
  @Input() enableSearch: boolean = false;

  searchText: any = null;

  @Output() add = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  addEventHandler(): void {
    this.add.emit();
  }

  searchEventHandler(): void {
    this.search.emit(this.searchText);
  }

}
