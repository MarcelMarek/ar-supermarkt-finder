# AR Puzzle

Bei diesem Projekt handelt es sich um eine [BabylonJS](https://doc.babylonjs.com/) -basierte WebApp, die für das Lösen von Puzzles in einer WebXR-Umgebung entwickelt wurde und es den Benutzern ermöglicht, Puzzleteile auf einer Oberfläche in der erweiterten Realität zu platzieren. Dabei wird BabylonJS für das Rendering und WebXR für die Augmented-Reality-Funktionen verwendet.

## Was beinhaltet das Projekt?

Hier eine kurze Zusammenfassung der Module und ihrer Schwerpunkte:

> **app.ts** Einstiegspunkt der Anwendung, Initialisierung der Anwendung und Einrichtung der BabylonJS-Engine und WebXR-Erfahrung.

> **createScene.ts** Konzentriert sich auf das Einrichten der BabylonJS-Szene, einschließlich Beleuchtung, Kamera und das Laden von Assets.

> **planeDetector.ts** Beteiligt an der Erkennung von Ebenen in der realen Welt mit WebXR, so dass die Benutzer eine Oberfläche auswählen können, auf der das Puzzle platziert werden soll.

> **controller.ts** Verwaltet Eingaben von Controllern in der WebXR-Umgebung und verarbeitet Benutzerinteraktionen wie das Auswählen und Verschieben von Puzzleteilen.

> **gui.ts** Verwaltet die Elemente der grafischen Benutzeroberfläche und erstellt und verwaltet Button, Panel und andere UI-Komponenten für das Spiel.

> **gameStates.ts** Verwaltet die verschiedenen States des Spiels( z. B. MENU, DESK_SELECT, GAME, GAME_OVER) und erleichtert Zustandsübergänge auf der Grundlage von Benutzeraktionen oder Spielereignissen.

> **gameBoard.ts** Enthält die Logik für die Platzierung des Spielbretts in der AR-Umgebung, einschließlich der Erstellung eines Rasters, auf dem die Puzzleteile platziert werden können.

> **jigsaw.ts** Dieses Modul ist das Herzstück der Puzzle-Logik. Es erzeugt die Puzzleteile, verwaltet ihre Platzierung und prüft gegebenenfalls, ob sie richtig platziert wurden.

## Wie wird das Projekt gestartet?

Da WebXR nur auf sicheren Websites (https) oder localhost funktioniert, müssen Sie, um die Anwendung mit einer Netzwerk-IP-Adresse zu starten, ein Zertifikat mit der Webseite verknüpfen. Dazu können Sie openssl verwenden und die folgenden Befehle im Anwendungsverzeichnis ausführen:

```
openssl genrsa -out private_key.pem
```

```
openssl req -new -key private_key.pem -out csr.pem
```

```
openssl x509 -req -days 9999 -in csr.pem -signkey private_key.pem -out cert.pem
```

Sobald Sie das Zertifikat erstellt haben, können Sie die Anwendung mit den folgenden Befehlen starten:

```
npm run start
```

## Hilfreiche Links mit Beispielen für AR

Eine Liste toller Dinge, die mit der Babylon.js-Spielengine zu tun haben:

```
https://github.com/Symbitic/awesome-babylonjs

```

Eine Liste toller Dinge, die mit der WebXR-API realisiert wurden:

```
https://immersive-web.github.io/webxr-samples/
```
