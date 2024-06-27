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

## UML Diagram

<svg version="1.1" baseProfile="full" width="447.0" height="163.0" viewbox="0 0 447 163" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">
<desc >#.interface: fill=lightblue
#.enumeration: fill=lightgreen
#.type: fill=lightgray
[&lt;enumeration&gt;AppState|MENU;DESK_SELECT;GAME;GAME_OVER]
[&lt;interface&gt;JigsawPiece|+name: string;+mesh: AbstractMesh;+correctPosition: Vector3|]</desc>
<g stroke-width="1.0" text-align="left" font="12pt Helvetica, Arial, sans-serif" font-size="12pt" font-family="Helvetica" font-weight="normal" font-style="normal">
<g font-family="Helvetica" font-size="12pt" font-weight="bold" font-style="normal" stroke-width="3.0" stroke-linejoin="round" stroke-linecap="round" stroke="#33322E">
<g stroke="transparent" fill="transparent">
<rect x="0.0" y="0.0" height="163.0" width="447.0" stroke="none"></rect>
</g>
<g transform="translate(8, 8)" fill="#33322E">
<g transform="translate(20, 20)">
<g data-name="AppState">
<g fill="lightgreen" stroke="#33322E" data-name="AppState">
<rect x="0.0" y="0.0" height="107.0" width="136.0" data-name="AppState"></rect>
<path d="M0.0 31.0 L136.0 31.0" fill="none" data-name="AppState"></path>
</g>
<g transform="translate(0, 0)" font-family="Helvetica" font-size="12pt" font-weight="normal" font-style="normal" data-name="AppState">
<g transform="translate(8, 8)" fill="#33322E" text-align="center" data-name="AppState">
<a id="src\typescript\gameStates.ts.AppState" xlink:href="src\typescript\gameStates.ts"><text x="60.0" y="13.5" stroke="none" text-anchor="middle" data-name="AppState">AppState</text></a>

</g>
</g>
<g transform="translate(0, 31)" font-family="Helvetica" font-size="12pt" font-weight="normal" font-style="normal" data-name="AppState">
<g transform="translate(8, 8)" fill="#33322E" text-align="left" data-name="AppState">
<text x="0.0" y="13.5" stroke="none" data-name="AppState">MENU</text>
<text x="0.0" y="28.5" stroke="none" data-name="AppState">DESK_SELECT</text>
<text x="0.0" y="43.5" stroke="none" data-name="AppState">GAME</text>
<text x="0.0" y="58.5" stroke="none" data-name="AppState">GAME_OVER</text>

</g>
</g>
</g>
<g data-name="JigsawPiece">
<g fill="lightblue" stroke="#33322E" data-name="JigsawPiece">
<rect x="176.0" y="3.5" height="100.0" width="215.0" data-name="JigsawPiece"></rect>
<path d="M176.0 34.5 L391.0 34.5" fill="none" data-name="JigsawPiece"></path>
<path d="M176.0 95.5 L391.0 95.5" fill="none" data-name="JigsawPiece"></path>
</g>
<g transform="translate(176, 3.5)" font-family="Helvetica" font-size="12pt" font-weight="normal" font-style="normal" data-name="JigsawPiece">
<g transform="translate(8, 8)" fill="#33322E" text-align="center" data-name="JigsawPiece">
<a id="src\typescript\interfaces\jigsaw.ts.JigsawPiece" xlink:href="src\typescript\interfaces\jigsaw.ts"><text x="99.5" y="13.5" stroke="none" text-anchor="middle" data-name="JigsawPiece">JigsawPiece</text></a>

</g>
</g>
<g transform="translate(176, 34.5)" font-family="Helvetica" font-size="12pt" font-weight="normal" font-style="normal" data-name="JigsawPiece">
<g transform="translate(8, 8)" fill="#33322E" text-align="left" data-name="JigsawPiece">
<text x="0.0" y="13.5" stroke="none" data-name="JigsawPiece">+name: string</text>
<text x="0.0" y="28.5" stroke="none" data-name="JigsawPiece">+mesh: AbstractMesh</text>
<text x="0.0" y="43.5" stroke="none" data-name="JigsawPiece">+correctPosition: Vector3</text>

</g>
</g>
<g transform="translate(176, 95.5)" font-family="Helvetica" font-size="12pt" font-weight="normal" font-style="normal" data-name="JigsawPiece">
<g transform="translate(8, 8)" fill="#33322E" data-name="JigsawPiece">

</g>
</g>
</g>
</g>
</g>
</g>
</g>
</svg>

## Hilfreiche Links mit Beispielen für AR

Eine Liste toller Dinge, die mit der Babylon.js-Spielengine zu tun haben:

```
https://github.com/Symbitic/awesome-babylonjs

```

Eine Liste toller Dinge, die mit der WebXR-API realisiert wurden:

```
https://immersive-web.github.io/webxr-samples/
```
