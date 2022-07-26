import {  ContentItem } from '@kontent-ai/kontent-delivery';
import {  resolveContentLink } from '../Utilities/ContentLinks';

export class Home extends ContentItem {
    
  constructor(){
    super({
      propertyResolver: ((fieldName) => {
                
        if (fieldName === 'hero_unit'){
          return 'heroUnit';
        }

        if (fieldName === 'our_story'){
          return 'ourStory';
        }

        if (fieldName === 'url_pattern'){
          return 'urlPattern';
        }

      }),
      linkResolver: (link) => resolveContentLink(link)
    })    
  }
    
}