import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayListPipe'
})
export class ArrayListPipe implements PipeTransform {

  transform (input: any[], key: string): any {
    return input.map(value => value[key]);
  }

}
