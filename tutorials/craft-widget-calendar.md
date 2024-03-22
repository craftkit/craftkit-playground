
# 🛺 Learning Craft.Widget.Calendar

This is a tutorial for using Craft.Widget.Calendar.

Before start this tutorial, play [CraftKit Basics](README.md) tutorial.

Open [Playground](https://craftkit.dev/craftkit-playground/), then copy and paste below snippets into your browser console.  
Enjoy!


## 📚 Tutorial

### 🧩 Load Calendar

``` 
load_module('https://unpkg.com/@craftkit/craft-widget-calendar/dist/craft-widget-calendar.min.dev.js')
``` 

At first, load Craft.Widget.Calendar by predefined playground function `load_module`.

Wait until message `loaded:`.

### 🧩 Load Moment.js

``` 
load_module('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js')
``` 

Calendar widget requires Monet.js. Let's load it.

Also, wait until message `loaded:`.

### 🧩 Prepare RootViewController

You can append Craft.UI.View instance directly into the DOM tree.  
But it is standard way to give it over to RootViewController.

In this tutorial, use default one.

``` 
var rootViewController = new Craft.UI.DefaultRootViewController()
Craft.Core.Context.setRootViewController(rootViewController)
``` 

### 🧩 Plain calendar

At first, place a plain calendar.

``` 
var calendar = new Craft.Widget.Calendar.View({
	yyyy       : moment().format('YYYY'),
	mm         : moment().format('MM'),
	delegate   : {
		handleSelectCalendarMonth : (month) => { console.log("selected month: "+month.iso) },
		handleSelectCalendarDay : (day) => { console.log("selected day: "+day.iso) }
	}
});

calendar.loadView()
rootViewController.appendView(calendar)
``` 

Click '←' to move previous month, '→' to next month.  
Those action show `month.iso` (YYYY-MM) on the console.  

Clicking a day shows `day.iso` (YYYY-MM-DD) on the console.  

Both handler can be defiened through delegate parameter as `handleSelectCalendarMonth` and `handleSelectCalendarDay`.

Play with the calendar, clean up screen.

``` 
calendar.removeFromParent()
``` 

### 🧩 Visual design

You can customize calendar visual by extend Craft.Widget.Calendar.* classes with over written style method.

But, an easy way has been prepared in this module to inject style.

Here is an predefined style set:

``` 
load_module('/craft-widget-calendar-design-1.js')
``` 

This module simplly defines global value named `CalendarStyle` containing CSS text.  
Type `CalendarStyle` to show the content, it may be something like this:

``` 
> CalendarStyle
{ calendar : ".header { ... } .month { ... } ... .prev { ... }  .next { ... }",
  month : ".root { ... }",
  day : ".weekday0 { ... } .weekday1 { ... } ... .weekday6 { ... } ... .tody { ... }"}
``` 

To apply this style set in this calendar module, instantiate with this.

``` 
var calendar = new Craft.Widget.Calendar.View({
	yyyy       : moment().format('YYYY'),
	mm         : moment().format('MM'),
	StyleSheet : CalendarStyle,
	delegate   : {
		handleSelectCalendarMonth : (month) => { console.log("selected month: "+month.iso) },
		handleSelectCalendarDay : (day) => { console.log("selected day: "+day.iso) }
	}
});

calendar.loadView()
rootViewController.appendView(calendar)
``` 

After playing with the designed calendar, clean up screen.

``` 
calendar.removeFromParent()
``` 

### 🧩 Apointment calendar

You have several appointments at previous, this and next month.
Let's define this situation by code:

``` 
var appointments = {}

var this_month = moment()
var prev_month = this_month.clone().subtract(1,'month')
var next_month = this_month.clone().add(1,'month')

appointments[ prev_month.date(10).format('YYYY-MM-DD') ] = { appointment:'11:00' }
appointments[ this_month.date(15).format('YYYY-MM-DD') ] = { appointment:'9:00' }
appointments[ this_month.date(24).format('YYYY-MM-DD') ] = { appointment:'15:00' }
appointments[ next_month.date(20).format('YYYY-MM-DD') ] = { appointment:'14:00' }
``` 

You are now able to look up your appointment by `appointments['YYYY-MM-DD']`.  
Its value defines time of your appointment. 

When showing month, `handleSelectCalendarMonth` will be called.    
So, you can inject your appointment in here.  
To check your appointment, just click day.

``` 
var handler = {
	handleSelectCalendarMonth : (month) => {
		month.this_days.forEach( day => {
			if( appointments[day.iso] ){
				day.classes.push('busy_day');
				day.appointment = appointments[day.iso].appointment;
				day.renderView();
			}
		});
	},
	handleSelectCalendarDay : (day) => {
		alert( day.appointment || 'Free!' );
	}
}
``` 

To highligh day that with appointment, above code applying `busy_day` class to the day.  
You have to define your day class, because it is not defined in any where. 

``` 
class MyDay extends Craft.Widget.Calendar.Day {
	style(componentId){
		return super.style(componentId) + `
			.busy_day { background-color: #f2eb77; }
		`;
	}
}
``` 

🗒 NOTE:  
In real world application, you may initialize `this.appointment` explicitly in MyDay constructor.  

OK, your apointment calendar is ready to build.

``` 
var calendar = new Craft.Widget.Calendar.View({
	yyyy       : this_month.format('YYYY'),
	mm         : this_month.format('MM'),
	StyleSheet : CalendarStyle,
	delegate   : handler,
	Day        : MyDay,
})

calendar.loadView()
rootViewController.appendView(calendar)
``` 

Play with TODO calendar, clean up screen.

``` 
calendar.removeFromParent()
``` 

## 🖋 License

MIT

