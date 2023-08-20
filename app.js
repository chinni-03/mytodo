const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todolist'); // 27017 is the default port number for MongoDB

const app = express();

const todoSchema = {
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean
    }
};

const DayTodo = mongoose.model('day-todo', todoSchema);
const WeekTodo = mongoose.model('week-todo', todoSchema);
const MonthTodo = mongoose.model('month-todo', todoSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', {listType: 'myTODO'});
});

//works
app.route('/day-todo')
.get((req, res) => {
    DayTodo.find().then((foundTasks) => {
        if(foundTasks) {
            res.render('todo', {
                listType: 'Day TODO',
                tasks: foundTasks,
                heading: "DAY"
            });
        }
    }).catch((err) => {
        console.log('error occured!', err);
    })
})
.post((req, res) => {
    DayTodo.find({task: req.body.task}).then((found) => {
        if(found === 0) {
            console.log('The task already exists!');
        } else {
            const task = new DayTodo ({
                task: req.body.task,
                completed: false
            });
            task.save();
        }
    });
    res.redirect('/day-todo');
})

// week works
app.route('/week-todo')
.get((req, res) => {
    WeekTodo.find().then((foundTasks) => {
        if(foundTasks) {
            res.render('todo', {
                listType: 'Week TODO',
                tasks: foundTasks,
                heading: "WEEK"
            });
        }
    }).catch((err) => {
        console.log('error occured!', err);
    })
})
.post((req, res) => {
    WeekTodo.find({task: req.body.task}).then((found) => {
        if(found === 0) {
            console.log('The task already exists!');
        } else {
            const task = new WeekTodo ({
                task: req.body.task,
                completed: false
            });
            task.save();
        }
    });
    res.redirect('/week-todo');
});

// works
app.route('/month-todo')
.get((req, res) => {
    MonthTodo.find().then((foundTasks) => {
        if(foundTasks) {
            res.render('todo', {
                listType: 'Month TODO',
                tasks: foundTasks,
                heading: "MONTH"
            });
        }
    }).catch((err) => {
        console.log('error occured!', err);
    })
})
.post((req, res) => {
    MonthTodo.find({task: req.body.task}).then((found) => {
        if(found === 0) {
            console.log('The task already exists!');
        } else {
            const task = new MonthTodo ({
                task: req.body.task,
                completed: false
            });
            task.save();
        }
    });
    res.redirect('/month-todo');
});

// works
app.post('/:customTodo/delete', (req, res) => {
    const custom = _.lowerCase(req.params.customTodo);
    if(custom === 'day') {
        DayTodo.deleteOne({_id: req.body.delete}).then((deleted) => {
            // console.log('deleted successfully!');
        }).catch((err) => {
            res.send('error occurred!');
        });
        res.redirect('/day-todo');
    } else if(custom === 'month') {
        MonthTodo.deleteOne({_id: req.body.delete}).then((deleted) => {
            // console.log('deleted successfully!');
        }).catch((err) => {
            res.send('error occurred!');
        });
        res.redirect('/month-todo');
    } else if(custom === 'week') {
        WeekTodo.deleteOne({_id: req.body.delete}).then((deleted) => {
            // console.log('deleted successfully!');
        }).catch((err) => {
            res.send('error occurred!');
        });
        res.redirect('/week-todo');
    }
})

// works
app.post('/:custom/done', (req, res) => {
    const custom = _.lowerCase(req.params.custom);
    if (custom === 'day') {
        DayTodo.findById(req.body.done).then((found) => {
            if(found.completed === false) {
                DayTodo.findByIdAndUpdate(req.body.done,
                    {completed: true}).then((completed) =>{
                        // console.log('completed!');
                    }).catch((err) => {
                        console.log(err);
                    });
            } else {
                DayTodo.findByIdAndUpdate(req.body.done,
                    {completed: false}).then((completed) =>{
                        // console.log('undone!');
                    }).catch((err) => {
                        console.log(err);
                    });;
            }
        });
        res.redirect('/day-todo');
    } else if (custom === 'week') {
        WeekTodo.findById(req.body.done).then((found) => {
            if(found.completed === false) {
                WeekTodo.findByIdAndUpdate(req.body.done,
                    {completed: true}).then((completed) =>{
                        // console.log('completed!');
                    }).catch((err) => {
                        console.log(err);
                    });
            } else {
                WeekTodo.findByIdAndUpdate(req.body.done,
                    {completed: false}).then((completed) =>{
                        // console.log('undone!');
                    }).catch((err) => {
                        console.log(err);
                    });;
            }
        });
        res.redirect('/week-todo');
    } else if (custom === 'month') {
        MonthTodo.findById(req.body.done).then((found) => {
            if(found.completed === false) {
                MonthTodo.findByIdAndUpdate(req.body.done,
                    {completed: true}).then((completed) =>{
                        // console.log('completed!');
                    }).catch((err) => {
                        console.log(err);
                    });
            } else {
                MonthTodo.findByIdAndUpdate(req.body.done,
                    {completed: false}).then((completed) =>{
                        // console.log('undone!');
                    }).catch((err) => {
                        console.log(err);
                    });;
            }
        });
        res.redirect('/month-todo');
    }
});

app.listen(3000, () => {
    console.log('Server started running on port 3000...');
});
