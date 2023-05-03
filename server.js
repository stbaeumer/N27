// Das IBAN-Modul wird benötigt, um eine gültige IBAN zu errechnen.

var IBAN = require('iban');

// Das installierte MYSQL-Modul wird mit require() eingebunden.
// Das MySQL-Modul stellt die Verbindung zwischen der App und der
// MySQL-Datenbank her.
// Eine Datenbank wird benötigt, wenn Daten auch nach der Laufzeit des
// Programms noch weiter existieren sollen.
// Außerdem ermöglicht die Datenbank, dass z.B. Geldüberweisungen
// zwischen Anwendern möglich werden.

var mysql = require('mysql'); 

// Die Verbindung zur Datenbank wird hergestellt. Dazu werden die
// Adresse und die Anmeldedaten der Datenbank angegeben.

var dbVerbindung = mysql.createConnection({
  
    // Der host ist der Server auf dem die Datenbank installiert ist.
    // Der Host kann über seinen Namen oder die IP-Adresse adressiert werden.
    // Wenn der Host nicht reagiert, kann mit "ping 10.40.38.110" geprüft werden,
    // ob der Rechner eingeschaltet ist.
    // Wenn der Rechner auf ping antwortet, aber kein connect aufgebaut werden kann,
    // dann muss geprüft werden, ob der Datenbank-Dienst auf dem Rechner läuft. Dazu
    // melden wir uns auf dem Datenbankserver an und starten die MySQL-Workbench.

    host: "10.40.38.110",
    //host: "130.255.124.99",
    user: "placematman",
    password: "BKB123456!",
    database: "dbn27"
});

// Die dbVerbindung ruft die connect-Methode auf, um eine Verbindung mit der
// Datenbank herzustellen.

dbVerbindung.connect(function(err) {

  // Wenn die Verbindung scheitert, wird ein Fehler geworfen.
  // Wenn die Datenbank nicht innerhalb einer definierten Zeit auf
  // den connect-Versuch antwortet, kommt ein TIMEOUT-Fehler.

  if (err) throw err;
  
  // Wenn die Verbindung aufgebaut werden kann, wird der Erfolg
  // auf der Console geloggt.
  
  console.log("Connected!");
});

// Die Verbindung zur Datenbank wird geöffnet.

dbVerbindung.connect(function(fehler){

  // Die Tabelle namens kunde wird erstellt.
  // Die Spalten heißen: idKunde, vorname, nachname, ort, kennwort, mail
  // VARCHAR(45)    : legt den Datentyp der Spalte auf "Text" mit der Länge max. 45 Zeichen fest.
  // INT(11)        : begrenzt die Eingabe auf 11 Ziffern. Es sind nur Ganzzahlen möglich.
  // Float / Double : sind Gleitkommazahlen
  // Smallint       : Zahlen von 0 - 65535
  // Date / Datetime: steht für ein Datum bzw. Uhrzeit 
  // idKunde ist Primary Key. Das bedeutet, dass die idKunde den Datensatz eindeutig
  // kennzeichnet. Das wiederum bedeutet, dass kein zweiter Kunde mit derselben idKunde angelegt werden kann.

dbVerbindung.query('CREATE TABLE kunde(idKunde INT(11), vorname VARCHAR(45), nachname VARCHAR(45), ort VARCHAR(45), kennwort VARCHAR(45), mail VARCHAR(45), PRIMARY KEY(idKunde));', function (fehler) {
    
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...

        if(fehler.code == "ER_TABLE_EXISTS_ERROR"){

            //... dann wird eine Fehlermdldung geloggt. 

            console.log("Tabelle kunde existiert bereits und wird nicht angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Tabelle Kunde erfolgreich angelegt.")
         }
    })
});

dbVerbindung.connect(function(fehler){
  
  dbVerbindung.query('CREATE TABLE kredit(idKunde INT(11), datum DATETIME, zinssatz FLOAT, laufzeit INT(11), betrag SMALLINT, PRIMARY KEY(idKunde,datum));', function (fehler) {
      
      // Falls ein Problem bei der Query aufkommt, ...
      
      if (fehler) {
      
          // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...
  
          if(fehler.code == "ER_TABLE_EXISTS_ERROR"){
  
              //... dann wird eine Fehlermdldung geloggt. 
  
              console.log("Tabelle kredit existiert bereits und wird nicht angelegt.")
          
          }else{
              console.log("Fehler: " + fehler )
          }
      }else{
              console.log("Tabelle kredit erfolgreich angelegt.")
       }
    })
});

