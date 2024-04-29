import { Color3, IWebXRPlane, Material, Mesh, PolygonMeshBuilder, Quaternion, Scene, StandardMaterial, Vector2 } from "@babylonjs/core";

export function addPolygonForPlaneDetection(scene: Scene, planes: Mesh[], plane: IWebXRPlane) {
  plane.polygonDefinition.push(plane.polygonDefinition[0]); // Die ersten und letzten Punkte sollten gleich sein, um die Form zu schließen
  var polygon_triangulation = new PolygonMeshBuilder(
    "name",
    plane.polygonDefinition.map((p) => new Vector2(p.x, p.z)), // Ein Format, das für den Mesh Builder geeignet ist
    scene
  );

  var polygon = polygon_triangulation.build(false, 0.01); // True: Nur Position; False: Position und Indizies; 0.01: Präzision der Messung (intern)
  plane.mesh = polygon;
  planes[plane.id] = plane.mesh;
  const mat = new StandardMaterial("mat", scene);
  mat.alpha = 0.5; // Transparenz
  mat.diffuseColor = Color3.Random();
  polygon.createNormals(true); // Erstellt Normale für das Licht etc.
  plane.mesh.material = mat;
  plane.mesh.rotationQuaternion = new Quaternion(); // Rotation des Plane.Mesh
  plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position); // Setzt Transformationen von Plane zu Mesh
}

export function updatePolygonForPlaneDetection(scene: Scene, planes: Mesh[], plane: IWebXRPlane) {
  let mat: Material;
  if (plane.mesh) {
    // keep the material, dispose the old polygon
    mat = plane.mesh.material;
    plane.mesh.dispose(false, false);
  }
  const some = plane.polygonDefinition.some((p) => !p);
  if (some) {
    return;
  }
  plane.polygonDefinition.push(plane.polygonDefinition[0]);
  var polygon_triangulation = new PolygonMeshBuilder(
    "name",
    plane.polygonDefinition.map((p) => new Vector2(p.x, p.z)),
    scene
  );
  var polygon = polygon_triangulation.build(false, 0.01);
  polygon.createNormals(true);
  plane.mesh = polygon;
  planes[plane.id] = plane.mesh;
  plane.mesh.material = mat;
  plane.mesh.rotationQuaternion = new Quaternion();
  plane.transformationMatrix.decompose(plane.mesh.scaling, plane.mesh.rotationQuaternion, plane.mesh.position);
}

export function removePolygonForPlaneDetection(planes: Mesh[], plane: IWebXRPlane) {
  if (plane && planes[plane.id]) {
    planes[plane.id].dispose();
  }
}
