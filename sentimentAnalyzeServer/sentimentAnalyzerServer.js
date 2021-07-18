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
    'url': req.query.url.trim(),
    'features': {
      'emotion': {'document':true}
      }
    };
    let nlu = getNLUInstance();

    nlu.analyze(analyzeParams).then(analysisResults => {
    let  rst = analysisResults.result.emotion;
    console.log(rst);
    return res.send(rst.document.emotion);
    }).catch(err => {
      console.log('error:', err);
    });
});

app.get("/url/sentiment", (req,res) => {

  let analyzeParams = {
   'url': req.query.url.trim(),
   'features': {
     'sentiment': {'document':true}
     }
   };
   let nlu = getNLUInstance();

   nlu.analyze(analyzeParams).then(analysisResults => {
   let  rst = analysisResults.result.sentiment;
   console.log(rst);
   return res.send(rst.document.label);

   }).catch(err => {
     console.log('error:', err);
   });
});

app.get("/text/emotion", (req,res) => {
  const analyzeParams = {
    'text': req.query.text,
    'features': {
      'emotion': {'document':true}
      }
    };
    let nlu = getNLUInstance();

    nlu.analyze(analyzeParams).then(analysisResults => {
    let  rst = analysisResults.result.emotion;
    console.log(rst);
    return res.send(rst.document.emotion);
    }).catch(err => {
      console.log('error:', err);
    });

});

app.get("/text/sentiment", (req,res) => {
   let analyzeParams = {
    'text': req.query.text,
    'features': {
      'sentiment': {'document':true}
      }
    };
    let nlu = getNLUInstance();
    //let rst = "";
    nlu.analyze(analyzeParams).then(analysisResults => {
    let  rst = analysisResults.result.sentiment;
      if(rst == "")
        {console.log("the result of sentiment analyze is empty") ;}
      else{
        console.log(rst);
        return res.send(rst.document.label);
      }
    }).catch(err => {
      console.log('error:', err);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
