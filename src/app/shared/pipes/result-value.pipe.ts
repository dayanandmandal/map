import { Pipe, PipeTransform } from '@angular/core';
import { OrsPlace } from '../../model/model';

@Pipe({
  name: 'resultValue',
  standalone: true,
})
export class ResultValuePipe implements PipeTransform {
  transform(result: OrsPlace): string {
    if (result) {
      return result.name || result.label;
    }

    return '';
  }
}
