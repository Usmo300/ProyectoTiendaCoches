'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use( new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    //confirmamos que el username existe en la base de datos
    const user = await User.findOne({username})
    if (!user) {
        return done(null, false, { message: 'El usuario no existe.'});
    } else {
        //Comprobamos si la contraseña es correcta
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, {message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((user, done) =>{
    done(null, user.id)
});

passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) => {
        done(err, user);
    })
});