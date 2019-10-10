import { Client } from '../Client.js';
import { SortOrder } from '@kentico/kontent-delivery';
import { takeUntil } from 'rxjs/operators';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import BaseStore from './Base';

const resetStore = () => ({
  articleList: initLanguageCodeObject(),
  articleDetails: initLanguageCodeObject()
});
let { articleList, articleDetails } = resetStore();

class Article extends BaseStore {
  constructor() {
    super();
  }

  // Actions
  provideArticle(articleId, language) {
    let query = Client.items()
      .type('article')
      .equalsFilter('system.id', articleId)
      .elementsParameter(['title', 'teaser_image', 'post_date', 'body_copy', 'video_host', 'video_id', 'tweet_link', 'theme', 'display_options'])

    if (language) {
      query.languageParameter(language);
    }

    query.toObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        if (language) {
          articleDetails[language][articleId] = response.items[0];
        } else {
          articleDetails[defaultLanguage][articleId] = response.items[0];
        }
        this.notifyChange();
      });
  }

  provideArticles(count, language) {
    let query = Client.items()
      .type('article')
      .orderParameter('elements.post_date', SortOrder.desc);

    if (language) {
      query.languageParameter(language);
    }

    query.toObservable()
      .pipe(takeUntil(this.observableUnsubscribe))
      .subscribe(response => {
        if (language) {
          articleList[language] = response.items;
        } else {
          articleList[defaultLanguage] = response.items
        }
        this.notifyChange();
      });
  }

  // Methods
  getArticle(articleId, language) {
    if (language) {
      return articleDetails[language][articleId];
    } else {
      return articleDetails[defaultLanguage][articleId];
    }
  }

  getArticles(count, language) {
    if (language) {
      return articleList[language].slice(0, count);
    }
    else {
      return articleList[defaultLanguage].slice(0, count);
    }
  }
}

let ArticleStore = new Article();

export { ArticleStore, resetStore }