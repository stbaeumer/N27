console.log("Übungen zu Klasse und Objekt")
console.log("============================") 

// Übung 1
// In einem Fußballverein sollen Spieler verwaltet werden. 
// a) Identifizieren Sie das Objekt der realen Welt mit seinen relevanten Eigenschaften
// b) Erstellen Sie die Klassendefinition
// c) Instanzieren Sie ein Objekt der Klasse
// d) Initialisieren Sie das Objekt mit Eigenschaftswerten

// zu a) Das Objekt der realen Welt ist der Spieler. 

// zu b)
class Spieler{
    constructor(){
        this.Name
        this.Position
        this.Verein
        this.Nummer
    }
}

// zu c)
// Es wird nun ein konkreter Spieler mit konkreten Eigenschaftswerten erzeugt.
// Dazu wird der konkrete Spieler deklariert (=bekanntgemacht): let spielerMueller
// In einem zweiten Schritt wird der konkrete Spieler instanziiert = new Spieler()
let spielerMueller = new Spieler()

// zu d)
// Es werden konkrete Eigenschaftswerte in den Arbeitsspeicher geschrieben:
spielerMueller.Name = "Thomas Müller"
spielerMueller.Nummer = 25
spielerMueller.Position = "Stürmer"
spielerMueller.Verein = "FCB"
spielerMueller.Alter = 18

if(spielerMueller.Alter >= 18){
    spielerMueller.Volljaehrig = true
    console.log("Der Spieler " + spielerMueller.Name + " ist volljährig.")
}

console.log(spielerMueller.Name)
console.log(spielerMueller.Position)
console.log("Der Spieler " + spielerMueller.Name + " hat die Nummer " + spielerMueller.Nummer + ".")


// Übung 2
// In einem Schulverwaltungsprogramm sollen Zeugnisse verwaltet werden. 
// a) Identifizieren Sie das Objekt der realen Welt mit seinen relevanten Eigenschaften
// b) Erstellen Sie die Klassendefinition
// c) Instanzieren Sie ein Objekt der Klasse
// d) Initialisieren Sie das Objekt mit Eigenschaftswerten

// zu a) Das "Zeugnis" ist das Objekt der realen Welt.

// zu b)
class Zeugnis{
    constructor(){
        this.SchuelerName
        this.Klasse
        this.Geburtsdatum
        this.Gesamtnote
        this.Fehlstunden
        this.Faecher
    }
}

// zu c)
let zeugnisPit = new Zeugnis()
let zeugnisMax = new Zeugnis()

// zu d)
zeugnisPit.SchuelerName = "Pit Kiff"
zeugnisPit.Fehlstunden = 100
zeugnisPit.Gesamtnote = 1

zeugnisMax.SchuelerName = "Max Muster"
zeugnisMax.Fehlstunden = 10
zeugnisMax.Gesamtnote = 2

if(zeugnisMax.Fehlstunden > zeugnisPit.Fehlstunden){
    console.log("Max Muster hat mehr Fehlstunden") 
}else{
    console.log("Pit Kiff hat mehr Fehlstunden")
}


// Übung 3
// In einem Kiosk soll das Sortiment verwaltet werden. 
// a) Identifizieren Sie das Objekt der realen Welt mit seinen relevanten Eigenschaften
// b) Erstellen Sie die Klassendefinition
// c) Instanzieren Sie ein Objekt der Klasse
// d) Initialisieren Sie das Objekt mit Eigenschaftswerten

// zu a) Die Objekte der realen Welt sind die Produkte

// zu b)
class Produkt{
    constructor(){
        this.BruttoPreis
        this.Bezeichnung
        this.MwStSatz
        this.Barcode
    }
}

// zu c)
// Deklaration und Instanziierung
let produkt1 = new Produkt()

// zu d)

produkt1.Bezeichnung = "Kaugummi"
produkt1.Barcode = 5901234123457
produkt1.BruttoPreis = 0.79 // Im Quellcode steht anstelle des Kommas ein Punkt
produkt1.MwStSatz = 19 // Prozent

console.log("Das Produkt " + produkt1.Bezeichnung + " hat den Bruttopreis " + produkt1.BruttoPreis + " €.")

produkt1.Nettopreis = produkt1.BruttoPreis / (100 + produkt1.MwStSatz) * 100

console.log("Nettopreis: " + produkt1.Nettopreis + " €.")

if(produkt1.BruttoPreis > 1){
    console.log("Achtung! Preis von " + produkt1.Bezeichnung + " muss gesenkt werden!")
}else{
    console.log("Preis von " + produkt1.Bezeichnung + " ist o.k.")
}

// Übung 4
// Für ein Schulfest sollen alle Stände verwaltet werden. 
// a) Identifizieren Sie das Objekt der realen Welt mit seinen relevanten Eigenschaften
// b) Erstellen Sie die Klassendefinition
// c) Instanzieren Sie ein Objekt der Klasse
// d) Initialisieren Sie das Objekt mit Eigenschaftswerten
// e) Geben Sie ausgewählte Eigenschaften auf der console aus.

class Stand{
    constructor(){
        this.Namen
        this.Lage
        this.Oeffnungszeiten
        this.Personalanzahl
        this.Angebot
        this.Ausgaben
        this.Einnahmen
    }
}

let standCafeteria = new Stand

standCafeteria.Name = "Cafeteria"
standCafeteria.Lage = "Turnhalle"
standCafeteria.Oeffnungszeiten = "10 Uhr bis 18 Uhr"
standCafeteria.Personalanzahl = 3
standCafeteria.Angebot = "Kaffee und Kuchen"
standCafeteria.Ausgaben = 1500
standCafeteria.Einnahmen = 1000

if(standCafeteria.Einnahmen > standCafeteria.Ausgaben){
    console.log("Der Stand " + standCafeteria.Name + " macht Gewinn. ")
}else{
    console.log("Der Stand " + standCafeteria.Name + " macht keinen Gewinn")
}







