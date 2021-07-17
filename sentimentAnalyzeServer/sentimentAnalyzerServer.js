const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;

  const nluV1= require('ibm-watson/natural-language-understanding/v1');
  const {IamAuthenticator} = require('ibm-watson/auth');

  const nlu = new nluV1({
    version:'2021-07-16',
    authenticator:new IamAuthenticator({
      apikey:api_key,
    }),
    serviceUrl:api_url,
  });
  return nlu;
}


const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());


app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

  const analyzeParams = {
    'url': req.query.url,
    'features': {
      'entities': {
        'emotion': true,
        'sentiment': false,
        'limit': 10,
        },
      'keywords': {
        'emotion': true,
        'sentiment': false,
        'limit': 10,
        },
      },
    };
    let nlu = getNLUInstance();
    let rst = "";
    nlu.analyze(analyzeParams).then(analysisResults => {
      rst = JSON.stringify(analysisResults);
    }).catch(err => {
      console.log('error:', err);
    });
    return res.send("url emotion result for '"+ req.query.url + "' is: " + rst);
});

app.get("/url/sentiment", (req,res) => {

  const analyzeParams = {
    'url': req.query.url,
    'features': {
    'sentiment': {
      'targets': [
        'happy'
      ]
    }
  }
    };
    let nlu = getNLUInstance();
    let rst = "";
    nlu.analyze(analyzeParams).then(analysisResults => {
      rst = JSON.stringify(analysisResults);
    }).catch(err => {
      console.log('error:', err);
    });
    return res.send("url sentiment result for "+ req.query.url + " is: " + rst);
});

app.get("/text/emotion", (req,res) => {
  const analyzeParams = {
    'text': req.query.text,
    'features': {
      'entities': {
        'emotion': true,
        'sentiment': false,
        'limit': 10,
        },
      'keywords': {
        'emotion': true,
        'sentiment': false,
        'limit': 10,
        },
      },
    };
    let nlu = getNLUInstance();
    let rst = "";
    nlu.analyze(analyzeParams).then(analysisResults => {
      rst = JSON.stringify(analysisResults);
    }).catch(err => {
      console.log('error:', err);
    });
    return res.send("text emotion result for '"+ req.query.text + "' is: " + rst);
});

app.get("/text/sentiment", (req,res) => {
   let analyzeParams = {
    'text': req.query.text,
    'features': {
      'sentiment': {'targets': [req.query.text],'document':true}
      }
    };
    let nlu = getNLUInstance();
    let rst = "";
    nlu.analyze(analyzeParams).then(analysisResults => {
      rst = analysisResults.sentiment;
      if(rst == "")
        {console.log("the result is empty") ;}
      else
        console.log( rst );
    }).catch(err => {
      console.log('error:', err);
    });
    return res.send("text sentiment result for '"+ req.query.text + "' is: " + rst);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