// Eine Tabelle namens Konto mit den Eigenschaften iban, idKunde, anfangssaldo, kontoart, timestamp wird neu angelegt,
// falls sie noch nicht existiert

dbVerbindung.connect(function(fehler){
  
  dbVerbindung.query('CREATE TABLE konto(iban VARCHAR(45), idKunde INT(11), anfangssaldo FLOAT, kontoart VARCHAR(45), timestamp TIMESTAMP, PRIMARY KEY(iban));', function (fehler) {
      
      // Falls ein Problem bei der Query aufkommt, ...
      
      if (fehler) {
      
          // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...
  
          if(fehler.code == "ER_TABLE_EXISTS_ERROR"){
  
              //... dann wird eine Fehlermdldung geloggt. 
  
              console.log("Tabelle kredit existiert bereits und wird nicht angelegt.")
          
          }else{
              console.log("Fehler: " + fehler )
          }
      }else{
              console.log("Tabelle kredit erfolgreich angelegt.")
       }
    })
});

// Ein Kunde soll neu in der Datenbank angelegt werden.

dbVerbindung.query('INSERT INTO kunde(idKunde, vorname, nachname, ort, kennwort, mail) VALUES (150000, "Pit", "Kiff", "BOR", "123!", "pk@web.de") ;', function (fehler) {
      
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...

        if(fehler.code == "ER_TABLE_EXISTS_ERROR"){

            //... dann wird eine Fehlermdldung geloggt. 

            console.log("Tabelle kredit existiert bereits und wird nicht angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Tabelle kredit erfolgreich angelegt.")
     }
});

class Kredit{
    constructor(){
        this.Zinssatz
        this.Laufzeit
        this.Betrag
    }

    // Eine Funktion berechnet etwas. Im Namen der Funktion steht also immer ein Verb.

    berechneGesamtkostenKreditNachEinemJahr(){
        return this.Betrag * this.Zinssatz / 100 + this.Betrag
    }
}


// Programme verarbeiten oft Objekte der realen Welt. Objekte haben 
// Eigenschaften. In unserem Bankingprogramm interessieren uns Objekte,
// wie z.B. Kunde, Konto, Filiale, Bankautomat, ...
// Alle Kunden unserer Bank haben dieselben Eigenschaften, aber
// unterschiedliche Eigenschaftswerte.

class Kunde{
    constructor(){
        this.IdKunde
        this.Nachname
        this.Vorname
        this.Kennwort
        this.Kontostand
        this.Geburtsdatum
        this.Mail
        this.Rufnummer
    }
}

// Von der Kunden-Klasse wird eine konkrete Instanz gebildet. 

let kunde = new Kunde()

// Die konkrete Instanz bekommt Eigenschaftswerte zugewiesen.



kunde.IdKunde = 150000
kunde.Nachname = "Müller"
kunde.Vorname = "Pit"
kunde.Geburtsdatum = "23.10.2000"
kunde.Mail = "mueller@web.de"
kunde.Kennwort = "123"
kunde.Rufnummer = "+49123/4567890"

class Kundenberater{
    constructor(){
        this.IdKundenberater
        this.Nachname
        this.Vorname
        this.Position
        this.Mail
        this.Rufnummer
        this.Begruessung
    }
}

// Es wird ein Kundenberater-Objekt instanziiert

let kundenberater = new Kundenberater()

// Die konkrete Instanz bekommt Eigenschaftswerte zugewiesen.

kundenberater.IdKundenberater = 1
kundenberater.Nachname = "Zimmermann"
kundenberater.Vorname = "Franz"
kundenberater.Mail = "zimmermann@n27.com"
kundenberater.Rufnummer = "+49123/4567890"
kundenberater.Begruessung = "Hallo, ich bin's, Dein Kundenberater!"
kundenberater.Position = "Master of desaster"

// Die Klasse Konto ist der Bauplan für alle konto-Objekte.
// In der Klasse werden alle relevanten Eigenschaften definiert.
// Die konto-Objekte, die aus dieser Klasse erzeugt werden, haben die selben
// Eigenschaften, aber unterschiedliche Eigenschaftswerte.

