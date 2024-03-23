# CraftKit Code Patterns: Style Sharing and Object-Oriented CSS

CraftKit's design, leveraging Shadow DOM encapsulation, permits the use of streamlined CSS class names within components, facilitating an environment where styles are isolated and conflicts between component styles are minimized. This setup enables the implementation of object-oriented styling principles, allowing for inheritance and extension of styles much like class-based inheritance in object-oriented programming.

## Inheriting and Extending Styles

### Overriding the Style Method

CraftKit components define their styles via the `style` method. By overriding this method in subclasses, you can extend and customize styles inherited from parent classes.

```javascript
class Hello extends Craft.UI.View {
  style(componentId){
    return super.style(componentId) + `
      .root { margin: 50px; }
      .text { color: black; }
    `;
  }
  template(componentId){
    return `
      <div id="root" class="root">
        <h1>Hello</h1>
        <p class="text">World!</p>
      </div>
    `;
  }
}

class HelloRed extends Hello {
  style(componentId){
    return super.style(componentId) + `
      .text { color: red; }
    `;
  }
}
```

In this example, `HelloRed` inherits the base styling from `Hello` and adds its distinct color styling.

### Pseudo Multiple Inheritance

JavaScript does not support multiple inheritance. However, CraftKit's dynamic style definition through the `style` method allows for a pseudo multiple inheritance for styling, akin to CSS's cascading nature.

#### Implementing Style Definitions

By separating style definitions into individual classes, you can reuse and combine these styles across different components.

```javascript
// HeaderStyling.js
export class HeaderStyling {
  static style() { return `h1 { color: red; }`; }
}

// ParagraphStyling.js
export class ParagraphStyling {
  static style() { return `p { line-height: 2em; }`; }
}
```

These styles can then be imported and combined within a component, demonstrating a form of style inheritance and reuse.

```javascript
import { HeaderStyling } from './HeaderStyling.js';
import { ParagraphStyling } from './ParagraphStyling.js';

class TextBlock extends Craft.UI.View {
  style(componentId){
    return HeaderStyling.style() + ParagraphStyling.style() + `
      p { color: blue; }
    `;
  }
}
```

### Dynamic Style Injection

The static importation of styles can be further enhanced with dynamic style injection, allowing for runtime decisions on which styles to apply.

```javascript
class DynamicTextBlockController extends Craft.UI.View {
  viewDidLoad(callback){
    this.appendSubView(new Hello({
      styles: [HeaderStyling, ParagraphStyling]
    }));
  }
}

class DaynamicTextBlock extends Craft.UI.View {
  constructor(options){
    super(options);
    this.injectedStyles = options.styles;
  }
  style(componentId){
    return this.injectedStyles.map(style => style.style()).join('') + `
      p { color: blue; }
    `;
  }
}
```

### Loading External CSS

**Note**: Safari after version 16.4 supports `adoptedStyleSheets`.

While `adoptedStyleSheets` offer a modern approach to style encapsulation, their support is not universal. An alternative method involves loading external CSS files and appending them to the shadow root.

At first, load external CSS somewhere you want. You may define this in your `index.html`.

```javascript 
var link = document.createElement('link');
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css';
link.rel = 'stylesheet';
document.head.appendChild(link)
``` 

Then, make view with constructor appending CSS to this.shadow. 

```javascript
class Hello extends Craft.UI.View {
  constructor(options){
    super(options);
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css';
    link.rel = 'stylesheet';
    this.shadow.appendChild(link);
  }
  template(componentId){
    return `
      <div id="root" class="root">
        <h1>Hello</h1>
        <i class="fas fa-globe"></i>
      </div>
    `;
  }
}
```

### Practical Application

These examples illustrate the versatility of CraftKit's styling approach, enabling developers to implement sophisticated styling strategies that leverage inheritance, reuse, and encapsulation. To experiment with these patterns and more, visit the CraftKit Playground: [https://github.com/craftkit/craftkit-playground](https://github.com/craftkit/craftkit-playground).