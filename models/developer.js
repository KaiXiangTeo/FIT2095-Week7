let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required : true
        }, 
        lastName : String
    },
    level:{
        type: String,
        required : true,
        validate:{
            validator: function(level){
                return (level=="BEGINNER" || level=="EXPERT")
            },
            message: 'level string shopuld be either ‘Beginner or Expert in all caps'
        }
    },
    address:{
        State:String,
        Suburb: String,
        Street:String,
        Unit:Number
    },
});
module.exports = mongoose.model('Developer', developerSchema);
