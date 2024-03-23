# CraftKit Best Practices: Managing Instance Data in Views

When developing view classes that manage instance data—such as data resulting from user actions or server responses—it's possible to store this data in various ways. However, adhering to best practices for managing the instance data of a `Craft.UI.View` subclass involves utilizing `this.data` for data storage.

`Craft.UI.View` and its superclass `Craft.Core.Component` come equipped with numerous default fields, intentionally designed to minimize conflicts with user-defined data. Despite these precautions, conflicts may still arise occasionally.

To mitigate the risk of such conflicts, it's advisable to allocate your instance data within `this.data`.

## Example:

```javascript
class HeaderTitle extends Craft.UI.View {
  constructor(options) {
    super(options);
    this.data = {
      title: options.title,
    };
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <h1>${this.data.title}</h1>
      </div>
    `;
  }
}
```

When extending `HeaderTitle` or any other subclass, it's recommended to define a unique `this.data` for the subclass.

```javascript
class SmallHeaderTitle extends HeaderTitle {
  constructor(options) {
    super(options);
    this.data = {
      title: options.title,
    };
  }
}
```

However, if necessary, you may also choose to extend the superclass `this.data`:

```javascript
class DualHeaderTitle extends HeaderTitle {
  constructor(options) {
    super(options);
    this.data = Object.assign(
      {
        sub: options.subtitle,
      },
      this.data
    );
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <h1>${this.data.title}</h1>
        <h2>${this.data.sub}</h2>
      </div>
    `;
  }
}
```

### Advanced Usage:

For those interested in implementing patterns such as the observer-observable pattern, for example, using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), it's essential to monitor changes to `this.data`.

Explore and experiment with these concepts on the CraftKit Playground:  
[https://github.com/craftkit/craftkit-playground](https://github.com/craftkit/craftkit-playground)

This documentation is structured to offer clear guidance on managing instance data within CraftKit's view classes, ensuring a seamless development experience.
