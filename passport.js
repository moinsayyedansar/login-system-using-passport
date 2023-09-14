let localstrategy = require("passport-local")
let users= require("./userschema")
let bcrypt = require("bcrypt")



let initializePassport = (passport)=>{
    passport.use(new localstrategy({usernameField:"email"},async(email,password,done)=>{
try{
      let user = await users.findOne({email})
      
      if(user==null){
        return done(null,false,{message:"no user with that email"})
      }
      else if(!await bcrypt.compare(password,user.password)){
        return done(null,false,{message:"user password does not match"})
      }
      else{
        return done(null,user)
      }
      
}
catch(err){
return done(err,false)
}
    }))

    passport.serializeUser((user,done)=>{

            return done(null,user)
                
    })
    passport.deserializeUser(async(id,done)=>{
        try{
            let user = await users.findById(id)
           return  done(null,user)

        }
        catch(err){
           return done(err,false)
        }
    })
}

module.exports=initializePassport