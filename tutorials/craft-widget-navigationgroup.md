
# 🛺 Learning Craft.Widget.NavigationGroup

This is a tutorial for using Craft.Widget.NavigationGroup.

This module provides traditional stack navigation. 

In this tutorial, we learn basic structure of this widget, and page navigation.

Before start this tutorial, play [CraftKit Basics](README.md) tutorial.

Open [Playground](https://craftkit.dev/craftkit-playground/), then copy and paste below snippets into your browser console.  
Enjoy!


## 📚 Tutorial for basic understanding

### 🧩 Load NavigationGroup

``` 
load_module('https://unpkg.com/@craftkit/craft-widget-navigationgroup/dist/craft-widget-navigationgroup.min.dev.js')
``` 

At first, load Craft.Widget.NavigationGroup by predefined playground function `load_module`.

Wait until message `loaded:`.


### 🧩 Prepare navigated pages

NavigationGroup provides page navigation and Side menu interface.

At first, we define a two pages, FirstPage and SecondPage.  

FirstPage shows a link to SecondPage.  
SecondPage shows a link to FirstPage.

Both should be some of the UI.View sub class.

``` 
class FirstPage extends Craft.UI.View {
	constructor(){
		super();
		this.path = '/first';
	}
	goSecond(){
		this.viewController.open({page:new SecondPage()});
	}
	template(componentId){
		return `
			<div style="padding:44px;">
				<div>I am FirstPage.</div>
				<div onclick="${componentId}.goSecond();" style="cursor:pointer;color:blue;">
					Click here to go SecondPage.
				</div>
			</div>
		`;
	}
}

class SecondPage extends Craft.UI.View {
	constructor(){
		super();
		this.path = '/second';
	}
	goFirst(){
		this.viewController.open({page:new FirstPage()});
	}
	template(componentId){
		return `
			<div style="padding:44px;">
				<div>I am SecondPage.</div>
				<div onclick="${componentId}.goFirst();" style="cursor:pointer;color:blue;">
					Click here to go FirstPage.
				</div>
			</div>
		`;
	}
}
``` 

Both constructor defines `path` property to be used as url.

Page transition is implemented by `NavigationGroup.ViewController#open` method.

### 🧩 Prepare side menu

Next, we define side menu.

This side menu shows links to FirstPage and SecondPage.

``` 
class Menu extends Craft.UI.View {
	openFirst(){
		this.viewController.open({page:new FirstPage()});
		this.viewController.toggleSidemenu();
	}
	openSecond(){
		this.viewController.open({page:new SecondPage()});
		this.viewController.toggleSidemenu();
	}
	style(){
		return `
			.menu { display:flex; flex-direction:column; padding-top:20px; }
			.item { padding-left:20px; line-height:50px; cursor:pointer; }
			.item:hover { background-color: #ddd; }
		`;
	}
	template(componentId){
		return `
			<div class="menu">
				<div class="item" onclick="${componentId}.openFirst();">First</div>
				<div class="item" onclick="${componentId}.openSecond();">Second</div>
			</div>
		`;
	}
}
``` 

### 🧩 Prepare RootViewController

``` 
class TwoPageViewController extends Craft.Widget.NavigationGroup.ViewController {
	resolveRoutingRequest(route){
		switch(route.path){
			case 'second':
				this.open({ page:new SecondPage(), callback:null, route:route });
				break;
			default:
				this.open({ page:new FirstPage(), callback:null, route:route });
				break;
		}
	}
}
``` 

### 🧩 Define App and boot it

Define your App object to launch this application by Bootstrap.

``` 
var TowPageApp = {
	router : Craft.Core.HashRouter,
	didBootApplication : function(options){
		Craft.Core.Defaults.ALLOW_COMPONENT_SHORTCUT = true;
		const rootViewController = new TwoPageViewController({
			enableHeader   : true,
			enableFooter   : true,
			enableSidemenu : true,
			page           : new FirstPage(), // initial page
		});
		Craft.Core.Context.setRootViewController(rootViewController);
		rootViewController.Header.setTitle("Demo");
		rootViewController.setSidemenu(new Menu());
		rootViewController.bringup();
	}
}
``` 

Here, build a rootViewController with enabling header and sidemenu.
Footer is also enabled, but not used in this tutorial. It is just for demonstration.

Finally, you can launch tow page app.

``` 
Craft.Core.Bootstrap.boot(TowPageApp)
``` 

Try open first and second page, and try browser back and forward.

#### 🤾‍♀️ Hash routing and Path routing

In above snippet, Craft.Core.HashRouter is selected for routing strategy.  
So you location moving between `/#/first` and `/#/second`.

You can also select Path routing by setting Craft.Core.PathRouter via Craft.Core.Context.  
OK, set it.

``` 
Craft.Core.Context.setRouter(Craft.Core.PathRouter)
``` 

Now, your two page app is ready to work with Path router.  

Let's bring up routing again.

``` 
Craft.Core.Context.getRootViewController().bringup()
``` 

Boon 🙌

Browser location is now changed to `/first` or `/second`.

#### 🤾‍♀️ Open third page

Adding extra page via Context.

``` 
class ThirdPage extends Craft.UI.View {
	constructor(){
		super();
		this.path = '/third';
	}
	template(componentId){
		return `
			<div style="padding:44px;">Injected ThirdPage</div>
		`;
	}
}

Craft.Core.Context.getRootViewController().open({page:new ThirdPage()})
``` 

This page is not routed by resolveRoutingRequest.  
So, just back back Context.

``` 
Craft.Core.Context.getRootViewController().back()
``` 

Boon 🙌🙌

Adding ThirdPage link to the side menu is your homework😄


🗒 NOTE:  
Above tutorial application is very durty implementation. 
When you open a page, its instance is hold by Craft.Core.ComponentStack until you unload it, to be able to access from global. 
In the real world application, you have to unload component instance at appropriate timming according to your application needs.

## 🖋 License

MIT

