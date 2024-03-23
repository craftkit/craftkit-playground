# CraftKit Code Pattern: Creating a Package Namespace

CraftKit allows for modular development, enabling the use of modules within an HTML context. To prevent naming conflicts and ensure a structured organization of modules, defining a package namespace is essential. This guide outlines the process of creating your own package under the `Craft.Widget` namespace, detailing the steps and structure necessary for implementation.

## Steps to Define a Package Namespace

1. **Define Your Package Namespace** as `Craft.Widget.Example`.
2. **Implement a View Class** within this namespace, extending `Craft.UI.View`.
3. **Display the View** on the screen.
4. **Establish Your Top-Level Namespace** for further organization and scalability.

## Structuring Your Package

The typical file structure for a CraftKit package might look like this:

```
Craft.Widget.Example/
├── package.json
├── index.js
├── index.min.js
├── main.js
├── View.js
├── webpack.config.js
└── index.html
```

### Key File Contents

- **package.json**: A minimal setup with CraftKit as a dependency.

```json
{
  "name": "Craft.Widget.Example",
  "version": "0.1.0",
  "dependencies": {
    "@craftkit/craft-uikit": "^3.1.4"
  }
}
```

- **index.js & index.min.js**: Serve as entry points for Node.js and HTML contexts, respectively, ensuring the package is correctly injected into the global `window` object or Node.js module system.

```javascript
// index.js
"use strict";
const Example = require("./main.js");
module.exports = Example.default || Example;

// index.min.js
("use strict");
const Example = require("./main.js");
window.Craft.usePackage(Example.default);
module.exports = Example.default || Example;
```

- **main.js**: The central script where the package's components are defined and an `inject` function is provided to integrate the package into the CraftKit ecosystem.

```javascript
import { View } from "./View.js";
const Packages = { View: View };
Packages.inject = function (Craft) {
  Craft.Widget = Craft.Widget || {};
  Craft.Widget.Example = Craft.Widget.Example || Packages;
};
export default Packages;
```

- **View.js**: Contains the implementation of your package's view, extending `Craft.UI.View`.

```javascript
import * as Craft from "@craftkit/craft-uikit";
export class View extends Craft.UI.View {
  template(componentId) {
    return `<div class="root">This is Example</div>`;
  }
}
```

- **webpack.config.js**: Configures webpack for bundling your package, specifying external dependencies and output settings.

```javascript
var path = require("path");
module.exports = {
  mode: "development",
  entry: "./index.min.js",
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "craft-widget-example.min.js",
    library: "Example",
    libraryTarget: "window",
    globalObject: "window",
  },
  externals: {
    "@craftkit/craft-uikit": "Craft",
  },
};
```

- **index.html**: An example HTML file showing how to use your package in a browser context.

```html
<html>
  <head>
    <script src="https://unpkg.com/@craftkit/craft-uikit/dist/craft-uikit.min.js"></script>
    <script src="./craft-widget-example.min.js"></script>
    <script>
      window.onload = function () {
        Craft.Core.Bootstrap.boot({
          didBootApplication: function () {
            var rootViewController = new Craft.UI.DefaultRootViewController();
            Craft.Core.Context.setRootViewController(rootViewController);
            rootViewController.appendView(new Craft.Widget.Example.View());
          },
        });
      };
    </script>
  </head>
  <body id="CraftRoot"></body>
</html>
```

## Running Your Package

Compile your package with webpack:

```
webpack --config webpack.config.js
```

Then, you can open `./index.html` in a browser to see your package in action.

## Utilizing in Node.js Context

In Node.js, package namespaces are managed through its module system. Use `Craft.usePackage` to integrate your package fully.

```javascript
import * as Craft from "@craftkit/craft-uikit";
import * as Example from "./craft-widget-example.min.js";
Craft.usePackage(Example);

class MyPage extends Craft.UI.View {
  viewDidLoad(callback) {
    this.appendView(new Craft.Widget.Example.View());
  }
}
```

## Establishing a Top-Level Namespace

For defining a top-level namespace, such as `MyCompany.MyApp.Example`, structure it as follows:

```javascript:MyCompany/main.js
const MyCompany = {};

MyCompany.usePackage = function(packages){
  packages.inject(MyCompany);
};

export default MyCompany;
```

Then, adapt your package implementation to align with your top-level namespace:

```javascript:MyCompany.MyApp.Example/main.js
import { View } from './View.js';

const Packages = {
  View: View
};

Packages.inject = function(MyCompany){
  MyCompany.MyApp = MyCompany.MyApp || {};
  if(!MyCompany.MyApp.Example){
    MyCompany.MyApp.Example = Packages;
  }
};

export default Packages;
```

Use the following script to integrate the namespace in the HTML context:

```javascript:index.min.js
'use strict';

const Example = require('./main.js');

window.MyCompany.usePackage(Example.default);

module.exports = Example.default || Example;
```

To utilize your namespace in a Node.js application:

```javascript:YourApp.js
import * as MyCompany from '/mycompany';
import * as Example from './mycompany-myapp-example';
MyCompany.usePackage(Example);

class MyPage extends Craft.UI.View {
  viewDidLoad(callback){
    this.appendView(new MyCompany.MyApp.Example.View());
  }
}
```
