
Abfragen in SQL
===============


Abfrage 1
---------

Suche alle Kunden aus der Tabelle kunde:

SELECT * FROM kunde;

Das Sternchen steht für alle Eigenschaften (Spalten) aller Kundendatensätze (Zeilen)

Abfrage 2
---------

Suche alle Vornamen und Nachnamen aller Kunden:

SELECT vorname, nachname FROM kunde;

Abfrage 3
---------

Suche alle Vornamen und Nachnamen aller Kunden, die in Borken wohnen:

SELECT vorname, nachname FROM kunde WHERE ort = "Borken";


