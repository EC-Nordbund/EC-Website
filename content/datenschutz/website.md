# Wer wir sind

Wir der EC-Jugendverband Nordbund Entschieden für Christus e.V. (im Folgenden „EC-Nordbund“) ist der Zusammenschluss der EC-Jugendarbeiten Entschieden für Christus in Hamburg und Schleswig-Holstein.  
Die Adresse unserer Website ist: https://www.ec-nordbund.de.

# Welche personenbezogenen Daten wir sammeln und warum wir sie sammeln

## Analytics
Wir nutzen als Analytics [ackee](https://ackee.electerious.com/) dies hat folgende Vortaile (für dich) gegenüber z.B. Google Analytics

1. Daten bleiben die ganze Zeit bei uns (daten werden nur auf unseren Servern verarbeitet)
2. Niemand bekommt die Rohdaten zu sehen
3. Wir haben die volle Kontrolle über die Daten (und nicht ein Unternehmen wie Google)

Du willst nicht das wir dich tracken? Dann kannst du in deinem Browser die "Do Not Track" Einstellung aktivieren. Beachte dass nicht alle Browser das unterstrützen siehe [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/navigator/doNotTrack).

Wir erhalten dabei aber KEINE personenbezogene Daten. Es wird für jeden Nutzer eine clientID generiert. Diese setzt sich zusammen aus

1. IP-Adresse
2. Täglichen Zufallscode
3. Browser daten

Wir können aus der clientID nicht auf die IP schließen. Wir dokumentieren zusäzulich zu "es hat jemand die Seite besucht" sondern auch welchen Browser und Geräteinformationen. Wir haben dabei aber nur Zugriff auf absolut werte z.B.: "In den letzten 7 Tagen hat die hälfte der Besucher die Seite von einem Handy aus besucht."

Wir erhalten dabei folgende Informationen:
1. Betriebsystem
2. Browser name
3. Browser Version
4. eingestellte Sprache
5. Größe des Browsers (in Pixel)


## Anmeldung

Wir bieten an unterschiedlichen Stellen Anmeldeformulare zu Veranstaltungen an. In diesem müssen (bei deiner Anmeldung) verschiedene persönliche Daten angegeben werden. Diese Daten werden temporär auf unserem Server zwischengespeichert.

An die angegebene E-Mail-Adresse versenden wir eine E-Mail, in der du deine Anmeldung mit einer Bestätigung abschließen musst. Zeitgleich erhältst du mit dieser Mail auch die entsprechenden Hinweise auf die weitere Datennutzung. Bis zur abgeschlossenen Anmeldung erhält niemand direkten Zugriff auf deine eingegebenen Daten. Ohne deine Bestätigung ist die Anmeldung ungültig und die angegeben Anmeldedaten werden automatisch nach 24 Stunden gelöscht. Sollte innerhalb der 24 Stunden ein Problem auftreten können deine Daten durch unsere Administratoren eingsehen und analysiert werden um eine Lösung für das Problem zu finden. Der Zeitraum von 24 Stunden kann aufgrund technischer Beschränkungen um bis zu 1h varieren (normalerweise aber maximal 10min).

<!-- ## Kontaktformulare

Wenn ein Benutzer Kontakt über eins der Kontakt-Formulare am Ende unserer Websiten mit uns aufnimmt, werden die angegebnen Daten in der Datenbank unserer Website gespeichert und direkt an den ausgewähten Kontakt gesendet. Diese E-Mail enthält die IP-Adresse, den Zeitstempel, den Namen, die E-Mail-Adresse, die Website und die Nachricht des Absenders.

Eine Weitergabe der Daten findet nur im Sinne der Anfrage und innerhalb des EC-Nordbundes statt. (Zum Beispiel, wenn für die Anfrage nicht der zuständige Ansprechpartner ausgewählt wurde, oder wenn die Bearbeitung der Nachricht aus anderen Gründen eine Weitergabe erforderlich macht.) -->

## Cookies

Wir setzen keine Cookies mit außnahme einses Session-Cookies.
<!-- Im nächsten Abschnitt über Service Workers gibt es noch einige Informationen was zusätzlich von deinem Browser gespeichert wird. -->

## ServerLogs

Wir benutzen verschiedene Server-Software:

1. Nginx für Subdomain aufteilung + weiterleitung an Docker Container
2. Express.JS (für Anmeldeverwaltung)
3. Connect

Diese sind so Eingestellt, dass sie zwar Log-Dateien produzieren, diese aber keine Personenbezogenen Daten beinhalten. Wir wissen also nur wann jemand welche Seiten angefordert hat aber können nicht sagen wer.

## Weitergabe von Daten

Eine weitergabe deiner Daten an dritte findet nicht statt.
<!-- Daten des Kontakt-Formulares werden an die Ausgewählte Person übernmittelt.
Eine Weitergabe der Daten an Personen außerhalb des EC-Nordbundes findet nicht statt.

Unser Server ist in Deutschland lokalisiert. -->

## Open Street Maps
Wir benutzen bei unseren Karten nicht wie häufig üblich Google Maps ein sondern setzen hier auf Open Street Maps. Dies ist ein OpenSource Projekt an dem jeder änderungen Vorschlagen kann. Wir benutzen um die Karten aufzubauen mehrere Frameworks die letzendlich die Daten von einem sogenannten Tiles-Server abrufen. Dieser ist in unserem Fall der deutsche (tile.openstreetmap.de). Schaut man sich die Datenschutzerklärung von www.openstreetmap.de an so gelangt man zu https://www.fossgis.de/datenschutzerkl%C3%A4rung/ welche im endefekt für die Karten auf https://wiki.osmfoundation.org/wiki/Privacy_Policy verweist. Dies ist eine sehr ausführliche Datenschutzerklärung die viel mehr umfasst als nur die Tiles Server. Uns ist nicht bekannt, dass irgendwelche Daten vom tiles Server gespeichert werden. Unseren Tests zufolge werden auch keine Cookies gesetzt.

## Shop
Wir bieten einen Shop an. Dieser wird von https://www.spreadshirt.de/ betrieben. 

Wir erheben dabei KEINE Daten (außer Analytics wie oft die Seite besucht wurde)! Welcher Nutzer im einzelnen etwas Kauft erfahren wir nicht. Es ist zu beachten, dass Spreadshirt selber aber schon Daten sammelt. Bei Aufruf der Shop seite wirst du u.U. gefragt ob du Cookies erlauben willst. Wir empfehlen den Button ABLEHNEN zu drücken! In jedem Fall werden bei einem Kauf von Spreadshirt personenbezogene Daten verarbeitet. Die gesamte Datenschutzerklärung von Spreadshirt findest du hier https://service.spreadshirt.com/hc/de/articles/115000978409/?shop_name=nordbund&shop_id=100229754&platform=eu.

