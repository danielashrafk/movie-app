const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const session = require('express-session');
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret: 'daniel',saveUninitialized: true,resave: true}));
var global;

//load tasks array from a file
let loadUser = function(){
    try {
        let bufferedData = fs.readFileSync('usersDatabase.json')
        let dataString = bufferedData.toString()
        let tasksArray = JSON.parse(dataString)
        return tasksArray
    } catch (error) {
        return []
    }
   
}


//add a new task to tasks array
let addUser = function(task){
    //load tasks array
    let tasks = loadUser()
    //push new task in array
    tasks.push(task)
    //save array back in file
    fs.writeFileSync('usersDatabase.json', JSON.stringify(tasks))
}

let addWList = function(task, user){
    //load tasks array
    let tasks = loadUser()
    let flag = false
    let flag2 = false
    //push new task in array
    for (i=0; i<loadUser().length && flag == false; i++){

        if(tasks[i].username == user){
            for(j=0; j<tasks[i].wlist.length && flag2 == false;j++){
                if(tasks[i].wlist[j] == task){
                    flag2 = true
                    message3 = "Movie Already In Your Watchlist"

                }

            }

            flag = true
            
        }

        if(flag2 == false && flag == true){
            tasks[i].wlist[tasks[i].wlist.length] = task
        }

    }
   
    //save array back in file
    fs.writeFileSync('usersDatabase.json', JSON.stringify(tasks))
}


app.get('/', function(req,res){
    res.render('login',{
        loginMessage:message2
    })
    message2="";
        })


    

app.get('/horror', function(req,res){
    res.render('horror')

})

app.get('/action', function(req,res){
    res.render('action')

})

app.get('/drama', function(req,res){
    res.render('drama')

})

var message3 = ""

app.get('/conjuring', function(req,res){
    res.render('conjuring',{wListMessage:message3})
    message3 = ""
})



app.get('/getconjuring', function(req,res){
    var user = req.session.username;

    addWList('The Conjuring',user)

    res.redirect('/conjuring')

})




app.get('/darkknight', function(req,res){
    res.render('darkknight',{wListMessage:message3})
    message3 = ""

})

app.get('/getdarkknight', function(req,res){
    var user = req.session.username;
    addWList('The Dark Knight', user)

    res.redirect('/darkknight')

})

app.get('/fightclub', function(req,res){
    res.render('fightclub',{wListMessage:message3})
    message3 = ""

})

app.get('/getfightclub', function(req,res){
    var user = req.session.username;

    addWList('Fight Club', user)

    res.redirect('/fightclub')

})

app.get('/godfather', function(req,res){
    res.render('godfather',{wListMessage:message3})
    message3 = ""

})

app.get('/getgodfather', function(req,res){
    var user = req.session.username;
    addWList('The Godfather', user)

    res.redirect('/godfather')

})



app.get('/godfather2', function(req,res){
    res.render('godfather2',{wListMessage:message3})
    message3 = ""

})

app.get('/getgodfather2', function(req,res){
    var user = req.session.username;
    addWList('The Godfather: Part II',user)

    res.redirect('/godfather2')

})

app.get('/scream', function(req,res){
    res.render('scream',{wListMessage:message3})
    message3 = ""

})

app.get('/getscream', function(req,res){
    var user = req.session.username;

    addWList('Scream',user)

    res.redirect('/scream')

})

app.get('/searchresults', function(req,res){
    res.render('searchresults')

})

app.get('/watchlist', function(req,res){
    var flag = false;
    let temp1 = [];
    for(z = 0; z<loadUser().length && flag == false; z++){
        
        if(loadUser()[z].username == req.session.username){
            temp1 = loadUser()[z].wlist
            
            flag = true
        }
    }
    res.render('watchlist', {arr:temp1})
   
    
})



var message = "";
var message2 = "";
app.post('/register', function(req,res){
   let userInfo = req.body
    let whole = {
        username:req.body.username,
        password:req.body.password,
        wlist:[]
    }
    
    let flag = false;
    
    for (i=0; i<loadUser().length && flag == false; i++)
    {
        if ( userInfo.username == loadUser()[i].username) {

            flag = true;
            

        }
    }


    if (flag == false){
        message="Registration Successful!";
        addUser(whole);
        res.redirect('/registration');

    }
    else{
        message="Pick Another Username Please!";
        res.redirect('/registration');


    }
   
})
 app.get('/registration',function(req,res)
{
    res.render('registration',{
        registrationMessage:message
        
    })
    message="";
})

app.get('/home',function(req,res){
    res.render('home')
})
app.post('/login', function(req,res){
    req.session.username = req.body.username;
    let userInfo = req.body
    let flag = false
    for (i=0; i<loadUser().length && flag == false; i++)
    {
        if ( userInfo.username == loadUser()[i].username && userInfo.password == loadUser()[i].password){

            flag = true;
            


        }
    }

    if (flag == false){
        message2="Username Or Password Is Incorrect";
        res.redirect('/');

    }
    else{
        res.redirect('/home');


    }
   
})



app.post('/search', function(req,res){
    var j = []
    var t = req.body.Search
    if('The Dark Knight'.toLowerCase().includes(t.toLowerCase())){

        j.push('The Dark Knight')
    }
    

    if('Fight Club'.toLowerCase().includes(t.toLowerCase())){

        j.push('Fight Club')
    }

    

    if('The Conjuring'.toLowerCase().includes(t.toLowerCase())){

        j.push('The Conjuring')
    }

    

    if('Scream'.toLowerCase().includes(t.toLowerCase())){

        j.push('Scream')
    }

    
    if('The Godfather'.toLowerCase().includes(t.toLowerCase())){

        j.push('The Godfather')
    }

    
    
    if('The Godfather: Part II'.toLowerCase().includes(t.toLowerCase())){

        j.push('The Godfather: Part II')
    }
    
    
    
    if(j.length == 0){
        j.push('Movie Not Found')
    }
    
    
    
    res.render('searchresults', {arr:j})



})




var port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log('server is running')
})