class Konto{
    constructor(){

        // Die relevanten Eigenschaften werden im Konstruktor aufgelistet.
        // Eigenschaften werden immer großgeschrieben        

        this.Kontostand
        this.IBAN
        this.Kontoart
        this.Pin
    }
}

// Instanzierung eines Objekts namens konto vom Typ Konto
// "let konto" bedeutet, dass ein Objekt namens konto exisitieren soll. Man sagt,
// das konto wird deklariert.

// "= new Konto()" nennt man die instanziierung. Bei der Instanziierung wird Festplatten-
// speicher reserviert, um bei der anschließenden Initialisierung konkrete Eigenschafts-
// werte für das Objekt zu speichern.

let konto = new Konto()

// Bei der Initialisierung werden konkrete Eigenschaftswerte in die reservierten Speicher-
// zellen geschrieben.

// Die Zuweisung von Eigenschaftswerten geschieht immer von rechts nach links.

konto.IBAN = "DE1234567890123456"
konto.Kontostand = 1000000
konto.Kontoart = "Giro"

const express = require('express')
const bodyParser = require('body-parser')
const meineApp = express()
const cookieParser = require('cookie-parser')
meineApp.set('view engine', 'ejs')
meineApp.use(express.static('public'))
meineApp.use(bodyParser.urlencoded({extended: true}))
meineApp.use(cookieParser('geheim'))

const server = meineApp.listen(process.env.PORT || 3000, () => {
    console.log('Server lauscht auf Port %s', server.address().port)    
})

// Die Methode meineApp.get('/' ...) wird abgearbeitet, sobald
// der Kunde die Indexseite (localhost:3000 bzw. n27.herokuapp.com) ansurft.

meineApp.get('/',(browserAnfrage, serverAntwort, next) => {              
    
    // Wenn ein signierter Cookie mit Namen 'istAngemeldetAls' im Browser vorhanden ist,
    // dann ist die Prüfung wahr und die Anweisungen im Rumpf der if-Kontrollstruktur 
    // werden abgearbeitet.

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        
        // Die Index-Seite wird an den Browser gegeben:

        serverAntwort.render('index.ejs',{})
    }else{

        // Wenn der Kunde noch nicht eigeloggt ist, soll
        // die Loginseite an den Browser zurückgegeben werden.
        serverAntwort.render('login.ejs', {
            Meldung: ""
        })
    }                 
})

// Die Methode meineApp.post('/login' ...) wird abgearbeitet, sobald
// der Anwender im Login-Formular auf "Einloggen" klickt.

meineApp.post('/login',(browserAnfrage, serverAntwort, next) => {              
    
    // Die im Browser eingegebene IdKunde und Kennwort werden zugewiesen
    // an die Konstanten namens idKunde und kennwort.

    const idKunde = browserAnfrage.body.IdKunde
    const kennwort = browserAnfrage.body.Kennwort
    
    console.log("ID des Kunden: " + idKunde)
    console.log("Kennwort des Kunden: " + kennwort)

    // Die Identität des Kunden wird überprüft.
    
    if(idKunde == kunde.IdKunde && kennwort == kunde.Kennwort){
    
        // Ein Cookie namens 'istAngemeldetAls' wird beim Browser gesetzt.
        // Der Wert des Cookies ist das in eine Zeichenkette umgewandelte Kunden-Objekt.
        // Der Cookie wird signiert, also gegen Manpulationen geschützt.

        serverAntwort.cookie('istAngemeldetAls',JSON.stringify(kunde),{signed:true})
        console.log("Der Cookie wurde erfolgreich gesetzt.")
        
        // Nachdem der Kunde erfolgreich eingeloggt ist, werden seine Konten aus der Datenbank eingelesen
        
        console.log("Jetzt werden die Konten eingelesen")

        // Wenn die Id des Kunden mit der Eingabe im Browser übereinstimmt
        // UND ("&&") das Kennwort ebenfalls übereinstimmt,
        // dann gibt der Server die gerenderte Index-Seite zurück.
        
        serverAntwort.render('index.ejs', {})
    }else{

        // Wenn entweder die eingegebene Id oder das Kennwort oder beides
        // nicht übereinstimmt, wird der Login verweigert. Es wird dann die
        // gerenderte Login-Seite an den Browser zurückgegeben.

        serverAntwort.render('login.ejs', {
            Meldung : "Ihre Zugangsdaten scheinen nicht zu stimmen."
        })
    }
})


