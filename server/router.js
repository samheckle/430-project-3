const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.ExerciseData.getData);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.ExerciseData.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.ExerciseData.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);
  app.get('/*', mid.requiresSecure, mid.requiresLogout, controllers.Account.notFound);
};

module.exports = router;
