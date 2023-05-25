/*
* ******************************* *********************** Partie Global ******************** **************************
*/
var objects = [];
var isAxisClicked = false; // c pour controler la gestion events objects 
var cmpPoint = 0;
var cmpSlider = 0;

function rgbToHex(rgb) {
    var rgbValues = rgb.match(/\d+/g).map(Number); // récupère les valeurs r, g, b
    var hex = rgbValues.map(value => value.toString(16).padStart(2, '0')).join(''); // les convertit en hexadécimal
    return '#' + hex;
}
$('#windowModal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
});


function affichageParametres(parametres){
    
    var contentInput = '';
    var contentCheckbox = '';
    var contentColor = '';
    var contentSelect = '';
    var inputobject = '';

    if (parametres[0] == 'graph') 
        inputobject += affichageObjectParametres();

    parametres.forEach((param) => {
      switch (param.type) {
        case 'number':
            contentInput +=
              `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute} :</label>
                    </div>
                    <div class="col">
                        <input type="number" step="0.01" id="${param.attribute}n" class="form-control" value="${(param.value)[0]}">
                    </div>
                    <div class="col">
                        <input type="number" step="0.01" id="${param.attribute}p" class="form-control" value="${(param.value)[1]}">
                    </div>
                </div>` ;
            break;
        case 'coord':
            contentInput +=
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute} :</label>
                    </div>
                    <div class="col">
                        <input type="text" id="${param.attribute}n" class="form-control" value="${(param.value)[0]}" readonly>
                    </div>
                    <div class="col">
                        <input type="text" id="${param.attribute}p" class="form-control" value="${(param.value)[1]}" readonly>
                    </div>
                </div>` ;
            break;
        case 'numberSize':
            contentInput +=
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>
                    <div class="col">
                        <input type="number" step="0.01" id="${param.attribute}" class="form-control" min=0 max=100 value="${param.value}">
                    </div>
                </div>` ;
            break;
        case 'text':
            contentInput+= 
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>
                    <div class="col">
                        <input type="text" id="${param.attribute}" class="form-control" value="${param.value}">
                    </div>
                </div>`
            break;
        case 'select':
            contentSelect = 
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>                    
                    <select class="form-select" id="${param.attribute}" >
                    <option value="">Choisir ${param.attribute} </option>`;
                        (param.value).forEach((val) => {
            contentSelect += `<option value="${(val.split('#'))[1]}">${(val.split('#'))[0]}</option>`
                        });
            contentSelect += `</select> </div>`;
            break;
        case 'color':
            contentColor += 
            `<div class="row g-3 my-1">
                <label for="ColorInput" class="param-label col">${ param.attribute} :</label>
                <input type="color" id="${param.attribute}" class="form-control form-control-color" value="${param.value}"> 
            </div>`
                break;
        case 'checkbox':
            contentCheckbox += `<div class="row g-3 my-1">
                <div class="form-check form-switch">
                    <input type="checkbox" class="form-check-input" role="switch" id="${param.attribute}"`;
                    if (param.value == true)
                        contentCheckbox += 'checked';
                    contentCheckbox += `><label class="form-check-label param-label" for="same-address">${param.attribute}</label>
                </div>
            </div>`
            break;
        default:
            break;
      }
    });
    $("#parametres .inputParametres").html(contentInput);
    $("#parametres .inputCheckbox").html(contentCheckbox);
    $("#parametres .inputColor").html(contentColor); 
    $("#parametres .inputSelect").html(contentSelect);
    $("#parametres .inputObjects").html(inputobject);
    if (contentInput !== '')
        document.querySelector("#parametres .inputParametres").innerHTML += '<hr class="my-4">';
    if (contentCheckbox !== '')
        document.querySelector("#parametres .inputCheckbox").innerHTML += '<hr class="my-4">';
    if(contentColor !== '')
        document.querySelector("#parametres .inputColor").innerHTML += '<hr class="my-4">';
    if(contentSelect !== '')
        document.querySelector("#parametres .inputSelect").innerHTML += '<hr class="my-4">';
} 
function affichageOptionPoint(param) {
    var contentOption = '';
    if(param == 'point' && objects.length > 0) {
        contentOption +=    
        `<div class="row g-3 my-1">
            <div class="col">
                <label for="object-base" class="param-label col-form-label">Basé sur :</label>
            </div>
            <div class="col">            
            <select class="form-select" id="object-base" multiple>
            <option value="">Choisir Object </option>`;
        objects.forEach((val,index) => {
            switch (val.type) {
                case 'point':
                    contentOption += `<option value="${index}">point-${val.object.name}-${val.object.id}</option>`
                    break;
                case 'slider':
                    contentOption += `<option value="${index}">slider-${val.object.name}-${val.object.id}</option>`
                    break;
            }
        });
        contentOption += `</select> </div></div>`;
    }
    return contentOption; 
}
function affichageParametresWindow(parametres){
    
    var contentForm = '';
    contentForm = affichageOptionPoint(parametres[0]);
   
    parametres.forEach((param) => {
      switch (param.type) {
        case 'coord':
                contentForm +=
                `<div class="row mb-3">
                    <label for="x-coord" class="col">${param.attribute}:</label>
                    <input type="text" placeholder="entre premier coord..." class="form-control col me-1" id="${param.attribute}nw" value="" required="required">
                    <input type="text" placeholder="entre deuxieme coord..." class="form-control col" id="${param.attribute}pw" value="" required="required">
                </div>` ;
            break;
        case 'number':
            contentForm +=
            `<div class="row mb-3">
                <label for="x-coord" class="col">${param.attribute}:</label>
                <input type="number" step="0.01" placeholder="entre premier coord..." class="form-control col me-1" id="${param.attribute}nw" value="" required="required">
                <input type="number" step="0.01" placeholder="entre deuxieme coord..." class="form-control col" id="${param.attribute}pw" value="" required="required">
            </div>` ;
        break;
        case 'numberWin':
            contentForm +=
            `<div class="row g-3 my-1">
                <div class="col">
                    <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                </div>
                <div class="col">
                    <input type="number" step="0.01" id="${param.attribute}w" class="form-control" value="" required="required">
                </div>
            </div>` ;
        break;
        case 'text':
            contentForm += 
                `<div class="row g-3 my-1">
                    <label for="${param.attribute}" class="col">${param.attribute}:</label>
                    <input type="text" class="form-control col me-1" id="${param.attribute}w">
                </div>`
            break;
        default:
            break;
      }
    });
    $(".modal-body form").html(contentForm + `
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-success" id="create${parametres[0]}">Create</button>
        </div>`);
}
function handleFormWindow() {
    $('.modal-body form').on('submit', function(event) {
        event.preventDefault();
        var button = $(this).attr('data-button');
        switch (button) {
            case 'Point':
                creationPointFactory();
                break;
            case 'slider':
                creationSliderFactory();
                break;
            default:
                break;
        }
    });
}
$(".objetcs-five-grid button").on("click", function(event){ 
    var button = event.delegateTarget.innerHTML;
    switch (button) {
        case 'Point':
            affichageParametresWindow(getParamsPoint(null));
            break;
        case 'slider':
            affichageParametresWindow(getParamsSlider(null));
            break;
        default:
            alert('no handling');
            break;
    }
    $('.modal-body form').attr('data-button', button);
});
handleFormWindow();
/*
* ******************************* *********************** Partie Graphe ******************** **************************
*/
var board = JXG.JSXGraph.initBoard('box', 
            {pan: 
                {enabled:false},
                boundingbox: [-15, 15, 15, -15], 
                axis:false,
                showNavigation:false,
                showCopyright:false
});
board.renderer.container.style.backgroundColor = "#ffffff";
function getParamsGraph() {
    return ['graph',
    {type:'number', attribute: "coordX", value: [Math.round(board.getBoundingBox()[0]),Math.round(board.getBoundingBox()[1])]},
    {type:'number', attribute: "coordY", value: [Math.round(board.getBoundingBox()[3]),Math.round(board.getBoundingBox()[2])]},
    {type:'color', attribute: "color-fond", value: rgbToHex(
        board.renderer.container.style.backgroundColor)},
    {type:'checkbox', attribute: "hide-xaxis", value: xaxis.getAttribute('visible')},
    {type:'checkbox', attribute: "hide-yaxis", value: yaxis.getAttribute('visible')},
    {type:'checkbox', attribute: "hide-xTickets", value: xaxis.getAttribute('ticks').visible},
    {type:'checkbox', attribute: "hide-yTickets", value: yaxis.getAttribute('ticks').visible},
    {type:'checkbox', attribute: "hide-grid", value: grid.getAttribute('visible')},
   ]
}
function gestionParametresGraphe(){
    

    // les inputs of bounbox
    var coordXNegative = $("#coordXn");
    var coordXPositive = $("#coordXp");
    var coordYNegative = $("#coordYn");
    var coordYPositive = $("#coordYp");
    
    // traitement les valeurs de boundbox
    
    var xNegative = parseFloat(coordXNegative.val());
    var xPositive = parseFloat(coordXPositive.val());
    var yNegative = parseFloat(coordYNegative.val());
    var yPositive = parseFloat(coordYPositive.val());
    
    coordXNegative.on("change", function(){
        xNegative = parseFloat(coordXNegative.val()) ;
        board.setBoundingBox([xNegative, xPositive, yPositive, yNegative]);
    });
    coordXPositive.on("change", function(){
        xPositive =parseFloat(coordXPositive.val()) ;
        board.setBoundingBox([xNegative, xPositive, yPositive, yNegative]);
    });
    coordYNegative.on("change", function(){
        yNegative = parseFloat(coordYNegative.val()) ;
        board.setBoundingBox([xNegative, xPositive, yPositive, yNegative]);
    });
    coordYPositive.on("change", function(){
        yPositive = parseFloat(coordYPositive.val()) ;
        board.setBoundingBox([xNegative, xPositive, yPositive, yNegative]);
    });
    
    // gestion les attributs boolean checkbox
    
    $('#hide-grid').on("change", function(){
        grid.setAttribute({visible: !grid.getAttribute('visible')});
    });
    $('#hide-xaxis').on("change", function(){
        xaxis.setAttribute({visible: !xaxis.getAttribute('visible')});
        var chekVal = $('#hide-xTickets').prop('checked');
        if (chekVal !== xaxis.getAttribute('visible'))
            $('#hide-xTickets').click();
    });
    $('#hide-yaxis').on("change", function(){
        yaxis.setAttribute({visible: !yaxis.getAttribute('visible')});
        var chekVal = $('#hide-yTickets').prop('checked');
        if (chekVal !== yaxis.getAttribute('visible'))
        $('#hide-yTickets').click();
    });
    $('#hide-xTickets').on("change", function(){
        xaxis.setAttribute({ticks :{visible: !xaxis.getAttribute('ticks').visible}});
    });
    $('#hide-yTickets').on("change", function(){
        yaxis.setAttribute({ticks :{visible: !yaxis.getAttribute('ticks').visible}});
    });
    // gestion color
    $('#color-fond').on("change", function(){
        board.renderer.container.style.backgroundColor= $('#color-fond').val();
    });
}
board.on("down", function() {
    if (!isAxisClicked) {
        affichageParametres(getParamsGraph());
        gestionParametresGraphe();
    }
    isAxisClicked = false;
});
/*
* ******************************* ******************* Partie Axes & Grid ******************** **************************
*/
var xaxis = board.create('axis', [[0, 0], [1,0]], 
		  { name:'x', 
			withLabel: true, 
			label: {
                fontSize : 15,
                position: 'rt',  
				offset: [-15, 20],
			 },
            ticks: {
                visible: true,
            }
			});
