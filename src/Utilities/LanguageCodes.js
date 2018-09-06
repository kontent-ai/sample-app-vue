export const languageCodes = [
  'en-US', // default languages
  'es-ES'
];

export const languageCodesLowerCase = languageCodes.map(code => code.toLowerCase());

export const dateFormats = {
  'en-US': {
    dayNames: [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    monthNames: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ],
    timeNames: [
      'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
  },
  'es-ES': {
    dayNames: [
      'dom.', 'lun.', 'mar.', 'mi\u00e9.', 'jue.', 'vie.', 's\u00e1b.',
      'domingo', 'lunes', 'martes', 'mi\u00e9rcoles', 'jueves', 'viernes', 's\u00e1bado'
    ],
    monthNames: [
      'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.',
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ],
    timeNames: [
      'a. m.', 'p. m.', 'a. m.', 'p. m.', 'a. m.', 'p. m.', 'a. m.', 'p. m.'
    ]
  }
}

export const defaultLanguage = languageCodes[0];

export const initLanguageCodeObject = (object) => {
  if (!object) {
    object = {};
  }

  languageCodes.forEach(language => {
    object[language] = [];
  })

  return object
}

export const getLanguageCode = (route) => {
  const defaultLanguage = languageCodes[0];
  const languageParameter = route.split('/')[1];

  if (languageCodesLowerCase.indexOf(languageParameter.toLowerCase()) > -1) {
    return languageCodes[languageCodesLowerCase.indexOf(languageParameter.toLowerCase())];
  }
  return defaultLanguage;
}

export default languageCodes;