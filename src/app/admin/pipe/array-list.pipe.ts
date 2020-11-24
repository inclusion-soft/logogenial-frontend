import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayListPipe'
})
export class ArrayListPipe implements PipeTransform {

  transform (input: any[], key: string): any {
    debugger;
    return input.map(value => value[key]);
  }

}
