# CraftKit Tips: Accessing Instance Variables from Template Literals

In CraftKit, the `template` method is used to define the structure of your view, typically utilizing JavaScript template literals for dynamic content insertion. This method returns HTML starting from a single node, and it accepts a `componentId` string argument, which can be linked to its instance via `window[componentId]` when `Craft.Core.Defaults.ALLOW_COMPONENT_SHORTCUT` is enabled.

## Access Styles in Templates

You can access instance variables within your template in two primary ways: directly via `this` or through the `componentId`. Both approaches yield the same result, but their applicability may vary depending on the context.

### Direct Access Using `this`

```javascript
class Example extends Craft.UI.View {
  constructor(options){
    super(options);
    this.data = { val: 'Hello!' };
  }
  template(componentId){
    return `
      <div id="root" class="root">
        ${this.data.val}
      </div>
    `;
  }
}
```

### Indirect Access Using `componentId`

```javascript
class Example extends Craft.UI.View {
  constructor(options){
    super(options);
    this.data = { val: 'Hello!' };
  }
  template(componentId){
    return `
      <div id="root" class="root">
        ${window[componentId].data.val}
      </div>
    `;
  }
}
```

While accessing instance variables directly with `this` is more intuitive, it's important to remember that in the context of JavaScript functions, `this` refers to the function itself. Therefore, using `componentId` is necessary when you need to access instance variables from within function contexts, such as event handlers.

## Practical Usage

When incorporating event handlers or needing to reference instance methods or variables within your template, using `componentId` ensures proper access.

### Correct vs. Incorrect Access Patterns

```html
<!-- Correct Usage -->
<div onclick="${componentId}.action('World!')">
  Hello
</div>

<!-- Incorrect: Results in TypeError -->
<div onclick="this.action('BUG!')">
  Hello
</div>

<!-- Incorrect: Undefined variable access -->
<div>
  componentId is evaluated as a string
  ${componentId.data.val}
</div>
```

It's crucial to understand that `componentId` should be used for accessing instance methods and properties to avoid common errors.

### Flexible Naming

The argument `componentId` in the `template` method can be named according to your preference, enhancing readability and maintainability of your code.

```javascript
class Example extends Craft.UI.View {
  constructor(options){
    super(options);
    this.data = { val: 'Hello!' };
  }
  action(str){
    alert(str);
  }
  template(self){
    return `
      <div id="root" class="root">
        <div onclick="${self}.action('World!')">
          ${this.data.val} traditional looks and feel
        </div>
      </div>
    `;
  }
}
```

This flexibility allows developers to choose naming conventions that best fit their project's structure and readability requirements.

## Note

The provided examples demonstrate effective strategies for interacting with instance variables and methods within templates. They are fully testable within the CraftKit Playground.

Explore these techniques and more:

[https://github.com/craftkit/craftkit-playground](https://github.com/craftkit/craftkit-playground)