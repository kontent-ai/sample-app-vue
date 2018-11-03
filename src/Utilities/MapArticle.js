import _ from 'lodash';

export function mapArticle(
  article, formatDateFn, i18nFn) {
  return {
    title: _.get(article, 'title.value', i18nFn('noArticleValue')),
    imageLink: _.get(article, 'teaserImage.value[0].url'),
    postDate: formatDateFn(_.get(article, 'postDate.value')),
    summary: _.get(article, 'summary.value', i18nFn('noSummaryValue')),
    link: `/${this.language}/articles/${_.get(article, 'system.id')}`,
    bodyCopyElement: _.get(article, 'bodyCopy')
  };
}
