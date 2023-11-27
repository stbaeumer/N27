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

dbVerbindung.query('CREATE TABLE kunde(idKunde INT(11), vorname VARCHAR(45), nachname VARCHAR(45), ort VARCHAR(45), kennwort VARCHAR(45), mail VARCHAR(45), idKundenberater INT(11), PRIMARY KEY(idKunde));', function (fehler) {
    
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
  
              console.log("Tabelle konto existiert bereits und wird nicht angelegt.")

          }else{
              console.log("Fehler: " + fehler )
          }
      }else{
              console.log("Tabelle konto erfolgreich angelegt.")
       }
    })
});

// Datenbanken können verhindern, dass z.B. ein Konto gelöscht wird, zu dem es noch
// Kontobewegungen gibt. Das ist ein Sicherheitsmechanismus. In der CREATE TABLE ...
// muss am Ende ergänzt werden: FOREIGN KEY (absenderIban) REFERENCES konto(iban)
// Das bedeutet, dass zu der absenderIban in der Kontobewegung-Tabelle eine Iban
// in der Kontotabelle existiert. Bevor ein Konto gelöscht werden kann, müssen alle
// Kontobewegungen gelöscht werden. Man sagt dazu, dass eine LÖSCHANOMALIE verhindert
// wird. Ebenso kann keine Kontobewegung angelegt werden zu einem Konto, dass es nicht
// gibt. Das würde man EINFÜGEANOMALIE nennen.

dbVerbindung.query('CREATE TABLE kontobewegung(timestamp TIMESTAMP, betrag SMALLINT, empfaengerIban VARCHAR(45), verwendungszweck VARCHAR(45), absenderIban VARCHAR(45), name VARCHAR(45), PRIMARY KEY(empfaengerIban,timestamp), FOREIGN KEY (absenderIban) REFERENCES konto(iban));', function (fehler) {
      
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...

        if(fehler.code == "ER_TABLE_EXISTS_ERROR"){

            //... dann wird eine Fehlermdldung geloggt. 

            console.log("Tabelle kontobewegung existiert bereits und wird nicht angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Tabelle kontobewegung erfolgreich angelegt.")
    }
})

// Ein Kunde soll neu in der Datenbank angelegt werden.