// Wenn die login-Seite im Browser aufgerufen wird, ...

meineApp.get('/login',(browserAnfrage, serverAntwort, next) => {              

    // ... dann wird die login.ejs vom Server gerendert an den
    // Browser zurückgegeben:

    // Der Cookie wird gelöscht.

    serverAntwort.clearCookie('istAngemeldetAls')

    serverAntwort.render('login.ejs', {
        Meldung: "Bitte geben Sie die Zugangsdaten ein."
    })          
})

// Wenn die about-Seite angesurft wird, wird die Funktion
// meineApp.get('/about'... abgearbeitet.

meineApp.get('/about',(browserAnfrage, serverAntwort, next) => {              

    // Wenn der Anmelde-Cookie gesetzt ist, wird der Nutzer zur
    // About-Seite gelenkt.

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        
        // Die About-Seite wird an den Browser gegeben:

        serverAntwort.render('about.ejs',{})
    }else{

        // Wenn der Kunde noch nicht eigeloggt ist, soll
        // die Loginseite an den Browser zurückgegeben werden.
        serverAntwort.render('login.ejs', {
            Meldung: ""
        })
    }         
})

meineApp.get('/profile',(browserAnfrage, serverAntwort, next) => {              

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        
        serverAntwort.render('profile.ejs', {
            Vorname: kunde.Vorname,
            Nachname: kunde.Nachname,
            Mail: kunde.Mail,
            Rufnummer: kunde.Rufnummer,
            Kennwort: kunde.Kennwort,
            Erfolgsmeldung: ""
        })
    }else{
        serverAntwort.render('login.ejs',{
            Meldung: ""
        })
    }          
})

meineApp.get('/support',(browserAnfrage, serverAntwort, next) => {              

    if(browserAnfrage.signedCookies['istAngemeldetAls']){        
        serverAntwort.render('support.ejs', {
            Vorname: kundenberater.Vorname,
            Nachname: kundenberater.Nachname,
            Mail: kundenberater.Mail,
            Rufnummer: kundenberater.Rufnummer,
            Begruessung: kundenberater.Begruessung,
            Position: kundenberater.Position
        })
    }else{
        serverAntwort.render('login.ejs',{
            Meldung: ""
        })
    }              
})

meineApp.get('/kreditBerechnen',(browserAnfrage, serverAntwort, next) => {              

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        serverAntwort.render('kreditBerechnen.ejs', {
            Betrag: "",
            Laufzeit: "",
            Zinssatz:"",
            Erfolgsmeldung:""
        })
    }else{
        serverAntwort.render('login.ejs',{
            Meldung: ""
        })
    }              
})

// Die Funktion meineApp.get('/kontoAnlegen'...  wird abgearbeitet, sobald die Seite
// kontoanlegen im Browser aufgerufen wird.

meineApp.get('/kontoAnlegen',(browserAnfrage, serverAntwort, next) => {              

    // Es wird geprüft, ob der User angemeldet ist, also ob der Cookie gesetzt ist

    if(browserAnfrage.signedCookies['istAngemeldetAls']){

        // Wenn der User angemeldet ist, wird die kontoAnlegen-Seite gerendert...

        serverAntwort.render('kontoAnlegen.ejs', {
            Erfolgsmeldung: ""
        })
    }else{

        // Wenn der User nicht angemeldet ist, wird er zur Login-Seite zurückgeworfen

        serverAntwort.render('login.ejs',{
            Meldung: ""
        })
    }              
})


// Sobald der Speichern-Button auf der Profile-Seite gedrückt wird,
// wird die meineApp.post('profile'...) abgearbeitet.

