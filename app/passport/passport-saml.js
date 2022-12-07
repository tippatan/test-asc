const SamlStrategy = require("passport-saml").Strategy;
const fs = require("fs");

const passportSaml = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(samlStrategy);
};

const samlStrategy = new SamlStrategy(
  {
    // path: process.env.SAML_CALLBACK_LOGIN_PATH,
    callbackUrl: process.env.SAML_CALLBACK_LOGIN_HOSTNAME_PATH,
    entryPoint: process.env.SMAL_ENTRY_POINT,
    issuer: process.env.SAML_ISUER,
    acceptedClockSkewMs: -1,
    identifierFormat: null,
  },
  function (profile, done) {
    return done(null, {
      sessionIndex: profile.sessionIndex,
      id: profile.Username,
      userName: profile.Username,
      email: profile.Email,
      firstName: profile.Firstname,
      lastName: profile.Lastname,
      nameID: profile.nameID,
      nameIDFormat: profile.nameIDFormat,
      fullName: profile.FullName,
    });
  }
);

module.exports = { passportSaml, samlStrategy };
