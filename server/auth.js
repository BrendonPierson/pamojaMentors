'use strict';

const Firebase = require('firebase');

class auth  {

  constructor() {
    this.ref = new Firebase(process.env.FBURL);
  }
  
  isAuth() {
    return this.ref.getAuth();
  }

  signIn(){
    this.ref.authWithPassword({
      email    : process.env.FBEMAIL,
      password : process.env.FBPW
    }, (error, authData) => {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }

}

module.exports = auth;