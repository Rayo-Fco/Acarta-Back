import User from '../Models/User';
///import Admin from '../Models/Admin';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from '../Config'


  const opts:StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_TOKEN
  };

  console.log("leee");
/*   export const admin = new Strategy(opts, async (payload, done) => {
        const admin = await Admin.findById(payload.id);
        if (admin) {
          return done(null, admin);
        }
        
        return done(null, false)
        
  })  */

  export const user = new Strategy(opts, async (payload, done) => {
      const user = await User.findById(payload.id);
      if (user){
        return done(null, user);
      }
      return done(null, false);
    
 }) 


