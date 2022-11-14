export const resolveChangeLanguageLink = (path: string, language: string) => {
  const pathArray = path.split('/');
  pathArray[1] = language.toLowerCase();
  return pathArray.join('/');
}