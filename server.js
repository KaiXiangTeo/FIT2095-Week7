let express = require('express')
const mongodb = require("mongodb");
let bodyParser = require('body-parser')
var mongoose = require('mongoose');

let Task = require('./models/task')
let Developer = require('./models/developer')
let url = "mongodb://localhost:27017/week7lab";

let db;

let app = express()

app.use(express.static("public/img"))
app.use(express.static("views"))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json()) //tells the system that you want json to be used.

app.engine("html", require('ejs').renderFile);
app.set('view engine', "html");

mongoose.connect(url, {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        return console.log('Mongoose connection error:', err);
    }
    console.log('Connect Successfully');
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

//add new task
app.get("/newtask", function (req, res) {
    res.sendFile(__dirname + "/views/newTask.html")
});

app.post('/addtask', function (req, res) {
    let taskDetails = new Task({
        // TaskId: Math.round(Math.random() * 1000),
        _id: new mongoose.Types.ObjectId(),
        TaskName: req.body.TaskName,
        TaskAssign: req.body.TaskAssign,
        TaskDue: new Date(req.body.TaskDue),
        TaskStatus: req.body.TaskStatus,
        TaskDesc: req.body.TaskDesc
    })

    taskDetails.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/listTask');
        }

    })
})

//list task
app.get('/listtask', function (req, res) {
    Task.find({}, function (err, data) {
        res.render('listTask.html', {
            tasks: data
        });
    });
});

//update tasks
app.get('/updateTask', function (req, res) {
    res.sendFile(__dirname + '/views/updateTask.html');
});

app.post('/updatetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = {
        _id: req.body.utaskid
    };
    let theUpdate = {
        $set: {
            TaskStatus: req.body.taskStatus,
        }
    };
    Task.updateMany(filter, theUpdate,function(err,data){});
    res.redirect('/listTask');
})

//delete task 
app.get('/deleteTask', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTask.html');
});
//POST request: receive the user's name and do the delete operation 
app.post('/deletetask', function (req, res) {
    // let userDetails = req.body;
    let filter = {
        _id: req.body.TaskId
    };
    Task.deleteOne(filter,function (err,result) {});
    res.redirect("/listTask");
});

//delete all task
app.get('/deleteAll', function (req, res) {
    res.sendFile(__dirname + '/views/deleteAll.html');
});
//POST request: receive the user's name and do the delete operation 
app.post('/deleteAllTask', function (req, res) {
    if (req.body.selection == "true") {
        Task.deleteMany({},function (err,data){});
        res.redirect("/listTask");
    } else {
        res.redirect("/");
    }
});

//add developer
app.get('/newDeveloper', function (req, res) {
    res.sendFile(__dirname + '/views/newDeveloper.html');
});


app.post('/addDeveloper', function (req, res) {
    let developer = new Developer({
        name: {
            firstName: req.body.FirstName,
            lastName: req.body.LastName
        },
        level: req.body.level,
        address: {
            State: req.body.State,
            Suburb: req.body.Suburb,
            Street: req.body.Street,
            Unit: parseInt(req.body.Unit)
        }
    });

    developer.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/listDeveloper');
        }
    })

})

//list developer
app.get('/listDeveloper', function (req, res) {
    Developer.find({}, function (err, data) {
        res.render('listDeveloper.html', {
            developers: data
        });
    });
});


//insert many
app.get("/insertMany", function (req, res) {
    res.sendFile(__dirname + "/views/insertMany.html")
});

app.post('/addManytask', function (req, res) {
    let taskDetails = new Task({
        // TaskId: Math.round(Math.random() * 1000),
        _id: new mongoose.Types.ObjectId(),
        TaskName: req.body.TaskName,
        TaskAssign: req.body.TaskAssign,
        TaskDue: new Date(req.body.TaskDue),
        TaskStatus: req.body.TaskStatus,
        TaskDesc: req.body.TaskDesc,
        TaskCount: req.body.TaskCount
    })
    
    arr=[]
    // if (req.body.TaskCount==3 && req.body.TaskName=="Task"){
    for (let i=0;i<req.body.TaskCount;i++){
        arr.push(req.body);
    }
        Task.insertMany(arr,function (err,data){
            if (err) {
                console.log(err);
            } else {
                res.redirect('/listMany');
            }
        });
    // }
    // else{
        // res.redirect('/listMany');
    // }
    
})

app.get('/listMany', function (req, res) {
    Task.find({}, function (err, data) {
        res.render('listMany.html', {
            tasks: data
        });
    });
});
app.listen(8080);