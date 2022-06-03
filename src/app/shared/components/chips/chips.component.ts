import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})
export class ChipsComponent implements OnInit {
  @Input() items: Array<any> = [];
  @Output() removeItem = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  close(item: string) {
    this.removeItem.emit(item);
  }
}
