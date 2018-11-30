const models = require('../models');
const Data = models.ExerciseData;

const makerPage = (req, res) => {
  Data.DataModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeData = (req, res) => {
  if (!req.body.name || !req.body.minutes || !req.body.day) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const data = {
    name: req.body.name,
    minutes: req.body.minutes,
    date: req.body.day,
    owner: req.session.account._id,
  };

  const newData = new Data.DataModel(data);

  const dataPromise = newData.save();

  dataPromise.then(() => res.json({ redirect: '/maker' }));

  dataPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return dataPromise;
};

const getData = (request, response) => {
  const req = request;
  const res = response;
  return Data.DataModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ domos: docs });
  });
};
module.exports.makerPage = makerPage;
module.exports.getData = getData;
module.exports.make = makeData;
