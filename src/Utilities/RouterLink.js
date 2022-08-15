export function resolveChangeLanguageLink(path, language){
  const pathArray = path.split('/');
  pathArray[1] = language;
  return pathArray.join('/');
}