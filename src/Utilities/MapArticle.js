import _ from 'lodash';

export function mapArticle(article) {
  return {
    title: _.get(article, 'title.value') || '(Article has no title)',
    imageLink: _.get(article, 'teaserImage.value[0].url'),
    postDate: this.formatDate(_.get(article, 'postDate.value')),
    summary: _.get(article, 'summary.value') || 'No summary yet',
    link: `/${this.language}/articles/${_.get(article, 'system.id')}`,
    bodyCopyElement: _.get(article, 'bodyCopy')
  };
}
