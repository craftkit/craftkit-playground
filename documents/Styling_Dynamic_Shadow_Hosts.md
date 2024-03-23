# CraftKit Code Patterns: Styling Dynamic Shadow Hosts

In CraftKit, styling your components typically involves setting styles for the `.root` class within each component. However, there are scenarios where you might need to apply styles directly to the shadow host. This document outlines methods for dynamically styling shadow hosts and provides best practices for managing these styles effectively.

## Defining Shadow Host Styles

To apply initial styles to the shadow host, use the `:host` selector in your component's style method. This is straightforward and effective for setting base styles.

```javascript
class Example extends Craft.UI.View {
  style(componentId) {
    return `
      :host {
        padding-top: env(safe-area-inset-top);
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      }
    `;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        Example
      </div>
    `;
  }
}
```

## Modifying Host Styles Directly

For dynamic styling changes, you can directly modify the host element's style properties using `this.shadow.host.style[*]`. This method is useful for applying styles that change in response to user interactions or other runtime conditions.

```javascript
class Example2 extends Craft.UI.View {
  updateShadowStyle() {
    this.shadow.host.style.width = "200px";
  }
  style(componentId) {
    return `
      :host {
        width: 100px;
      }
    `;
  }
  template(componentId) {
    return `
      <div id="root" class="root" onclick="${componentId}.updateShadowStyle()">
        Example2
      </div>
    `;
  }
}
```

## Swapping Shadow Host CSS Classes

To switch between styles dynamically, define the target classes in a parent component. This allows you to toggle classes on the shadow host, effectively changing its style on the fly.

```javascript
class Example3 extends Craft.UI.View {
  viewDidLoad(callback) {
    this.appendView(new Example3Wrapped());
    if (callback) {
      callback();
    }
  }
  style(componentId) {
    return `
      .light { color: #333; background-color: #fff; }
      .dark { color: #fff; background-color: #333; }
    `;
  }
}

class Example3Wrapped extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { mode: 0 };
  }
  toggleMode() {
    this.data.mode++;
    if (this.data.mode % 2) {
      this.shadow.host.classList.add("light");
      this.shadow.host.classList.remove("dark");
    } else {
      this.shadow.host.classList.add("dark");
      this.shadow.host.classList.remove("light");
    }
  }
  style(componentId) {
    return `
      :host { color: #333; background-color: #fff; }
      .root { 
        width: 100px; margin-left: auto; margin-right: auto;
      }
    `;
  }
  template(componentId) {
    return `
      <div id="root" class="root" onclick="${componentId}.toggleMode()">
        Example3Wrapped
      </div>
    `;
  }
}
```

## Discouraged Practices

Avoid patterns where the styling logic becomes convoluted, such as toggling styles through back-and-forth method calls between components. These practices can lead to maintenance challenges and decreased readability.

```javascript
// Example of discouraged practice due to complexity and maintainability issues.

class Example4Wrapper extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = { mode: 1 };
    this.views = { example: null };
  }
  viewDidLoad(callback) {
    this.views.example = new Example4Wrapped({ delegate: this });
    this.appendView(this.views.example);
    if (callback) {
      callback();
    }
  }
  toggleMode() {
    if (this.data.mode++ % 2) {
      this.views.example.darkMode();
    } else {
      this.views.example.lightMode();
    }
  }
  style(componentId) {
    return `
      .light { color:#333; background-color: #fff; }
      .dark { color:#fff; background-color: #333; }
    `;
  }
}

class Example4Wrapped extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.delegate = options.delegate;
  }
  lightMode() {
    this.shadow.host.classList.add("light");
    this.shadow.host.classList.remove("dark");
  }
  darkMode() {
    this.shadow.host.classList.add("dark");
    this.shadow.host.classList.remove("light");
  }
  style(componentId) {
    return `
      :host { color:#333; background-color: #fff; }
      .root { 
        width:100px; marign-left:auto; marign-right:auto;
      }
    `;
  }
  template(componentId) {
    return `
      <div id="root" class="root" 
      onclick="${componentId}.delegate.toggleMode()">
        Example4Wrapped
      </div>
    `;
  }
}
```

## Summary

- Use the `:host` selector for static shadow host styling.
- Apply dynamic styles directly via `this.shadow.host.style[*]` for runtime changes.
- Swap CSS classes for flexible style toggling, ensuring classes are defined in an accessible scope.
- Avoid complex inter-component styling logic that complicates maintenance.

These examples illustrate various strategies for dynamically styling shadow hosts in CraftKit, enhancing the flexibility and responsiveness of your UI components. Remember, maintaining simplicity and clarity in your styling logic will greatly benefit long-term maintenance and scalability of your applications.

Explore these techniques and more on the CraftKit Playground:

[https://craftkit.dev/craftkit-playground/](https://craftkit.dev/craftkit-playground/)
