import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours',
  pure: true,
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(totalMinutes: number): string {
    if (totalMinutes === null || totalMinutes === 0) return '';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} h ${minutes} m`;
  }
}
