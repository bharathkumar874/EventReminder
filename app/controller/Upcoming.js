Ext.define('EventReminder.controller.Upcoming', {
extend: 'Ext.app.Controller',
config: {
refs: {
upcoming: 'upcoming'
},
control: {
upcoming: {
backCommand: 'onBack'
}
}
},
onBack: function(){
var main = {
xtype: 'main'
}
Ext.Viewport.animateActiveItem(main, {type: 'slide', direction: 'right'});
}

});