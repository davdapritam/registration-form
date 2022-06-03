import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDropListner]'
})
export class DragDropListnerDirective {

  @Output() fileDropped = new EventEmitter();

  constructor() { }

  // Dragover Listner
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Dragleave Listner
  @HostListener('dragleave', ['$event']) onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Drop Listner
  @HostListener('drop', ['$event']) onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();

    const file = evt.dataTransfer.files;
    if (file) {
      this.fileDropped.emit(evt);

    }
  }

}
