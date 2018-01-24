const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const generateRandomString = function(){
  const alphNumList = [0,1,2,3,4,5,6,7,8,9,0,'z','x','c','v','b','n','m','a','s','d','f','g','h','j','k','l','q','w','e','r','t','y','u','i','o','Z','X','C','V','B','N','M','A','S','D','F','G','H','J','K','L','Q','W','E','R','T','Y','U','I','O','P'];
  let alphNumString = '';
  for (let i = 1; i <= 6; i++){
    let randomNum = Math.ceil(Math.random() * 62);
    alphNumString += alphNumList[randomNum];
  }
  return alphNumString;
};


app.get('/', (req, res) => {
  res.end('Hello!');
});


app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n')
});


app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index.ejs', templateVars);
});


app.get('/urls.json', (req, res) =>{
  //send a json response
  res.json(urlDatabase);
});


app.get('/urls/new', (req, res) => {
  res.render('urls_new.ejs');
});


app.post('/urls', (req, res) => {
  let longURL = req.body.longURL;
  let shortURLExisting = false;
  for (let key in urlDatabase) {
    if (urlDatabase[key] === longURL){
      shortURLExisting = true;
      shortURL = key;
    }
  };
  if (!shortURLExisting) {
    shortURL = generateRandomString();
    urlDatabase[shortURL] = longURL;
  };
  let updatedURL = '/urls/' + shortURL;
  res.redirect(updatedURL);
});


app.get('/urls/:id', (req, res) => {
  let templateVars = {shortURL: req.params.id,
                      urlDatabase: urlDatabase};
  res.render('urls_show.ejs', templateVars);
});


app.get('/u/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  //redirect to :id
  let idSearch = '/urls/' + shortURL;
  res.redirect(longURL || idSearch);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});