import type { IContentItem } from '@kontent-ai/delivery-sdk';

export const languageCodes = [
  'en-US', // default languages
  'es-ES',
];

export const languageCodesLowerCase = languageCodes.map((code) =>
  code.toLowerCase()
);

export const dateFormats = {
  'en-US': {
    dayNames: [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    monthNames: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    timeNames: ['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'],
  },
  'es-ES': {
    dayNames: [
      'dom.',
      'lun.',
      'mar.',
      'mi\u00e9.',
      'jue.',
      'vie.',
      's\u00e1b.',
      'domingo',
      'lunes',
      'martes',
      'mi\u00e9rcoles',
      'jueves',
      'viernes',
      's\u00e1bado',
    ],
    monthNames: [
      'ene.',
      'feb.',
      'mar.',
      'abr.',
      'may.',
      'jun.',
      'jul.',
      'ago.',
      'sept.',
      'oct.',
      'nov.',
      'dic.',
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    timeNames: [
      'a. m.',
      'p. m.',
      'a. m.',
      'p. m.',
      'a. m.',
      'p. m.',
      'a. m.',
      'p. m.',
    ],
  },
};

export const defaultLanguage = languageCodes[0];

export type ILanguageObject<TContentItem extends IContentItem> = Record<string, TContentItem | null>;

export const initLanguageCodeObject = <TContentItem extends IContentItem>(
  object: ILanguageObject<TContentItem> | null = null
): ILanguageObject<TContentItem> => {
  if (!object) {
    object = {};
  }

  languageCodes.forEach((language) => {
    if (object) {
      object[language] = null;
    }
  });

  return object;
};

export type ILanguageObjectWithArray<TContentItem extends IContentItem> = Record<string, TContentItem[]>;

export const initLanguageCodeObjectWithArray = <
  TContentItem extends IContentItem
>(
  object: ILanguageObjectWithArray<TContentItem> | null = null
): ILanguageObjectWithArray<TContentItem> => {
  if (!object) {
    object = {};
  }

  languageCodes.forEach((language) => {
    if (object) {
      object[language] = [];
    }
  });

  return object;
};

export const getLanguageCode = (route: string): string => {
  const defaultLanguage = languageCodes[0];
  const languageParameter = route.split('/')[1];

  if (languageCodesLowerCase.includes(languageParameter.toLowerCase())) {
    return languageCodes[
      languageCodesLowerCase.indexOf(languageParameter.toLowerCase())
    ];
  }
  return defaultLanguage;
};

export default { languageCodes };
