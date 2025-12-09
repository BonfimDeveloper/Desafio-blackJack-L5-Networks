import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFormat',
  standalone: true,
})
export class DataFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    let novo = value;

    // remove os 3 últimos caracteres
    novo = novo.slice(0, -3);

    // remove vírgulas
    novo = novo.replace(/,/g, '');

    // troca "/" por "-"
    novo = novo.replace(/\//g, '-');

    return novo;
  }
}
