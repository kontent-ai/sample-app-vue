> [!Warning]
> Deprecation Notice: This repository is no longer maintained.
>
> We encourage you to explore our newer solutions [Kickstart Vue.js solution](https://github.com/kontent-ai/kickstart-vue-app)

> [!IMPORTANT]
> This sample app relies on the Dancing Goat project, which is no longer available for creation in Kontent.ai.
>
> If you still wish to use this project, you can import the Dancing Goat project using the [Data Ops](https://github.com/kontent-ai/data-ops) tool by following the instructions provided in our [Dancing Goat repository](https://github.com/kontent-ai-bot/dancing-goat).

# Kontent.ai sample Vue.js single-page application

[![Netlify Status](https://api.netlify.com/api/v1/badges/cb6d3394-1ee9-491d-949f-8e9d4740ff36/deploy-status)](https://app.netlify.com/sites/kontent-sample-app-vue/deploys)
[![Live Demo](https://img.shields.io/badge/live-demo-brightgreen.svg)](https://kontent-sample-app-vue.netlify.app/)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kontent-ai)
[![Discord](https://img.shields.io/discord/821885171984891914?label=Discord&logo=Discord&logoColor=white)](https://discord.gg/SKCxwPtevJ)

This is a sample website written in Typescript utilizing the Kontent.ai Delivery API to retrieve content. You can register your account for free at <https://app.kontent.ai>.

## Application setup

1. Install the latest version of NodeJS and npm. You can download both at <https://nodejs.org/en/download/>.
2. Clone the sample application repository.
3. Navigate to the root folder of the application in the command line.
4. Type `npm install` to install required npm packages.
5. Type `npm run dev` to start a development server.
6. The application opens in your browser at <http://localhost:5173>.

## Connecting to your sample project

On the first run of the app, you'll be presented with a configuration page. It will allow you to connect the app to your Kontent.ai sample project or create a new one. You'll also be able to start a trial and convert to a developer plan when the trial expires.

> If you want to open the configuration page after the project is already connected to the app. Just open the URL <http://localhost:5173/Admin/Configuration>.

Alternatively, you can connect your project manually as per the chapter below.

### Connecting to your project manually

If you want to change the source Kontent.ai project, follow these steps:

1. In Kontent.ai, choose Environment settings from the app menu.
2. Under the General settings, copy Environment ID.
4. Create and open a `.env.local` file in the sample application folder.
5. On the first line, add your Environment ID constant using the format `VITE_VUE_APP_ENVIRONMENT_ID=00000000-0000-0000-0000-000000000000`.
6. Save the file.

Now, when you run the application, it will retrieve the content from your sample project. This setup has a higher priority than [setting your sample project via the Configuration page](#connecting-to-your-sample-project).

### Previewing content from your project

To preview unpublished content in the sample application, follow these steps:

1. In Kontent.ai, choose Project settings from the app menu.
2. Under Production environment settings, choose API keys.
3. Copy your Environment ID and Preview API key.
4. Create and open a `.env.local` file in the sample application folder.
5. On the first line, add your Environment ID constant using the format `VITE_VUE_APP_ENVIRONMENT_ID=00000000-0000-0000-0000-000000000000`.
6. On the next line, add your Preview API key using the format `VUE_APP_PREVIEW_API_KEY=00000000-0000-0000-0000-000000000000`.
7. Save the file.

Now, when you now run the application, you will see all project content including the unpublished version of content items.

## Content administration

1. Navigate to <https://app.kontent.ai> in your browser.
2. Sign in with your credentials.
3. Manage content in the content administration interface of your sample project.

You can learn [more about content editing](https://kontent.ai/learn/tutorials/write-and-collaborate/create-content/introducing-content-items) at Kontent.ai Learn.

## Content delivery

You can retrieve content either through the Kontent.ai Delivery SDKs or the Kontent.ai Delivery API:

- For published content, use `https://deliver.kontent.ai/ENVIRONMENT_ID/items`.
- For unpublished content, use `https://preview-deliver.kontent.ai/ENVIRONMENT_ID/items`.

For more info about the API, see the [API reference](hhttps://kontent.ai/learn/reference/kontent-apis-overview/).

You can find the Delivery and other SDKs at <https://github.com/kontent-ai>.

### Data origin

This sample wants to showcase loading content from Kontent.ai as well as loading some part of the site from static JSON resources.

> Basically, the content that you can't find in the [`Localization`](https://github.com/kontent-ai/sample-app-vue/tree/master/src/Localization) folder is loaded from Kontent.ai.

- The data provided from [`Localization`](https://github.com/kontent-ai/kontent-sample-app-vue/tree/master/src/Localization) are using the `vue-i18n` plugin, so every call in components using `t('KEYWORD')` in components is loading data from these JSONs as "Banner" section" ([component here](https://github.com/kontent-ai/kontent-sample-app-vue/blob/master/src/components/Banner.vue#L6))

## Model mapping and data fetching

There are two types of model mapping in this application:

### content type -> DTO -> component

Content type definitions are generated from content types via [Kontent.ai model generator](https://github.com/kontent-ai/model-generator-js) tool. All types can be found in `src/Models` folder. The `_project.ts` contains information about the project structure such as project languages as well as other structure information like codenames about content types.

### content type -> DTO -> view model -> component

Some models displayed in views might require an adjustment from content types. For example, the content type `Cafe`  contains fields for `city` and `street` and we would like to have a model containing an address in the format `city, street`. You can find an example of such a view model in `CafeModel.tsx` located in the `src/ViewModels` folder. Converting `Cafe` into `CafeModel` can be done by the function located in `src/Utilities/CafeListing.ts`.

### Data fetching

This solution fetches data using the [Kontent.ai Delivery client](https://github.com/kontent-ai/delivery-sdk-js). For more implementation detail on how to set up the client see [src/Client.js](https://github.com/kontent-ai/sample-app-vue/blob/master/src/Client.ts). After your client is set up, you are able to deliver your content to your project. The following example showcases how to use a Kontent.ai delivery client to fetch data.

```ts
const fetchBrewer = () => {
  var query = Client.items<Brewer>()
    .type('brewer')
    .equalsFilter('url_pattern', route.params.brewerSlug as string)

  if(language) {
    query.languageParameter(language)
  }

  query
    .toPromise()
    .then(response => {
      // store data to the state variable of your component.
      brewer.value = response.data.items[0]
    }
}
```

### Language fallbacks

To deal with content that is not available in the current language, this project uses a method called language fallbacks. It will fetch the content in the language set as a fallback language in the Kontent.ai project and redirect the website to the URL with a prefix of the given language. However, it is possible to disable language fallbacks by adding a filter of `system.language` to your query. For more information about getting localized content check this [`link.`](https://kontent.ai/learn/tutorials/develop-apps/get-content/localized-content-items/?tech=javascript)

```js
var query = Client.items<AboutUs>().type('about_us');

if (language) {
  query
    .languageParameter(language)
    .equalsFilter('system.language', 'es-ES');
}
```

## Handling 404

For the not found resources, prefixed 404 pages are used for both languages. As the content on one page should be in one language, this approach might help you to optimize SEO. If language is not set in the URL the application uses the last used language, which is set in cookies.

## Deployment

You can use, for example, [surge](http://surge.sh/) to deploy your app live. Check out the step-by-step guide on our [blog](https://kontent.ai/blog/3-steps-to-rapidly-deploy-headless-single-page-app).
