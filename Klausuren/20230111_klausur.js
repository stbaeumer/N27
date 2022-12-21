console.log("KLAUSUR")

// Wenn  ein*e Schüler*in mehr als 20 oder höchstens 27 Punkte hat, bekommt sie / er eine drei in WI.

let untergrenze = 20
let obergrenze = 27
let punktzahl = 20


if (punktzahl > untergrenze && punktzahl <= obergrenze){
    console.log("Die / der Schüler*in hat eine 3 in WI.")
}else{
    console.log("Der Schüler hat keine drei in WI.")
}

// Wenn ein Kind kleiner als 1 Meter ist oder noch keine 7 Jahre alt ist, hat es freien Eintritt im Schwimmbad.

let obergrenzeGroesseInMeter = 1 
let obergrenzeAlterInJahre = 7

let alter = 6
let groesse = 1.5

if (alter < obergrenzeAlterInJahre || groesse < obergrenzeGroesseInMeter){
    console.log("Freier Eintritt")
}else{
    console.log("KEIN freier Eintritt")
}

// Geben Sie mit einer Schleife 6x untereinander den Ausruf "Hallo!" aus!

// let i = 0; bedeutet, dass eine Variable namens i mit dem Wert 0 initialisiert wird.

// i < 6; bedeutet, dass die Schleife sooft durchlaufen wird, solange die Prüfung wahr ist.

// i++ bedeutet, dass i bei jedem Schleifendurchlauf um 1 hochgezählt wird.

for (let i = 1; i < 7; i++) {
    console.log(i + ". Hallo!")   
}

for (let i = 0; i < 6; i++) {
    console.log((i+1) + ". Hallo!")   
}

// Ein Euro wird auf dem Sparbuch angelegt bei 10% Zinsen. Wie  hoch ist der Kapitalwert
// nach 5 Jahren

let anfangsbetrag = 1
let zinssatz = 0.1
let kapitalwert = anfangsbetrag
let laufzeit = 2

for(let i = 0; i < laufzeit; i++){
    kapitalwert = kapitalwert + kapitalwert * zinssatz
}

console.log("Kapitalwert nach " + laufzeit + " Jahren: " + kapitalwert)

// Zählen Sie mit einer Schleife von 3 bis 1 herunter.

for(let i = 3; i > 0; i--){
    console.log("Countdown: " + i)
}
