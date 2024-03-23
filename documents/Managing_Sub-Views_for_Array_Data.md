# CraftKit Best Practices: Managing Sub-Views for Array Data

When your application includes sub-views generated from array data, you face the challenge of efficiently managing these views. This document compares two approaches to creating views for array data and recommends the best practice for maintainability and scalability.

## Approaches to Handling Array Data in Views

Given a list of products like the one below, there are two primary methods to create views for each item:

```javascript
var products = [
  { name: "Apple", price: 10 },
  { name: "Orange", price: 13 },
  { name: "Strawberry", price: 20 },
  { name: "Pear", price: 9 },
];
```

### Loop Pattern

The loop pattern involves iterating over the array data directly within the template method of a view. Here's how it looks:

```javascript
class ProductListLoop extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { products: options.products };
    this.views = {};
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        ${this.data.products.map((product, idx) => `
          <div id="idx" class="product">
            ${product.name} : ${product.price}
          </div>
        `).join("")}
      </div>
    `;
  }
}
```

### Factorize Pattern

The factorize pattern breaks down the view into smaller, manageable components. Each item in the array data is represented by its own view instance:

```javascript
class Product extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = options;
    this.views = {};
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        ${this.data.name} : ${this.data.price}
      </div>
    `;
  }
}

class ProductListFactorize extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { products: options.products };
    this.views = { products: [] };
  }
  viewDidLoad(callback) {
    this.data.products.forEach((p) => {
      let view = new Product(p);
      this.appendView(view);
      this.views.products.push(view);
    });
  }
}
```

## Recommendation: Factorize Pattern

While looping directly within the template offers a shorter and more straightforward approach, it complicates subsequent manipulations and updates to individual sub-views. For instance, altering the style of a specific product view post-rendering would require direct DOM manipulation or maintaining a separate index-to-product mapping, which is not ideal for complex applications.

The factorize pattern, on the other hand, encapsulates each item in its own view, making it simpler to manage, update, and maintain. This approach not only enhances code readability and reusability but also facilitates easier modifications to individual sub-views without impacting the broader list.

## Conclusion

For managing sub-views generated from array data, the factorize pattern is the recommended best practice. It provides a scalable and maintainable framework that simplifies the management of dynamic list-based UI components.

Explore these techniques and more with the CraftKit Playground:

[https://github.com/craftkit/craftkit-playground](https://github.com/craftkit/craftkit-playground)

Adopting the factorize pattern will significantly improve the quality and maintainability of your CraftKit applications, ensuring a robust foundation for scalable UI development.
