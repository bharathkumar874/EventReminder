Ext.define('EventReminder.controller.Recurrence', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.field.Spinner'],
    config: {
        refs: {
            recurrence: 'recurrence',
            recurrenceType: 'recurrence #selectType',
            recurrenceInterval: 'recurrence #recurrenceInterval',
            recurrenceCount: 'recurrence #count'
        },
        control: {
            recurrence: {
                cancelCommand: 'onCancel',
                addCommand: 'onAdd'
            }
        }
    },

    //Cancelation of popup
    onCancel:function(){
        this.getRecurrence().hide();
    },

    //Adding the recurrence to the Event
    onAdd:function(){

        //Preparing the Values for the store
        var recurrenceType = this.getRecurrenceType().getValue();
        var recurrenceInterval = this.getRecurrenceInterval().getValue();
        var recurrenceCount = this.getRecurrenceCount().getValue();

        //Creating a Recurrence model
        var recurrence = Ext.create('EventReminder.model.Recurrence', {
            RecurrenceId: (new Date()).getTime(),
            Type: recurrenceType,
            Interval: recurrenceInterval,
            Count: recurrenceCount
        });

        //Get the handle of current view's recurrence field
        var currentView = Ext.Viewport.getActiveItem().down('#recurrence');

        //Test the model for errors
        var errors = recurrence.validate();

        //If the model object is invalid
        if(currentView.getValue() != 'none'){
            //If recurrence is already set
            var recurrenceStore = Ext.getStore('Recurrence');
            var index = recurrenceStore.findExact('RecurrenceId', parseInt(currentView.getValue()));
            var record = recurrenceStore.getAt(index);
            record.set('Type', this.getRecurrenceType().getValue());
            record.set('Interval', this.getRecurrenceInterval().getValue());
            record.set('Count', this.getRecurrenceCount().getValue());
            recurrenceStore.sync();
            Ext.Msg.alert("Recurrence Updated");

            //Hide
            this.getRecurrence().hide();
        }
        else if(!errors.isValid()){
            Ext.Msg.alert('Invalid Recurrence Details');
        }
        else{
            //Store this record and set the Hidden field with the recurrence ID

            //Set the generated Unique Id to this recurrenceId field
            console.log(currentView.$className);
            currentView.setValue(recurrence.get('RecurrenceId'));
            console.log(currentView.getValue());

            //Storing into the Table
            var recurrenceStore = Ext.getStore('Recurrence');
            recurrenceStore.add(recurrence);
            recurrenceStore.sync();

            //Display Success Message
            Ext.Msg.alert('Recurrence Set');

            //Hide
            this.getRecurrence().hide();

            //Schedule recurrent Event
            //Get the event corresponding to this recurrence
            var eventID = Ext.Viewport.getActiveItem().down('#ID');
            var eventStore = Ext.getStore('Upcoming');
            var index = eventStore.findExact(eventID);
            var record = eventStore.getAt(index);

            //Get the frequency
            var frequency = this.getRecurrenceType().getValue();
            if(frequency == 'Daily')
                frequency = 'day';
            else if(frequency == 'Weekly')
                frequency = 'week';
            else
                frequency = 'month';


            //Set the phone LED lights for different priorities
            var led;
            if(event.get('priority') == "High")
                led = "FF0000";
            else if(event.get('priority') == "Medium")
                led = "00FF00";
            else
                led = "0000FF";

            cordova.plugins.notification.local.update({
                id: record.get('EventID'),
                title: record.get('category'),
                text: record.get('message'),
                at: record.get('date'),
                every: frequency,
                badge: 1,
                led: led
            });
        }
    }
});