meineApp.post('/profile',(browserAnfrage, serverAntwort, next) => {              

    // Die Erfolgsmeldung für das Speichern der geänderten
    // Profildaten wird in eine lokale Variable namens 
    // erfolgsmeldung gespeichert.

    let erfolgsmeldung = ""

    // Der Wert der Eigenschaft von Mail im Browser wird
    // zugewiesen (=) an die Eigenschaft Mail des Objekts kunde

    if(kunde.Mail != browserAnfrage.body.Mail){

        // Wenn der Wert der Eigenschaft von kunde.Mail abweicht
        // vom Wert der Eigenschaft Mail aus dem Browser-Formular,
        // dann wird die Erfolgsmeldung initialisiert:

        erfolgsmeldung = erfolgsmeldung + "Änderung der Mail erfolgreich. "
        kunde.Mail = browserAnfrage.body.Mail
        console.log(erfolgsmeldung)
    }

    if(kunde.Kennwort != browserAnfrage.body.Kennwort){

        // Wenn der Wert der Eigenschaft von kunde.Kennwort abweicht
        // vom Wert der Eigenschaft Kennwort aus dem Browser-Formular,
        // dann wird die Erfolgsmeldung initialisiert:

        erfolgsmeldung = erfolgsmeldung + "Änderung des Kennworts erfolgreich. "
        kunde.Kennwort = browserAnfrage.body.Kennwort
        console.log(erfolgsmeldung)
    }

    if(kunde.Rufnummer != browserAnfrage.body.Rufnummer){

        // Wenn der Wert der Eigenschaft von kunde.Rufnummer abweicht
        // vom Wert der Eigenschaft Rufnummer aus dem Browser-Formular,
        // dann wird die Erfolgsmeldung initialisiert:

        erfolgsmeldung = erfolgsmeldung + "Änderung der Rufnummer erfolgreich. "
        kunde.Rufnummer = browserAnfrage.body.Rufnummer
        console.log(erfolgsmeldung)
    }
    
    console.log("Profil gespeichert.")
    
    serverAntwort.render('profile.ejs', {
        Vorname: kunde.Vorname,
        Nachname: kunde.Nachname,
        Mail: kunde.Mail,
        Rufnummer: kunde.Rufnummer,
        Kennwort: kunde.Kennwort,
        Erfolgsmeldung: erfolgsmeldung
    })
})

// Sobald der Button "Kontostand anzeigen" auf der index-Seite gedrückt wird, 
// wird die meineApp.get('/kontostandAnzeigen'-Funktion abgearbeitet.

meineApp.get('/kontostandAnzeigen',(browserAnfrage, serverAntwort, next) => {              
    
    // Wenn ein signierter Cookie mit Namen 'istAngemeldetAls' im Browser vorhanden ist,
    // dann ist die Prüfung WAHR und die Anweisungen im Rumpf der if-Kontrollstruktur 
    // werden abgearbeitet.

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        
        // In MySQL werden Abfragen gegen die Datenbank wie folgt formuliert:
        // Der Abfragebefehl beginnt mit SELECT.
        // Anschließend wird die interessierende Spalte angegeben. 
        // Mehrere interessierende Spalten werden mit Komma getrennt angegeben.
        // Wenn alle Spalten ausgewählt werden sollen, kann vereinfachend * angegeben werden.
        //   Beispiele: 'SELECT iban, anfangssaldo FROM ...' oder 'SELECT * FROM ...'
        // Mit FROM wird die Tabelle angegeben, aus der der Result eingelesen werden soll.
        // Mit WHERE wird der Result zeilenweise aus der Tabelle gefiltert

        dbVerbindung.query('SELECT * FROM konto WHERE idKunde = 150000;', function (fehler, result) {      
            console.log(result)

            // Die Index-Seite wird an den Browser gegeben (man sagt auch gerendert):

            serverAntwort.render('kontostandAnzeigen.ejs',{
                MeineIbans: result,
                Kontostand: konto.Kontostand,
                IBAN: konto.IBAN,
                Kontoart: konto.Kontoart,
                Erfolgsmeldung: ""
            })
        })
    }else{

        // Wenn der Kunde noch nicht eigeloggt ist, soll
        // die Loginseite an den Browser zurückgegeben werden.

        serverAntwort.render('login.ejs', {
            Meldung: ""
        })
    }                 
})


// Die Funktion meineApp.post('/kontoAnlegen'... wird abgearbeitet, sobald der Button 
// auf der kontoAnlegen-Seite gedrückt wird und das Formular abgesendet ('gepostet') wird.

