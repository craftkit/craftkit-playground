
var CalendarStyle = {
	calendar : `
		* { box-sizing:border-box; margin:0; padding:0; }
		:host {
		}
		.root {
			box-sizing: border-box;
			width: 100%;
			height: 100%;
			background-color: #fff;
		}
		.header { width:350px; margin-top:22px; margin-left:auto; margin-right:auto; }
		.month { width:350px; margin-top:11px; margin-left:auto; margin-right:auto; }
		.navi { width:350px; margin-top: 11px; padding-bottom:22px; margin-left:auto; margin-right:auto; display:flex; }
		.prev { margin-left:15px; cursor:pointer; text-align:right;  }
		.next { margin-right:15px; cursor:pointer; margin-left:auto; text-align:left; }
	`,
	month : `
		* { box-sizing:border-box; margin:0; padding:0; }
		:host {
			width: 350px;
		}
		.root {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			width: 350px;
		}
	`,
	day : `
		* { box-sizing:border-box; margin:0; padding:0; }
		:host {
			width: 50px;
			height: 50px;
		}
		.root {
			width: 50px;
			text-align: center;
			line-height: 50px;
			cursor: pointer;
		}
		.root:hover {
			background-color: yellowgreen;
		}
		.weekday0 { color: #f00; }
		.weekday1 { color: #555; }
		.weekday2 { color: #555; }
		.weekday3 { color: #555; }
		.weekday4 { color: #555; }
		.weekday5 { color: #555; }
		.weekday6 { color: #00f; }
		.prev_month { pointer-events: none; opacity: 0.5; }
		.this_month { pointer-events: all; }
		.next_month { pointer-events: none; opacity: 0.5; }
		.today { background-color: #0f0; }
	`
};
