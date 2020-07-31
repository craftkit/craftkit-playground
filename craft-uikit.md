
# 🛺 Learning CraftKit Basics

This is an online tutorial for Craft-UIKit basic logics.

Open [Playground](https://craftkit.dev/craftkit-playground/), then copy and paste below snippets into your browser console.  
Enjoy!


## 📚 Tutorial

### 🧩 Prepare RootViewController

You can append Craft.UI.View instance directly into the DOM tree.  
But it is standard way to give it over to RootViewController.

In this tutorial, use default one.

``` 
var rootViewController = new Craft.UI.DefaultRootViewController()
Craft.Core.Context.setRootViewController(rootViewController)
``` 

### 🧩 "Hello" view

Place a basic Craft.UI.View object.

``` 
class Hello extends Craft.UI.View {
	style(componentId){
		return `
			.root { 
				text-align:center;
			}
		`;
	}
	template(componentId){
		return `<div class="root">Hello!</div>`;
	}
}

var view = new Hello()
view.loadView()
rootViewController.appendView(view)
``` 

#### 🤾‍♀️ Change its color and position directly

The view encapsulates Shadow DOM. And the Shadow DOM contains actual structure as `root`.  
So you can change its property by accessing root.

``` 
view.root.style.color = 'red'
view.root.style.marginTop = '200px'
``` 

Play with root.style, clean up screen.

``` 
view.removeFromParent()
``` 

#### 🤾‍♀️ Change its color and position by cascading

Changing perperty by accessing `root` is useful but it is so adhook solution.

More clean way is to override style method.  
To cascade super class style, you can append yours by returning value of super.style.

``` 
class HelloRed extends Hello {
	style(componentId){
		return super.style(componentId) + `
			.root {
				color:red;
				margin-top:200px;
			}
		`;
	}
}

var view = new HelloRed()
view.loadView()
rootViewController.appendView(view)
``` 

Play with cascading, clean up screen.

``` 
view.removeFromParent()
``` 

#### 🤾‍♀️ Change with CSS transition

Style method can define any CSS.  
So, it is easy to apply animation by using CSS transition.

``` 
class HelloTransition extends Hello {
	style(componentId){
		return super.style(componentId) + `
			.root {
				transition: 0.7s;
			}
		`;
	}
}

var view = new HelloTransition()
view.loadView()
rootViewController.appendView(view)
``` 

After you place a view with CSS transition,
move and make it red by below snippet like above.

``` 
view.root.style.color = 'red'
view.root.style.marginTop = '200px'
``` 

Play with CSS transition, then clean up screen.

``` 
view.removeFromParent()
``` 

#### 🤾‍♀️ Encapsulation of Shadow DOM

Craft.UI.View encapsulates Shadow DOM.  
So, you are never plagued by CSS name space.

``` 
class HelloBlue extends Hello {
	style(componentId){
		return super.style(componentId) + `
			.root {
				color:blue;
			}
		`;
	}
}
class HelloGreen extends Hello {
	style(componentId){
		return super.style(componentId) + `
			.root {
				color:green;
			}
		`;
	}
}
``` 

Above two classes have same style class `color`,  
but never conflict.

``` 
var viewBlue = new HelloBlue()
var viewGreen = new HelloGreen()
viewBlue.loadView()
viewGreen.loadView()
rootViewController.appendView(viewBlue)
rootViewController.appendView(viewGreen)
``` 

After checking encapsulation, clean up screen.

``` 
viewBlue.removeFromParent()
viewGreen.removeFromParent()
``` 

Of course, `id` defined in the template is also encapsulated.

### 🧩 "Hello World" view

OK, let's start interaction.  
Prepare base class by extending `HelloRed` to reuse CSS design.

``` 
class SayHello extends HelloRed {
	constructor(whom){
		super();
		this.whom = whom;
	}
	sayTo(whom){
		this.whom = whom;
		this.renderView();
	}
	template(componentId){
		return `<div class="root">Hello <span id="whom">${this.whom}</span>!</div>`;
	}
}

var view = new SayHello('World')
view.loadView()
rootViewController.appendView(view)

view.sayTo('CraftKit')
``` 

sayTo method updates `whom`, and update its view.

#### 🤾‍♀️ Yet another solution

In above case, `renderView` re-compiles template with current status of `this`.  
This will reset some dynamic design applied to your object. (instead, this implementation is durty)


The compiled view is accesible by `shadow` property,  
So, you can change `whom` by following code, and you can keep your inner status.

``` 
view.shadow.getElementById('whom').innerHTML = 'CraftKit'
``` 

Therefore, you can implement SayHello class like this.

(Before paste following snippet remove the view)

``` 
view.removeFromParent()
``` 

OK, re-define SayHello class and put it on the screen.

``` 
class SayHello extends HelloRed {
	constructor(whom){
		super();
		this.whom = whom;
	}
	viewDidLoad(){
		this.sayTo(this.whom);
	}
	sayTo(whom){
		this.whom = whom;
		this.shadow.getElementById('whom').innerHTML = this.whom;
	}
	template(componentId){
		return `<div class="root">Hello <span id="whom"></span>!</div>`;
	}
}

var view = new SayHello('World')
view.loadView()
rootViewController.appendView(view)

view.sayTo('CraftKit')
``` 

This is more natural coding style.

Play with SayHello, then clean up screen.

``` 
view.removeFromParent()
``` 

#### 🤾‍♀️ More practical solution

In real world application, you may not want to inject HTML code into the Shadow DOM directly.

So, you may implement like this:

``` 
class World extends Craft.UI.InlineBlockView {
	constructor(whom){
		super();
		this.whom = whom || 'World';
	}
	template(componentId){
		return `<div class="root">${this.whom}</div>`;
	}
}
class SayHelloAdvanced extends HelloRed {
	constructor(whom){
		super();
		this.whom = whom;
		this.world = null; /* will be initialized when this view is loaded */
	}
	viewDidLoad(){
		this.sayTo(this.whom);
	}
	sayTo(whom){
		let disappear = this.world;
		this.world = new World(whom);
		this.replaceView({
			id        : '#whom',
			component : this.world
		});
		if( disappear ){
			disappear.unloadView();
		}
	}
	template(componentId){
		return `<div class="root">Hello <span id="whom"></span>!</div>`;
	}
}

var view = new SayHelloAdvanced()
view.loadView()
rootViewController.appendView(view)

view.sayTo('CraftKit')
``` 

🗒 NOTE:  
In this solution, instance of `World` is created by every `sayTo` call.  
But even if you removed it from the screen (=DOM tree), its instance is still on the memory.  
So, you have to delete it by calling `unloadView`.

#### 🤾‍♀️ Global component access

The component instance is identified by `componentId`.  
Here is an example output of browser console. (try by yourself)

``` 
> view.componentId
SayHelloAdvanced_18
``` 

The `componentId` points its instance globally.
So you can call `sayTo` method by following code.

``` 
SayHelloAdvanced_18.sayTo('from Global')
``` 

The trailing number is unique serial number automatically appended by library following to its class name. 

To avoid name space conflict, it is recommended to define `packagename` in your class.

``` 
class HelloRealWorld extends Craft.UI.View {
	constructor(whom){
		super();
		this.packagename = 'Craftkit.Tutorial.HelloRealWorld';
	}
	template(componentId){
		return `<div class="root">Hello real World!</div>`;
	}
}

var view = new HelloRealWorld()
view.loadView()
rootViewController.appendView(view)
``` 

In this case, view is poited by:

``` 
> view.componentId
"Craftkit_Tutorial_HelloRealWorld_26"
``` 

🗒 NOTE:  
`packagename` is an adhook solution until comming **Private class fields** in Safari.


## 🖋 License

MIT

