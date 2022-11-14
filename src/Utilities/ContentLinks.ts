import type { ILink } from "@kontent-ai/delivery-sdk";

export const resolveContentLink = (link: ILink, language: string): string => {
  let resultLink;
  switch (link.type) {
  case 'article':
    resultLink = `/articles/${link.linkId}`;
    break;
  case 'coffee':
    resultLink = `/coffees/${link.urlSlug}`;
    break;
  case 'brewer':
    resultLink = `/brewers/${link.urlSlug}`; 
    break;
  default:
    resultLink = '';
  }
  
  if(language){
    resultLink = `/${language.toLowerCase()}${resultLink}`
  }

  return resultLink;
}