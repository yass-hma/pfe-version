/*
* ******************************* *********************** Partie Global ******************** **************************
*/
var objects = [];
var isClicked = false; // c pour controler la gestion events objects 
var cmpPoint = 0;
var cmpSlider = 0;
var cmpFunction = 0;
var cmpLine = 0;

function rgbToHex(rgb) {
    var rgbValues = rgb.match(/\d+/g).map(Number); // récupère les valeurs r, g, b
    var hex = rgbValues.map(value => value.toString(16).padStart(2, '0')).join(''); // les convertit en hexadécimal
    return '#' + hex;
}
function isValideExprFunctionGraph(expression) {
    var lastChar = expression.slice(-1);
    var operators = ['+', '*', '/', '%'];

    if (operators.includes(lastChar)) {
        return false;
    }

    var invalidRegex = /([0-9][a-zA-Z])|([-+*/%]{2})|([-+*/%]$)|([^a-zA-Z0-9_*+\-/%().])|(^[^a-zA-Z0-9_*+\-/%().])|(^|[^0-9]),|,(?![0-9])/;
    if (invalidRegex.test(expression.replace(/\s/g, ''))) {
        return false;
    }

    var regex = /^\s*\(*\s*(-)?(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|Math\.[a-zA-Z]+(\(-?[a-zA-Z0-9]*\))?\s*|[a-zA-Z]|[0-9]+(\.[0-9]+)?)(\s*[+\-%/*]\s*\(*\s*(-)?(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|Math\.[a-zA-Z]+(\(-?[a-zA-Z0-9]*\))?\s*|[a-zA-Z]|[0-9]+(\.[0-9]+)?)\s*\)*)*\s*$/;
    if (!regex.test(expression)) {
        return false;
    }

    var parentheses = 0;
    for (var i = 0; i < expression.length; i++) {
        var char = expression[i];
        if (char === '(') {
            parentheses++;
        } else if (char === ')') {
            parentheses--;
            if (parentheses < 0) {
                return false;
            }
        }
    }
    return parentheses === 0;
}
function isValidExpressionObject(coord) {
    var regex = /^\s*\(*\s*(-)?(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|[0-9]+(\.[0-9]+)?)(\s*[+\-%/*]\s*\(*\s*(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|[0-9]+(\.[0-9]+)?)\s*\)*)*\s*$/;
    return regex.test(coord);
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
function isValideIdObjectExpresion(indices,coord) {
  
    var usedIds=[];
  
    indices.forEach(function(index) {
      usedIds.push(objects[index].object.id);
    });
  
    return isValideExpr(usedIds,coord)
}
$('#windowModal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
});
function updateButton(button,type){
    var eyeIcon = button.find('i');
    if(type === 'eyes'){
    if (eyeIcon.hasClass('bi-eye-fill')) {
        eyeIcon.removeClass('bi-eye-fill');
        eyeIcon.addClass('bi-eye-slash-fill');
    } else {
        eyeIcon.removeClass('bi-eye-slash-fill');
        eyeIcon.addClass('bi-eye-fill');
    }}
    else{
        if (eyeIcon.hasClass('bi-unlock-fill')) {
            eyeIcon.removeClass('bi-unlock-fill')
            eyeIcon.addClass('bi-lock-fill');
        } else {
            eyeIcon.removeClass('bi-lock-fill');
            eyeIcon.addClass('bi-unlock-fill')
        }
    }
}
function gestionShareAttribute(object) {
    $("#hide-label").on("click",function(){
        updateButton($("#hide-label"),'eyes');
        object.setAttribute({withLabel : !object.getAttribute("withLabel")});
    });
    $("#label").on("change",function(){
      object.setAttribute({name : $("#label").val()});
    });
    $("#size-label").on("change",function(){
      object.setAttribute({label: {fontSize: parseFloat($("#size-label").val())}});
  });
    $("#color-label").on("change",function(){
      object.setAttribute({label: {strokecolor: $("#color-label").val()}});
    });
    $("#fixed").on("click",function(){
        updateButton($("#fixed"),'lock');
        object.setAttribute({fixed: !object.getAttribute("fixed")});
    });
    $("#hide").on("click",function(){
        updateButton($("#hide"),'eyes');
        object.setAttribute({visible: !object.getAttribute("visible")});
    });
    $("#color-object").on("change",function(){
        object.setAttribute({strokeColor: $("#color-object").val()});
    });
    $("#size-object").on("change",function(){
        object.setAttribute({strokeWidth: parseFloat($("#size-object").val())});
    });
    $("#style").on("change",function(){
        object.setAttribute({dash: $("#style").val()});
    });
}
function affichageObjectParametres(){
    var inputobject = '';
    objects.forEach((obj) => {
        inputobject += 
        `<div class="row my-1">
        <div class="d-flex justify-content-between">
            <label class="form-check-label param-label flex-item" for="same-address">${obj.type}_${obj.object.id} :</label>
            <div>    
                <button type="button" class="btn btn-secondary eye-toggle" id="eye-${obj.object.id}">
                    <i class="bi ` ;
                    obj.object.getAttribute('visible') == true ? inputobject += 'bi-eye-fill' : inputobject += 'bi-eye-slash-fill';
                    inputobject += `"></i>
                </button>
                <button type="button" class="btn btn-secondary eye-toggle" id="trash-${obj.object.id}">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </div>
        </div></div>`
    });

    return inputobject;
}
function addEventsObjetcAction(){
    objects.forEach((obj,index) => {
        $(`#eye-${obj.object.id}`).on("click", function() {
            updateButton($(`#eye-${obj.object.id}`),'eyes')
            obj.object.setAttribute({visible :!obj.object.getAttribute('visible')});
        });

        $(`#trash-${obj.object.id}`).on("click", function() {
            obj.object.setAttribute({visible :!obj.object.getAttribute('visible')});
            board.removeObject(obj.object);
            objects.splice(index,1);
            affichageParametres(getParamsGraph());
        });
    });
}
function affichageParametres(parametres){
    
    var contentInput = '';
    
    parametres.forEach((param) => {
      switch (param.type) {
        case 'textarea':
                contentInput += 
                `<div class="mb-3">
                    <label for="${param.attribute}" class="form-label">Modification data</label>
                    <textarea class="form-control" id="${param.attribute}" rows="3"></textarea>
                </div>`
            break;
        case 'coord':
            if(!param.display) break;
            contentInput +=
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute} :</label>
                    </div>
                    <div class="col">
                        <input type=${param.for} id="${param.attribute}n" class="form-control" value="${(param.value)[0]}"`
                        param.for == 'text' ? contentInput += 'readonly' : contentInput += 'step="0.01"'
                        contentInput += `></div>
                    <div class="col">
                        <input type=${param.for} id="${param.attribute}p" class="form-control" value="${(param.value)[1]}"`
                        param.for == 'text' ? contentInput += 'readonly' : contentInput += 'step="0.01"'
                        contentInput += `></div></div>` ;
              if(param.last)
                contentInput += '<hr class="my-4">';
          break;
        case 'number':
            if(!param.display) break;
            contentInput +=
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>
                    <div class="col">
                        <input type="number" step="0.01" id="${param.attribute}" class="form-control" min=0 max=100 value="${param.value}">
                    </div>
                </div>` ;
                if(param.last)
                  contentInput += '<hr class="my-4">';
          break;
        case 'text':
          if (!param.display) break;
            contentInput+= 
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>
                    <div class="col">
                        <input type="text" id="${param.attribute}" class="form-control" value="${param.value}">
                    </div>
                </div>`
                if(param.last)
                  contentInput += '<hr class="my-4">';
          break;
        case 'select':
          contentInput += 
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>                    
                    <select class="form-select" id="${param.attribute}" >
                    <option value="">Choisir ${param.attribute} </option>`;
                        (param.value).forEach((val) => {
            contentInput += `<option value="${(val.split('#'))[1]}">${(val.split('#'))[0]}</option>`
                        });
            contentInput += `</select> </div>`;
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
        case 'color':
          contentInput +=
            `<div class="row g-3 my-1">
                <label for="ColorInput" class="param-label col">${ param.attribute} :</label>
                <input type="color" id="${param.attribute}" class="form-control form-control-color" value="${param.value}"> 
            </div>`
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
        case 'eyes':  
          contentInput += 
          `<div class="row my-1">
            <div class="d-flex justify-content-between">
            <label class="form-check-label param-label flex-item" for="same-address">${param.attribute} :</label>
                <button type="button" class="btn btn-secondary eye-toggle" id="${param.attribute}" >
                <i class="bi ` ;
                param.value == true ? contentInput += 'bi-eye-fill' : contentInput += 'bi-eye-slash-fill';
                contentInput += `"></i>
                </button>
            </div></div>`
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
          case 'lock': 
          contentInput += 
          `<div class="row my-1">
            <div class="d-flex justify-content-between">
            <label class="form-check-label param-label" for="same-address">${param.attribute} :</label>
                <button type="button" class="btn btn-secondary eye-toggle" id="${param.attribute}">
                <i class="bi ` ;
                param.value == true ? contentInput += 'bi-lock-fill' : contentInput += 'bi-unlock-fill';
                contentInput += `"></i>
                </button>
            </div></div>`
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
        default:
          break;
      }
    });
    if (parametres[0] == 'graph') 
        contentInput += affichageObjectParametres();
    $("#parametres .inputParametres").html(contentInput);
    addEventsObjetcAction();
} 
function affichageOptionObjects(param) {
    var contentOption = '';
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
            case 'functionGraph':
                if(param !== 'functionGraph') break;
                contentOption += `<option value="${index}">function-${val.object.id}</option>`
                break;
        }
    });
    contentOption += `</select> </div></div>`;
    return contentOption; 
}
function affichageParametresWindow(parametres){
    var contentForm = '';
    if(parametres[0] !== 'slider' && objects.length > 0)
        contentForm = affichageOptionObjects(parametres[0]);
   
    parametres.forEach((param) => {
      switch (param.type) {
        case 'coord':
                contentForm +=
                `<div class="row mb-3">
                    <label for="x-coord" class="col">${param.attribute}:</label>
                    <input type=${param.for} placeholder="entre premier coord..." class="form-control col me-1" id="${param.attribute}nw" value="" required="required">
                    <input type=${param.for} placeholder="entre deuxieme coord..." class="form-control col" id="${param.attribute}pw" value="" required="required">
                </div>` ;
            break;
        case 'number':
            if(!param.win) break;
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
                    <input type="text" class="form-control col me-1" id="${param.attribute}w"`
                if(param.required) contentForm += ` required`;
            contentForm +=`></div>`
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
            case 'Slider':
                creationSliderFactory();
                break;
            case 'Function':
                creationFunctionGraphFactory();
                break;
            case 'Line':
                creationLineFactory();
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
        case 'Slider':
            affichageParametresWindow(getParamsSlider(null));
            break;
        case 'Function':
            affichageParametresWindow(getParamsFunctionGraph(null));
            break;
        case 'Line':
            affichageParametresWindow(getParamsLine(null));
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
    {type:'coord', attribute: "coordX", value: [Math.round(board.getBoundingBox()[0]),Math.round(board.getBoundingBox()[1])], for: 'number', display : true},
    {type:'coord', attribute: "coordY", value: [Math.round(board.getBoundingBox()[3]),Math.round(board.getBoundingBox()[2])], for: 'number', last:true, display : true},
    {type:'color', attribute: "color-fond", value: rgbToHex(
        board.renderer.container.style.backgroundColor), last : true},
    {type:'eyes', attribute: "hide-xaxis", value: xaxis.getAttribute('visible')},
    {type:'eyes', attribute: "hide-yaxis", value: yaxis.getAttribute('visible')},
    {type:'eyes', attribute: "hide-xTickets", value: xaxis.getAttribute('ticks').visible},
    {type:'eyes', attribute: "hide-yTickets", value: yaxis.getAttribute('ticks').visible},
    {type:'eyes', attribute: "hide-grid", value: grid.getAttribute('visible'), last: true},
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
    $('#hide-grid').on("click", function(){
        updateButton($('#hide-grid'),'eyes')
        grid.setAttribute({visible: !grid.getAttribute('visible')});
    });
    $('#hide-xaxis').on("click", function(){
        updateButton($('#hide-xaxis'),'eyes')
        xaxis.setAttribute({visible: !xaxis.getAttribute('visible')});
        var chekVal = $('#hide-xTickets').find('i').hasClass('bi-eye-fill');
        if (chekVal !== xaxis.getAttribute('visible'))
            $('#hide-xTickets').click();
    });
    $('#hide-yaxis').on("click", function(){
        updateButton($('#hide-yaxis'),'eyes')
        yaxis.setAttribute({visible: !yaxis.getAttribute('visible')});
        var chekVal = $('#hide-yTickets').find('i').hasClass('bi-eye-fill');
        if (chekVal !== yaxis.getAttribute('visible'))
            $('#hide-yTickets').click();
    });
    $('#hide-xTickets').on("click", function(){
        updateButton($('#hide-xTickets'),'eyes')
        xaxis.setAttribute({ticks :{visible: !xaxis.getAttribute('ticks').visible}});
    });
    $('#hide-yTickets').on("click", function(){
        updateButton($('#hide-yTickets'),'eyes')
        yaxis.setAttribute({ticks :{visible: !yaxis.getAttribute('ticks').visible}});
    });
    // gestion color
    $('#color-fond').on("change", function(){
        board.renderer.container.style.backgroundColor= $('#color-fond').val();
    });
}
board.on("down", function() {
    if (!isClicked) {
        affichageParametres(getParamsGraph());
        gestionParametresGraphe();
    }
    isClicked = false;
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
    {type:'number', attribute: "size-object", value: axi.getAttribute('strokeWidth'), display : true},
    {type:'text', attribute: "label", value: axi.name, display: true},
    {type:'number', attribute: "size-label", value: axi.getAttribute('label').fontsize, last:true , display : true},
    {type:'select', attribute: "style", value: ["solid line#0","dotted line#1","smalle dash#2","medium dash#3","big dashes#4","small gaps#5","large gaps#6"], last:true},
    {type:'color', attribute: "color-object", value: axi.getAttribute('strokeColor')},
    {type:'color', attribute: "color-label", value: axi.getAttribute('label').strokecolor, last : true},
    {type:'eyes', attribute: "hide-label",value: axi.getAttribute('withLabel'),},
    ]
};
function gestionParametresAxes(axis){
    gestionShareAttribute(axis);
}
xaxis.on('down',function(){
    isClicked = true;
    affichageParametres(getParamsAxe(xaxis));
    gestionParametresAxes(xaxis);
});
yaxis.on('down',function(){
    isClicked = true;
    affichageParametres(getParamsAxe(yaxis));
    gestionParametresAxes(yaxis);
});
/*
* ******************************* ******************* Partie Point ******************** **************************
*/
function getParamsPoint(point,bool=null){
    return ['point',
        {type:'coord', attribute: "coord", value: point !== null ? point.coords.usrCoords.slice(1) : 0, for: ((objects.length > 0 && bool == null) || bool) ? 'text' : 'number', display : true},
        {type:'number', attribute: "size-point", value: point !== null ? point.getAttribute('size') : 0,  display : true},
        {type:'number', attribute: "opacity-point", value: point !== null ? point.getAttribute('opacity') * 100: 0,display : true },
        {type:'text', attribute: "label", value: point !== null ? point.name : 0, display: true},
        {type:'number', attribute: "size-label", value: point !== null ? point.label.getAttribute('fontsize') : 0, last: true ,display : true},
        {type:'select', attribute: "style-point", value: ["cross#x","circle#o","plus#+","minus#-","square#[]","diamond#<>"], last : true},
        {type:'color', attribute: "color-point", value: point !== null ? point.getAttribute('color') : 0},
        {type:'color', attribute: "color-label", value: point !== null ? point.getAttribute('label').strokecolor : 0, last :true},
        {type:'lock', attribute: "fixed",value: point !== null ? point.getAttribute('fixed') : 0},
        {type:'lock', attribute: "trace",value: point !== null ? point.getAttribute('trace') : 0, last: true},
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
        point.setAttribute({opacity : parseFloat($("#opacity-point").val()) / 100});
    });
    $("#style-point").on("change",function(){
        point.setAttribute({face: $("#style-point").val()});
    });
    $("#color-point").on("change",function(){
        point.setAttribute({color: $("#color-point").val()});
    });
    $("#trace").on("click",function(){
        updateButton($("#trace"),'lock')
        point.setAttribute({trace: !point.getAttribute("trace")});
    });
    gestionShareAttribute(point);
}
function handlePointDrag(point){
    point.on("drag",function(){
        $("#coordn").val(point.coords.usrCoords[1]);
        $("#coordp").val(point.coords.usrCoords[2]);
    })
}
function handlePointDown(point,bool){
    point.on("down",function(){
        isClicked = true;
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
function createPoint(coordX, coordY, label=null){
    
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
function creationCoordPoint(arrayIndexObjects, coord){
    var Ids= [];
    var indexMap= {};

    arrayIndexObjects.forEach(function(index) {
        indexMap[objects[index].object.id] = index;
    });
    arrayIndexObjects.forEach(function(index) {
        Ids.push(objects[index].object.id);
    });
    var f = function (expr) {return new Function("return " + expr + ";");}
    return f(transformExpression(coord,Ids,indexMap));
}
function creationPointFactory() {

    var arrayIndexObjects = $('#object-base').val();
    var coordX = $('#coordnw').val();
    var coordY = $('#coordpw').val();
    var label =  $('#labelw').val();
    
    if (($('#object-base').length == 0) || (arrayIndexObjects.length == 0 && !isNaN(coordX)  && !isNaN(coordY))) { // for first object point : isNaN(arrayIndexObjects)
        var point = createPoint(parseFloat(coordX), parseFloat(coordY), label);
        callFunctionPoint(point,false);
    }
    else if (arrayIndexObjects.length > 0  && isValidExpressionObject(coordX) && isValidExpressionObject(coordY) && 
        isValideIdObjectExpresion(arrayIndexObjects,coordX) &&  isValideIdObjectExpresion(arrayIndexObjects,coordY)){
        var Ids= [];

        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });

        var point = createPoint(creationCoordPoint(arrayIndexObjects,coordX),creationCoordPoint(arrayIndexObjects,coordY),label);

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
        {type:'coord', attribute: "coordX", value: slider ? slider.point1.coords.usrCoords.slice(1) :0, for: 'number', display : true},
        {type:'coord', attribute: "coordY", value: slider ? slider.point2.coords.usrCoords.slice(1) :0, for: 'number', display : true},
        {type:'number', attribute: "min-value", value: 0, win :true,},
        {type:'number', attribute: "max-value", value: 0, win: true},
        {type:'number', attribute: "pas-value", value:slider ? slider.getAttribute('snapWidth'):0, win:true, display:true},
        {type:'text', attribute: "label", value:slider ? slider.name : 0, display : true},
        {type:'number', attribute: "size-label", value:slider ? slider.label.getAttribute('fontsize'): 0, display : true},
        {type:'text', attribute: "label-postfix", value:slider ? slider.getAttribute('postLabel') : 0, last :true, display : true},
        {type:'color', attribute: "color-slider", value:slider ? slider.getAttribute('fillColor') : 0},
        {type:'color', attribute: "color-baseline", value:slider ? slider.baseline.getAttribute('strokecolor') :0 },
        {type:'color', attribute: "color-highline", value:slider ? slider.highline.getAttribute('strokecolor') : 0},
        {type:'color', attribute: "color-label", value:slider ? slider.label.getAttribute('strokecolor') : 0, last : true},
        {type:'eyes', attribute: "hide", value:slider ? slider.getAttribute('visible'): 0},
        {type:'lock', attribute: "fixe", value:slider ? slider.getAttribute('point1').fixed: 0},
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
    $("#color-slider").on("change",function(){
        slider.setAttribute({fillColor: $("#color-slider").val()});
    });
    $("#color-baseline").on("change",function(){
        slider.setAttribute({baseline: {strokeColor: $("#color-baseline").val()}});
    });
    $("#color-highline").on("change",function(){
        slider.setAttribute({highline: {strokeColor:  $("#color-highline").val()}});
    });
    $("#label-postfix").on("change",function(){
        slider.setAttribute({postLabel:  $('#label-postfix').val()});
    });
    $("#fixe").on("click",function(){
        updateButton($("#fixe"),'lock')
        slider.setAttribute({point1: {fixed: !slider.getAttribute('point1').fixed},
                            point2: {fixed: !slider.getAttribute('point2').fixed},
                            baseline: {fixed: !slider.getAttribute('baseline').fixed}});
    });
    gestionShareAttribute(slider);
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
        isClicked = true;
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
                name : $('#labelw').val(),
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
* ******************************* ******************* Partie functiongraphe *************** **************************
*/
function getParamsFunctionGraph(functionGraph) {
    return ['functionGraph',
        {type:'textarea', attribute: "modification-data"},
        {type:'text', attribute: "premier-arg", required : true},
        {type:'text', attribute: "deuxieme-arg"},
        {type:'text', attribute: "troisieme-arg"},
        {type:'text', attribute: "label", value : functionGraph ? functionGraph.name : 0, display : true},
        {type:'number', attribute: "size-label", value : functionGraph ? functionGraph.label.getAttribute('fontsize') : 0, display : true},
        {type:'number', attribute: "size-object", value : functionGraph ? functionGraph.getAttribute('strokewidth') : 0, display : true, last: true},
        {type:'color', attribute: "color-object", value : functionGraph ? functionGraph.getAttribute('strokecolor') : 0},
        {type:'color', attribute: "color-label", value : functionGraph ? functionGraph.getAttribute('label').strokecolor : 0, last :true},
        {type:'lock', attribute: "fixed", value:functionGraph ? functionGraph.getAttribute('fixed'): 0},
        {type:'eyes', attribute: "hide", value:functionGraph ? functionGraph.getAttribute('visible'): 0},
    ]
}
function exprToFonction(arrayIndexObjects,expr) {
    var variablePattern = /\b[a-z]\b|\([a-z]+\)/g;
    var match, variables = [],Ids= [];
    var indexMap= {};
    if($('#object-base').length !== 0){
        arrayIndexObjects.forEach(function(index) {
            indexMap[objects[index].object.id] = index;
        });
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }
    expr = transformExpression(expr,Ids,indexMap);
    while ((match = variablePattern.exec(expr)) !== null) {
        var variable = match[0].replace(/\(|\)/g, '');
        if (!variables.includes(variable)) {
            variables.push(variable);
        }
    }
    return new Function(...variables, `return ${expr};`);
}
function gestionParametresFunctionGraph(functionGraph){
    $("#modification-data").on("change",function(){
        try {
            functionGraph.updateDataArray = new Function($("#modification-data").val());
            board.update();
        } catch (error) {
            alert("erreur lors de modification")
        }
    });
   
    gestionShareAttribute(functionGraph);
}
function verificationExpreFunctionGrahp(arrayIndexObjects,arg) {
    var expr = null;
    if (!isNaN(arg))
        expr = parseFloat(arg);
    else if(isValideExprFunctionGraph(arg))
        expr = exprToFonction(arrayIndexObjects,arg);
    return expr;
}
function handleGraphDown(functionGraph){
    functionGraph.on('down',function(){
        isClicked = true;
        affichageParametres(getParamsFunctionGraph(functionGraph));
        gestionParametresFunctionGraph(functionGraph);
    });
}
function callFunctionGraph(functionGraph,coords) {
    //handleGraphDrag(functionGraph);
    handleGraphDown(functionGraph);
    objects.push({type :'functionGraph', object:functionGraph, coords: coords});
    $('#windowModal').modal('hide');
    affichageParametres(getParamsFunctionGraph(functionGraph));
    gestionParametresFunctionGraph(functionGraph);
}
function creationFunctionGraphFactory() {
    var functionGraph;
    var Ids= [];
    var arrayIndexObjects = $('#object-base').val();
    var arg1 = $('#premier-argw').val();
    var arg2 = $('#deuxieme-argw').val();
    var arg3 = $('#troisieme-argw').val();
    var name = $('#labelw').val();

    var coord1 = verificationExpreFunctionGrahp(arrayIndexObjects,arg1);
    arg2 === '' ?  coord2 = -10 : coord2 = verificationExpreFunctionGrahp(arrayIndexObjects,arg2);
    arg3 == '' ? coord3 = 10  : coord3 = verificationExpreFunctionGrahp(arrayIndexObjects,arg3);
    
    if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0){
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }
    if (!coord1 || !coord2 || !coord3)
        alert("Erreur : Merci de verifiez vos expressions!")
    else{ 
        try {
            functionGraph = board.create('functiongraph',[coord1,coord2,coord3],{id : 'f'+ ++cmpFunction, withLabel : true ,name: name});
            callFunctionGraph(functionGraph,{arg1,arg2,arg3,Ids});
        } catch (error) {
            alert("Erreur : Merci de verifiez vos expressions!")
        }
    }
}
/*
* ******************************* ******************* Partie Line ******************** **************************
*/
function getParamsLine(line){
    return ['line',
        {type:'coord', attribute: "point1", for: 'text'},
        {type:'coord', attribute: "point2", for: 'text'},
        {type:'number', attribute: "size-object", value : line ? line.getAttribute('strokewidth') : 0, display : true, last: true},
        {type:'number', attribute: "size-label", value : line ? line.label.getAttribute('fontsize') : 0, display : true},
        {type:'text', attribute: "label", value: line ? line.name : 0, display: true},
        {type:'select', attribute: "style", value: ["solid line#0","dotted line#1","smalle dash#2","medium dash#3","big dashes#4","small gaps#5","large gaps#6"], last:true},
        {type:'color', attribute: "color-object", value : line ? line.getAttribute('strokecolor') : 0},
        {type:'color', attribute: "color-label", value : line ? line.getAttribute('label').strokecolor : 0, last :true},
        {type:'eyes', attribute: "hide", value:line ? line.getAttribute('visible'): 0},
        {type:'lock', attribute: "fixed",value: line ? line.getAttribute('fixed') : 0},
        {type:'lock', attribute: "border-point1",value: line ? !line.getAttribute('straightfirst') : 0},
        {type:'lock', attribute: "border-point2",value: line ? !line.getAttribute('straightlast') : 0, last: true},

    ];  
}
function gestionParametresLine(line){
    $("#border-point1").on("click",function(){
        updateButton($("#border-point1"),'lock')
        line.setAttribute({straightFirst: !line.getAttribute("straightfirst")});
    });    
    $("#border-point2").on("click",function(){
        updateButton($("#border-point2"),'lock')
        line.setAttribute({straightLast: !line.getAttribute("straightlast")});
    });
    gestionShareAttribute(line);
}
function handleLineDown(line){
    line.on("down",function(){
        isClicked = true;
        affichageParametres(getParamsLine(line));
        gestionParametresLine(line);
    });
}
function callFunctionLine(line) {
    handleLineDown(line);
    objects.push({type : 'line', object: line});
    $('#windowModal').modal('hide');
    affichageParametres(getParamsLine(line));
    gestionParametresLine(line);
}
function createPointLine(arrayIndexObjects, point1x, point1y) {
    var point = null;
    var regex = /^p\d+$/;
    var Ids= [];
    if($("#object-base").length !== 0)
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });

    if (($('#object-base').length == 0) || (!isNaN(point1x)  && !isNaN(point1y))) { // for first object point : isNaN(arrayIndexObjects)
        point = [parseFloat(point1x), parseFloat(point1y)];
    }
    else if (arrayIndexObjects.length > 0  && isValidExpressionObject(point1x) && isValidExpressionObject(point1y) && 
        isValideIdObjectExpresion(arrayIndexObjects,point1x) &&  isValideIdObjectExpresion(arrayIndexObjects,point1y)){
    
        point = createPoint(creationCoordPoint(arrayIndexObjects,point1x),creationCoordPoint(arrayIndexObjects,point1y));
        callFunctionPoint(point,true,{ids:Ids,coordX : point1x, coordY: point1y});
        return point;
    }
    else if (arrayIndexObjects.length > 0 && regex.test(point1x) && regex.test(point1y) && point1x === point1y && Ids.includes(point1x))
    {
        for(var i = 0; i < arrayIndexObjects.length; i++) {
            var index = arrayIndexObjects[i];
            if (objects[index].object.id === point1x) {
                point = objects[index].object;
                break;
            }
        }  
    }
    return point; 
}
function creationLineFactory() {
    var point1, point2,line ;
    var arrayIndexObjects = $('#object-base').val();
    var point1x = $('#point1nw').val();
    var point1y = $('#point1pw').val();
    var point2x = $('#point2nw').val();
    var point2y = $('#point2pw').val();
    var label =  $('#labelw').val();
    
    point1 = createPointLine(arrayIndexObjects,point1x,point1y);
    point2 = createPointLine(arrayIndexObjects,point2x,point2y);
    if(point1 && point2){
        try {
            line = board.create('line',[point1,point2],{id : 'l'+ ++cmpLine, withLabel : true ,name : label});
            callFunctionLine(line);
        } catch (error) {
            alert("Erreur : Merci de verifier les expression que vous avez fournit!");
        }
    }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit!");
    } 
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
        fontSize : ${axiObje.label.getAttribute('fontsize')},
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
function transformExprePointVisualiser(expr,ids){
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
        coordX = `function(){return ${transformExprePointVisualiser(base.coordX,base.ids)};}`
        coordY = `function(){return ${transformExprePointVisualiser(base.coordY,base.ids)};}`
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
                fontSize: ${point.label.getAttribute('fontsize')}, 
                color: '${point.getAttribute('label').strokecolor}',
            }
        });\n`;
        return jsCode
}
function exprToFunctionGraphAffiche(expr) {
        var variablePattern = /\b[a-z]\b|\([a-z]+\)/g;
        var match, variables = [];
        while ((match = variablePattern.exec(expr)) !== null) {
            var variable = match[0].replace(/\(|\)/g, '');
            if (!variables.includes(variable)) {
                variables.push(variable);
            }
        }
        return new Function(...variables, `return ${expr};`);
}
function getFunctionCode(object){
    var jsCode;
    var coord1,coord2,coord3;

    isNaN(object.coords.arg1coord1) ? coord1 = transformExprePointVisualiser(object.coords.arg1, object.coords.Ids) : coord1 = parseFloat(object.coords.arg1)
    isNaN(object.coords.arg1coord2) ? coord2 = transformExprePointVisualiser(object.coords.arg2, object.coords.Ids) : coord2 = parseFloat(object.coords.arg2)
    isNaN(object.coords.arg1coord3) ? coord3 = transformExprePointVisualiser(object.coords.arg3, object.coords.Ids) : coord3 = parseFloat(object.coords.arg3)

    isNaN(coord1) ? coord1 = exprToFunctionGraphAffiche(coord1).toString().replace('function anonymous', 'function') : coord1;
    isNaN(coord2) ? coord2 = exprToFunctionGraphAffiche(coord2).toString().replace('function anonymous', 'function') : coord2;
    isNaN(coord3) ? coord3 = exprToFunctionGraphAffiche(coord3).toString().replace('function anonymous', 'function') : coord3;

    if (coord2 == '') coord2 = -10;
    if (coord3 == '') coord3 = 10;
    jsCode =
    `functiongraph_${object.object.id} = board.create('functiongraph',[${coord1},${coord2},${coord3}],
    {
        withLabel : true ,
        name: '${object.object.name}',
        visible : ${object.object.getAttribute("visible")},
        strokeWidth : ${object.object.getAttribute('strokewidth')},
        strokeColor : '${object.object.getAttribute('strokecolor')}',
        label :{
            fontSize : ${object.object.label.getAttribute('fontsize')},
            strokeColor : '${object.object.getAttribute('label').strokecolor}',
        },
        fixed : ${object.object.getAttribute('fixed')},
    });\n`
    return jsCode;
}
$("#copyButton").on("click", function() {
    var activeTabId = $('.nav-tabs .active').attr('href');
    var codeToCopy = $(activeTabId).text();

    navigator.clipboard.writeText(codeToCopy)
    .then(() => {
      alert('Code copié dans le presse-papiers !');
    })
    .catch(err => {
      alert('Erreur lors de la copie du code :', err);
    });
});
$("#visualiser").on("click",function(){
    var htmlCode = `<!DOCTYPE html>;
    <html lang="en">;
      <head>;
          <meta charset="UTF-8">;
          <!-------------------------------------------- SECTION JSXGRAPH ------------------------------------------------->;
          <link rel="stylesheet" type="text/css" href="https://jsxgraph.org/distrib/jsxgraph.css" />;
          <script type="text/javascript" src="https://jsxgraph.org/distrib/jsxgraphcore.js">;</script>;
          <title>;Editor</title>;
      </head>;
      <body>;
          <div id="box" >; </div >;
      </body>;
    </html>;`;
    
    var cssCode = `#box { 
        width: 800px; 
        height: 800px; 
        border : 5px solid black 
    }`;
    var jsCode = 
    `var board = JXG.JSXGraph.initBoard('box', {
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
            case 'functionGraph':
                jsCode += getFunctionCode(obj);
        }
    })
    $('#htmlCode').text(htmlCode);
    $('#cssCode').text(cssCode);
    $('#jsCode').text(jsCode);

    var modal = new bootstrap.Modal($('#codeModal'));
    modal.show();
});
$("#reinitialiser").on('click', function(){
    var confirmation = confirm("Êtes-vous sûr de vouloir supprimer tous les objets ?");
    if (confirmation) {
        objects.forEach((obj,index) => {
            obj.object.setAttribute({visible :!obj.object.getAttribute('visible')});
            board.removeObject(obj.object);
        });
        objects = [];
        board.setBoundingBox([-15, 15, 15, -15]); 
        affichageParametres(getParamsGraph());
    }
});
/*
* ******************************* ******************* Partie afficher des load ***************** *********************
*/
affichageParametres(getParamsGraph());
gestionParametresGraphe();