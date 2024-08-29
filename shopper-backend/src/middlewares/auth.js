// import { User } from "../models/sequelize";
// import LocalStrategy  from 'passport-local';
// import passport from "passport";

class Auth {
  strategy = (passport, LocalStrategy, bcrypt, User, Role) => {
    passport.use(
      new LocalStrategy(
        { usernameField: "email", passwordField: "password", session: true },
        async (email, password, done) => {
          try {
            // let user = await User.findOne({ where: { email: email },raw:true});
            let user = await User.findOne({
              where: { email: email },
              include: [{ model: Role, as: "roles" }],
              raw: false,
              nest: true,
            });
            if (!user)
              return done(null, false, {
                message: "Incorrect username or password.",
              });
            const match = await bcrypt.compare(password, user.hash_password);
            if (!match)
              return done(null, false, {
                message: "Incorrect username or password.",
              });
            return done(
              null,
              {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles.map((role) => {
                  const { id, name } = role;
                  return { id, name };
                }),
              },
              { message: "Login successful." }
            );
          } catch (error) {
            return done(error);
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user.email);
    });

    passport.deserializeUser(function (email, done) {
      User.findOne({
        where: { email },
        include: [{ model: Role, as: "roles" }],
        raw: false,
        nest: true,
      }).then((user) => {
        done(null, {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles.map((role) => {
            const { id, name } = role;
            return { id, name };
          }),
        });
      });
    });
  };

  isLogged = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    // req.flash("error_msg","You are not authorized to access this page.");
    res.redirect("/");
  };

  isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin == 1) return next();
    // req.flash("error_msg","You are not authorized to access this page.");
    res.redirect("/");
  };
}

export default new Auth();
