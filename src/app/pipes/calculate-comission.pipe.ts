import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateComission'
})
export class CalculateComissionPipe implements PipeTransform {

  transform(value: string, comission: number): unknown {
    if (parseInt(value)) {
      return parseInt(value)*comission/100;
    } else {
      return 0;
    }
  }

}
