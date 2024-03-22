
# 🛺 Learning Craft.Widget.StickyHeaderNavi

This is a tutorial for using Craft.Widget.StickyHeaderNavi.

This module provides responsive navigation. 

In this tutorial, we learn basic structure of this widget, and page navigation.

Before start this tutorial, play [CraftKit Basics](README.md) tutorial.

Open [Playground](https://craftkit.dev/craftkit-playground/), then copy and paste below snippets into your browser console.  
Enjoy!


## 📚 Tutorial for basic understanding

### 🧩 Load StickyHeaderNavi

``` 
load_module('https://unpkg.com/@craftkit/craft-widget-stickyheadernavi/dist/craft-widget-stickyheadernavi.min.dev.js')
``` 

At first, load Craft.Widget.StickyHeaderNavi by predefined playground function `load_module`.

Wait until message `loaded:`.


### 🧩 Structure overview

Before building tutorial application, check it out widget structure.

StickyHeaderNavi provides RootViewController and Sticky-Header that is shrinked by page scroll.

To apply this widhget, create ViewController with header components, and set it as RootViewController.

🗒 NOTE:  
Following snippets are very durty, just for understanding.  
Wait Tutorial application section for more actual case.

``` 
var rootViewController = new Craft.Widget.StickyHeaderNavi.ViewController({
	header : new Craft.Widget.StickyHeaderNavi.Header({
		large : new Craft.UI.View(),
		small : new Craft.UI.View(),
	}),
	backbtn : new Craft.Widget.StickyHeaderNavi.BackButton(),
	enableSwipeBack : true
});

Craft.Core.Context.setRootViewController(rootViewController)
``` 

Above snippet still dose not show any visual.  
So let's make up.

```  
rootViewController.header.root.style.backgroundColor = '#f0f0f0'
rootViewController.header.large.root.innerHTML = 'Large'
rootViewController.header.small.root.innerHTML = 'Small'
```  

Still small header is not shown.  
Let the page scrollable to be able to show it.

``` 
var page = new Craft.Widget.StickyHeaderNavi.Page()
page.loadView()
page.root.innerHTML = [...Array(80).keys()].map( (i) => `<div>${i}</div>`).join('')
rootViewController.open({page:page})
``` 

When you scroll page. `Small` will be shown.

Below snippet makes it more like large and small.

``` 
rootViewController.header.large.root.style.fontSize = '44px'
rootViewController.header.large.root.style.lineHeight = '88px'
rootViewController.header.small.root.style.fontSize = '22px'
rootViewController.header.small.root.style.lineHeight = '44px'
``` 

Try scrolling and changing style, then clean up screen.

``` 
Craft.Core.Context.getRootElement().innerHTML = ''
``` 

## 📚 Tutorial application

In this section, we make an application that have two page.

First is list of fruits.  
Second is detail of selected fruit.

### 🧩 Prepare header

StickyHeaderNavi requires at least two classes for its navigation.  
One is Large header element, one is small header element.  
Both are sub class of `Craft.UI.View`.

Large header is shown by default.  
And when you scroll down, header is replaced by Small header.

``` 
class FruitAppHeader extends Craft.Widget.StickyHeaderNavi.Header {
	style(componentId){
		return super.style(componentId) + `
			:host{
				box-shadow: 0px 2px 2px 1px rgba(128,128,128,.25);
				background-color: rgba(241,241,241,.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
			.root{ box-sizing:border-box; }
		`;
	}
}

class LargeTitle extends Craft.UI.View {
	setMessage(message){
		this.shadow.getElementById("message").innerHTML = message;
	}
	style(componentId){
		return super.style(componentId) + `
			.root { height: 84px; }
			h1 { font-size:44px; }
		`;
	}
	template(componentId){
		return `
			<div id="root" class="root">
				<h1 id="message"></h1>
			</div>
		`;
	}
}

class SmallTitle extends LargeTitle {
	style(componentId){
		return super.style(componentId) + `
			.root { height: 44px; }
			h1 { font-size:22px; }
		`;
	}
}
``` 

`#message` is a placehoulder to be changed by pages defined below.

### 🧩 Prepare list page

List class shows four fruit items.  
To be able to test Large and Small header bahaviour, this class also generates long empty lines.

``` 
class List extends Craft.Widget.StickyHeaderNavi.Page {
	constructor(fruit){
		super();
		this.path = '/list';
	}
	viewWillAppear(callback){
		this.viewController.header.large.setMessage('Fruit List');
		this.viewController.header.small.setMessage('Fruit List');
		if( callback ){ callback(); }
	}
	detail(fruit){
		this.viewController.open({
			page: new Detail(fruit)
		});
	}
	style(componentId){
		return super.style(componentId) + `
			.root {
				line-height: 33px;
			}
			.even { height:33px; background-color: #f0f0f0; }
			.odd { height:33px; background-color: #fafafa; }
		`;
	}
	template(componentId){
		return `
			<div class="root">
				<div onclick="${componentId}.detail('apple')" class="even">🍎 Apple</div>
				<div onclick="${componentId}.detail('orange')" class="odd">🍊 Orange</div>
				<div onclick="${componentId}.detail('lemon')" class="even">🍋 Lemon</div>
				<div onclick="${componentId}.detail('pineapple')" class="odd">🍍 Pineapple</div>
				${[...Array(40)].map( () => `
					<div class="even"></div>
					<div class="odd"></div>
				`).join('')}
			</div>
		`;
	}
}
``` 

### 🧩 Prepare detail page

By clicking an item, list page opens detail page for selected fruit.

``` 
class Detail extends Craft.Widget.StickyHeaderNavi.Page {
	constructor(fruit){
		super();
		if( !fruit ){ fruit = 'Apple'; }
		this.fruit = fruit;
		this.path = '/detail?'+fruit;
	}
	backToList(){
		this.viewController.open({page:new List()});
	}
	viewWillAppear(callback){
		this.viewController.header.large.setMessage(this.fruit);
		this.viewController.header.small.setMessage(this.fruit);
		if( callback ){ callback(); }
	}
	template(componentId){
		return `
			<div class="root">
				You selected ${this.fruit}<br>
				<div onclick="${componentId}.backToList()" style="margin-top:22px;color:blue;">back to list</div>
			</div>
		`;
	}
}
``` 

### 🧩 Prepare RootViewController

Your application will route a request for `/list` to List instance,  
and route a request for `/detail?<fruit>` to Detail instance.

By default, this RootViewController shows list page.

``` 
class MyViewController extends Craft.Widget.StickyHeaderNavi.ViewController {
	resolveRoutingRequest(route){
		let matches = route.path.match(/(\w+)\?*(\w+)/);
		let path = matches ? matches[1] : '';
		console.log(route)
		switch(path){
			case 'detail':
				let fruit = matches[2];
				this.open({ page:new Detail(fruit), callback:null, route:route });
				break;
			default:
				this.open({ page:new List(), callback:null, route:route });
				break;
		}
	}
}
``` 

### 🧩 Define App and boot it

Define your App object to launch this application by Bootstrap.

``` 
var FruitApp = {
	router : Craft.Core.HashRouter,
	didBootApplication : function(){
		Craft.Core.Defaults.ALLOW_COMPONENT_SHORTCUT = true;
		var rootViewController = new MyViewController({
			header : new FruitAppHeader({
				large : new LargeTitle(),
				small : new SmallTitle(),
			}),
			backbtn : new Craft.Widget.StickyHeaderNavi.BackButton(),
			enableSwipeBack : true
		});
		Craft.Core.Context.setRootViewController(rootViewController);
		rootViewController.bringup();
	}
}
``` 

Finally, you can launch fuit app.

``` 
Craft.Core.Bootstrap.boot(FruitApp)
``` 

Try open fruit page and back and forward.

#### 🤾‍♀️ Hash routing and Path routing

In above snippet, Craft.Core.HashRouter is selected for routing strategy.  
So you location is `list` or something like `/detail?apple`.

You can also select Path routing by setting Craft.Core.PathRouter via Craft.Core.Context.  
OK, set it.

``` 
Craft.Core.Context.setRouter(Craft.Core.PathRouter)
``` 

Now, fruit app is ready to work with Path router.  

Let's bring up routing again.

``` 
Craft.Core.Context.getRootViewController().bringup()
``` 

Boon 🙌

Browser location is now changed to `/list` or something like `/detail?apple`.


## 🖋 License

MIT

