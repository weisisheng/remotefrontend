/* eslint-disable */
const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const slash = require('slash');

// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
// Will create pages for WordPress pages (route : /{slug})
// Will create pages for WordPress posts (route : /post/{slug})
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    // ==== POSTS (WORDPRESS NATIVE AND ACF) ====
    graphql(
      `
        {
          allWordpressWpJobs(
            sort: { fields: date, order: DESC }
            filter: { status: { eq: "publish" } }
          ) {
            edges {
              node {
                id
                slug
                status
              }
            }
          }
        }
      `
    )
      .then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }
        const postTemplate = path.resolve('./src/templates/post/post.js');
        // We want to create a detailed page for each
        // post node. We'll just use the WordPress Slug for the slug.
        // The Post ID is prefixed with 'POST_'
        _.each(result.data.allWordpressWpJobs.edges, edge => {
          createPage({
            path: `/jobs/${edge.node.slug}`,
            component: slash(postTemplate),
            context: {
              id: edge.node.id,
            },
          });
        });
        resolve();
      })
      .then(() => {
        // ==== PAGES (WORDPRESS NATIVE) ====
        graphql(
          `
            {
              allWordpressPage(
                sort: { fields: date, order: DESC }
                filter: { status: { eq: "publish" } }
              ) {
                edges {
                  node {
                    id
                    slug
                    status
                    template
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors);
            reject(result.errors);
          }

          // Create Page pages.
          const pageTemplate = path.resolve('./src/templates/page.js');
          // We want to create a detailed page for each
          // page node. We'll just use the WordPress Slug for the slug.
          // The Page ID is prefixed with 'PAGE_'
          _.each(result.data.allWordpressPage.edges, edge => {
            // Gatsby uses Redux to manage its internal state.
            // Plugins and sites can use functions like "createPage"
            // to interact with Gatsby.
            createPage({
              // Each page is required to have a `path` as well
              // as a template component. The `context` is
              // optional but is often necessary so the template
              // can query data specific to each page.
              path: `/${edge.node.slug}/`,
              component: slash(pageTemplate),
              context: {
                id: edge.node.id,
              },
            });
          });
        });
      })
      .then(() => {
        // ==== PAGES (WORDPRESS NATIVE) ====
        graphql(
          `
            {
              allWordpressPost(
                sort: { fields: date, order: DESC }
                filter: { status: { eq: "publish" } }
              ) {
                edges {
                  node {
                    id
                    slug
                    status
                    template
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors);
            reject(result.errors);
          }

          // Create Page pages.
          const pageTemplate = path.resolve(
            './src/templates/article/article.js'
          );
          // We want to create a detailed page for each
          // page node. We'll just use the WordPress Slug for the slug.
          // The Page ID is prefixed with 'PAGE_'
          _.each(result.data.allWordpressPost.edges, edge => {
            // Gatsby uses Redux to manage its internal state.
            // Plugins and sites can use functions like "createPage"
            // to interact with Gatsby.
            createPage({
              // Each page is required to have a `path` as well
              // as a template component. The `context` is
              // optional but is often necessary so the template
              // can query data specific to each page.
              path: `/articles/${edge.node.slug}/`,
              component: slash(pageTemplate),
              context: {
                id: edge.node.id,
              },
            });
          });
        });
      });
  });
  // ==== END POSTS ====
};
