# CraftKit Code Patterns: Routing with Strategy Pattern Object

CraftKit applications manage routing through a specialized `RootViewController`, which acts as a central point for handling navigation and routing logic. This controller leverages the `resolveRoutingRequest(route)` method to process routing requests, encapsulated within a `Route` object.

## Key Components of the Route Object

- **launch**: Indicates if the method call originates from the `RootViewController#bringup` sequence.
- **path**: The parsed path that needs handling, distinct from `location.pathname`.
- **event**: Present if invoked by browser navigation actions (back/forward) via a popstate event.

Handling `Route.path` involves parsing and normalizing the path, a responsibility that falls to your router's implementation.

## History Management

Properly managing browser history requires careful consideration of popstate events and the `launch` flag:

```javascript
let event = route ? route.event : null;
let launch = route ? route.launch : false;

if (launch) {
  // Initial app launch, update history without adding a new entry
  window.history.replaceState({}, title, path);
} else {
  if (!event) {
    // Navigation within the app, add a new history entry
    window.history.pushState({}, title, path);
  }
}
```

This pattern becomes a common block in the implementation of a CraftKit application's `RootViewController`.

## Implementing RootViewController

### Example Views

```javascript
class Apple extends Craft.UI.View {
  template(componentId) {
    return `<div class="root">🍎</div>`;
  }
}
class Orange extends Craft.UI.View {
  template(componentId) {
    return `<div class="root">🍊</div>`;
  }
}
```

### PageController with Routing

```javascript
class PageController extends Craft.UI.DefaultRootViewController {
  constructor(options) {
    super(options);
    this.data = {
      map: {
        apple: new Apple(),
        orange: new Orange(),
      },
    };
  }
  resolveRoutingRequest(route) {
    let path = route.path || "apple";
    let view = this.data.map[path];
    this.replaceView(view);
    if (route.launch) {
      window.history.replaceState({}, "", "#/" + path);
    } else {
      if (!route.event) {
        window.history.pushState({}, "", "#/" + path);
      }
    }
  }
}
```

### Running the Example

```javascript
var rootViewController = new PageController();
Craft.Core.Context.setRootViewController(rootViewController);

rootViewController.bringup();
```

Launching this setup initiates route resolution. By default, the 🍎 view is displayed. Modifying the URL to `#orange` updates the display to 🍊, with browser navigation reflecting these changes accurately.

## Note on Path Normalization

CraftKit supports path normalization through `Craft.Core.HashRouter` and `Craft.Core.PathRouter`, demonstrating the Strategy pattern. By default, `HashRouter` is used, but you can specify your preference during application boot:

```javascript
// Bootloader configuration
Craft.Core.Bootstrap.boot({
  router: Craft.Core.HashRouter,
  didBootApplication: function () {
    let rootViewController = new PageController();
    Craft.Core.Context.setRootViewController(rootViewController);
    rootViewController.bringup();
  },
});

// Within RootViewController
let normalized_path = Craft.Core.Context.getRouter().normalize(path);

if (route.launch) {
  window.history.replaceState({}, "", normalized_path);
} else {
  if (!route.event) {
    window.history.pushState({}, "", normalized_path);
  }
}
```

Refer to CraftKit's GitHub documentation for more details on boot settings and router configurations. This strategy ensures a flexible and maintainable approach to handling routing in CraftKit applications.
