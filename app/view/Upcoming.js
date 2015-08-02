Ext.define('EventReminder.view.Upcoming', {
extend: 'Ext.Container',
xtype: 'upcoming',
config: {
layout: {
    type: 'vbox'
},
items: [
{
xtype: 'titlebar',
title: 'Upcoming Reminders',
items: [
{
xtype: 'button',
text: 'Back',
itemId: 'back'
}
]
},
{
xtype: 'list',
flex: 1,
itemTpl: '<div>{event}</div>',
    data: [
    {event: 'Birthday'},
    {event: 'Meeting'},
    {event: 'Call'},
    {event: 'Mail'},
    ]
}
],
listeners: [
{
delegate: '#back',
event: 'tap',
fn: 'back'
}
]
},
back:function(){
this.fireEvent("backCommand", this);
}
});