dbVerbindung.query('INSERT INTO kunde(idKunde, vorname, nachname, ort, kennwort, mail, idKundenberater) VALUES (150000, "Pit", "Kiff", "BOR", "123", "pk@web.de", 145) ;', function (fehler) {
      
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_DUP_ENTRY" lautet, ...

        if(fehler.code == "ER_DUP_ENTRY"){

            //... dann wird eine Fehlermdldung geloggt. 

            console.log("Der Kunde 150000 existiert bereits und wird nicht angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Kunde 150000 erfolgreich angelegt.")
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

// Die Tabelle Bank wird angelegt, damit die Daten der Bank nicht hart in die server.js eincodiert werden müssen.

dbVerbindung.query('CREATE TABLE bank(name VARCHAR(45), strasse VARCHAR(45), postleitzahl INT(11), ort VARCHAR(45), telefonnummer VARCHAR(45), bankleitzahl INT(8), ceo VARCHAR(45), PRIMARY KEY(bankleitzahl));', function (fehler) {
      
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...

        if(fehler.code == "ER_TABLE_EXISTS_ERROR"){

            //... dann wird eine Fehlermedldung geloggt. 

            console.log("Tabelle bank existiert bereits und wird nicht angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Tabelle bank erfolgreich angelegt.")
    }
})

// Die Bankdaten werden eingefügt. 

dbVerbindung.query('INSERT INTO bank(name, strasse, postleitzahl, ort, telefonnummer, bankleitzahl, ceo) VALUES ("N27-Bank", "Josefstraße", 46325, "Borken", "02861 90990-0", 27000000, "Kurt Cobain") ;', function (fehler) {
      
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_DUP_ENTRY" lautet, ...

        if(fehler.code == "ER_DUP_ENTRY"){

            //... dann wird eine Fehlermedldung geloggt. 

            console.log("Die Bank ist bereits in der Tabelle bank angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Tabelle bank erfolgreich angelegt.")
    }
});




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

// Eine Tabelle namens kundenberater wird angelegt. 

dbVerbindung.query('CREATE TABLE kundenberater(idKundenberater INT(11), vorname VARCHAR(45), nachname VARCHAR(45), position VARCHAR(45), mail VARCHAR(45), rufnummer VARCHAR(45), begruessung VARCHAR(45), PRIMARY KEY(idKundenberater));', function (fehler) {
      
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...

        if(fehler.code == "ER_TABLE_EXISTS_ERROR"){

            //... dann wird eine Fehlermedldung geloggt. 

            console.log("Tabelle kundenberater existiert bereits und wird nicht angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Tabelle kundenberater erfolgreich angelegt.")
    }
})

// Ein Kundenberaterobjekt wird in die Tabelle kundenberater eingefügt.

dbVerbindung.query('INSERT INTO kundenberater(idKundenberater, vorname, nachname, position, mail, rufnummer, begruessung) VALUES (145, "Max", "Müller", "Master of Desaster", "max.mueller@n27.com", "02861 90990-0", "Hallo ich bin es, Ihr Kundenberater!") ;', function (fehler) {
      
    // Falls ein Problem bei der Query aufkommt, ...
    
    if (fehler) {
    
        // ... und der Fehlercode "ER_TABLE_EXISTS_ERROR" lautet, ...

        if(fehler.code == "ER_DUP_ENTRY"){

            //... dann wird eine Fehlermdldung geloggt. 

            console.log("Der Kundenberater max.mueller@n27.com existiert bereits und wird nicht angelegt.")
        
        }else{
            console.log("Fehler: " + fehler )
        }
    }else{
            console.log("Kundenberater max.mueller@n27.com erfolgreich angelegt.")
    }
});



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
const cookieParser = require('cookie-parser');
const { DECIMAL } = require('mysql/lib/protocol/constants/types');
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
    
    // IdKunde und Kennwort werden auf der Konsole geloggt.

    console.log("Ein Kunde versucht sich anzumelden.")
    console.log("ID des Kunden: " + idKunde)
    console.log("Kennwort des Kunden: " + kennwort)

    // Die Identität des Kunden wird überprüft.
    // Dazu wird die Tabelle Kunde auf einen Kunden mit IdKunde und Kennwort abgefragt.
    
    dbVerbindung.query('SELECT * FROM kunde WHERE idKunde = ' + idKunde + ' AND kennwort ="' + kennwort + '";', function (fehler, result) {      
        
        // Der oder die zurückgegebenen Datensätze stecken im result und werden auf der Konsole geloggt.

        console.log(result)

        // Wenn im result exakt ein Datensatz zurückgegeben wird, bedeutet dass, das 
        // es einen Kunden mit dieser idKunde und dem Kennwort in der Datenbank gibt.
        // Es kann in der Datenbank höchstes ein Datensatz mit einer bestimmten Kombination aus
        // idKunde und Kennwort geben, weil idKunde in der Tabelle kunde Primary Key ist.
        
        if(result.length === 1){

            console.log("Die Anmeldedaten des Kunden sind korrekt.")

            // Wenn der Kunde berechtigt ist, wird aus dem result ein Kundenobjekt erzeugt.
            // "let kunde" bedeutet, dass ein Kundenobjekt deklariert wird. Der Name ist 
            // kunde.    
            // "new Kunde()" bedeutet, dass das Objekt instanziiert wird. Das wiederum heißt, dass
            // Speiherzellen im Arbeitsspeicher reserviert werden. 
            
            let kunde = new Kunde()

            // Die konkrete Instanz bekommt Eigenschaftswerte zugewiesen. Das nennt man
            // Initialisierung.

            // mit "[0]" wird der erste Datensatz aus dem result isoliert. [1] wäre der zweite Datensatz usw.
            // Dahinter wird der Nae der Eigenschaft angegeben.
            // Die Werte aus dem result werden unserem Kundenobjekt zugewiesen.

            kunde.IdKunde = result[0].idKunde
            kunde.Nachname = result[0].nachname
            kunde.Vorname = result[0].vorname
            kunde.Mail = result[0].mail
            kunde.Kennwort = result[0].kennwort
            kunde.Ort = result[0].ort

            console.log(kunde)

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
        
        // ToDo: Unsere Bank aus der Datenbank auslesen 

        dbVerbindung.query('SELECT * FROM bank WHERE bankleitzahl = 27000000;', function (fehler, result) {      
            
            console.log(result)

            // Ein neues Bankobjekt wird instanziiert

            class Bank{
                constructor(){
                    this.Name
                    this.Strasse
                    this.Postleitzahl
                    this.Ort
                    this.Telefonnummer
                    this.Bankleitzahl
                    this.CEO
                }
            }
            
            let bank = new Bank();

            if(result.length === 0){

                // Wenn es keinen Kundenberater in der Datenbank gibt, werden die Werte wie folgt gesetzt:

                bank.Name = "N.N."
                bank.Strasse = "N.N."
                bank.Postleitzahl = ""
                bank.Ort = ""
                bank.Telefonnummer = ""
                bank.Bankleitzahl = ""
                bank.CEO = ""

            }else{

                // Wenn der result nicht leer ist, wird das erste Objekt mit seinen Eigenschaften aus dem result zugewiesen.

                bank.Name = result[0].name
                bank.Strasse = result[0].strasse
                bank.Postleitzahl = result[0].postleitzahl
                bank.Ort = result[0].ort
                bank.Telefonnummer = result[0].telefonnummer
                bank.Bankleitzahl = result[0].bankleitzahl
                bank.CEO = result[0].ceo
            }

            // Die Support-Seite wird an den Browser gegeben (man sagt auch gerendert):

            serverAntwort.render('about.ejs', {
                Name: bank.Name,
                Strasse: bank.Strasse,
                Postleitzahl: bank.Postleitzahl,
                Ort: bank.Ort,
                Telefonnummer: bank.Telefonnummer,
                Bankleitzahl: bank.Bankleitzahl,
                CEO: bank.CEO
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

meineApp.get('/profile',(browserAnfrage, serverAntwort, next) => {              

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        
        // Die Eigenschaftswerte des Kunden stecken im Cookie und werden zu einem Kundenobjekt
        
        const kunde = JSON.parse(browserAnfrage.signedCookies.istAngemeldetAls)

        serverAntwort.render('profile.ejs', {
            Vorname: kunde.Vorname,
            Nachname: kunde.Nachname,
            Mail: kunde.Mail,
            Ort: kunde.Ort,
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
        
        // Der Kundenberater des Kunden wird aus der Datenbank ausgelesen

        dbVerbindung.query('SELECT * FROM kundenberater WHERE idKundenberater = 145;', function (fehler, result) {      
            
            console.log(result)

            // Ein neues Kundenberaterobjekt wird instanziiert

            let kundenberater = new Kundenberater();

            if(result.length === 0){

                // Wenn es keinen Kundenberater in der Datenbank gibt, werden die Werte wie folgt gesetzt:

                kundenberater.Vorname = "N.N."
                kundenberater.Nachname = "N.N."
                kundenberater.Mail = ""
                kundenberater.Rufnummer = ""
                kundenberater.Begruessung = ""
                kundenberater.Position = ""
            }else{

                // Wenn der result nicht leer ist, wird das erste Objekt mit seinen Eigenschaften aus dem result zugewiesen.

                kundenberater.Vorname = result[0].vorname
                kundenberater.Nachname = result[0].nachname
                kundenberater.Mail = result[0].mail
                kundenberater.Rufnummer = result[0].rufnummer
                kundenberater.Begruessung = result[0].begruessung
                kundenberater.Position = result[0].position
            }

            // Die Support-Seite wird an den Browser gegeben (man sagt auch gerendert):

            serverAntwort.render('support.ejs', {
                Vorname: kundenberater.Vorname,
                Nachname: kundenberater.Nachname,
                Mail: kundenberater.Mail,
                Rufnummer: kundenberater.Rufnummer,
                Begruessung: kundenberater.Begruessung,
                Position: kundenberater.Position
            })
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

// Die Funktion meineApp.post('/kreditBe... wird ausgeführt, wenn  der Button gedrückt wird.

meineApp.post('/kreditBerechnen',(browserAnfrage, serverAntwort, next) => {              

    // Der Wert der Variablen namens Betrag aus dem Formular in der EJS-Datei
    // wird einer Variablen namens betrag zugewiesen.
    let betrag = browserAnfrage.body.Betrag
    
    // Der Wert der Variablen namens Betrag wird zu einem String verkettet
    // und im Terminal ausgegeben.
    console.log("Betrag: " + betrag)

    let laufzeit = browserAnfrage.body.Laufzeit
    console.log("Laufzeit: " + laufzeit)

    let zinssatz = browserAnfrage.body.Zinssatz
    console.log("Zinssatz: " + zinssatz)

    // Annahme: Jedes Jahr werden die angefallenen Zinsen überwiesen:

    let kreditkosten = betrag * zinssatz / 100 * laufzeit

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        serverAntwort.render('kreditBerechnen.ejs', {
            Betrag: betrag,
            Laufzeit: laufzeit,
            Zinssatz: zinssatz,
            Erfolgsmeldung:"Ihre Kreditkosten betragen: " + kreditkosten
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

                // Der result wird an die ejs-Seite übergeben und steckt dann in dem Attribut MeineIbans
                // Der Datentyp von MeineIbans ist dann eine Liste
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

// Wenn der Button "Bitte ein Konto auswählen" gedrückt wird, wird die
// meineApp.post-Funktion abgearbeitet.

meineApp.post('/kontostandAnzeigen',(browserAnfrage, serverAntwort, next) => {              

    // Es wird eine Variable namens index instanziert. Beim Schleifendurchauf 
    // wird index der Wert der ausgewählten Variablen zugewiesen

    var index

    // Eine Verbindung zur DB wird ausgewählt. Alle Zeilen werden ausgewählt, in denen die idKunde 1500000 ist.
    // Das Ergebnis, das die DB uns zurückgibt steckt im result.

    dbVerbindung.query('SELECT * FROM konto WHERE idKunde = 150000;', function (fehler, result) {      
        
        // Der result (alle meine Konten) wird auf der Console geloggt.
        
        console.log(result)

        console.log("Ausgewähltes Element:")

        // Die IBAN, die im Select ausgewählt wurde, wird auf der Console geloggt.

        console.log(browserAnfrage.body.iban)   
    
        // Der Wert der Variablen iban aus der Browseranfrage wird der Variablen ausgewaehltesKontoIban zugewiesen. 

        var ausgewaehltesKontoIban = browserAnfrage.body.iban

        // Mit der for-Schleife wird der result solange durchlaufen, bis der Wert von 
        // ausgewaehltesKonto mit dem Wert des durchlaufenen Kontos übereinstimmt.

        // Zur For-Scheife: Eine For-Schleife besteht immer aus drei Teilen:
        // let i = 0: Eine Variable namens i wird mit 0 initialisiert.
        // i <= result.length: Die Schleife wird solange durchlaufen, bis die Anzahl der
        //                     Elemente im result erreicht ist.
        // i++:  i wird mit jedem Schleifendurchlauf um 1 hochgezählt

        for (let i = 0; i <= result.length; i++) {
           
            // Wenn der Wert der Variablen ausgewaehltesKontoIban mit dem 
            // gerade in der Schleife durchlaufenen Element aus dem result übereinstimmt, ...

           if(ausgewaehltesKontoIban === result[i].iban){
            
                // ... dann werden die Eigenschften des Kontos aus dem result geloggt:
            
                console.log("Kontoart des ausgewählten Kontos:")
                console.log(result[i].kontoart)
                console.log("Kontostand des ausgewählten Kontos:")
                console.log(result[i].anfangssaldo) 
                console.log("Index des ausgewählten Kontos:")
                console.log(i)
                index = i            
                
                // Sobald das gewünschte Element gefunden wurde, verlassen wir die Schleife
                // mit dem Befehl break: 

                break;
           }
        }

        // Die Index-Seite wird an den Browser gegeben (man sagt auch gerendert):

        serverAntwort.render('kontostandAnzeigen.ejs',{

            // Der result wird an die ejs-Seite übergeben und steckt dann in dem Attribut MeineIbans
            // Der Datentyp von MeineIbans ist dann eine Liste
            MeineIbans: result,
            Kontostand: result[index].anfangssaldo,
            IBAN: result[index].iban,
            Kontoart: result[index].kontoart,
            Erfolgsmeldung: ""
        })
    })
})

// Die Funktion meineApp.post('/kontoAnlegen'... wird abgearbeitet, sobald der Button 
// auf der kontoAnlegen-Seite gedrückt wird und das Formular abgesendet ('gepostet') wird.

meineApp.post('/kontoAnlegen',(browserAnfrage, serverAntwort, next) => {              
    
    const kunde = JSON.parse(browserAnfrage.signedCookies.istAngemeldetAls)

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

    dbVerbindung.query('INSERT INTO konto(iban, idKunde, anfangssaldo, kontoart, timestamp) VALUES ("' + iban + '", "'+ kunde.IdKunde +'", 1, "' + kontoArt + '", NOW()) ;', function (fehler) {
      
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

    // Der Wert von "AbsenderIban" aus der Browseranfrage wird zugewiesen (=)
    // an eine Konstante namens absenderIban.
    
    const absenderIban = browserAnfrage.body.AbsenderIban
        
    console.log("IBAN des Absenders: " + absenderIban)

    // Die Datenbank wird abgefragt und der passende Datensatz mit allen Attributwerten (*)
    // zur abesenderIban als result an den Server übergeben.

    dbVerbindung.query('SELECT * FROM konto WHERE iban = "' + absenderIban + '";', function (fehler, result) {
        
        console.log(result)

        // Der Result besteht möglicherweise aus vielen Datensätzen.
        // Um den Result auf den ersten Datensatz zu begrenzen, wird [0] hinter
        // dem Result angegeben. Zuletzt wird die Eigenschaft anfangssaldo mit Punkt
        // angehängt. Der zweite Datensatz würde mit result[1].anfangssaldo ausgelesen.

        console.log("Anfangssaldo: " + result[0].anfangssaldo)

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
            
            // Wenn die empfaengerIban gültig ist, dann wird der String "Erfolg" 
            // der Variablen namens erfolgsmeldung zugewiesen.
            
            erfolgsmeldung = "Die Empfänger-IBAN ist gültig."
        
            // Prüfung, ob der Kontostand des Absenders ausreicht:
            // Der gewünschte Überweisungsbetrag wird mit dem ausgelesenen Kontostand
            // verglichen. Wenn der Betrag kleiner oder gleich dem Kontostand ist,
            // dann ist das Konto des Absenders gedeckt.

            if(betrag <= result[0].anfangssaldo){
                
                // Der String "Das Konto ..." wird verkettet (+) mit dem Wert der Variablen
                // erfolgsmeldung und dann zugewiesen (=) an die Variable namens Erfolgsmeldung.
                
                erfolgsmeldung = erfolgsmeldung + " Das Konto des Absenders ist gedeckt."

                // Überweisung in die Datenbank schreiben:

                // Zuerst wird zwischen der inneren Klammer der Betrag vom anfngssaldo abgezogen.
                // Danach wird alles miteinander verkettet.
            
                console.log("Neuer Anfangssaldo des Absenders: " + (parseFloat(result[0].anfangssaldo) - parseFloat(betrag)))

                // Es muss für jede Überweisung ein neuer Datensatz in der Tabelle kontobewegung
                // eingefügt werden (INSERT INTO)

                dbVerbindung.query('INSERT INTO kontobewegung(timestamp, betrag, empfaengerIban, verwendungszweck, absenderIban, name) VALUES (NOW(), 100, "DE123Empf", "Verwendungszweck", "DE05270000009708846254", "MeinName") ;', function (fehler) {
                    console.log("fehler:")            
                    console.log(fehler)            
                })

                // Das Konto des Empfängers muss abgefragt werden, um den Anfangssaldo erhöhen zu können.
                
                dbVerbindung.query('SELECT anfangssaldo FROM konto WHERE iban = "' + empfaengerIban + '";', function (fehler, resultEmpfaenger) {

                    // Der erste Datensatz (Zeile) des Results wird mit [0] gefiltert. Das gewünschte Attribut wird mit
                    // ".anfangssaldo" (Spalte) an den resultEmpfaenger[0] angehangen.

                    console.log("Anfangssaldo des Empfängers vor der Überweisung: " + resultEmpfaenger[0].anfangssaldo)
                
                    // Die Gutschrift auf dem Empfängerkonto muss in die DB geschrieben werden:

                    dbVerbindung.query('UPDATE konto SET anfangssaldo = ' + (parseFloat(resultEmpfaenger[0].anfangssaldo) + parseFloat(betrag)) + ' WHERE iban = "' + empfaengerIban + '";', function (fehler, result) {      
                    })

                    // Mit dem += Operator wird die Zeichenkette um einen weiteren String
                    // verlängert.

                    erfolgsmeldung += "Die Überweisung wurde erfolgreich ausgeführt. "        
                })
            }else{
                erfolgsmeldung = erfolgsmeldung + " Das Konto des Absenders ist nicht gedeckt."
            }        
        }else{            
            erfolgsmeldung = "Die Empfänger-IBAN ist ungültig."            
        }
        dbVerbindung.query('SELECT * FROM konto WHERE idKunde = ' + kunde.IdKunde + ';', function (fehler, resultMeineIbans) { 

            serverAntwort.render('ueberweisungTaetigen.ejs', {        
                Erfolgsmeldung: erfolgsmeldung,
                MeineIbans: resultMeineIbans,
                AbsenderIban: absenderIban,
                Betrag: betrag,
                Verwendungszweck: verwendungszweck,
                empfaengerIban: empfaengerIban    
            })
        })
    })
})

meineApp.get('/kontobewegungAnzeigen',(browserAnfrage, serverAntwort, next) => {              
    
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

            dbVerbindung.query('SELECT * FROM kontobewegung WHERE absenderIban = "' + result[0].AbsenderIban + '";', function (fehler, resultKontobewegung) {       
        
                console.log("Kontobewegungen zu Konto " + ausgewaehltesKontoIban + ":")
                console.log(resultKontobewegung)
             
                // Die Index-Seite wird an den Browser gegeben (man sagt auch gerendert):

                serverAntwort.render('kontobewegungAnzeigen.ejs',{

                    // Der result wird an die ejs-Seite übergeben und steckt dann in dem Attribut MeineIbans
                    // Der Datentyp von MeineIbans ist dann eine Liste
                    MeineIbans: result,
                    Kontostand: konto.Kontostand,
                    IBAN: konto.IBAN,
                    Kontobewegungen: resultKontobewegung,
                    Erfolgsmeldung: ""
                })
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

// Wenn der Button "Bitte ein Konto auswählen" gedrückt wird, wird die
// meineApp.post-Funktion abgearbeitet.

meineApp.post('/kontobewegungAnzeigen',(browserAnfrage, serverAntwort, next) => {              

    // Es wird eine Variable namens index instanziert. Beim Schleifendurchauf 
    // wird index der Wert der ausgewählten Variablen zugewiesen

    var index

    // Eine Verbindung zur DB wird ausgewählt. Alle Zeilen werden ausgewählt, in denen die idKunde 1500000 ist.
    // Das Ergebnis, das die DB uns zurückgibt steckt im result.

    dbVerbindung.query('SELECT * FROM konto WHERE idKunde = 150000;', function (fehler, result) {      
        
        // Der result (alle meine Konten) wird auf der Console geloggt.
        
        console.log(result)

        console.log("Ausgewähltes Element:")

        // Die IBAN, die im Select ausgewählt wurde, wird auf der Console geloggt.

        console.log(browserAnfrage.body.iban)   
    
        // Der Wert der Variablen iban aus der Browseranfrage wird der Variablen ausgewaehltesKontoIban zugewiesen. 

        var ausgewaehltesKontoIban = browserAnfrage.body.iban

        // Mit der for-Schleife wird der result solange durchlaufen, bis der Wert von 
        // ausgewaehltesKonto mit dem Wert des durchlaufenen Kontos übereinstimmt.

        // Zur For-Scheife: Eine For-Schleife besteht immer aus drei Teilen:
        // let i = 0: Eine Variable namens i wird mit 0 initialisiert.
        // i <= result.length: Die Schleife wird solange durchlaufen, bis die Anzahl der
        //                     Elemente im result erreicht ist.
        // i++:  i wird mit jedem Schleifendurchlauf um 1 hochgezählt

        for (let i = 0; i <= result.length; i++) {
           
            // Wenn der Wert der Variablen ausgewaehltesKontoIban mit dem 
            // gerade in der Schleife durchlaufenen Element aus dem result übereinstimmt, ...

           if(ausgewaehltesKontoIban === result[i].iban){
            
                // ... dann werden die Eigenschften des Kontos aus dem result geloggt:
            
                console.log("Kontoart des ausgewählten Kontos:")
                console.log(result[i].kontoart)
                console.log("Kontostand des ausgewählten Kontos:")
                console.log(result[i].anfangssaldo) 
                console.log("Index des ausgewählten Kontos:")
                console.log(i)
                index = i            
                
                // Sobald das gewünschte Element gefunden wurde, verlassen wir die Schleife
                // mit dem Befehl break: 

                break;
           }
        }

        dbVerbindung.query('SELECT * FROM kontobewegung WHERE absenderIban = "' + ausgewaehltesKontoIban + '";', function (fehler, resultKontobewegung) {       
        
            console.log("Kontobewegungen zu Konto " + ausgewaehltesKontoIban + ":")
            console.log(resultKontobewegung)
        
            // Die Index-Seite wird an den Browser gegeben (man sagt auch gerendert):

            serverAntwort.render('kontobewegungAnzeigen.ejs',{

                // Der result wird an die ejs-Seite übergeben und steckt dann in dem Attribut MeineIbans
                // Der Datentyp von MeineIbans ist dann eine Liste
                MeineIbans: result,
                Kontostand: result[index].anfangssaldo,
                IBAN: result[index].iban,
                Kontobewegungen: resultKontobewegung,
                Erfolgsmeldung: ""
            })
        })
    })
})

meineApp.get('/geldAnlegen',(browserAnfrage, serverAntwort, next) => {              

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        serverAntwort.render('geldAnlegen.ejs', {
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

// Die Funktion meineApp.post('/geldAn... wird ausgeführt, wenn  der Button gedrückt wird.

meineApp.post('/geldAnlegen',(browserAnfrage, serverAntwort, next) => {              

    // Der Wert der Variablen namens Betrag aus dem Formular in der EJS-Datei
    // wird einer Variablen namens betrag zugewiesen.
    let betrag = browserAnfrage.body.Betrag
    
    // Der Wert der Variablen namens Betrag wird zu einem String verkettet
    // und im Terminal ausgegeben.
    console.log("Betrag: " + betrag)

    // Aus der Browseranfrage wird die Variable namens
    // Laufzeit ausgelesen und einer lokalen Variablen
    // namens laufzeit zugewisen.
    let laufzeit = browserAnfrage.body.Laufzeit
    console.log("Laufzeit: " + laufzeit)

    //Aus der Browseranfrage wird die Variable namens
    // Zinssatz ausgelesen und an eine lokale Variable 
    // namens zinssatz zugewiesen.
    let zinssatz = browserAnfrage.body.Zinssatz
    console.log("Zinssatz: " + zinssatz)

    // Wenn die Laufzeit 0 Jahre beträgt, wird die Schleife nicht durch-
    // laufen und der Rückzahungsbetrag entspricht dem eingezahlten Betrag.
    let rückzahlungsbetrag = parseFloat(betrag)


    // Eine For-Schleife ist eine Kontrollstruktur, die 
    // verwendet wird, um eine bestimmte Aufgabe mehrmals
    // auszuführen, solange eine bestimmte Bedingung 
    // (hier: i < laufzeit) erfüllt ist.
    // i wird mit jedem Schleifendurchlauf um 1 hochgezählt.
    for (let i = 0; i < laufzeit; i++) {
        
        // Mit jedem Schleifendurchlauf wird der Rückzahlungsbetrag 
        // mit dem Zinssatz multipliziert, um die Zinsen auszurechnen,
        // die dann auf die ursprünglichen Rückzahlungsbetrag hinzuaddiert werden.
        rückzahlungsbetrag += (rückzahlungsbetrag * zinssatz / 100)
        console.log("Rückzahlung nach " + (i+1) + " Jahren: " + rückzahlungsbetrag)
    } 

    if(browserAnfrage.signedCookies['istAngemeldetAls']){
        serverAntwort.render('geldAnlegen.ejs', {
            Betrag: betrag,
            Laufzeit: laufzeit,
            Zinssatz: zinssatz,
            Erfolgsmeldung:"Nach " + laufzeit + " Jahren Laufzeit bekommen Sie " + rückzahlungsbetrag.toLocaleString('en-IN', {style: 'currency',currency: 'EUR', minimumFractionDigits: 2}) + " ausgezahlt."
        })
    }else{
        serverAntwort.render('login.ejs',{
            Meldung: ""
        })
    }              
})




//require('./Uebungen/ifUndElse.js')
//require('./Uebungen/klasseUndObjekt.js')
//require('./Klausuren/20221026_klausur.js')
//require('./Klausuren/20230111_klausur.js')