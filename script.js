const Products = {

  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8"
  },

  /**
   * Sets up the query string for the GraphQL request
   * @returns {String} A GraphQL query string
   */
  query: () => `{
    products(first:3) { 
      edges {
        node {
          id
          title
          tags
          images (first:1) {
            edges {
              node {
                originalSrc
              }
            }
          },
          priceRange {
            maxVariantPrice {
              amount
            }
          }
        }
      }
    }
  }`,

  /**
   * Fetches the products via GraphQL then runs the display function
   */
  handleFetch: async () => {
    const productsResponse = await fetch(Products.state.storeUrl, {
      method: "POST",
      headers: {
        "Content-Type": Products.state.contentType,
        Accept: Products.state.accept,
        "X-Shopify-Storefront-Access-Token": Products.state.accessToken,
      }, 
      body: JSON.stringify({
        query: Products.query()
      })
    });
    const productsResponseJson = await productsResponse.json();
    Products.displayProducts(productsResponseJson);
  },

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts: productsJson => {

    const container = document.getElementById("cards-container");
    console.log(container);
    let products = productsJson.data.products.edges;
    console.log(products);

    products.map(product => {
      const { node } = product;
      const { title, tags, images, priceRange} = node;
      const cards = `
      <div class="card">
        <span class="gender">${tags}</span>
        <div style="background-image:url(${images.edges[0].node.originalSrc});" class="card-img">
        </div>
        <h2>${title}</h2>
        <p>$${priceRange.maxVariantPrice.amount}</p>
        <button type="button" class="btn btn-warning">
        Shop Now 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
          </svg>
        </button>
      </div>
    `;
      container.innerHTML += cards;
    })
  },

  /**
   * Sets up the click handler for the fetch button
   */
  initialize: () => {

    addEventListener("click", event => {
      if (event.target.id === "fetch-products") {
        Products.handleFetch();
      }
    });

  }

};

document.addEventListener('DOMContentLoaded', () => {
  Products.initialize();
});