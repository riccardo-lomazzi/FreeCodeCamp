
var express = require('express');
var app = express();


// --> 7)  Mount the Logger middleware here
/*Qui il middleware parte a livello root, prima degli altri usi (cioè gli assets statici) nel passaggio 4). 
Viene loggato il tipo di richiesta (GET; POST; DELETE, ecc), il path dove è effettuata (scritto come URL) e l'IP del richiedente
next(); è obbligatoria, altrimenti app.use va in loop*/
app.use('/', function(req, res, next){  
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// --> 11)  Mount the body-parser middleware  here
var bodyParser = require('body-parser');
app.use('/name',bodyParser.urlencoded({extended: false}));

/** 1) Meet the node console. */
console.log("Hello World");

/** 2) A first working Express Server */
//app.get('/', function(req,res) {res.send('Hello Express');});  
/*ogni volta che accedo al sito (all'app) faccio una richiesta GET via http. Accedendo alla homepage, accedo alla root (/). 
Il modulo Express permette al server, in ascolto sulla porta 3000, con app.get(PATH, HANDLER) di ricevere le richieste GET sulla root PATH, e di gestire la richiesta con un HANDLER, 
in questo caso una funzione che restituisce una stringa "Hello Express". */

/** 3) Serve an HTML file */
var absolutePathHTML = __dirname + "/views/index.html";
app.get('/', function(req,res) {res.sendFile(absolutePathHTML);});
//questa volta viene fornito un file HTML, contenente dei form. Il path del file è stabilito da __dirname, che indica il nome della cartella in cui si trova questo file Javascript, più il path che porta alla cartella views
//è ancora da chiarire dove si trovino attualmente questi file, se vengono presi da git direttamente o stanno su un server. 

/** 4) Serve static assets  */
/*- qui vengono serviti i contenuti esterni STATICI alla pagina HTML, cioè CSS, immagini, ecc. Si trovano in /public. 
- per usarli, si usa app.use(PATH, MIDDLEWAREHANDLER) e non app.get. 
- PATH indica il percorso alla risorsa, MIDDLEWAREHANDLER è l'oggetto di ritorno della funzione Middleware express.static(staticPATH) per caricare contenuti esterni alla pagina attuale restituita col get. 
- Qui PATH non è indicato, è indicata solo la funzione di Middleware che in questo caso non prende argomenti come REQ o RES. Così facendo, la funzione è eseguita per ogni richiesta.
*/
var absolutePathStaticAssets = __dirname + "/public"; 
app.use(express.static(absolutePathStaticAssets));

/** 5) serve JSON on a specific route */


//all'URL che termina con /json, fornisce tramite il metodo res.json JSONOBJ) un oggetto JSON cioè JSONOBJ, il cui testo è {"message": messaggio} con messaggio = "Hello json"

/** 6) Use the .env file to configure the app */

//qui si tratta solo di cambiare il messaggio JSON a seconda che il file .env, che immagazzina le variabili di ambiente, abbia al suo interno una variabile MESSAGE_STYLE che ha valore "uppercase" 
app.get('/json', (req,res) => 
        {
            let responseJSON = "Hello json";
            if (process.env.MESSAGE_STYLE == "uppercase")
            {
              responseJSON = responseJSON.toUpperCase();
            }
            res.json( {"message": responseJSON });
        }
);  
 
/** 7) Root-level Middleware - A logger */
//  vedi sopra


/** 8) Chaining middleware. A Time server */
//possiamo incatenare un middleware ad ogni richiesta dell'app via express. In particolare qui viene unito il tempo della richiesta req.time alla data corrente
app.get('/now', function(req, res, next){
  req.time += new Date().toString();
  next(); //sempre obbligatorio, altrimenti non procede all'handler
}, function(req,res){  //questo è l'handler che si occupa della richiesta, restituisce il tempo req.time formato JSON
  res.json({"time": req.time});
});

/** 9)  Get input from client - Route parameters */
app.get('/:word/echo', (req,res) => {res.json({"echo" : req.params.word});});
/*con questa gestione di Get, all'indirizzo segnato da /word/echo, con word variabile di tipo stringa (: serve ad indicare una variabile nell'URL), viene restutito un JSON contenente word (memorizzata in req.params.word, d
ove req.params contiene tutti i parametri della richiesta GET catturata) nel campo "echo" (indipendente da quello che è scritto nel link)*/

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>
//app.get('/name', (req,res) => {res.json({"name": req.query.first + " " + req.query.last});});  //<---- SINGOLO ESERCIZIO

//in questa riga di codice si sta sperimentando con le query. Queste sono memorizzate nell'URL, e per prenderne il valore si accede a req.query.nomevariabile (in questo caso first e last)

//questa riga qui sotto serve a specificare che handler assegnare ad ogni metodo GET, POST ecc associato al route specificato '/name', e sostituisce quella sopra poiché nel punto 11 serve gestire anche la POST
app.route('/name').get((req, res) => {res.json({"name" : req.query.first + " " + req.query.last});}).post((req, res) => {res.json({"name" : req.body.first + " " + req.body.last});});  


/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */



// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
