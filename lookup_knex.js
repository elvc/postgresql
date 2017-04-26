const input = process.argv[2];
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

function getFamousPerson(name) {
  knex('famous_people').where('first_name', name).orWhere('last_name', name).asCallback(function (err, rows) {
    if (err) {
      knex.destroy();
      return console.error("error running query", err);
    }
    console.log("Searching ...");
    console.log(`Found ${rows.length} person(s) by the name '${name}':`);
    rows.forEach((item, index) => {
      let dob = item.birthdate.toISOString().slice(0, 10);
      console.log(`- ${index+1}: ${item.first_name} ${item.last_name}, born '${dob}'`);
    });
    knex.destroy();
  });
}

getFamousPerson(input);
