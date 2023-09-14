let express= require("express")
let router = express.Router()
let user = require("./userschema")
let bcrypt = require("bcrypt")
let jokes = require("./jokes")
let passport = require("passport")
let initializePassport = require("./passport")
let expressSession = require("express-session")
let methodoverride = require("method-override")

initializePassport(passport)
router.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodoverride("_method"))



router.get("/user",async(req,res)=>{
        let users = await user.find({})
        res.json(users)
})

router.get("/login",notauthenticatedUser,(req,res)=>{
   res.sendFile(__dirname+"/view/login.html")
})
router.get("/",notauthenticatedUser,(req,res)=>{
    res.sendFile(__dirname+"/view/register.html")
})  

router.get("/jokes",authenticatedUser,(req,res)=>{
    let user = req.user.name
   let random = Math.floor(Math.random()*jokes.length)
   let obj = {
    joke : jokes[random],
    name:user
   }
   res.render(__dirname+"/view/joke",{obj})
})

router.post("/register",async(req,res)=>{
    console.log(req.body)
    let existinguser = await user.findOne({email:req.body.email})
    if(!existinguser){
        try{
            user.create({
                name:req.body.name,
                email:req.body.email,
                password:await bcrypt.hash(req.body.password,10)
            })
            
            res.redirect("/login")
        }
        catch(err){
            res.send(err)
        }
    }
    else{
        res.send("users already registered please try using different email")
    }
}
)

router.post("/login",passport.authenticate("local",{successRedirect:"/jokes"}),async(req,res)=>{
    
    // try{
    //     let users = await user.findOne({email:req.body.email})
    //     if(users){
    //        let check = await bcrypt.compare(req.body.password,users.password)
    //        if(check){
    //         res.redirect("/user/jokes/?name="+users.name)
    //        }
    //        else{
    //         res.send("please enter correct password")
    //        }
    //     }
    //     else{
    //         res.send("please enter correct email")
    //     }
    // }
    // catch(err){
    //      res.send(err.message)
    // }
})

router.delete("/delete/:id",async(req,res)=>{
    try{
        let users = await user.findByIdAndDelete(req.params.id)
        console.log(users)
        if(users){
          res.send("user deleted")
        }
        else{
          res.send("please enter a valid id")
        }
    }
    catch(err){
        res.send("something went wrong")
    }
     
})
router.delete("/logout",(req,res)=>{
    req.logout((err)=>{
        if(!err){
            res.redirect("/login")
        }
    })
   
})

router.get("/get",(req,res)=>{
    
    res.send(`<h1>hello world</h1>`)
})

function authenticatedUser(req,res,next){
if(req.user){
return next()
}
else{
    res.redirect("/login")
}
}

function notauthenticatedUser(req,res,next){
if(req.user){
    res.redirect("/jokes")
}
else{
return next()
}
}
module.exports = router