meineApp.post('/kontoAnlegen',(browserAnfrage, serverAntwort, next) => {              
    
    let erfolgsmeldung = ""

    // Die im Formular eingegebene Kontoart wird an die Konstante namens kontoArt zugewiesen

    const kontoArt = browserAnfrage.body.kontoArt
    
    console.log("Gewählte Kontart: " + kontoArt)
    
    // Die IBAN wird automtisch erzeugt. Die IBAN kennzeichnet das anzulegende Konto einmalig (Primary Key).

    // Ein String mit dem Wert "DE" wird zugewiesen an eine Variable namens laenderkennng

    let laenderkennung = "DE"
    
    // Die Zahl 27000000 wird zugewiesen an eine Variable namens bankleitzahl
    
    let bankleitzahl = 27000000

    // Die Zahl 1111111111 wird zugewiesen an eine Variable namens min

    let min = 1111111111;

    // Die Zahl 999999999 wird an eine Variable namens max zugwiesen

    let max = 9999999999;

    // Eine Zufallszahl zwischen min und max wird von der Math-Bibliothek mit der Methode random()
    // erzeugt und an die Variable zufaelligeKontonummer zugewiesen.

    let zufaelligeKontonummer = Math.floor(Math.random() * (max - min + 1)) + min;
    
    console.log("Die zufällig generierte Kontonummer lautet " + zufaelligeKontonummer)

    // Die IBAN wird mit einer Node-Bibliothek namens IBAN errechnet. Die Parameter der Funktion zur Berechnung der
    // Iban sind: Länderkennung, bankleitzahl und Kontonummer.

    let iban = IBAN.fromBBAN(laenderkennung, bankleitzahl + " " + zufaelligeKontonummer)

    console.log("IBAN: " + iban)

    // Wenn die Iban korrekt ist, dann wird in der Console ausgegeben: "Iban gültig."

    if(IBAN.isValid(iban)){
        console.log("Die IBAN ist gültig.")
    }else{
        console.log("Die IBAN ist ungültig.")
    }

    // Für die generierte IBAN muss ein neuer Datensatz in der Tabelle konto angelegt werden.

    dbVerbindung.query('INSERT INTO konto(iban, idKunde, anfangssaldo, kontoart, timestamp) VALUES ("' + iban + '", 150000, 1, "' + kontoArt + '", NOW()) ;', function (fehler) {
      
        // Falls ein Problem bei der Query aufkommt, ...
        
        if (fehler) {
        
            erfolgsmeldung = "Fehler: " + fehler
            
        }else{
            erfolgsmeldung = "Das " + kontoArt + " mit der IBAN " + iban + " wurde erfolgreich angelegt."
        }
    
    })
    
        // Nach dem Erstellen des Kontos wird die Serverantwort gerendet an den Browser zurückgegeben,.

        serverAntwort.render('kontoAnlegen.ejs', {

            // Damit die Meldung auf der ejs-Seite angezeigt wird, muss es auf der ejs-Seite eine Variable
            // namens <%= Erfolgsmeldung %> geben.

            Erfolgsmeldung: erfolgsmeldung
        })
    
})

meineApp.get('/ueberweisungTaetigen',(browserAnfrage, serverAntwort, next) => {              
    
    // Wenn ein signierter Cookie mit Namen 'istAngemeldetAls' im Browser vorhanden ist,
    // dann ist die Prüfung WAHR und die Anweisungen im Rumpf der if-Kontrollstruktur 
    // werden abgearbeitet.

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        
        // Ein Objekt vom Typ Kunde wird deklariert und instanziiert.

        let kunde = new Kunde()

        // Das Objekt Kunde wird mit der Funktion JSON.parse() aus dem Cookie gewonnen.

        kunde = JSON.parse(browserAnfrage.signedCookies['istAngemeldetAls'])
        
        // Anschließend kann das Kundenobjekt mit seinen Eigenschaftswerten aus-
        // gelesen werden.
        
        console.log(kunde.IdKunde)

        // In MySQL werden Abfragen gegen die Datenbank wie folgt formuliert:
        // Der Abfragebefehl beginnt mit SELECT.
        // Anschließend wird die interessierende Spalte angegeben. 
        // Mehrere interessierende Spalten werden mit Komma getrennt angegeben.
        // Wenn alle Spalten ausgewählt werden sollen, kann vereinfachend * angegeben werden.
        //   Beispiele: 'SELECT iban, anfangssaldo FROM ...' oder 'SELECT * FROM ...'
        // Mit FROM wird die Tabelle angegeben, aus der der Result eingelesen werden soll.
        // Mit WHERE wird der Result zeilenweise aus der Tabelle gefiltert

        dbVerbindung.query('SELECT * FROM konto WHERE idKunde = ' + kunde.IdKunde + ';', function (fehler, result) {      
            console.log(result)

            // Die Index-Seite wird an den Browser gegeben (man sagt auch gerendert):

            serverAntwort.render('ueberweisungTaetigen.ejs',{
                MeineIbans: result,
                Kontostand: konto.Kontostand,
                IBAN: konto.IBAN,
                Kontoart: konto.Kontoart,
                Erfolgsmeldung: ""
            })
        })
    }else{

        // Wenn der Kunde noch nicht eigeloggt ist, soll
        // die Loginseite an den Browser zurückgegeben werden.

        serverAntwort.render('login.ejs', {
            Meldung: ""
        })
    }                 
})

