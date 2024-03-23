# CraftKit Code Patterns: Updating Views

CraftKit's `Craft.UI.View` class is designed to encapsulate methods, data, and the DOM structure of UI components. These components are rendered automatically by a ViewController, based on the implementation of the view's lifecycle methods. Once a view is appended to the screen, updating its DOM is a manual task—hence the name, CraftKit, emphasizing the craft in creating and updating views.

## Updating View Patterns

### Shadow Access Pattern

The most straightforward way to update a view's content is by directly accessing DOM elements through `this.shadow`, allowing for direct manipulation of the view's HTML.

```javascript
class CounterView1 extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { count: 0 };
  }
  countup() {
    this.data.count++;
    this.shadow.getElementById("counter").innerHTML = this.data.count;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <span id="counter">${this.data.count}</span>
      </div>
    `;
  }
}
```

With advancements in browser capabilities, methods like `replaceChildren` offer alternatives to `innerHTML` for updating content.

### RenderView Pattern

Utilizing the `renderView` method from `Craft.UI.View` allows for the entire view to be re-rendered upon data updates. This method is straightforward and particularly useful for simple data structures.

```javascript
class CounterView2 extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { count: 0 };
  }
  countup() {
    this.data.count++;
    this.renderView();
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        ${this.data.count}
      </div>
    `;
  }
}
```

This approach ensures that the view always reflects the current state of the data.

### Swap and RenderView Pattern

For applications with more complexity, dynamically swapping templates based on conditions can provide flexibility in how content is displayed.

```javascript
class CounterView3 extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { count: 0 };
    this.templates = {
      even: () => `Some complex even view: ${this.data.count}`,
      odd: () => `Some complex odd view: ${this.data.count}`,
    };
    this.crr_template = this.templates.even();
  }
  countup() {
    this.data.count++;
    this.crr_template =
      this.data.count % 2 == 0 ? this.templates.even() : this.templates.odd();
    this.renderView();
  }
  template(componentId) {
    return `
      <div id="root" class="root" onClick="${componentId}.countup()">
        ${this.crr_template}
      </div>`;
  }
}
```

This method allows for a dynamic response to changes in the view's data.

### Factorize Pattern

Breaking down the view into smaller, manageable components (factorization) can simplify updates and enhance maintainability.

```javascript
class CounterView4 extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { count: 0 };
    this.views = { numbox: null };
  }
  countup() {
    this.data.count++;
    this.updateNumBoxView();
  }
  updateNumBoxView() {
    let view = new NumBoxView({ num: this.data.count });
    this.replaceView({ id: "container", component: view });
    this.views.numbox?.unloadView();
    this.views.numbox = view;
  }
  viewDidLoad(callback) {
    this.updateNumBoxView();
    if (callback) {
      callback();
    }
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <div id="container" onClick="${componentId}.countup()"></div>
      </div>
    `;
  }
}

class NumBoxView extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = options;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        ${this.data.num}
      </div>
    `;
  }
}
```

### Combined Pattern

Combining various patterns may be necessary for web applications dealing with dynamic data sources or complex user interactions.

```javascript
class CounterView5 extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { count: 0 };
    this.views = {
      even: new EvenNumBoxView({ delegate: this }),
      odd: new OddNumBoxView({ delegate: this }),
    };
  }
  viewDidLoad(callback) {
    this.updateNumBoxView();
    if (callback) {
      callback();
    }
  }
  countup() {
    this.data.count++;
    this.updateNumBoxView();
  }
  updateNumBoxView() {
    if (this.data.count % 2 == 0) {
      this.views.even.renderView();
      this.replaceView({
        id: "container",
        component: this.views.even,
      });
    } else {
      this.views.odd.renderView();
      this.replaceView({
        id: "container",
        component: this.views.odd,
      });
    }
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <div id="container" onClick="${componentId}.countup()"></div>
      </div>
    `;
  }
}

class EvenNumBoxView extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.delegate = options.delegate;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        Some complex even view structure: 
        ${this.delegate.data.count}
      </div>
    `;
  }
}

class OddNumBoxView extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.delegate = options.delegate;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        Some complex odd view structure: 
        ${this.delegate.data.count}
      </div>
    `;
  }
}
```

In this comprehensive example, `CounterView` dynamically updates its content by swapping between even and odd number views, showcasing the flexibility of CraftKit in handling complex UI requirements.

### Note

These examples are practical demonstrations of how to effectively manage and update views within the CraftKit framework, highlighting the versatility and manual control offered to developers. To explore these patterns further, visit the CraftKit Playground: [https://github.com/craftkit/craftkit-playground](https://github.com/craftkit/craftkit-playground.).
