export function resolveChangeLanguageLink(path, language){
  const pathArray = path.split('/');
  pathArray[1] = language.toLowerCase();
  return pathArray.join('/');
}