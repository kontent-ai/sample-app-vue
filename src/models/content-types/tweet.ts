import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
/**
 * Generated by '@kontent-ai/model-generator@5.8.0'
 *
 * Tweet
 * Id: f808c142-4b62-43b0-8f4d-1cbf412580ab
 * Codename: tweet
 */
export type Tweet = IContentItem<{
  /**
   * Display options (multiple_choice)
   * Required: false
   * Id: 8c6db6cf-1003-951e-5407-b2a19c15b4cd
   * Codename: display_options
   */
  displayOptions: Elements.MultipleChoiceElement;

  /**
   * Theme (multiple_choice)
   * Required: false
   * Id: 779b27fd-5a4d-5e5f-66dc-b30931fcba92
   * Codename: theme
   */
  theme: Elements.MultipleChoiceElement;

  /**
   * Tweet link (text)
   * Required: true
   * Id: 20bf9ba1-28fe-203c-5920-6f9610498fb9
   * Codename: tweet_link
   */
  tweetLink: Elements.TextElement;
}>;
