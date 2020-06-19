const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

function initialize(passport,getUserByEmail,getUserById){
    const authenticatedUser = (email,password,done)=>{
        //return a user object(if any)
        const user = getUserByEmail(email);
        if(user === null){
            //done(error,isUserAuthenticated:boolean,message:'')
            return done(null,false,{message:'No user with that email found'});
        }
        try{
            if(await bcrypt.compare(password,user.passport)){
                //if user is authenticated => send the user info who is authenticated
                return done(null,user);
            }
            else{
                return done(null,false,{message:'Password is incorrect'});
            }
        }
        catch(error){
            return done(error);
        };
        
    }
    passport.use(new LocalStrategy({usernameField:'email'}),authenticatedUser);
    passport.serializeUser((user,done)=> done(null, user.id));
    passport.deserializeUser((id,done)=>{
        return done(null,getUserById(id))
    });
};



module.exports = initialize