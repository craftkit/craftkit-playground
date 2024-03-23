# CraftKit Best Practices: Managing Sub-views

When developing complex user interfaces with CraftKit, you often work with multiple sub-views within a parent view. While it's possible to directly manage these sub-view instances within your class, there's a recommended approach that enhances maintainability and reduces potential conflicts.

## Best Practice: Utilizing `this.views`

The preferred method for managing sub-views in CraftKit involves storing them within `this.views`. This practice aligns with the management of instance data using `this.data`, ensuring a consistent approach across your project.

### Why `this.views`?

CraftKit's `Craft.UI.View` and its superclass `Craft.Core.Component` come equipped with numerous predefined fields. These fields are carefully designed to avoid clashes with user-defined properties. However, conflicts can still arise. Storing your sub-views in `this.views` minimizes the risk of such conflicts, promoting cleaner and safer code.

### Example Implementation

```javascript
class Header extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.views = {};
  }
  viewDidLoad(callback) {
    let title = new Title();
    this.appendSubView(title);
    this.views.title = title;

    let backbtn = new BackBtn();
    this.appendSubView(backbtn);
    this.views.backbtn = backbtn;

    if (callback) {
      callback();
    }
  }
  updateTitleText(text) {
    this.views.title.setText(text);
  }
}

class Title extends Craft.UI.View {
  constructor(options) {
    super(options);
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <h1 id="title">Title</h1>
      </div>
    `;
  }
  setText(text) {
    this.shadow.getElementById("title").innerHTML = text;
  }
}

class BackBtn extends Craft.UI.View {
  constructor(options) {
    super(options);
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <button id="backbtn">Back</button>
      </div>
    `;
  }
}
```

This example demonstrates how to initialize, store, and reference sub-views using `this.views`. By following this approach, you ensure that your views are organized and easily accessible, simplifying tasks such as updates and modifications.

## Further Reading

- For related best practices, review [CraftKit Best Practices: How to Hold Instance Data in Your View](#).

## Explore More

Experiment with these concepts and more in the CraftKit Playground:

[https://github.com/craftkit/craftkit-playground](https://github.com/craftkit/craftkit-playground)

By adhering to these best practices, you can create more robust and maintainable CraftKit applications, enhancing both the development experience and the end product.
