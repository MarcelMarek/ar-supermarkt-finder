# AR Supermarkt Finder

## Einleitung

An AR App to assist your search for products in a supermarket.

## Erfahrungen und Schwierigkeiten

### Aufsetzen des Servers für eine Verbindung mit der Quest 3

- Problem: WebXR erlaubt nur HTTPS-Seiten.
- Lösung: Befehl (npx webpack serve --server-type https)
- Weitere Lösung: Live Server (adb reverse tcp:3000 tcp:5500, adb reverse --remove-all)

### Wandkollision wirkt sich nicht auf Objekt in der Szene aus

- Problem: Ein Torus-Objekt ist in der Szene sichtbar, aber der HitTest ist nicht verfügbar (Torus bleibt flach an den Wänden und dreht sich nicht zur Wand hin).
- Lösung: Quest 3 benötigt Raumscan für das Interagieren mit der babylonjs Szene.
- Weitere Lösung: Punktwolken (Raumscans) können geteilt werden

### Raumscans (mit definierten Objekten) ist in der Größe begrenzt

- Problem: Zu kleine Raumgröße der Qest 3. Nach 10 x 10 Meter ist Scannen der Umgebung möglich. Allerdings können keine Möbelstücke, außerhalb des 10x10 Bereiches, hinzugefügt werden.
- Lösung: Mehrere aneinander gereihte Räume können als ein großer Raum agieren. Über "Punktwolke mit Meta teilen" können diese Räume für Andere zur Verfügung gestellt werden.

- Bachelorarbeit BabylonJS (AR)

Szene kann über "Punktwolke mit Meta teilen" geteilt werden

### Laden der Rauminformationen in babylonjs

- Problem: Das Interface IWebXRPlane besitzt nicht ein Mesh Objekt namens mesh (BabylonJS-Beispiel besitzt jedoch eines: https://playground.babylonjs.com/#98TM63)
- Lösung: IWebXRPlane modifizieren und mesh hinzufügen

- Problem: Keine Anzeige der Rauminformationen. Fehlermeldung "earcut is missing"
- Lösung: Skript hinzugefügt (<script src="https://cdn.babylonjs.com/earcut.min.js"></script>)

Anchors
20 min Präsentation
Video der Präsentation, statt langem Text
(Scrcpy außen und innen aufnehmen zum)
