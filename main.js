



const board = JXG.JSXGraph.initBoard('box', {boundingbox: [-5, 5, 5, -5], axis:true});
let currentPoint = null;

const objects = [];

function createPoint() {
  //var coordX = document.getElementById("xCoord").value;
  //var coordY = document.getElementById("yCoord").value;
  const point = board.create('point', [4, 4]);

  point.on('drag', function () {
    const coordinates = point.coords.usrCoords.slice(1); // Récupère les coordonnées du point
    point.setPosition(JXG.COORDS_BY_USER, coordinates); // Met à jour la position du point
  });

  objects.push({ type: 'point', object: point});
}

function createLine() {
  const point1 = board.create('point', [1, 1]);
  const point2 = board.create('point', [4, 4]);
  const line = board.create('line', [point1, point2]);
  objects.push({ type: 'line', object: line });
}

function createCurve() {
  var dataX = [1,2,3,4,5,6,7,8];
  var dataY = [0.3,4.0,-1,2.3,7,9,8,9];
  var curve = board.create('curve', [dataX,dataY],{strokeColor:'red',strokeWidth:3});
  objects.push({ type: 'curve', object: curve, dataX: dataX, dataY: dataY });
}

function createFunction() {
  const func = board.create('functiongraph', [function(x) { return 2 * x; }]);
  objects.push({ type: 'function', object: func });
}

function createCircle() {
  const point = board.create('point', [1, 1]);
  const circle = board.create('circle', [point, 3]);
  objects.push({ type: 'circle', object: circle });
}

document.getElementById('createPoint').addEventListener('click', createPoint);
document.getElementById('createLine').addEventListener('click', createLine);
document.getElementById('createCurve').addEventListener('click', createCurve);
document.getElementById('createFunction').addEventListener('click', createFunction);
document.getElementById('createCircle').addEventListener('click', createCircle);


function visualize() {
    let htmlCode = `&lt;div id="box" &gt; &lt;/div &gt;`;
    let cssCode = `#box { width: 600px; height: 600px; }`;
    let jsCode = `const board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10]});\n`;
  
    objects.forEach((obj) => {
      switch (obj.type) {
        case 'point':
          const pointCoords = obj.object.coords.usrCoords.slice(1);
          jsCode += `const point_${obj.object.id} = board.create('point', [${pointCoords[0]}, ${pointCoords[1]}]);\n`;
          break;
        case 'line':
          const point1Coords = obj.object.point1.coords.usrCoords.slice(1);
          const point2Coords = obj.object.point2.coords.usrCoords.slice(1);
          jsCode += `const point_${obj.object.point1.id} = board.create('point', [${point1Coords[0]}, ${point1Coords[1]}]);\n`;
          jsCode += `const point_${obj.object.point2.id} = board.create('point', [${point2Coords[0]}, ${point2Coords[1]}]);\n`;
          jsCode += `const line_${obj.object.id} = board.create('line', [point_${obj.object.point1.id}, point_${obj.object.point2.id}]);\n`;
          break;
        case 'curve':
          jsCode += `var dataX = ${JSON.stringify(obj.dataX)};\n`;
          jsCode += `var dataY = ${JSON.stringify(obj.dataY)};\n`;
          jsCode += `var curve_${obj.object.id} = board.create('curve', [dataX, dataY], { strokeColor: 'red', strokeWidth: 3 });\n`;
          break;
        case 'function':
          const func = obj.object.Y;
          jsCode += `const func_${obj.object.id} = board.create('functiongraph', [function(x) { return ${func.c[1]} * x; }]);\n`;
          break;
        case 'circle':
          const circleCenterCoords = obj.object.center.coords.usrCoords.slice(1);
          const circleRadius = obj.object.radius;
          jsCode += `const point_${obj.object.center.id} = board.create('point', [${circleCenterCoords[0]}, ${circleCenterCoords[1]}]);\n`;
          jsCode += `const circle_${obj.object.id} = board.create('circle', [point_${obj.object.center.id}, ${circleRadius}]);\n`;
          break;
        case 'sageCell':
            htmlCode += `<div class="sageCell"></div>`;
            jsCode += `sagecell.makeSagecell({ inputLocation: $('.sageCell')[${objects.filter(o => o.type === 'sageCell').indexOf(obj)}], evalButtonText: 'Calculer' });\n`;
            break;
      }
    });
  
    // Ouvrir une nouvelle fenêtre ou un nouvel onglet
    const newWindow = window.open();
  
    // Écrire le contenu de la nouvelle fenêtre
    newWindow.document.write(`
      <h2>HTML</h2>
      <pre>${htmlCode}</pre>
      <h2>CSS</h2>
      <pre>${cssCode}</pre>
      <h2>JS</h2>
      <pre>${jsCode}</pre>
    `);
  }
  
  document.getElementById('visualize').addEventListener('click', visualize);
  

  /* ---------------------------------------------------------add le 11/05/2023------------------------------------------------------- */
// Obtenir les éléments de la page
var modal = document.getElementById("window-parent");
var btn = document.getElementById("openModal");
var span = document.getElementsByClassName("close")[0];
var createPointBtn = document.getElementById("createPoint");

// Quand l'utilisateur clique sur le bouton, ouvrir la boîte de dialogue 
btn.onclick = function() {
  modal.style.display = "block";
}

// Quand l'utilisateur clique sur (x), fermer la boîte de dialogue
span.onclick = function() {
  modal.style.display = "none";
}

// Quand l'utilisateur clique en dehors de la boîte de dialogue, la fermer
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Créer le point lorsque l'utilisateur clique sur "Créer le point"
createPointBtn.onclick = function() {
  var x = document.getElementById("xCoord").value;
  var y = document.getElementById("yCoord").value;
  // Créer le point ici
  console.log("Point créé avec les coordonnées X=" + x + ", Y=" + y);
  modal.style.display = "none";
}
/*-------------------------------------------------------------------------------------------------------------- */
  
/*
document.getElementById('exportCode').addEventListener('click', () => {
    if (currentPoint) {
      //const pointData = currentPoint.point.coords.usrCoords.slice(1);
      const htmlCode = '<div id="box"></div>';
      const cssCode = '#box { width: 600px; height: 600px; }';
      const jsCode = "const board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10]});const point = board.create('point', [${pointData[0]}, ${pointData[1]}]);";
  
      console.log('HTML:', htmlCode);
      console.log('CSS:', cssCode);
      console.log('JS:', jsCode);
    } else {
      alert("Veuillez d'abord créer un point.");
    }
  });*/