var yaxis = board.create('axis', [[0, 0], [0, 1]], 
		  { name:'y',
			withLabel: true, 
			label: {
              fontSize : 15,
			  position: 'lrt',  
			  offset: [-20, 0],
			},
            ticks: {
                visible: true,
            }
			});	
var grid = board.create('grid', []);
function getParamsAxe(axi){
    return [
    {type:'numberSize', attribute: "size-axe", value: axi.getAttribute('strokeWidth') },
    {type:'text', attribute: "label-axe", value: axi.name},
    {type:'numberSize', attribute: "size-label", value: axi.getAttribute('label').fontsize},
    {type:'select', attribute: "border-style", value: ["solid line#0","dotted line#1","smalle dash#2","medium dash#3","big dashes#4","small gaps#5","large gaps#6"]},
    {type:'color', attribute: "color-axe", value: axi.getAttribute('strokeColor')},
    {type:'color', attribute: "color-label", value: axi.getAttribute('label').strokecolor},
    {type:'checkbox', attribute: "hide-label",value: axi.getAttribute('withLabel')},
    ]
};
function gestionParametresAxes(axis){

    $("#label-axe").on("change",function(){
        axis.setAttribute({name : $("#label-axe").val()});
    });
    $("#hide-label").on("change",function(){
        axis.setAttribute({withLabel : $("#hide-label").prop('checked')});
    });
    $("#size-axe").on("change",function(){
        axis.setAttribute({strokeWidth : $("#size-axe").val()});
    });
    $("#color-axe").on("change",function(){
        axis.setAttribute({strokeColor: $("#color-axe").val()});
    });
    $("#border-style").on("change",function(){
        axis.setAttribute({dash: $("#border-style").val()});
    });
    $("#size-label").on("change",function(){
        axis.setAttribute({label: {fontsize: $("#size-label").val()}});
    });
    $("#color-label").on("change",function(){
        axis.setAttribute({label: {strokecolor: $("#color-label").val()}});
    });
}
xaxis.on('down',function(){
    isAxisClicked = true;
    affichageParametres(getParamsAxe(xaxis));
    gestionParametresAxes(xaxis);
});
yaxis.on('down',function(){
    isAxisClicked = true;
    affichageParametres(getParamsAxe(yaxis));
    gestionParametresAxes(yaxis);
});
/*
* ******************************* ******************* Partie Point ******************** **************************
*/

