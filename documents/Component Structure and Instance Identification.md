# Inside CraftKit: Component Structure and Instance Identification

CraftKit, a framework for building modular web applications, employs Shadow DOM to encapsulate components, ensuring style and DOM isolation. This encapsulation is a cornerstone of CraftKit's design, allowing developers to create reusable and conflict-free UI components. The key properties of `Craft.UI.View`, defined by the `Craft.Core.Component` superclass, facilitate this encapsulation:

- **this.view**: The Shadow Host, typically a `div` element, representing the component's top-level DOM node, uniquely identified by `componentId`.
- **this.shadow**: The Shadow Root, attached to `this.view` in open mode, serving as the encapsulation boundary for the component's internal structure.
- **this.root**: The root element of the component's template, inserted into `this.shadow`, containing the component's HTML content.

This structure ensures CSS class names and DOM IDs remain unique across the application, eliminating conflicts and promoting object-oriented programming principles within CraftKit.

## Example: Vehicle, Bike, and Car

The following example illustrates how subclasses (`Bike` and `Car`) can inherit and extend the base class (`Vehicle`), with each maintaining independent and non-conflicting styles.

```javascript
class Vehicle extends Craft.UI.View {
  whoami() {
    return this.shadow.getElementById("text").innerHTML;
  }
  style(componentId) {
    return `
      .root { color: red; }
    `;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        Generic Vehicle
      </div>
    `;
  }
}

class Bike extends Vehicle {
  style(componentId) {
    return super.style(componentId) + `
        .root { color: blue; }
    `;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <span id="text">I'm Bike.</span>
      </div>
    `;
  }
}

class Car extends Vehicle {
  style(componentId) {
    return super.style(componentId) + `
      .root { color: purple; }
    `;
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <span id="text">I'm Car.</span>
      </div>
    `;
  }
}
```

This mechanism allows `Bike` and `Car` to share and override the `.root` CSS class from `Vehicle` without any conflict, thanks to the Shadow DOM isolation.

## Accessing Component Internals

While the Shadow DOM specification restricts direct access to a component's internals from the outside, CraftKit provides a way to interact with components through the `componentId`. This unique identifier allows global access to component instances when `Craft.Core.Defaults.ALLOW_COMPONENT_SHORTCUT` is enabled, facilitating direct method calls from within the template or externally.

## DangerousTruck Example

The `DangerousTruck` class extends `Car` and demonstrates invoking instance methods (`ignite` and `cooldown`) from both within the component's template and globally.

```javascript
class DangerousTruck extends Car {
  ignite() {
    this.shadow.getElementById("text").innerHTML = "🚛🔥🔥🔥";
  }
  cooldown() {
    this.shadow.getElementById("text").innerHTML = "I'm COOL Truck.";
  }
  template(componentId) {
    return `
      <div id="root" class="root">
        <span id="text" onclick="${componentId}.ignite()">
          I'm dangerous Truck.
        </span>
      </div>
    `;
  }
}
```

This pattern showcases CraftKit's flexibility in managing component interactions and state changes, powered by its encapsulation model and instance identification system.

## Running Examples in CraftKit Playground

The provided examples, including the vehicle hierarchy and the interactive `DangerousTruck`, can be explored and tested in the CraftKit Playground. This hands-on experience highlights the practical applications of CraftKit's component model, encapsulation, and instance management techniques.

Explore CraftKit and its core concepts to build modular, reusable, and maintainable web components in your applications.

🛺 [Try CraftKit Playground](https://github.com/craftkit/craftkit-playground)
