let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    TaskName: String,
    TaskAssign: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Developer'
    },
    TaskDue: Date,
    TaskStatus:{
        type:String,
        validate:{
            validator:function(status){
                return status=="InProgress" || status=="Complete"
            },
            message: 'Task status should only be InProgress or Complete'
        }
    },
    TaskDesc: String
})

module.exports = mongoose.model('Task', taskSchema);