// Wenn der Button namens Überweisung tätigen gedrückt wird, wird die Funktion abgearbeitet.

meineApp.post('/ueberweisungTaetigen',(browserAnfrage, serverAntwort, next) => {              

    const absenderIban = browserAnfrage.body.AbsenderIban
    console.log("IBAN des Absenders: " + absenderIban)

    dbVerbindung.query('SELECT * FROM konto WHERE iban = "' + absenderIban + '";', function (fehler, result) {      
        console.log(result)

        // Der Result besteht möglicherweise aus vielen Datensätzen.
        // Um den Result auf den ersten Datensatz zu begrenzen, wird [0] hinter
        // dem Result angegeben. Zuletzt wird die Eigenschaft anfangssaldo mit Punkt
        // angehängt. Der zweite Datensatz würde mit result[1].anfangssaldo ausgelesen.

        console.log("Anfangssaldo:" + result[0].anfangssaldo)

        // Der String (=Zeichenkette) wird zugewiesen (=) an eine Variable namens erfolgsmeldung 
        let erfolgsmeldung = "Die Überweisung wurde ausgeführt."

        // Die Werte aus dem Formular werden eingelesen
        
        const betrag = browserAnfrage.body.Betrag
        console.log("Überweisungsbetrag: " + betrag)
        const verwendungszweck = browserAnfrage.body.Verwendungszweck
        console.log("Verwendungszweck: " + verwendungszweck)
        const empfaengerIban = browserAnfrage.body.EmpfaengerIban
        console.log("IBAN des Empfängers: " + empfaengerIban)
    
        // Empfänger-IBAN auf Gültigkeit prüfen: Die Funktion isValid() wird auf das 
        // IBAN-Modul aufgerufen. Als Parameter in den runden Klammern wird die
        // Empfänger-IBAN übergeben. Die Funktion isValid() gibt entweder den Wert
        // true oder false zurück.

        if(IBAN.isValid(empfaengerIban)){
            erfolgsmeldung = "Die Empfänger-IBAN ist gültig."
        }else{
            erfolgsmeldung = "Die Empfänger-IBAN ist ungültig."
        }    

        // Prüfung, ob der Kontostand des Absenders ausreicht:
        // Der gewünschte Überweisungsbetrag wird mit dem ausgelesenen Kontostand
        // verglichen. Wenn der Betrag kleiner oder gleich dem Kontostand ist,
        // dann ist das Konto des Absenders gedeckt.

        if(betrag <= result[0].anfangssaldo){
            // Der Wert der Variablen erfolgsmeldung wird ergänzt um die weitere Meldung
            erfolgsmeldung = erfolgsmeldung + " Das Konto des Absenders ist gedeckt."
        }else{
            erfolgsmeldung = erfolgsmeldung + " Das Konto des Absenders ist nicht gedeckt."
        }

        // Überweisung in die Datenbank schreiben

        

        serverAntwort.render('ueberweisungTaetigen.ejs', {        
            Erfolgsmeldung: erfolgsmeldung,
            MeineIbans: "",
            AbsenderIban: absenderIban,
            Betrag: betrag,
            Verwendungszweck: verwendungszweck,
            empfaengerIban: empfaengerIban
    
        })
    })
})


//require('./Uebungen/ifUndElse.js')
//require('./Uebungen/klasseUndObjekt.js')
//require('./Klausuren/20221026_klausur.js')
//require('./Klausuren/20230111_klausur.js')