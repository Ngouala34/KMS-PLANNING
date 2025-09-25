import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(
    dateStr: string | null,
    startTime?: string,
    endTime?: string,
    options: { locale?: string; time12h?: boolean; showDate?: boolean } = {}
  ): string {
    if (!dateStr) return 'Date inconnue';

    const locale = options.locale || 'fr-FR';
    const time12h = options.time12h ?? false;
    const showDate = options.showDate ?? true;

    const date = new Date(dateStr);

    // Format date
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    const formattedDate = showDate
      ? date.toLocaleDateString(locale, dateOptions)
      : '';

    // Format time
    const formatTime = (time?: string) => {
      if (!time) return '';
      const [hour, minute] = time.split(':');
      let h = +hour;
      let suffix = '';
      if (time12h) {
        suffix = h >= 12 ? 'PM' : 'AM';
        h = h % 12 === 0 ? 12 : h % 12;
      }
      return `${h.toString().padStart(2, '0')}:${minute}${time12h ? ' ' + suffix : ''}`;
    };

    const formattedTime = startTime
      ? endTime
        ? `${formatTime(startTime)} - ${formatTime(endTime)}`
        : formatTime(startTime)
      : '';

    return [formattedDate, formattedTime].filter(Boolean).join(' • ');
  }
}
