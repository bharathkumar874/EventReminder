Ext.define('EventReminder.controller.Category', {
    extend: 'Ext.app.Controller',
    requires: 'Ext.MessageBox',
    config: {
        refs: {
            category: 'category',
            main : 'main',
            categoryName: 'category #categoryName',
            categoryActivity: 'category #selectActivity',
            categoryPriority: 'category #priority',
            editEventCategory: 'editevent #selectEditCategory',
            newEventCategory: 'newEvent #selectCategory',
            editevent: 'editevent',
            newevent: 'newEvent'
        },
        control: {
            category: {
                backCommand: 'back',
                createCommand: 'create'
            }
        }
    },
    back: function(){
        //code for navigating to the main view
        Ext.Viewport.animateActiveItem(this.getMain(), {type: 'slide', direction: 'right'});
    },

    //Function for creating a new event
    create: function(){

        //Creating a new Category model
        var category = Ext.create('EventReminder.model.Category', {
            Category: this.getCategoryName().getValue(),
            Priority: this.getCategoryPriority().getValue(),
            Activity: this.getCategoryActivity().getValue()
        });

        //Validate the Category
        var errors = category.validate();

        //Also Check for Duplicate categories assuming the new category is not duplicate
        var categoryOptionsStore = Ext.getStore('CategoryOptions');
        var isDuplicate = false;
        var me = this;
        categoryOptionsStore.each(function(item, index, length){
            var rec = me.getCategoryName().getValue();
            //console.log(rec);
            //console.log(item.get('text'));
            if(item.get('text') == rec)
                isDuplicate = true;
        });

        if(!errors.isValid() || isDuplicate){
           Ext.Msg.alert("Duplicate or invalid Category");
        }
        else{

            //Getting the Options store
            var store = Ext.getStore('Category');
            store.add(category);
            store.sync();

            //Prepare Option Object
            var option = Ext.create('EventReminder.model.CategoryOptions', {
                text: this.getCategoryName().getValue(),
                value: this.getCategoryName().getValue()
            });

            var errors = option.validate();

            if(errors.isValid())
            {
                //Add the new category to options
                categoryOptionsStore.add(option);
                categoryOptionsStore.sync();

               //Display success message
               Ext.Msg.alert('New Category Created');

               //Clear the fields
               this.getCategoryName().setValue("");
               this.getCategoryPriority().setValue(0);
               this.getCategoryActivity().getValue("");
            }
            else
            {
                Ext.Msg.alert('Category Already Exists');
            }
        }
    },

    launch: function(){

        //Add default records if the store is the loaded first time
        var categoryOptionsStore = Ext.getStore('CategoryOptions');
        categoryOptionsStore.sync();

        categoryOptionsStore.load(function(records, operation, success){

             if(categoryOptionsStore.getTotalCount() == 0){
                 var None = Ext.create('EventReminder.model.CategoryOptions', {
                      text: 'None',
                      value: ''
                  });
                 var Birthday = Ext.create('EventReminder.model.CategoryOptions', {
                     text: 'Birthday',
                     value: 'Birthday'
                 });
                 var Meeting = Ext.create('EventReminder.model.CategoryOptions', {
                     text: 'Meeting',
                     value: 'Meeting'
                 });
                 var Shopping = Ext.create('EventReminder.model.CategoryOptions', {
                     text: 'Shopping',
                     value: 'Shopping'
                 });
                 var Outing = Ext.create('EventReminder.model.CategoryOptions', {
                     text: 'Outing',
                     value: 'Outing'
                 });
                 categoryOptionsStore.add(None);
                 categoryOptionsStore.add(Birthday);
                 categoryOptionsStore.add(Meeting);
                 categoryOptionsStore.add(Shopping);
                 categoryOptionsStore.add(Outing);
                 categoryOptionsStore.sync();
            }
        });

        //Add Default records to the Category store too
        var categoryStore = Ext.getStore('Category');
        categoryStore.load(function(records, operation, success){

            if(categoryStore.getTotalCount() == 0){
        var Birthday = Ext.create('EventReminder.model.Category', {
             Category: 'Birthday',
             Priority: '70',
             Activity: 'Call'
         });
         var Meeting = Ext.create('EventReminder.model.Category', {
             Category: 'Meeting',
             Priority: '100',
             Activity: 'Email'
         });
         var Shopping = Ext.create('EventReminder.model.Category', {
             Category: 'Shopping',
             Priority: '80',
             Activity: 'Text'
         });
         var Outing = Ext.create('EventReminder.model.Category', {
             Category: 'Outing',
             Priority: '30',
             Activity: 'Email'
         });
         categoryStore.add(Birthday);
         categoryStore.add(Meeting);
         categoryStore.add(Shopping);
         categoryStore.add(Outing);
         categoryStore.sync();
            }
        });
    }
    });