function isValidExpression(coordX, coordY) {
    var regex = /^\s*\(*\s*(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|[0-9]+(\.[0-9]+)?)(\s*[+\-%/*]\s*\(*\s*(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|[0-9]+(\.[0-9]+)?)\s*\)*)*\s*$/;
    return regex.test(coordX) && regex.test(coordY);
}
function getParamsPoint(point,bool=null){
    console.log(bool);
    return ['point',
        {type: ((objects.length > 0 && bool == null) || bool) ?'coord': 'number', attribute: "coord", value: point !== null ? point.coords.usrCoords.slice(1) : 0},
        {type:'numberSize', attribute: "size-point", value: point !== null ? point.getAttribute('size') : 0},
        {type:'numberSize', attribute: "opacity-point", value: point !== null ? point.getAttribute('opacity') * 100: 0},
        {type:'text', attribute: "label-point", value: point !== null ? point.name : 0},
        {type:'numberSize', attribute: "size-label", value: point !== null ? point.getAttribute('label').fontsize : 0},
        {type:'select', attribute: "style-point", value: ["cross#x","circle#o","plus#+","minus#-","square#[]","diamond#<>"]},
        {type:'color', attribute: "color-point", value: point !== null ? point.getAttribute('color') : 0},
        {type:'color', attribute: "color-label", value: point !== null ? point.getAttribute('label').strokecolor : 0},
        {type:'checkbox', attribute: "fixed",value: point !== null ? point.getAttribute('fixed') : 0},
        {type:'checkbox', attribute: "trace",value: point !== null ? point.getAttribute('trace') : 0},
    ];
}
function gestionParametresPoint(point){

    $("#coordn").on("change",function(){
        point.setPosition(JXG.COORDS_BY_USER, [parseFloat($("#coordn").val()),point.coords.usrCoords[2]]);
        board.update();
    });
    $("#coordp").on("change",function(){
        point.setPosition(JXG.COORDS_BY_USER, [point.coords.usrCoords[1],parseFloat($("#coordp").val())]);
        board.update();
    });
    $("#size-point").on("change",function(){
        point.setAttribute({size : $("#size-point").val()});
    });
    $("#opacity-point").on("change",function(){
        console.log("here opacity");
        point.setAttribute({opacity : parseFloat($("#opacity-point").val()) / 100});
    });
    $("#label-point").on("change",function(){
        point.setAttribute({name : $("#label-point").val()});
    });
    $("#size-label").on("change",function(){
        point.setAttribute({label: {fontsize :parseInt($("#size-label").val())}});
    });
    $("#style-point").on("change",function(){
        point.setAttribute({face: $("#style-point").val()});
    });
    $("#color-point").on("change",function(){
        point.setAttribute({color: $("#color-point").val()});
    });
    $("#color-label").on("change",function(){
        point.setAttribute({label: {strokecolor: $("#color-label").val()}});
    });
    $("#fixed").on("change",function(){
        point.setAttribute({fixed: !point.getAttribute("fixed")});
    });
    $("#trace").on("change",function(){
        point.setAttribute({trace: !point.getAttribute("trace")});
    });

}
function handlePointDrag(point){
    point.on("drag",function(){
        $("#coordn").val(point.coords.usrCoords[1]);
        $("#coordp").val(point.coords.usrCoords[2]);
    })
}
function handlePointDown(point,bool){
    point.on("down",function(){
        isAxisClicked = true;
        affichageParametres(getParamsPoint(point,bool));
        gestionParametresPoint(point);
    });
}
function callFunctionPoint(point,bool,base=null) {
    handlePointDrag(point);
    handlePointDown(point,bool);
    objects.push({type : 'point', object: point, base:base});
    $('#windowModal').modal('hide');
    affichageParametres(getParamsPoint(point,bool));
    gestionParametresPoint(point);
}
function createPoint(coordX, coordY, label){
    
    var pointAttributes = {
        size: 4,
        color: '#000000',
        fixed : false,
        trace : false,
        opacity : 1,
        label: {
            fontSize: 15,
            color: '#000000',
        },
        id : 'p'+ ++cmpPoint
    };

    if (label !== '') {
        pointAttributes.name = label;
    }

    return board.create('point',[coordX,coordY],pointAttributes);
}
function isValideExpr(usedIds,expr) {
    var match;
    var validX = true;
    var validY = true;
    var idRegex = /[ps][0-9]+/g; 
  
    while ((match = idRegex.exec(expr)) !== null) {
      var id = match[0];
      if (!usedIds.includes(id)) {
        validX = false;
        break;
      }
        
      if (id.startsWith('p') && !match.input.substr(match.index + id.length).startsWith('.x') && !match.input.substr(match.index + id.length).startsWith('.y')) {
        validX = false;
        break;
      }
      else if (id.startsWith('s') && (match.input.substr(match.index + id.length).startsWith('.y') || match.input.substr(match.index + id.length).startsWith('.x'))) {
        validY = false;
        break;
      }
    }
    return (validX && validY)
}  
  function isValideIdExpresion(indices,coordX,coordY) {
  
    var usedIds=[];
  
    indices.forEach(function(index) {
      usedIds.push(objects[index].object.id);
    });
  
    return isValideExpr(usedIds,coordX) && isValideExpr(usedIds,coordY)
}
function transformExpression(expr, ids,indexMap) {
    var transformedExpr = expr;
    
    for (var i = 0; i < ids.length; i++) {
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.x\\b", 'g'), "objects[" + indexMap[ids[i]] + "].object.X()");
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.y\\b", 'g'), "objects[" + indexMap[ids[i]] + "].object.Y()");
        
        if (ids[i].startsWith('s')) {
            transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\b", 'g'), "objects[" + indexMap[ids[i]] + "].object.Value()");
        }
    }
    return transformedExpr;
}
function creationPointFactory() {

    var objetIndex = $('#object-base').val();
    var coordX = $('#coordnw').val();
    var coordY = $('#coordpw').val();
    var label =  $('#label-pointw').val();
    
    if (($('#object-base').length == 0) || (objetIndex.length == 0 && !isNaN(coordX)  && !isNaN(coordY))) { // for first object point : isNaN(objetIndex)
        var point = createPoint(parseFloat(coordX), parseFloat(coordY), label);
        callFunctionPoint(point,false);
    }
    else if (objetIndex.length > 0  && isValidExpression(coordX,coordY) && isValideIdExpresion(objetIndex,coordX,coordY)){
        var Ids= [];
        var indexMap= {};

        objetIndex.forEach(function(index) {
            indexMap[objects[index].object.id] = index;
        });
        objetIndex.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
        var f = function (expr) {return new Function("return " + expr + ";");}

        var point = createPoint(
            f(transformExpression(coordX,Ids,indexMap)),
            f(transformExpression(coordY,Ids,indexMap)),label);
        callFunctionPoint(point,true,{ids:Ids,coordX : coordX, coordY: coordY});
    }

    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit !");
    }
}
/*
* ******************************* ******************* Partie SLIDER ******************** **************************
*/
function getParamsSlider(slider = null){
    return ['slider',
        {type:'number', attribute: "coordX", value: slider ? slider.point1.coords.usrCoords.slice(1) :0},
        {type:'number', attribute: "coordY", value: slider ? slider.point2.coords.usrCoords.slice(1) :0},
        {type:'numberWin', attribute: "min-value", value: 0},
        {type:'numberWin', attribute: "max-value", value: 0},
        {type:slider ? 'numberSize': 'numberWin', attribute: "pas-value", value:slider ? slider.getAttribute('snapWidth'):0},
        {type:'color', attribute: "color-slider", value:slider ? slider.getAttribute('fillColor') : 0},
        {type:'color', attribute: "color-baseline", value:slider ? slider.baseline.getAttribute('strokecolor') :0 },
        {type:'color', attribute: "color-highline", value:slider ? slider.highline.getAttribute('strokecolor') : 0},
        {type:'text', attribute: "label-slider", value:slider ? slider.name : 0},
        {type:'numberSize', attribute: "label-size", value:slider ? slider.label.getAttribute('fontsize'): 0},
        {type:'color', attribute: "color-label", value:slider ? slider.label.getAttribute('strokecolor') : 0},
        {type:'text', attribute: "label-postfix", value:slider ? slider.getAttribute('postLabel') : 0},
        {type:'checkbox', attribute: "hide-slider", value:slider ? !slider.getAttribute('visible'): 0},
        {type:'checkbox', attribute: "fixed", value:slider ? slider.getAttribute('point1').fixed: 0},
    ];
}
function gestionParametresSlider(slider){

    $("#coordXn").on("change", function(){
        xNegative = parseFloat($("#coordXn").val()) ;
        slider.point1.setPositionDirectly(JXG.COORDS_BY_USER, [xNegative, (slider.point1.coords.usrCoords)[2]]);
        board.update();
    });
    $("#coordXp").on("change", function(){
        xPositive =parseFloat($("#coordXp").val()) ;
        slider.point1.setPositionDirectly(JXG.COORDS_BY_USER, [(slider.point1.coords.usrCoords)[1], xPositive]);
        board.update();
    });
    $("#coordYn").on("change", function(){
        yNegative = parseFloat($("#coordYn").val()) ;
        slider.point2.setPositionDirectly(JXG.COORDS_BY_USER, [yNegative, (slider.point2.coords.usrCoords)[2]]);
        board.update();
    });
    $("#coordYp").on("change", function(){
        yPositive = parseFloat($("#coordYp").val()) ;
        slider.point2.setPositionDirectly(JXG.COORDS_BY_USER, [(slider.point2.coords.usrCoords)[1], yPositive]);
        board.update();
    });
    $("#pas-value").on("change",function(){
        slider.setAttribute({snapWidth: parseFloat($("#pas-value").val())});
    });
    $("#label-slider").on("change",function(){
        slider.setAttribute({name: $("#label-slider").val()});
    });
    $("#color-slider").on("change",function(){
        slider.setAttribute({fillColor: $("#color-slider").val()});
    });
    $("#color-baseline").on("change",function(){
        slider.setAttribute({baseline: {strokeColor: $("#color-baseline").val()}});
    });
    $("#color-highline").on("change",function(){
        slider.setAttribute({highline: {strokeColor:  $("#color-highline").val()}});
    });
    $("#label-size").on("change",function(){
        slider.setAttribute({label: {fontSize: parseFloat($("#label-size").val())}});
    });
    $("#color-label").on("change",function(){
        slider.setAttribute({label: {strokeColor: $("#color-label").val()}});
    });
    $("#label-postfix").on("change",function(){
        slider.setAttribute({postLabel:  $('#label-postfix').val()});
    });
    $("#hide-slider").on("change",function(){
        slider.setAttribute({visible: !slider.getAttribute("visible")});
    });
    $("#fixed").on("change",function(){
        slider.setAttribute({point1: {fixed: !slider.getAttribute('point1').fixed},
                            point2: {fixed: !slider.getAttribute('point2').fixed},
                            baseline: {fixed: !slider.getAttribute('baseline').fixed}});
    });
}
function handleSliderDrag(slider){
    slider.on("drag",function(){
       /* $("#coordXn").val(slider.point1.coords.usrCoords[1]);
        $("#coordXp").val(slider.point1.coords.usrCoords[2]);
        $("#coordYn").val(slider.point2.coords.usrCoords[1]);
        $("#coordYp").val(slider.point2.coords.usrCoords[2]);*/
    })
}
function handleSliderDown(slider){
    slider.on("down",function(){
        isAxisClicked = true;
        affichageParametres(getParamsSlider(slider));
        gestionParametresSlider(slider);
    });
}
function callFunctionSlider(slider) {
    handleSliderDrag(slider);
    handleSliderDown(slider);
    objects.push({type : 'slider', object: slider});
    $('#windowModal').modal('hide');
    affichageParametres(getParamsSlider(slider));
    gestionParametresSlider(slider);
    
}
function creationSliderFactory() {

    var s = board.create('slider',[[parseFloat($('#coordXnw').val()),parseFloat($('#coordXpw').val())],
            [parseFloat($('#coordYnw').val()),parseFloat($('#coordYpw').val())],
            [parseFloat($('#min-valuew').val()),1,parseFloat($('#max-valuew').val())]], 
            {
                id : 's'+ ++cmpSlider,
                visible : true,
                snapWidth : parseFloat($('#pas-valuew').val()),
                name : $('#label-sliderw').val(),
                point1: {fixed: true},
                point2: {fixed: true},
                baseline: {strokecolor: '#000000', fixed: true, needsRegularUpdate: true},
                highline: {strokecolor: '#000000',},
                fillColor: '#000000',
                label: {fontsize: 20, strokecolor: '#000000'},
                postLabel:  $('#label-postfixw').val(),
            });
    callFunctionSlider(s)
}
/*
* ******************************* ******************* Partie Buttons ******************** **************************
*/
function getAxiCode(axiObje,typeAxe){
    var jsCode;
    
    jsCode= ` var ${typeAxe} = board.create('axis', `;
    typeAxe=='yaxis' ? jsCode += `[[0, 0], [0,1]],` :  jsCode+= `[[0, 0], [1,0]],`;

    jsCode += `{name:'${axiObje.name}', 
    dash : ${axiObje.getAttribute('dash')},
    strokeColor : "${axiObje.getAttribute('strokecolor')}",
    visible : ${axiObje.getAttribute('visible')},
    withLabel: ${axiObje.getAttribute('withLabel')}, 
    strokeWidth : ${axiObje.getAttribute('strokeWidth')},

    label: {
        fontSize : ${axiObje.getAttribute('label').fontsize},
        strokecolor : "${axiObje.getAttribute('label').strokecolor}",
        position: 'rt',  
        offset: [-15, 20],
    },
    ticks: {
        visible: ${axiObje.getAttribute('ticks').visible},
    }
    });\n`
    return jsCode;
}
function getSliderCode(slider){
    const pointCoordsA = slider.point1.coords.usrCoords.slice(1);
    const pointCoordsB = slider.point2.coords.usrCoords.slice(1);
    var jsCode;

    jsCode = `const slider_${slider.id} = board.create('slider', [[${pointCoordsA[0]},${pointCoordsA[1]}],
        [${pointCoordsB[0]},${pointCoordsB[1]}],[${slider._smin},1,${slider._smax}]]
        ,{  visible : ${slider.getAttribute('visible')},
            snapWidth : ${slider.getAttribute('snapWidth')},
            name : '${slider.name}',
            point1: {fixed: ${slider.getAttribute('point1').fixed},},
            point2: {fixed: ${slider.getAttribute('point2').fixed},},
            baseline: {
                strokeColor: '${slider.baseline.getAttribute('strokeColor')}',
                fixed: ${slider.getAttribute('baseline').fixed}, needsRegularUpdate: true
            },
            fillColor: '${slider.getAttribute('fillColor')}',
            highline: {strokeColor: '${slider.highline.getAttribute('strokeColor')}'},
            label: {
                fontSize: ${slider.label.getAttribute('fontsize')},
                strokeColor: '${slider.label.getAttribute('strokeColor')}',
            },
            postLabel: '${slider.getAttribute('postLabel')}',
        });\n`
        return jsCode;
}
function transformExpressionVisualiser(expr,ids){
    var transformedExpr = expr;
    for (var i = 0; i < ids.length; i++) {
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.x\\b", 'g'), "point_"+ids[i]+".X()");
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.y\\b", 'g'), "point_"+ids[i]+".Y()");
        if (ids[i].startsWith('s')) {
            transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\b", 'g'), "slider_"+ids[i]+".Value()");
        }
    }
    return transformedExpr;
}
function getPointCode(point,base) {
    var coordX;
    var coordY;

    if (base == null){
        const pointCoords = point.coords.usrCoords.slice(1);
        coordX = pointCoords[0];
        coordY = pointCoords[1];
    }
    else{
        coordX = `function(){return ${transformExpressionVisualiser(base.coordX,base.ids)};}`
        coordY = `function(){return ${transformExpressionVisualiser(base.coordY,base.ids)};}`
    }

    var jsCode;
    jsCode = `const point_${point.id} = board.create('point', [${coordX}, ${coordY}],
        { 
            face :  '${point.getAttribute('face')}',
            size: ${point.getAttribute('size')},   
            name: '${point.name}', 
            color: '${point.getAttribute('color')}', 
            fixed : ${point.getAttribute('fixed')},
            trace : ${point.getAttribute('trace')},
            opacity : ${point.getAttribute('opacity')},
            label: {
                fontSize: ${point.getAttribute('label').fontsize}, 
                color: '${point.getAttribute('label').strokecolor}',
            }
        });\n`;
        return jsCode
}
$("#visualiser").on("click",function(){
    var htmlCode = `&lt;!DOCTYPE html&gt;
    &lt;html lang="en"&gt;
      &lt;head&gt;
          &lt;meta charset="UTF-8"&gt;
          &lt;!-------------------------------------------- SECTION JSXGRAPH -------------------------------------------------&gt;
          &lt;link rel="stylesheet" type="text/css" href="https://jsxgraph.org/distrib/jsxgraph.css" /&gt;
          &lt;script type="text/javascript" src="https://jsxgraph.org/distrib/jsxgraphcore.js"&gt;&lt;/script&gt;
          &lt;title&gt;Editor&lt;/title&gt;
      &lt;/head&gt;
      &lt;body&gt;
          &lt;div id="box" &gt; &lt;/div &gt;
      &lt;/body&gt;
    &lt;/html&gt;`;
    
    var cssCode = `#box { 
        width: 800px; 
        height: 800px; 
        border : 5px solid black 
    }`;
    var jsCode = `
        var board = JXG.JSXGraph.initBoard('box', {
        pan: {enabled:false},
        boundingbox: [${board.getBoundingBox()}], 
        axis:false,
        showNavigation:false,
        showCopyright:false
        });\n 
        board.renderer.container.style.backgroundColor = "${rgbToHex(board.renderer.container.style.backgroundColor)}";\n`

    jsCode += getAxiCode(xaxis,'axix');
    jsCode += getAxiCode(yaxis,'yaxis');
    jsCode += `var grid = board.create('grid', [],{ visible:${grid.getAttribute('visible')}});\n`;

    objects.forEach((obj) => {
        switch (obj.type) {
            case 'point':
                jsCode += getPointCode(obj.object, obj.base);
                break;
            case 'slider':
                jsCode += getSliderCode(obj.object);
                break;
        }
    })
    const newWindow = window.open();
      newWindow.document.write(`
      <h2>HTML</h2>
      <pre>${htmlCode}</pre>
      <h2>CSS</h2>
      <pre>${cssCode}</pre>
      <h2>JS</h2>
      <pre>${jsCode}</pre>
    `);
});
$("#reinitialiser").on('click', function(){
    board.setBoundingBox([-10, 10, 10, -10]); 
});
/*
* ******************************* ******************* Partie afficher des load ***************** *********************
*/
affichageParametres(getParamsGraph());
gestionParametresGraphe();