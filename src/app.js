/* global instantsearch */

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "xyz", // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
        host: "localhost",
        port: "8108",
        protocol: "http",
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  //  filterBy is managed and overridden by InstantSearch.js. To set it, you want to use one of the filter widgets like refinementList or use the `configure` widget.
  additionalSearchParameters: {
    query_by: 'title',
    infix: 'always',
    num_typos: 2,
    sort_by: '_text_match:desc',
    text_match_type: 'sum_score',
  }
});
const { searchClient } = typesenseInstantsearchAdapter;

const search = instantsearch({
  searchClient,
  indexName: "books",
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item(item) {
        return `
        <div>
          <div class="hit-name">
            ${item._highlightResult.title.value}
          </div>
        </div>
      `;
      },
    },
  }),
  instantsearch.widgets.pagination({
    container: "#pagination",
  }),
]);

search.start();
