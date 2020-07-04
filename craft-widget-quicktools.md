
# 🛺 Learning Craft.Widget.QuickTools

This is a tutorial for using Craft.Widget.QuickTools.

Before start this tutorial, play [CraftKit Basics](README.md) tutorial.

Open [Playground](https://craftkit.dev/craftkit-playground/), then copy and paste below snippets into your browser console.  
Enjoy!


## 📚 Tutorial

### 🧩 Load QuickTools

``` 
load_module('https://unpkg.com/@craftkit/craft-widget-quicktools/dist/craft-widget-quicktools.min.dev.js')
``` 

At first, load Craft.Widget.QuickTools by predefined playground function `load_module`.

Wait until message `loaded:`.

### 🧩 Load Font-Awesome 5.12.1

``` 
load_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css')
``` 

Second, load Font-Awesome by predefined playground function `load_css`.

Wait until message `loaded:`.

### 🧩 Prepare RootViewController

You can append Craft.UI.View instance directly into the DOM tree.  
But it is standard way to give it over to RootViewController.

In this tutorial, use default one.

``` 
var rootViewController = new Craft.UI.DefaultRootViewController()
Craft.Core.Context.setRootViewController(rootViewController)
``` 

### 🧩 PlainButton

``` 
var btn = new Craft.Widget.QuickTools.PlainButton({
	label:'Play',
	handler:()=>{alert('wow!');}
});
btn.loadView()

rootViewController.appendView(btn)
``` 

Click the button, then remove.

``` 
btn.removeFromParent()
``` 

### 🧩 IconButton

`iconSource` should be preliminary loaded in global because of Shadow DOM restriction.

In this case, it is already loaed by above snippet.

``` 
var btn = new Craft.Widget.QuickTools.IconButton({
	iconSource : "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css",
	icon       : "fas fa-thumbs-up",
	handler    : () => { alert("Wow"); }
});
btn.loadView()

rootViewController.appendView(btn)
``` 

#### 🤾‍♀️ Move its location and change color

``` 
btn.root.style.transition = '0.7s'
btn.root.style.color = 'red'
btn.root.style.marginTop = '200px'
btn.root.style.marginLeft = 'auto'
btn.root.style.marginRight = 'auto'
``` 

#### 🤾‍♀️ Change icon

You can also change icon itself in this playground.

Below snippet will reset above style (caused by renderView).

``` 
btn.icon = "fas fa-thumbs-down"
btn.renderView()
``` 

In real world application, you will extend Craft.Widget.QuickTools.IconButton to change its style.

Play with button, clean up screen.

``` 
btn.removeFromParent()
``` 

### 🧩 TipsPanel

🗒 NOTE:  
This module catches `onmouseover` and `onmouseout`. 
Those functions may not be fired if you started this tutorial in responsive mode. 
In such case, switch to PC view (toggle device tool bar in Chrome Developer Tools), and access playground again (don't reload), 
then start again from "Prepare RootViewController" section.

``` 
var view = new Craft.Widget.QuickTools.TipsPanelable({
	text : 'Tippable text (hover me).',
	tips : 'Hello, I am tips!'
});
view.loadView()
rootViewController.appendView(view)
``` 

Mouse over on the text, then clean up screen.

``` 
view.removeFromParent()
``` 

#### 🤾‍♀️ More complex panel

Below snippet, make MyView as a TipsPanelable view's content.

``` 
class MyView extends Craft.UI.View {
	style(){
		return `
			.root { 
				box-sizing: border-box;
				width:200px; height:40px; margin:44px; 
				cursor:pointer; background-color:#eee; 
				text-align:center; line-height:40px;
			}
		`;
	}
	template(componentId){
		return `
			<div class="root">Hover me.</div>
		`;
	}
}
class TippableMyView extends Craft.Widget.QuickTools.TipsPanelable {
	constructor(options){
		super();
		this.tips = 'Hello, this is info.';
		let content = new MyView();
		content.loadView();
		this.content = content;
	}
	style(){
		return `
			:host { display:inline-block; }
		`;
	}
}

var view = new TippableMyView()
view.loadView()
rootViewController.appendView(view)
``` 

Play with TipsPanelable, then clean up screen.

``` 
view.removeFromParent()
``` 

### 🧩 ActionPanel

This widget uses `ContentTapped` event fired by `Craft.UI.DefaultViewController`.
ActionPanel catches the event and control its view.

To enable `ContentTapped` event at the entire screen,  
force expand rootViewController to 100vh.

``` 
rootViewController.root.style.height = '100vh'
``` 

Then, try below ActionPanel snippet.

``` 
class InfoPanel extends Craft.UI.View {
	template(componentId){
		return `
			<div style="padding:44px;">Click out side of me to close me.</div>
		`;
	}
}
class PanelableElement extends Craft.UI.View {
	constructor(options){
		super();
	}
	showPanel(target){
		this.actionPanel = new Craft.Widget.QuickTools.ActionPanel({
			base : this
		});
		this.actionPanel.loadView();
		this.actionPanel.setContent(new InfoPanel());
		this.actionPanel.showPanel({
			target     : target,
			top_margin : -44 // see docs
		});
	}
	style(){
		return `
			.root { 
				box-sizing: border-box;
				width:200px; height:40px; margin:44px; 
				cursor:pointer; background-color:#eee; 
				text-align:center; line-height:40px;
			}
		`;
	}
	template(componentId){
		return `
			<div class="root" onclick="${componentId}.showPanel(this);">Click me.</span>
		`;
	}
}

var view = new PanelableElement()
view.loadView()
rootViewController.appendView(view)
``` 

Click the PanelableElement, then clean up screen.

``` 
view.removeFromParent()
``` 

### 🧩 ActionSheet

`Craft.Widget.QuickTools.ActionSheet` only provides content to be shown.

You have to implement how to show it by yourself.

``` 
class SheetableElement extends Craft.UI.View {
	openActionSheet(){
		const actionSheet = new Craft.Widget.QuickTools.ActionSheet({ 
			iconSource : "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css",
			actions:[
				{
					icon    : "fas fa-thumbs-up",
					title   : "Wow",
					handler : () => { alert("Wow"); }
				},
				{
					icon    : "fas fa-thumbs-down",
					title   : "Boo",
					handler : () => { alert("Boo"); }
				}
			]
		});
		
		const modalViewController = new Craft.UI.ModalViewController();
		modalViewController.loadView();
		modalViewController.setContent(actionSheet);
		Craft.Core.Context.getRootViewController().appendView(modalViewController);
		
		actionSheet.closeHandler = () => { modalViewController.unloadView(); };
		
		modalViewController.showContent();
	}
	style(){
		return `
			.root { margin:44px; cursor:pointer; }
		`;
	}
	template(componentId){
		return `
			<div class="root" onclick="${componentId}.openActionSheet();">Click me.</div>
		`;
	}
}

var view = new SheetableElement()
view.loadView()
rootViewController.appendView(view)
``` 

After all, clean up screen.

``` 
view.removeFromParent()
``` 

## 🖋 License

MIT

