const firstName = process.argv[2];
const lastName = process.argv[3];
const dob = process.argv[4];
const settings = require("./settings");

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: settings.hostname,
    user: settings.user,
    password: settings.password,
    database: settings.database,
    port: settings.port,
    ssl: settings.ssl
  },
});

function insertFamousPerson(f_name, l_name, dob) {
  knex('famous_people').insert({first_name: f_name, last_name: l_name, birthdate: dob}).asCallback(function (err, rows) {
    if (err) {
      knex.destroy();
      return console.error("error running query", err);
    }
    console.log('New person successfully added');
    knex.destroy();
  });
}

insertFamousPerson(firstName, lastName, dob);
