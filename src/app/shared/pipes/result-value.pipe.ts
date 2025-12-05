import { Pipe, PipeTransform } from '@angular/core';
import { OrsPlaceModel } from '../../model/model';

@Pipe({
  name: 'resultValue',
  standalone: true,
})
export class ResultValuePipe implements PipeTransform {
  transform(result: OrsPlaceModel): string {
    if (result) {
      return result.name || result.label;
    }

    return '';
  }
}
