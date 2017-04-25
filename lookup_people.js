const inputName = process.argv[2];
const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

function getFamousPerson(name) {
  if (!name) {
    client.end();
    return console.error ('Invalid parameters. Please include a name for search.');
  }

  client.query("SELECT * FROM famous_people WHERE LOWER(last_name) = $1 OR LOWER(first_name) = $1", [name.toLowerCase()], (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    
    console.log("Searching ...");
    const found = result.rows.length;
    console.log(`Found ${found} person(s) by the name '${name}':`);
    result.rows.forEach((item, index) => {
      let dob = item.birthdate.toISOString().slice(0,10);
      console.log(`- ${index+1}: ${result.rows[index].first_name} ${result.rows[index].last_name}, born '${dob}'`);
    });
    client.end();

  });
}

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  } 

  getFamousPerson(inputName);
});
