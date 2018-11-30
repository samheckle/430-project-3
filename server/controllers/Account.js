// comment for heroku
const models = require('../models/');
const Account = models.Account;

const notFound = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};

const loginPage = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({
      error: 'wrong username / password',
    });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'wrong username or password',
      });
    }
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({
      redirect: '/maker',
    });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'all fields are required',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'passwords do not match',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({
        redirect: '/maker',
      });
    });

    savePromise.catch((err) => {
      if (err.code === 11000) {
        return res.status(400).json({
          error: 'username already in use',
        });
      }

      return res.status(400).json({
        error: 'an error occurred',
      });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const changePass = (request, response) => {
  const req = request;
  const res = response;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if (!req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({
      error: 'all fields are required',
    });
  }

  const query = {
    _id: req.session.account._id,
  };

  return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
    const newPass = {
      password: hash,
      salt,
    };

    Account.AccountModel.findOneAndUpdate(query, newPass, (err) => {
      if (err) {
        return response.send(500, {
          error: err,
        });
      }
      return res.redirect('/maker');
    });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePass = changePass;
module.exports.notFound = notFound;
