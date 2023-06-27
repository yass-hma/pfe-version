/*
* ******************************* *****************g****** Partie Global ******************** **************************
*/
var objects = [];
var isClicked = false; // c pour controler la gestion events objects 
var isCircle = false;
var isAnimation = false;
var cmpPoint = 0;
var cmpSlider = 0;
var cmpFunction = 0;
var cmpLine = 0;
var cmpText = 0;
var cmpImage = 0;
var cmpCircle = 0;
var cmpCircumcle = 0;
var cmpAnimation = 0;
var cmpPolygon = 0;
var selectedVertices;
var backgroundImageUrl = null;
var functionsCreationAnimation = '';
var functionsMoveAnimation = '';
var functionsMoveAnimationImporter = '';

function deleteObject(object){
    if(object) board.removeObject(object);
}
function existeObject(tableau) {
    var typesRecherches = ['point', 'image', 'slider','circle','text','circumcircle'];
    return tableau.some(element => typesRecherches.includes(element.type));
}  
function rgbToHex(rgb) {
    var rgbValues = rgb.match(/\d+/g).map(Number); // récupère les valeurs r, g, b
    var hex = rgbValues.map(value => value.toString(16).padStart(2, '0')).join(''); // les convertit en hexadécimal
    return '#' + hex;
}
function backgroundImageHandling(){
    var html = $("#parametres .inputParametres").html();
    var back = `<hr class="my-4">
        <div class="background row my-1" style="display:` 
        $('#box').css('background-image') !== 'none' ? back += 'inline' : back +='none';
        back += `;"><div class="d-flex justify-content-between">
                <label class="form-check-label param-label flex-item" for="same-address">Background-image :</label>
            <div>    
            <button type="button" class="btn btn-secondary trash-toggle" id="trash-back">
                <i class="bi bi-trash-fill"></i>
            </button>
        <div>`
        $("#parametres .inputParametres").html(html + back);
        $('#trash-back').on('click', function() {
            $('#box').css('background-image', 'none');
            $('.background').css('display', 'none');  
            affichageParametres(getParamsGraph(null));
        });
}
function isValideExprFunctionGraph(arrayIndexObjects,expression) {
    var lastChar = expression.slice(-1);
    var operators = ['+', '*', '/', '%'];

    if (operators.includes(lastChar)) {
        return false;
    }
    var invalidRegex = /([0-9][a-zA-Z])|([-+*/%]{2})|([-+*/%]$)|([^a-zA-Z0-9_*+\-/%().])|(^[^a-zA-Z0-9_*+\-/%().])|(^|[^0-9]),|,(?![0-9])/;
    if (invalidRegex.test(expression.replace(/\s/g, ''))) {
        return false;
    }
    var regex = /^\s*\(*\s*(-)?(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|c[0-9]+\.r|cr[0-9]+\.r|Math\.[a-zA-Z]+(\(-?[a-zA-Z0-9]*\))?\s*|[a-zA-Z]|[0-9]+(\.[0-9]+)?)(\s*[+\-%/*]\s*\(*\s*(-)?(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|c[0-9]+\.r|cr[0-9]+\.r|Math\.[a-zA-Z]+(\(-?[a-zA-Z0-9]*\))?\s*|[a-zA-Z]|[0-9]+(\.[0-9]+)?)\s*\)*)*\s*$/;
    if (!regex.test(expression) || ($('#object-base').length !== 0 && !isValideIdObjectExpresion(arrayIndexObjects,expression))) {
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
    var regex = /^\s*\(*\s*(-)?(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|c[0-9]+\.r|cr[0-9]+\.r|[0-9]+(\.[0-9]+)?)(\s*[+\-%/*]\s*\(*\s*(p[0-9]+\.x|p[0-9]+\.y|s[0-9]+|c[0-9]+\.r|cr[0-9]+\.r|[0-9]+(\.[0-9]+)?)\s*\)*)*\s*$/;
    return regex.test(coord);
}
function isValideExpr(usedIds,expr) {
    var match;
    var valid = true;
    var idRegex = /(p|s|c|im|cr)([0-9]+)/g;  
    while ((match = idRegex.exec(expr)) !== null) {
        var id = match[0];
        if (!usedIds.includes(id)) {
            valid = false;
            break;
        }
    }
    return valid;
}  
function isValideIdObjectExpresion(indices,coord) {
    var usedIds=[];
  
    indices.forEach(function(index) {
      usedIds.push(objects[index].object.id);
    });
  
    return isValideExpr(usedIds,coord)
}
$('#windowModal').on('hidden.bs.modal', function () {
    if (!isAnimation) $(this).find('form')[0].reset();
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
    $("#trace").on("click",function(){
        updateButton($("#trace"),'lock')
        object.setAttribute({trace: !object.getAttribute("trace")});
    });
    $("#opacity").on("change",function(){
        object.setAttribute({fillOpacity : parseFloat($("#opacity").val()) / 100});
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
    $("#coordn").on("change",function(){
        object.setPosition(JXG.COORDS_BY_USER, [parseFloat($("#coordn").val()),object.coords.usrCoords[2]]);
        board.update();
    });
    $("#coordp").on("change",function(){
        object.setPosition(JXG.COORDS_BY_USER, [object.coords.usrCoords[1],parseFloat($("#coordp").val())]);
        board.update();
    });
}
function affichageObjectParametres(){
    var inputobject = '';
    objects.forEach((obj) => {
        if(obj.type !== 'button'){
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
    }
    });

    return inputobject;
}
function addEventsObjetcAction(){
    objects.forEach((obj,index) => {
        if(obj.type !== 'button'){
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
    }
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
                        param.readonly ? contentInput += 'readonly' : contentInput += 'step="0.01"'
                        contentInput += `></div>
                    <div class="col">
                        <input type=${param.for} id="${param.attribute}p" class="form-control" value="${(param.value)[1]}"`
                        param.readonly ? contentInput += 'readonly' : contentInput += 'step="0.01"'
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
          if(!param.display) break;
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
        contentInput += affichageObjectParametres() 
    $("#parametres .inputParametres").html(contentInput);
    if (parametres[0] == 'graph') backgroundImageHandling();
    addEventsObjetcAction();
}
function affichageOptionObjects(param,aw=null) {
    var contentOption = '';
    contentOption +=    
    `<div class="row g-3 my-1">
        <div class="col">
            <label for="object-base" class="param-label col-form-label">Basé sur :</label>
        </div>
        <div class="col">            
        <select class="form-select" id="object-base`
        if(aw !== null) contentOption += 'aw';
        contentOption += `" multiple>
        <option value="">Choisir Object </option>`;
    objects.forEach((val,index) => {
        switch (val.type) {
            case 'point':
                contentOption += `<option value="${index}">point-${val.object.name}-${val.object.id}</option>`
                break;
            case 'slider':
                if(param === 'animation') break;
                contentOption += `<option value="${index}">slider-${val.object.name}-${val.object.id}</option>`
                break;
            case 'image':
                if(param !== 'animation') break;
                contentOption += `<option value="${index}">image-${val.object.id}</option>`
                break;
            case 'circle':
                contentOption += `<option value="${index}">circle-${val.object.id}</option>`
                break;
            case 'circumcircle':
                contentOption += `<option value="${index}">circumcircle-${val.object.id}</option>`
                break;
            case 'text':
                if(param !== 'animation') break;
                contentOption += `<option value="${index}">text-${val.object.id}</option>`
                break;
        }
    });
    contentOption += `</select> </div></div>`;
    return contentOption; 
}
function affichageParametresWindow(parametres){
    var contentForm = '';
    if(parametres[0] !== 'slider' && objects.length > 0 && existeObject(objects))
        contentForm = affichageOptionObjects(parametres[0]);
   
    parametres.forEach((param) => {
      switch (param.type) {
        case 'select':     
           if (!param.win) break;
            contentForm += 
                  `<div class="row g-3 my-1">
                      <div class="col">
                          <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                      </div>                    
                      <select class="form-select" id="${param.attribute}"`
                      if (param.required ) contentForm += 'required'
                      contentForm += `><option value="">Choisir ${param.attribute} </option>`;
                          (param.value).forEach((val) => {
                            contentForm += `<option value="${(val.split('#'))[1]}">${(val.split('#'))[0]}</option>`
                          });
                          contentForm += `</select> </div>`;
              if(param.last)
              contentForm += '<hr class="my-4">';
            break;
        case 'textarea':
            if(!param.win) break;
            contentForm += 
                `<div class="mb-3">
                    <label for="${param.attribute}" class="form-label">${param.attribute} :</label>
                    <textarea class="form-control" id="${param.attribute}w" rows="3"`
                if(param.required) contentForm += 'required="required"'
                contentForm += `></textarea>
                </div>`
            break;
        case 'button':
            if(param.first) contentForm += `<div class="objetcs-creation-animer">   
            <div class="mb-3">
            <label for="Creation" class="form-label">Creation : </label></div>`;
            contentForm += 
                `<button id="creation${param.attribute}" type="button" class="btn btn-primary me-2 mb-2" data-bs-toggle="modal" 
                    data-bs-target="#windowModalDeux">${param.attribute}</button>`
            if(param.dernier) contentForm += `</div>`
            break;
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
        if (parametres[0] === 'animation') animerCreationObjetcs();
}
function affichageParametresWindowDeux(parametres){
    
    var contentInput = '';
    if(parametres[0] !== 'slider' && objects.length > 0 && existeObject(objects))
        contentInput = affichageOptionObjects(parametres[0],'an');

    parametres.forEach((param) => {
      switch (param.type) {
        case 'coord':
            if(!param.win2) break;
            contentInput +=
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute} :</label>
                    </div>
                    <div class="col">
                        <input type=${param.for} id="${param.attribute}naw" class="form-control" value="" required></div>
                    <div class="col">
                        <input type=${param.for} id="${param.attribute}paw" class="form-control" value="" required></div></div>` ;
              if(param.last)
                contentInput += '<hr class="my-4">';
          break;
        case 'number':
            if(!param.win2) break;
            contentInput +=
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>
                    <div class="col">
                        <input type="number" step="0.01" id="${param.attribute}aw" class="form-control" min=0 max=100 value="${param.value}">
                    </div>
                </div>` ;
                if(param.last)
                  contentInput += '<hr class="my-4">';
          break;
        case 'text':
            if(!param.win2) break;
            contentInput+= 
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>
                    <div class="col">
                        <input type="text" id="${param.attribute}aw" class="form-control" value="" `
                    if (param.required) contentInput+= 'required'
                    contentInput+= `></div>
                </div>`
                if(param.last)
                  contentInput += '<hr class="my-4">';
          break;
        case 'select':
            if(!param.win2) break;
          contentInput += 
                `<div class="row g-3 my-1">
                    <div class="col">
                        <label for="${param.attribute}" class="param-label col-form-label">${param.attribute}:</label>
                    </div>                    
                    <select class="form-select" id="${param.attribute}aw" >
                    <option value="">Choisir ${param.attribute} </option>`;
                        (param.value).forEach((val) => {
            contentInput += `<option value="${(val.split('#'))[1]}">${(val.split('#'))[0]}</option>`
                        });
            contentInput += `</select> </div>`;
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
        case 'color':
            if(!param.win2) break;
          contentInput +=
            `<div class="row g-3 my-1">
                <label for="ColorInput" class="param-label col">${ param.attribute} :</label>
                <input type="color" id="${param.attribute}aw" class="form-control form-control-color"> 
            </div>`
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
        case 'eyes': 
        if(!param.win2) break; 
            contentInput += 
          `<div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="${param.attribute}aw">
                <label class="custom-control-label" for="${param.attribute}">${param.attribute}</label>
            </div>`
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
          case 'lock': 
          if(!param.win2) break;
            contentInput += 
          `<div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input switch" id="${param.attribute}aw">
                <label class="custom-control-label" for="${param.attribute}">${param.attribute}</label>
            </div>`
            if(param.last)
              contentInput += '<hr class="my-4">';
          break;
        default:
          break;
      }
    });
    $(".modal-body-deux form").html(contentInput + `
    <div class="modal-footer">
        <button type="button" id="back" class="btn btn-secondary" data-bs-target="#windowModal" data-bs-toggle="modal">back</button>
        <button type="submit" class="btn btn-success" >Create</button>
    </div>`);
    animerCreationObjetcs();
}
function handleFormWindow() {
    $('.modal-body form').on('submit', function(event) {
        event.preventDefault();
        var button = $(this).attr('data-button');
        switch (button) {
            case 'Point':
                creationPointFactory();
                break;
            case 'Polygone':
                creationPolygonFactory();
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
            case 'Text':
                creationTextFactory();
                break;
            case 'Image':
                creationImageFactory();
                break;
            case 'Animation':
                creationAnimationFactory();
                break;
            case 'Circle':
                creationCircleFactory();
                break;
            case 'Circumcircle':
                creationCircleFactory(1);
                break;
            default:
                break;
        }
    });
}
function handleFormWindowDeux() {
    $('.modal-body-deux form').on('submit', function(event) {
        event.preventDefault();
        var button = $(this).attr('data-button');
        switch (button) {
            case 'Point':
                creationPointFactoryAnimation();
                break;
            case 'Function':
                creationFunctionGraphFactoryAnimation();
                break;
            case 'Line':
                creationLineFactoryAnimation();
                break;
            case 'Text':
                creationTextFactoryAnimation();
                break;
            case 'Image':
                creationImageFactoryAnimation();
                break;
            case 'Circle':
                creationCircleFactoryAnimation();
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
        case 'Text':
            affichageParametresWindow(getParamsText(null));
            break;
        case 'Image':
            affichageParametresWindow(getParamsImage(null));
            break;
        case 'Animation': 
            functionsCreationAnimation = '';
            functionsMoveAnimation = '';
            $('.button-animation').html('');
            affichageParametresWindow(getParamsAnimation(null));
            isAnimation = true;
            break;
        case 'Circle':
            affichageParametresWindow(getParamsCircle(null));
            break;
        case 'Circumcircle':
            affichageParametresWindow(getParamsCircle(null,1));
            break;
        case 'Polygone':
            affichageParametresWindow(getParamsPolygon(null));
            $("#vertices").on("change", function() {
                selectedVertices = $(this).val().split('#')[0];
                createCoords(selectedVertices);
              });
            break;
        default:
            break;
    }
    $('.modal-body form').attr('data-button', button);
});
function animerCreationObjetcs(){
    $(".objetcs-creation-animer button").on("click", function(event){ 
    var button = event.delegateTarget.innerHTML;
    switch (button) {
        case 'Point':
            affichageParametresWindowDeux(getParamsPoint(null));
            break;
        case 'Function':
            affichageParametresWindowDeux(getParamsFunctionGraph(null));
            break;
        case 'Line':
            affichageParametresWindowDeux(getParamsLine(null));
            break;
        case 'Text':
            affichageParametresWindowDeux(getParamsText(null));
            break;
        case 'Image':
            affichageParametresWindowDeux(getParamsImage(null));
            break;
        case 'Circle':
            affichageParametresWindowDeux(getParamsCircle(null));
            break;
        default:            
            break;
    }
    $('.modal-body-deux form').attr('data-button', button);
});
}
handleFormWindow();
handleFormWindowDeux();
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
JXG.Options.text.useMathJax = true;	
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
        xNegative = parseFloat(coordXNegative.val()).toFixed(2);
        board.setBoundingBox([xNegative, xPositive, yPositive, yNegative]);
    });
    coordXPositive.on("change", function(){
        xPositive =parseFloat(coordXPositive.val()).toFixed(2);
        board.setBoundingBox([xNegative, xPositive, yPositive, yNegative]);
    });
    coordYNegative.on("change", function(){
        yNegative = parseFloat(coordYNegative.val()).toFixed(2) ;
        board.setBoundingBox([xNegative, xPositive, yPositive, yNegative]);
    });
    coordYPositive.on("change", function(){
        yPositive = parseFloat(coordYPositive.val()).toFixed(2);
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
function callFunctionAxis(axis){
    axis.on('down',function(){
        isClicked = true;
        affichageParametres(getParamsAxe(axis));
        gestionParametresAxes(axis);
    });
}
callFunctionAxis(xaxis);
callFunctionAxis(yaxis);

/*
* ******************************* ******************* Partie Point ******************** **************************
*/
function getParamsPoint(point,bool=null){
    return ['point',
        {type:'coord', attribute: "coord", value: point !== null ? point.coords.usrCoords.slice(1) : 0, for: ((objects.length > 0 && existeObject(objects))) ? 'text' : 'number',readonly : ((objects.length > 0 && bool == null) || bool), display : true,win2 : true},
        {type:'number', attribute: "size-point", value: point !== null ? point.getAttribute('size') : 0,  display : true},
        {type:'number', attribute: "opacity", value: point !== null ? point.getAttribute('opacity') * 100: 0,display : true },
        {type:'text', attribute: "label", value: point !== null ? point.name : 0, display: true},
        {type:'number', attribute: "size-label", value: point !== null ? point.label.getAttribute('fontsize') : 0, last: true ,display : true},
        {type:'select', attribute: "style-point", value: ["cross#x","circle#o","plus#+","minus#-","square#[]","diamond#<>"],display:true, last : true,win2 : true},
        {type:'color', attribute: "color-point", value: point !== null ? point.getAttribute('color') : 0,win2 : true},
        {type:'color', attribute: "color-label", value: point !== null ? point.getAttribute('label').strokecolor : 0, last :true,win2 : true},
        {type:'lock', attribute: "fixed",value: point !== null ? point.getAttribute('fixed') : 0,win2 : true},
        {type:'lock', attribute: "trace",value: point !== null ? point.getAttribute('trace') : 0, last: true,win2 : true},
    ];  
}
function gestionParametresPoint(point){

    $("#size-point").on("change",function(){
        point.setAttribute({size : $("#size-point").val()});
    });
    $("#style-point").on("change",function(){
        point.setAttribute({face: $("#style-point").val()});
    });
    $("#color-point").on("change",function(){
        point.setAttribute({color: $("#color-point").val()});
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
        if (ids[i].startsWith('cr'))
            transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.r\\b", 'g'), "objects[" + indexMap[ids[i]] + "].object.Radius()");
        else if (!ids[i].endsWith('r'))
            transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.r\\b", 'g'), "objects[" + indexMap[ids[i]] + "].object.Radius()");
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
    var Ids= [];
    if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0)
    arrayIndexObjects.forEach(function(index) {
        Ids.push(objects[index].object.id);
    });
    
    if (($('#object-base').length == 0) || (arrayIndexObjects.length == 0 && !isNaN(coordX)  && !isNaN(coordY))) { // for first object point : isNaN(arrayIndexObjects)
        var point = createPoint(parseFloat(coordX), parseFloat(coordY), label);
        callFunctionPoint(point,false,{ids:Ids,coordX : coordX, coordY: coordY});
    }
    else if (arrayIndexObjects.length > 0  && isValidExpressionObject(coordX) && isValidExpressionObject(coordY) && 
        isValideIdObjectExpresion(arrayIndexObjects,coordX) &&  isValideIdObjectExpresion(arrayIndexObjects,coordY)){
        var point = createPoint(!isNaN(coordX) ?parseFloat(coordX):creationCoordPoint(arrayIndexObjects,coordX),!isNaN(coordY) ?parseFloat(coordY):creationCoordPoint(arrayIndexObjects,coordY),label);
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
        {type:'text', attribute: "premier-arg", required : true,win2 : true},
        {type:'text', attribute: "deuxieme-arg",win2 : true},
        {type:'text', attribute: "troisieme-arg",win2 : true},
        {type:'text', attribute: "label", value : functionGraph ? functionGraph.name : 0, display : true,win2 : true},
        {type:'number', attribute: "size-label", value : functionGraph ? functionGraph.label.getAttribute('fontsize') : 0, display : true},
        {type:'number', attribute: "size-object", value : functionGraph ? functionGraph.getAttribute('strokewidth') : 0, display : true, last: true},
        {type:'color', attribute: "color-object", value : functionGraph ? functionGraph.getAttribute('strokecolor') : 0,win2 : true},
        {type:'color', attribute: "color-label", value : functionGraph ? functionGraph.getAttribute('label').strokecolor : 0, last :true},
        {type:'lock', attribute: "fixed", value:functionGraph ? functionGraph.getAttribute('fixed'): 0,win2 : true},
        {type:'eyes', attribute: "hide", value:functionGraph ? functionGraph.getAttribute('visible'): 0},
    ]
}
function exprToFonction(arrayIndexObjects,expr) {
    var variablePattern = /\b[a-z]\b|\([a-z]+\)/g;
    var match, variables = [],Ids= [];
    var indexMap= {};
    if($('#object-base').length !== 0 ){
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
    else if(isValideExprFunctionGraph(arrayIndexObjects,arg))
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
            callFunctionGraph(functionGraph,{arg1:arg1,arg2:arg2,arg3:arg3,ids:Ids});
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
        {type:'coord', attribute: "point1", for: existeObject(objects)? 'text' :'number',win2 : true},
        {type:'coord', attribute: "point2",  for: existeObject(objects)? 'text' :'number',win2 : true},
        {type:'number', attribute: "size-object", value : line ? line.getAttribute('strokewidth') : 0, display : true, last: true},
        {type:'number', attribute: "size-label", value : line ? line.label.getAttribute('fontsize') : 0, display : true},
        {type:'text', attribute: "label", value: line ? line.name : 0, display: true,win2 : true},
        {type:'select', attribute: "style", value: ["solid line#0","dotted line#1","smalle dash#2","medium dash#3","big dashes#4","small gaps#5","large gaps#6"],display: true, last:true,win2 : true},
        {type:'color', attribute: "color-object", value : line ? line.getAttribute('strokecolor') : 0,win2 : true},
        {type:'color', attribute: "color-label", value : line ? line.getAttribute('label').strokecolor : 0, last :true},
        {type:'eyes', attribute: "hide", value:line ? line.getAttribute('visible'): 0},
        {type:'lock', attribute: "fixed",value: line ? line.getAttribute('fixed') : 0,win2 : true},
        {type:'lock', attribute: "border-point1",value: line ? !line.getAttribute('straightfirst') : 0,win2 : true},
        {type:'lock', attribute: "border-point2",value: line ? !line.getAttribute('straightlast') : 0, last: true,win2 : true},

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
function callFunctionLine(line,base) {    
    handleLineDown(line);
    objects.push({type : 'line', object: line, base : base});
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

    if (($('#object-base').length == 0) || (!isNaN(point1x)  && !isNaN(point1y))) { 
        point = [parseFloat(point1x), parseFloat(point1y)];
    }
    else if (arrayIndexObjects.length > 0  && isValidExpressionObject(point1x) && isValidExpressionObject(point1y) && 
        isValideIdObjectExpresion(arrayIndexObjects,point1x) &&  isValideIdObjectExpresion(arrayIndexObjects,point1y)){
    
        point =[!isNaN(point1x)?parseFloat(point1x):creationCoordPoint(arrayIndexObjects,point1x),!isNaN(point1y)?parseFloat(point1y):creationCoordPoint(arrayIndexObjects,point1y)];
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
    var label   = $('#labelw').val();
    var Ids= [];
    
    if($("#object-base").length !== 0)
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    point1 = createPointLine(arrayIndexObjects,point1x,point1y);
    point2 = createPointLine(arrayIndexObjects,point2x,point2y);
    if(point1 && point2){
        try {
            line = board.create('line',[point1,point2],{id : 'l'+ ++cmpLine, withLabel : true ,name : label});
            callFunctionLine(line,{ids:Ids,arg1 : point1x, arg2: point1y, arg3 : point2x, arg4 : point2y});
        } catch (error) {
            alert("Erreur : Merci de verifier les expression que vous avez fournit!");
        }
    }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit!");
        deleteObject(point1);
        deleteObject(point2);
    } 
}
/*
* ******************************* ******************* Partie Text ******************** **************************
*/
function getParamsText(text){
    return ['text',
        {type:'coord', attribute: "coord", value : text !== null ? text.coords.usrCoords.slice(1) : 0,for: !existeObject(objects) ? 'number' :'text', display : true,win2 : true},
        {type:'text', attribute: "text", value : text ? text.plaintext : '', required : true, display : true,win2 : true},
        {type:'number', attribute: "size-text", value : text ? text.getAttribute('strokewidth') : 0, display : true, last: true},
        {type:'color', attribute: "color-object", value : text ? text.getAttribute('strokecolor') : 0, last : true,win2 : true},
        {type:'eyes', attribute: "hide", value:text ? text.getAttribute('visible'): 0},
        {type:'lock', attribute: "fixed",value: text ? text.getAttribute('fixed') : 0,win2 : true},
    ];  
}
function gestionParametresText(text){
    $("#text").on("change",function(){
        text.setText($("#text").val());
        board.update();
    });   
    $("#size-text").on("change",function(){
        text.setAttribute({fontSize: parseInt($("#size-text").val())});
    });  
    gestionShareAttribute(text);
}
function handleTextDown(text){
    text.on("down",function(){
        isClicked = true;
        affichageParametres(getParamsText(text));
        gestionParametresText(text);
    });
}
function callFunctionText(text,base) {
    handleTextDown(text);
    objects.push({type : 'text', object: text, base : base});
    $('#windowModal').modal('hide');
    affichageParametres(getParamsText(text));
    gestionParametresText(text);
}
function isValidExpressText(text){
    var regex = /^(?:[^']*$|'(?:(?:[^'\\]|\\.)*'|\((?:-?p\d+\.[xy]|-?s\d+|-?c\d+\.r|-?f\d+)(?:\s*[\+\-\*\/]\s*(?:-?p\d+\.[xy]|-?s\d+|-?c\d+\.r|-?f\d+))*\))*(?:\s*\+\s*(?:(?:[^'\\]|\\.)*'|\((?:-?p\d+\.[xy]|-?s\d+|-?c\d+\.r|-?f\d+)(?:\s*[\+\-\*\/]\s*(?:-?p\d+\.[xy]|-?s\d+|-?c\d+\.r|-?f\d+))*\))*'*)*)$/
    return regex.test(text);
}
function createCoordText(arrayIndexObjects, expr) {
    var coord = null;
    if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0  && isValidExpressionObject(expr) && isValideIdObjectExpresion(arrayIndexObjects,expr)){
        coord = creationCoordPoint(arrayIndexObjects,expr);
    }
    return coord; 
}
function creationTextFactory() {
    var text ;
    var arrayIndexObjects = $('#object-base').val();
    var coord1 = $('#coordnw').val();
    var coord2 = $('#coordpw').val();
    var string = $('#textw').val();
    var Ids= [];
    var regex = /(p\d+\.[xy]|s\d+|c\d+\.r|cr\d+\.r)/;
    var f = function (expr) {return new Function("return " + `"${expr}"` + ";");}

    isNaN(coord1) ? coord1 = createCoordText(arrayIndexObjects,coord1): coord1 = parseFloat(coord1);
    isNaN(coord2) ? coord2 = createCoordText(arrayIndexObjects,coord2): coord2 = parseFloat(coord2);

    if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0){
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }

    if(coord1 && coord2 && isValidExpressText(string) ){
        if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0 && isValideIdObjectExpresion(arrayIndexObjects, string) && regex.test(string)) {
           string = creationCoordPoint(arrayIndexObjects, string);
        }
        else if (!regex.test(string))
            string = f(string);
        else{
            alert("Erreur : Merci de verifier les expression que vous avez fournit !");
            return ;
        }
        try {
                text = board.create('text',[coord1,coord2,string],{id : 't'+ ++cmpText,display:'html',CSSClass:'rotated45',parse:false,useMathJax:true});
                callFunctionText(text,{ids:Ids,arg1 : $('#coordnw').val(), arg2: $('#coordpw').val(), arg3 :$('#textw').val()});
            } catch (error) {
                alert("Erreur : Merci de verifier les expression que vous avez fournit !");
            }
        }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit !");
    } 
}
/*
* ******************************* ******************* Partie Image ******************** ******************************
*/
function getParamsImage(image){
    return ['image',
        {type:'coord', attribute: "point1", for: existeObject(objects) ? 'text' :'number',win2 : true},
        {type:'coord', attribute: "point2",  for: existeObject(objects) ? 'text' :'number',win2 : true},
        {type:'text', attribute: "url", value : image ? image.getAttribute('url') : '', required : true,win2 : true},
        {type:'eyes', attribute: "hide", value: image ? image.getAttribute('visible'): 0},
        {type:'lock', attribute: "fixed",value: image ? image.getAttribute('fixed') : 0,win2 : true},
    ];  
}
function gestionParametresImage(image){   
    gestionShareAttribute(image);
}
function handleImageDown(image){
    image.on("down",function(){
        isClicked = true;
        affichageParametres(getParamsImage(image));
        gestionParametresImage(image);
    });
}
function callFunctionImage(image,base) {
    handleImageDown(image);
    objects.push({type : 'image', object: image, base : base});
    $('#windowModal').modal('hide');
    affichageParametres(getParamsImage(image));
    gestionParametresImage(image);
}
function createPointImage(arrayIndexObjects, point1x, point1y) {
    var point = null;
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
        point = [creationCoordPoint(arrayIndexObjects,point1x),creationCoordPoint(arrayIndexObjects,point1y)];
        return point;
    }
    return point; 
}
function creationImageFactory() {
    var point1, point2,image ;
    var arrayIndexObjects = $('#object-base').val();
    var point1x = $('#point1nw').val();
    var point1y = $('#point1pw').val();
    var point2x = $('#point2nw').val();
    var point2y = $('#point2pw').val();
    var url =  $('#urlw').val();
    var Ids= [];

    if($("#object-base").length !== 0)
    arrayIndexObjects.forEach(function(index) {
        Ids.push(objects[index].object.id);
    });
    point1 = createPointImage(arrayIndexObjects,point1x,point1y);
    point2 = createPointImage(arrayIndexObjects,point2x,point2y);
    if(point1 && point2){
        try {
            image = board.create('image',[url,point1,point2],{id : 'im'+ ++cmpImage});
            callFunctionImage(image,{ids:Ids,arg1 : point1x, arg2: point1y, arg3 : point2x, arg4 : point2y,url : url});
        } catch (error) {
            alert("Erreur : Merci de verifier les expression que vous avez fournit 1!");
        }
    }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit 2!");
    } 
}
/*
* ******************************* ******************* Partie Circle ******************** **************************
*/
function getParamsCircle(circle,circl = null){
    return ['circle',
        {type:'coord', attribute: "center", for: objects.length>0 && existeObject(objects) ? 'text' : 'number',win2 : true},
        {type:'coord', attribute: "radius", for: objects.length>0 && existeObject(objects) ? 'text' : 'number',win2 : true},
        circl ? {type:'coord', attribute: "point3", for: objects.length>0 && existeObject(objects) ? 'text' : 'number'} :0,
        {type:'number', attribute: "size-object", value : circle ? circle.getAttribute('strokewidth') : 0, display : true},
        {type:'number', attribute: "size-label", value : circle ? circle.label.getAttribute('fontsize') : 0, display : true},
        {type:'text', attribute: "label", value: circle ? circle.name : 0, display: true,win2 : true},
        {type:'select', attribute: "style", value: ["solid line#0","dotted line#1","smalle dash#2","medium dash#3","big dashes#4","small gaps#5","large gaps#6"],display:true, last:true,win2 : true},
        {type:'color', attribute: "color-object", value : circle ? circle.getAttribute('strokecolor') : 0,win2 : true},
        {type:'color', attribute: "color-remplissage", value : circle ? circle.getAttribute('fillcolor') : 0,win2 : true},
        {type:'color', attribute: "color-label", value : circle ? circle.getAttribute('label').strokecolor : 0, last :true},
        {type:'eyes', attribute: "hide", value:circle ? circle.getAttribute('visible'): 0},
        {type:'lock', attribute: "fixed",value: circle ? circle.getAttribute('fixed') : 0,win2 : true},
    ];
}
function gestionParametresCircle(circle){
    $("#color-remplissage").on("change",function(){
        circle.setAttribute({fillColor: $("#color-remplissage").val()});
      });

    gestionShareAttribute(circle);
}
function handleCircleDown(circle){
    circle.on("down",function(){
        isClicked = true;
        affichageParametres(getParamsCircle(circle));
        gestionParametresCircle(circle);
    });
}
function callFunctionCircle(circle,base,circum=null) {
    handleCircleDown(circle);
    objects.push({type : circum ? 'circumcircle' :'circle' , object: circle, base : base});
    $('#windowModal').modal('hide');
    affichageParametres(getParamsCircle(circle));
    gestionParametresCircle(circle);
}
function createPointCircle(arrayIndexObjects, centerx, centery) {
    var center = null;
    var regexP = /^p\d+$/;
    var regexC = /^c\d+$/;
    var Ids = [];

    if ($("#object-base").length !== 0) {
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }

    if (($('#object-base').length == 0) || (!isNaN(centerx) && !isNaN(centery))) {
        center = [parseFloat(centerx), parseFloat(centery)];
    }
    else if (arrayIndexObjects.length > 0 && isValidExpressionObject(centerx) && isValidExpressionObject(centery) &&
        isValideIdObjectExpresion(arrayIndexObjects, centerx) && isValideIdObjectExpresion(arrayIndexObjects, centery)) {        
        center = [!isNaN(centerx)?parseFloat(centerx):creationCoordPoint(arrayIndexObjects, centerx),!isNaN(centery)?parseFloat(centery):creationCoordPoint(arrayIndexObjects, centery)];
        return center;
    }
    else if (arrayIndexObjects.length > 0 && regexP.test(centerx) && regexP.test(centery) && centerx === centery && Ids.includes(centerx)) {
        for (var i = 0; i < arrayIndexObjects.length; i++) {
            var index = arrayIndexObjects[i];
            if (objects[index].object.id === centerx) {
                center = objects[index].object;
                break;
            }
        }
    }
    else if (arrayIndexObjects.length > 0 && regexC.test(centerx) && regexC.test(centery) && centerx === centery && Ids.includes(centerx)) {
        for (var i = 0; i < arrayIndexObjects.length; i++) {
            var index = arrayIndexObjects[i];
            if (objects[index].object.id === centerx) {
                center = objects[index].object;
                break;
            }
        }
    }
    return center; 
}
function creationCircleFactory(circl=null) {
    var center, radius, point3 = null,circle, circumcircle;
    var arrayIndexObjects = $('#object-base').val();
    var centerx = $('#centernw').val();
    var centery = $('#centerpw').val();
    var radiusx = $('#radiusnw').val();
    var radiusy = $('#radiuspw').val();
    var point3x = $('#point3nw').val();
    var point3y = $('#point3pw').val();
    var label = $('#labelw').val();
    var Ids = [];

    if ($("#object-base").length !== 0) {
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }
    center = createPointCircle(arrayIndexObjects, centerx, centery);
    radius = createPointCircle(arrayIndexObjects, radiusx, radiusy);
    if(circl) point3 = createPointCircle(arrayIndexObjects, point3x, point3y);

    if (center && radius) {
        if (!circl){
            try {
                circle = board.create('circle', [center, radius], { id: 'c' + ++cmpCircle, withLabel: true, name: label });
                callFunctionCircle(circle,{ids:Ids,arg1 : centerx, arg2: centery, arg3 : radiusx, arg4 : radiusy});
            } catch (error) {
                alert("Erreur : Merci de vérifier les expressions que vous avez fournies 0!");
            }
        }
        else if(circl && point3){
            try {
                circumcircle = board.create('circumcircle', [center, radius,point3], { id: 'cr' + ++cmpCircumcle, withLabel: true, name: label });
                callFunctionCircle(circumcircle,{ids:Ids,arg1 : centerx, arg2: centery, arg3 : radiusx, arg4 : radiusy, arg5 : point3x, arg6: point3y},1);
            } catch (error) {
                alert("Erreur : Merci de vérifier les expressions que vous avez fournies 1!");
            }
        }
        else 
            alert("Erreur : Merci de vérifier les expressions que vous avez fournies 2!");
    } else {
        alert("Erreur : Merci de vérifier les expressions que vous avez fournies 3!");
    }
}
/*
* ******************************* ******************* Partie Polygone ******************** **************************
*/
function getParamsPolygon(polygon = null) {
    return [
      'polygon',
      { type: 'select', attribute: "vertices", value: ["3#3", "4#4", "5#5", "6#6", "7#7", "8#8", "9#9", "10#10"],win : true, required: true},
      { type: 'text', attribute: "label", value: polygon ? polygon.name : 0, display: true },
      {type:'number', attribute: "size-label", value : polygon ? polygon.label.getAttribute('fontsize') : 0, display : true},
      { type:'number', attribute: "opacity", value: polygon !== null ? polygon.getAttribute('fillOpacity') * 100: 0,display : true , last: true},
      { type: 'color', attribute: "color-remplissage", value: polygon ? polygon.getAttribute('fillColor') : 0 },
      { type: 'color', attribute: "color-label", value: polygon ? polygon.getAttribute('label').strokecolor : 0 , last : true},
      { type: 'eyes', attribute: "hide", value: polygon ? polygon.getAttribute('visible') : 0 },
      { type: 'eyes', attribute: "hide-label", value: polygon ? polygon.getAttribute('withLabel') : 0 },
      { type: 'eyes', attribute: "hide-border", value: polygon ? !polygon.getAttribute('borders').visible : 0 },
      { type: 'eyes', attribute: "hide-vertice", value: polygon ? !polygon.getAttribute('vertices').visible : 0 },
      {type:'lock', attribute: "fixed",value: polygon ? polygon.getAttribute('fixed') : 0},
      {type:'lock', attribute: "trace",value: polygon !== null ? polygon.getAttribute('trace') : 0, last: true},

    ];
}
function gestionParametresPolygon(polygon){
    $("#hide-border").on("click",function(){
        updateButton($("#hide-border"),'eyes');
        polygon.setAttribute({borders : {visible :!polygon.getAttribute('borders').visible}});
    });
    $("#hide-vertice").on("click",function(){
        updateButton($("#hide-vertice"),'eyes');
        polygon.setAttribute({vertices : {visible : !polygon.getAttribute('vertices').visible}});
    });
    $("#color-remplissage").on("change",function(){
        polygon.setAttribute({fillColor: $('#color-remplissage').val()});
    });
    gestionShareAttribute(polygon);
}
function createCoords(x) {
    var coords = [];
    // Générer les coordonnées en fonction du nombre de sommets
    for (var i = 0; i < x; i++) {
        var coord = {
        type: 'coord',
        attribute: 'point' + (i + 1),
        for: objects.length>0 && existeObject(objects) ? 'text' : 'number'
        };
        coords.push(coord);
    }
    affichageParametresWindow(coords);
}
function handlePolygonDown(polygon) {
    polygon.on("down", function () {
        isClicked = true;
        affichageParametres(getParamsPolygon(polygon));
        gestionParametresPolygon(polygon);
});
} 
function callFunctionPolygon(polygon, base) {
    handlePolygonDown(polygon);
    objects.push({ type: 'polygon', object: polygon, base: base });
    $('#windowModal').modal('hide');
    affichageParametres(getParamsPolygon(polygon));
    gestionParametresPolygon(polygon);
}
function createPointPolygon(arrayIndexObjects, point1x, point1y) {
    var point = null;
    var regex = /^p\d+$/;
    var Ids = [];
    if ($("#object-base").length !== 0)
        arrayIndexObjects.forEach(function (index) {
        Ids.push(objects[index].object.id);
        });

    if (($('#object-base').length == 0) || (!isNaN(point1x) && !isNaN(point1y))) { // for first object point : isNaN(arrayIndexObjects)
        point = [parseFloat(point1x), parseFloat(point1y)];
    }
    else if (arrayIndexObjects.length > 0 && isValidExpressionObject(point1x) && isValidExpressionObject(point1y) &&
        isValideIdObjectExpresion(arrayIndexObjects, point1x) && isValideIdObjectExpresion(arrayIndexObjects, point1y)) {
            point =[!isNaN(point1x)?parseFloat(point1x):creationCoordPoint(arrayIndexObjects,point1x),!isNaN(point1y)?parseFloat(point1y):creationCoordPoint(arrayIndexObjects,point1y)];
            return point;
    }
    else if (arrayIndexObjects.length > 0 && regex.test(point1x) && regex.test(point1y) && point1x === point1y && Ids.includes(point1x)) {
        for (var i = 0; i < arrayIndexObjects.length; i++) {
        var index = arrayIndexObjects[i];
        if (objects[index].object.id === point1x) {
            point = objects[index].object;
            break;
        }
        }
    }
    return point;
}
function creationPolygonFactory() {
    var pointsVisualiser = [];
    var points = [];
    var arrayIndexObjects = $('#object-base').val();
    var label = $('#label').val();
    var Ids = [];
    if ($("#object-base").length !== 0)
        arrayIndexObjects.forEach(function (index) {
        Ids.push(objects[index].object.id);
        });

    // Récupérer les coordonnées des sommets à partir des champs de formulaire
    for (var i = 0; i < selectedVertices ; i++) {
        var x = $('#point' + (i + 1) + 'nw').val();
        var y = $('#point' + (i + 1) + 'pw').val();
        var point = createPointPolygon(arrayIndexObjects, x, y);
        pointsVisualiser.push([x,y]);
        points.push(point);
    }

    // Vérifier si tous les points ont été créés avec succès
    var allPointsCreated = points.every(function (point) {
        return point !== null;
    });

    if (allPointsCreated) {
        try {
        var polygon = board.create('polygon', points, { id: 'pl' + ++cmpPolygon, withLabel: true, name: label,
        vertices: {visible : true},
        borders: {visible : true},
    });
        callFunctionPolygon(polygon,{ ids: Ids, point:pointsVisualiser });
        } catch (error) {
        alert("Erreur : Veuillez vérifier les expressions que vous avez fournies !");
        }
    } else {
        alert("Erreur : Veuillez vérifier les expressions que vous avez fournies !");
    }
}
/*
* ************************ ******************* Partie Creation Animation ******************** ***********************
*/
function creationPointFactoryAnimation() {

    var arrayIndexObjects = $('#object-baseaw').val();
    var coordX = $('#coordnaw').val();
    var coordY = $('#coordpaw').val();
    var Ids= [];

    if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0)
    arrayIndexObjects.forEach(function(index) {
        Ids.push(objects[index].object.id);
    });
    if (($('#object-base').length == 0) || (arrayIndexObjects.length == 0 && !isNaN(coordX)  && !isNaN(coordY))) { // for first object point : isNaN(arrayIndexObjects)
        functionsCreationAnimation +=`board.create('point',[${parseFloat(coordX)},${parseFloat(coordY)}],
        {size: 4,color: '${$('#color-pointaw').val()}',fixed : ${$('#fixedaw').prop('checked')},
        trace :  ${$('#traceaw').prop('checked')},`
        if ($('#labelaw').val() !== undefined) functionsCreationAnimation +=`name : ${$('#labelaw').val()},`
        if( $('#style-pointaw').val().length > 0) functionsCreationAnimation +=`face: '${$('#style-pointaw').val()}',`
        functionsCreationAnimation += `label: {fontSize: 15, color: '${$('#color-labelaw').val()}',}})\n`;
        $('#back').click();
    }
    else if (arrayIndexObjects.length > 0  && isValidExpressionObject(coordX) && isValidExpressionObject(coordY) && 
        isValideIdObjectExpresion(arrayIndexObjects,coordX) &&  isValideIdObjectExpresion(arrayIndexObjects,coordY)){
        functionsCreationAnimation +=`board.create('point',[${!isNaN(coordX) ?parseFloat(coordX):creationCoordPoint(arrayIndexObjects,coordX)},${!isNaN(coordY) ?parseFloat(coordY):creationCoordPoint(arrayIndexObjects,coordY)}],
        {size: 4,color: '${$('#color-pointaw').val()}',fixed : ${$('#fixedaw').prop('checked')},
        trace :  ${$('#traceaw').prop('checked')},`
        if ($('#labelaw').val() !== undefined) functionsCreationAnimation +=`name : ${$('#labelaw').val()},`
        if(  $('#style-pointaw').val().length > 0) functionsCreationAnimation +=`face :'${$('#style-pointaw').val()}',`
        functionsCreationAnimation += `label: {fontSize: 15, color: '${$('#color-labelaw').val()}',}})\n`;
        $('#back').click();
    }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit !");
    }
}
function creationTextFactoryAnimation(){
    var arrayIndexObjects = $('#object-baseaw').val();
    var coord2 = $('#coordpaw').val();
    var coord1 = $('#coordnaw').val();
    var string = $('#textaw').val();
    var Ids= [];
    var regex = /(p\d+\.[xy]|s\d+|c\d+\.r|cr\d+\.r)/;
    var f = function (expr) {return new Function("return " + `"${expr}"` + ";");}
    isNaN(coord1) ? coord1 = createCoordText(arrayIndexObjects,coord1): coord1 = parseFloat(coord1);
    isNaN(coord2) ? coord2 = createCoordText(arrayIndexObjects,coord2): coord2 = parseFloat(coord2);

    if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0){
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }
    if(coord1 && coord2 && isValidExpressText(string) ){
        if ($('#object-base').length !== 0 && arrayIndexObjects.length > 0 && isValideIdObjectExpresion(arrayIndexObjects, string) && regex.test(string)) {
           string = creationCoordPoint(arrayIndexObjects, string);
        }
        else if (!regex.test(string))
            string = f(string);
        else{
            alert("Erreur : Merci de verifier les expression que vous avez fournit !");
            return ;
        }
            functionsCreationAnimation += `board.create('text',[${coord1},${coord2},${string}],
            {strokeColor : '${$('#color-objectaw').val()}',fixed : ${$('#fixedaw').prop('checked')},useMathJax :true,}
            );\n`
            $('#back').click();
        }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit !");
    } 
}
function creationLineFactoryAnimation() {
    var point1 = null, point2 = null;
    var arrayIndexObjects = $('#object-baseaw').val();
    var point1x = $('#point1naw').val();
    var point1y = $('#point1paw').val();
    var point2x = $('#point2naw').val();
    var point2y = $('#point2paw').val();
    var regex = /^p\d+$/;
    var Ids= [];
    var ispoint1 = false;
    var ispoint2 = false;

    
    if($("#object-base").length !== 0)
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    if ($("#object-base").length !== 0 && arrayIndexObjects.length > 0 && regex.test(point1x) && regex.test(point1y) && point1x === point1y && Ids.includes(point1x))
    {
        for(var i = 0; i < arrayIndexObjects.length; i++) {
            var index = arrayIndexObjects[i];
            if (objects[index].object.id === point1x) {
                ispoint1 = true
                point1 = `objects[${index}].object`;
                break;
            }
        }  
    }
    if ($("#object-base").length !== 0 && arrayIndexObjects.length > 0 && regex.test(point2x) && regex.test(point2y) && point2x === point2y && Ids.includes(point2x))
    {
        for(var i = 0; i < arrayIndexObjects.length; i++) {
            var index = arrayIndexObjects[i];
            if (objects[index].object.id === point2x) {
                ispoint2 = true
                point2 = `objects[${index}].object`;
                break;
            }
        }  
    }
    point1? point1 : point1 = createPointLine(arrayIndexObjects,point1x,point1y);
    point2? point2 : point2 = createPointLine(arrayIndexObjects,point2x,point2y);

    if(point1 && point2){
        functionsCreationAnimation += `board.create('line',[`
        !ispoint1 ? functionsCreationAnimation += `[${point1}],` : functionsCreationAnimation += `${point1},`;
        !ispoint2 ? functionsCreationAnimation += `[${point2}]],{` : functionsCreationAnimation += `${point2}],{`;
        if( $('#styleaw').val().length > 0) functionsCreationAnimation +=`dash: ${$('#styleaw').val()},`;
        if ($('#labelaw').val() !== '') functionsCreationAnimation +=`name : '${$('#labelaw').val()}',`
        functionsCreationAnimation += `fixed : ${$('#fixedaw').prop('checked')},
        strokeColor :  '${$('#color-objectaw').val()}',
        withLabel : true ,
        label : {
            fontSize :  12,
            strokecolor : '#000000',
        },
        straightfirst : ${!$('#border-point1aw').prop('checked')},
        straightlast :  ${!$('#border-point2aw').prop('checked')},
        });\n`
        $('#back').click();
    }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit!");
        deleteObject(point1);
        deleteObject(point2);
    } 
}
function creationCircleFactoryAnimation(circl=null) {
    var center = null, radius = null;
    var regex = /^p\d+$/;
    var regexc = /^c\d+$/;
    var arrayIndexObjects = $('#object-baseaw').val();
    var centerx = $('#centernaw').val();
    var centery = $('#centerpaw').val();
    var radiusx = $('#radiusnaw').val();
    var radiusy = $('#radiuspaw').val();
    var Ids = [];
    var ispoint1 = false;
    var ispoint2 = false;

    if ($("#object-base").length !== 0) {
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }
    if ($("#object-base").length !== 0 && arrayIndexObjects.length > 0 && ((regex.test(centerx) && regex.test(centery)) || (regexc.test(centerx) && regexc.test(centery))) && centerx === centery && Ids.includes(centerx))
    {
        for(var i = 0; i < arrayIndexObjects.length; i++) {
            var index = arrayIndexObjects[i];
            if (objects[index].object.id === centerx) {
                ispoint1 = true;
                center = `objects[${index}].object`;
                break;
            }
        }  
    }
    if ($("#object-base").length !== 0 && arrayIndexObjects.length > 0 && ((regex.test(radiusx) && regex.test(radiusy)) || (regexc.test(radiusx) && regexc.test(radiusy))) && radiusx === radiusy && Ids.includes(radiusx))
    {
        for(var i = 0; i < arrayIndexObjects.length; i++) {
            var index = arrayIndexObjects[i];
            if (objects[index].object.id === radiusx) {
                ispoint2 = true;
                radius = `objects[${index}].object`;
                break;
            }
        }  
    }
    center? center : center = createPointCircle(arrayIndexObjects, centerx, centery);
    radius? radius : radius = createPointCircle(arrayIndexObjects, radiusx, radiusy);
    if (center && radius) {
            functionsCreationAnimation += `board.create('circle', [`
                !ispoint1 ? functionsCreationAnimation += `[${center}],` : functionsCreationAnimation += `${center},`;
                !ispoint2 ? functionsCreationAnimation += `[${radius}]],{` : functionsCreationAnimation += `${radius}],{`;
                if( $('#styleaw').val().length > 0) functionsCreationAnimation +=`dash: ${$('#styleaw').val()},`;
                if ($('#labelaw').val() !== '') functionsCreationAnimation +=`name : '${$('#labelaw').val()}',`
                if ($('#color-remplissageaw').val() !== '#000000') functionsCreationAnimation +=`fillColor :  '${$('#color-remplissageaw').val()}',`
                functionsCreationAnimation += `
                strokeColor :  '${$('#color-objectaw').val()}',
                withLabel : true ,
                label : {
                    fontSize :  12,
                    strokecolor : '#000000',
                }});\n`
            $('#back').click();
    } else {
        alert("Erreur : Merci de vérifier les expressions que vous avez fournies 3!");
    }
}
function creationImageFactoryAnimation() {
    var point1, point2;
    var arrayIndexObjects = $('#object-baseaw').val();
    var point1x = $('#point1naw').val();
    var point1y = $('#point1paw').val();
    var point2x = $('#point2naw').val();
    var point2y = $('#point2paw').val();
    var url =  $('#urlaw').val();
    var Ids= [];

    if($("#object-base").length !== 0)
    arrayIndexObjects.forEach(function(index) {
        Ids.push(objects[index].object.id);
    });
    point1 = createPointImage(arrayIndexObjects,point1x,point1y);
    point2 = createPointImage(arrayIndexObjects,point2x,point2y);
    if(point1 && point2){
        functionsCreationAnimation +=`board.create('image',['${url}',[${point1}],[${point2}]],{fixed :${$('#fixedaw').prop('checked')}});\n`
        $("#back").click()
    }
    else{
        alert("Erreur : Merci de verifier les expression que vous avez fournit 2!");
    } 
}
function creationFunctionGraphFactoryAnimation() {
    var Ids= [];
    var arrayIndexObjects = $('#object-baseaw').val();
    var arg1 = $('#premier-argaw').val();
    var arg2 = $('#deuxieme-argaw').val();
    var arg3 = $('#troisieme-argaw').val();

    var coord1 = verificationExpreFunctionGrahp(arrayIndexObjects,arg1);
    arg2 === '' ?  coord2 = -10 : coord2 = verificationExpreFunctionGrahp(arrayIndexObjects,arg2);
    arg3 == '' ? coord3 = 10  : coord3 = verificationExpreFunctionGrahp(arrayIndexObjects,arg3);
    
    if ($('#object-baseaw').length !== 0 && arrayIndexObjects.length > 0){
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }
    if (!coord1 || !coord2 || !coord3)
        alert("Erreur : Merci de verifiez vos expressions!")
    else{ 
        try {
            functionsCreationAnimation += `board.create('functiongraph',[${coord1},${coord2},${coord3}],`;
                if ($('#labelaw').val() !== '') functionsCreationAnimation +=`name : '${$('#labelaw').val()}',`
                functionsCreationAnimation += `{
                strokeColor : '${$('#color-objectaw').val()}',
                label :{
                    fontSize : 12,
                    strokeColor : '#000000',
                },
                fixed : ${$('#fixedaw').prop('checked')}})\n`
            $('#back').click()
        } catch (error) {
            alert("Erreur : Merci de verifiez vos expressions!")
        }
    }
}
/*
* ******************************* ******************* Partie Animation ******************** **************************
*/
function startAnimation(){
    eval(functionsMoveAnimation)
}
function nextStep() {
    eval(functionsCreationAnimation) 
};
function getParamsAnimation(animation){
    return ['animation',
        {type:'textarea', attribute: "deplacement",  win : true},
        {type:'button', attribute: "Point",  first : true},
        {type:'button', attribute: "Circle"},
        {type:'button', attribute: "Function"},
        {type:'button', attribute: "Line"},
        {type:'button', attribute: "Image"},
        {type:'button', attribute: "Text", dernier : true},
    ];  
}
function callFunctionAnimation(base=null) {    
    objects.push({type : 'button', base : base});
    $('#windowModal').modal('hide');
}
function modifyStringAnimation(expr, nameFunction=null) {
    let lines = expr.split('\n');
    let result = "";

    if (nameFunction) 
        lines[0] = `${lines[0].trim().substring(0, lines[0].length - 1)}, {effect: '--', callback: nextStep})`;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        let nextLine = lines[i + 1];
        if (/^\d+$/.test(line)) {
            if (nextLine && nextLine.trim() !== '') {
                result += `setTimeout(function() {\n${nextLine}\n}, ${line * 1000});\n`;
                i++;
            }
        } else if (line !== '') {
            result += line + '\n';
        }
    }
    return result;
}
function transformExpressionDeplace(expr, arrayIndexObjects,functionsAnimation) {
    var transformedExpr = expr;
    var indexMap= {};
    var ids = []

    arrayIndexObjects.forEach(function(index) {
        indexMap[objects[index].object.id] = index;
    });
    arrayIndexObjects.forEach(function(index) {
        ids.push(objects[index].object.id);
    });
    for (var i = 0; i < ids.length; i++) {
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i], 'g'), "objects[" + indexMap[ids[i]] + "].object");
    }
    return modifyStringAnimation(transformedExpr,functionsAnimation);
}
function isValideExprDeplacement(str){
    var regex = /^(p|im|t)\d+\.(moveTo|visit)\(\[-?\d+,-?\d+\],\d+\)$|^\d*$|^$/;
    var lines = str.split('\n');
    for (var i = 0; i < lines.length; i++) {
        console.log(lines[i])
        if (!regex.test(lines[i])) {
            return false
        }
    }
    return true
}
function creationAnimationFactory() {
    var arrayIndexObjects = $('#object-base').val();
    var move   = $('#deplacementw').val();
    var Ids= [];
    
    if($("#object-base").length !== 0){
        arrayIndexObjects.forEach(function(index) {
            Ids.push(objects[index].object.id);
        });
    }   
    if($("#object-base").length !== 0 && $('#deplacementw').val().trim().length > 0 && isValideExprDeplacement(move) && isValideIdObjectExpresion(arrayIndexObjects,move)){

        functionsMoveAnimation += transformExpressionDeplace(move,arrayIndexObjects,functionsCreationAnimation !== ''? nextStep : null) 
        callFunctionAnimation({ids:Ids,arg1 : move});
        isAnimation = false;
        $('.button-animation').html(`<img src="./start.png" width="50" height="50" title="reactualise" 
        onclick="startAnimation();" data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">
        <img src="./reset.png" width="50" height="50" title="reactualise" onclick="document.location.reload();"
         data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">
        `)
    }
    else if (functionsCreationAnimation && $('#deplacementw').val() == ''){
        isAnimation = false
        $('.button-animation').html(`<img src="./start.png" width="50" height="50" title="reactualise" 
            onclick="nextStep();" data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">
            <img src="./reset.png" width="50" height="50" title="reactualise" onclick="document.location.reload();"
            data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">`)
            callFunctionAnimation();
        }
    else
        alert("Erreur : Merci de verifier les expression que vous avez fournit !");
}
/*
* ******************************* ******************* Partie Buttons ******************** **************************
*/
function transformExprePointVisualiser(expr,ids){
    var transformedExpr = expr;
    for (var i = 0; i < ids.length; i++) {
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.x\\b", 'g'), "point_"+ids[i]+".X()");
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.y\\b", 'g'), "point_"+ids[i]+".Y()");
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.moveTo\\b", 'g'), "point_"+ids[i]+".moveTo");
        transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.visit\\b", 'g'), "point_"+ids[i]+".visit");
        if (ids[i].startsWith('cr'))
            transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.r\\b", 'g'), "circumcircle_"+ids[i]+".Radius()");
        else if (!ids[i].endsWith('r'))
            transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\.r\\b", 'g'), "circle_"+ids[i]+".Radius()");
        if (ids[i].startsWith('s'))
            transformedExpr = transformedExpr.replace(new RegExp("\\b" + ids[i] + "\\b", 'g'), "slider_"+ids[i]+".Value()");
    }
    return transformedExpr;
}
function remplacerChaine(string) {
    var regex = /objects\[(\d+)\]\.object/g;
    var resultat = string.replace(regex, function(match, index) {
      var nombreQuelconque = parseInt(index); // Conversion en nombre
      var evalString = 'objects[' + nombreQuelconque + '].type + "_" + objects[' + nombreQuelconque + '].object.id';
      return eval(evalString);
    });
    
    return resultat;
}
function getCoordVisualier(obj,coord1,coord2, ids,point1ou2){
    var coord;
    var regex = /^p\d+$/;
    if (regex.test(coord1))
        return 'point_'+coord1.replace(/'/g, '');
    coord = []
    !isNaN(coord1)?  (point1ou2 == 1 ? coord.push(`${obj.point1.X()}`) : coord.push(`${obj.point2.X()}`)): coord.push(`function(){return ${transformExprePointVisualiser(coord1,ids)};}`);
    !isNaN(coord2)? (point1ou2 == 1 ? coord.push(`${obj.point1.Y()}`) : coord.push(`${obj.point2.Y()}`)) : coord.push(`function(){return ${transformExprePointVisualiser(coord2,ids)};}`);
    return coord;
}
function getCoordVisualierText(obj,coord1,coord2, ids){
    var coord = [];
    var points = obj.coords.usrCoords.slice(1)
    !isNaN(coord1)? coord.push(`${points[0]}`): coord.push(`function(){return ${transformExprePointVisualiser(coord1,ids)};}`);
    !isNaN(coord2)? coord.push(`${points[1]}`): coord.push(`function(){return ${transformExprePointVisualiser(coord2,ids)};}`);
    return coord;
}
function getCoordVisualierImg(obj,coord1,coord2, ids, size=null){
    var coord = []
    !isNaN(coord1)? (size ? coord.push(`${obj.usrSize[0]}`): coord.push(`${obj.X()}`)): coord.push(`function(){return ${transformExprePointVisualiser(coord1,ids)};}`);
    !isNaN(coord2)? (size ? coord.push(`${obj.usrSize[1]}`): coord.push(`${obj.X()}`)) : coord.push(`function(){return ${transformExprePointVisualiser(coord2,ids)};}`);
    return coord;
}
function getCoordVisualierCircle(obj,coord1,coord2, ids,raduioupoint){
    var coord;
    var regex  = /^p\d+$/;
    var regexC = /^c\d+$/;
    if (regex.test(coord1))
        return 'point_'+coord1.replace(/'/g, '');
    if (regexC.test(coord1)){
        isCircle = true;
        return 'circle_'+coord1.replace(/'/g, '');
    }
    coord = []
    if(raduioupoint == 3){
        !isNaN(coord1)?coord.push(`${coord1}`):coord.push(`function(){return ${transformExprePointVisualiser(coord1,ids)};}`);
        !isNaN(coord1)?coord.push(`${coord2}`):coord.push(`function(){return ${transformExprePointVisualiser(coord2,ids)};}`);
    }
    else{
        !isNaN(coord1)?(raduioupoint === 1 ? coord.push(`${obj.center.X()}`): (!isCircle ? coord.push(`${obj.point2.X()}`):coord.push(`${obj.center.X()}`))) : coord.push(`function(){return ${transformExprePointVisualiser(coord1,ids)};}`);
        !isNaN(coord2)?(raduioupoint === 1 ? coord.push(`${obj.center.Y()}`):(!isCircle ? coord.push(`${obj.point2.Y()}`):coord.push(`${obj.center.Y()}`))) : coord.push(`function(){return ${transformExprePointVisualiser(coord2,ids)};}`);
    }
    return coord;
}
function getCoordVisualierPolygon(obj, coord1, coord2, ids, nmbrePoint){
    var coordinates = obj.borders.map(function(border) {
        return [border.point1.X(), border.point1.Y()];
    });
    var coord;
    var regex = /^p\d+$/;
    if (regex.test(coord1))
        return 'point_'+coord1.replace(/'/g, '');
    coord = []
    !isNaN(coord1)?  coord.push(`${parseFloat(coordinates[nmbrePoint][0])}`) : coord.push(`function(){return ${transformExprePointVisualiser(coord1,ids)};}`);
    !isNaN(coord2)?  coord.push(`${parseFloat(coordinates[nmbrePoint][1])}`) : coord.push(`function(){return ${transformExprePointVisualiser(coord2,ids)};}`);
    return coord;
}
function getAxiCode(axiObje,typeAxe){
    var jsCode;
    
    jsCode= ` var ${typeAxe} = board.create('axis', `;
    typeAxe=='yaxis' ? jsCode += `[[0, 0], [0,1]],` :  jsCode+= `[[0, 0], [1,0]],`;

    jsCode += `{
    name:'${axiObje.name}', 
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

    jsCode = `var slider_${slider.id} = board.create('slider', [[${pointCoordsA[0]},${pointCoordsA[1]}],
        [${pointCoordsB[0]},${pointCoordsB[1]}],[${slider._smin},1,${slider._smax}]]
        ,{  
            id : '${slider.id}',
            visible : ${slider.getAttribute('visible')},
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
function getPointCode(object) {
    var coordX;
    var coordY;
    var jsCode;

    !isNaN(object.base.coordX)? coordX = object.object.coords.usrCoords[1] : coordX = `function(){return ${transformExprePointVisualiser(object.base.coordX,object.base.ids)};}`
    !isNaN(object.base.coordY)? coordY = object.object.coords.usrCoords[2] : coordY = `function(){return ${transformExprePointVisualiser(object.base.coordY,object.base.ids)};}`

    jsCode = `var point_${object.object.id} = board.create('point', [${coordX}, ${coordY}],
        { 
            id : '${object.object.id}',
            face :  '${object.object.getAttribute('face')}',
            size: ${object.object.getAttribute('size')},   
            name: '${object.object.name}', 
            color: '${object.object.getAttribute('color')}', 
            fixed : ${object.object.getAttribute('fixed')},
            trace : ${object.object.getAttribute('trace')},
            opacity : ${object.object.getAttribute('opacity')},
            label: {
                fontSize: ${object.object.label.getAttribute('fontsize')}, 
                color: '${object.object.getAttribute('label').strokecolor}',
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

    isNaN(object.coords.arg1) ? coord1 = exprToFunctionGraphAffiche(transformExprePointVisualiser(object.coords.arg1, object.coords.ids)).toString().replace('function anonymous', 'function') : coord1 = parseFloat(object.coords.arg1)
    isNaN(object.coords.arg2) ? coord2 = exprToFunctionGraphAffiche(transformExprePointVisualiser(object.coords.arg2, object.coords.ids)).toString().replace('function anonymous', 'function') : coord2 = parseFloat(object.coords.arg2)
    isNaN(object.coords.arg3) ? coord3 = exprToFunctionGraphAffiche(transformExprePointVisualiser(object.coords.arg3, object.coords.ids)).toString().replace('function anonymous', 'function') : coord3 = parseFloat(object.coords.arg3)

    if (coord2 == '') coord2 = -10;
    if (coord3 == '') coord3 = 10;
    jsCode =
    `var functiongraph_${object.object.id} = board.create('functiongraph',[${coord1},${coord2},${coord3}],
    {
        id : '${object.object.id}',
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
function getTextCode(object){
    var coord;
    var jsCode;
    var text;
    var f = function (expr) {return new Function("return " + `"${expr}"` + ";");}
    var regex = /(p\d+\.[xy]|s\d+|c\d+\.r|cr\d+\.r)/;

    coord = getCoordVisualierText(object.object,object.base.arg1, object.base.arg2, object.base.ids)
    regex.test(object.base.arg3) ? text = `function(){return ${transformExprePointVisualiser(object.base.arg3,object.base.ids)};}` : text = f(`'${object.base.arg3}'`); 
   
    jsCode = `
    var text_${object.object.id} = board.create('text',[${coord},${text}],
    {
        id : '${object.object.id}',
        visible : ${object.object.getAttribute("visible")},
        fontSize : ${object.object.getAttribute('fontsize')},
        strokeColor : '${object.object.getAttribute('strokecolor')}',
        fixed : ${object.object.getAttribute('fixed')},
        useMathJax :true,
    });\n`
    return jsCode;
}
function getLineCode(object){

    var jsCode;
    var coord1 = getCoordVisualier(object.object,object.base.arg1,object.base.arg2, object.base.ids,1);
    var coord2 = getCoordVisualier(object.object,object.base.arg3,object.base.arg4, object.base.ids,2); 
    jsCode = `
    var line_${object.object.id} = board.create('line',[`
    typeof(getCoordVisualier(object.object,object.base.arg1,object.base.arg2, object.base.ids,1)) === 'string' ? jsCode += `${coord1},`: jsCode +=`[${coord1}],`
    typeof(getCoordVisualier(object.object,object.base.arg3,object.base.arg4, object.base.ids,2)) === 'string' ? jsCode += `${coord2}`: jsCode +=`[${coord2}]`
    jsCode += `],
    {
        id : '${object.object.id}',
        dash : ${object.object.getAttribute('dash')},
        visible : ${object.object.getAttribute("visible")},
        withLabel : true ,
        name : '${object.object.name}',
        fixed : ${object.object.getAttribute('fixed')},
        strokeWidth : ${object.object.getAttribute('strokewidth')},
        strokeColor : '${object.object.getAttribute('strokecolor')}',
        label : {
            fontSize :  ${object.object.label.getAttribute('fontsize')},
            strokecolor : '${object.object.getAttribute('label').strokecolor}',
        },
        straightfirst : ${object.object.getAttribute('straightfirst')},
        straightlast :  ${object.object.getAttribute('straightlast')},
    });\n`
    return jsCode;
}
function getImageCode(object){

    var jsCode;
    var coord1 = getCoordVisualierImg(object.object,object.base.arg1,object.base.arg2, object.base.ids);
    var coord2 = getCoordVisualierImg(object.object,object.base.arg3,object.base.arg4, object.base.ids,'size'); 
    jsCode = `
    var image_${object.object.id} = board.create('image',["${object.base.url}",[${coord1}],[${coord2}]],
    {
        id : '${object.object.id}',
        visible : ${object.object.getAttribute("visible")},
        fixed : ${object.object.getAttribute('fixed')},
    });\n`
    return jsCode;
}
function getCircleCode(object,circum=null){

    var jsCode;
    var coord1 = getCoordVisualierCircle(object.object,object.base.arg1,object.base.arg2,object.base.ids,circum? 3:1);
    var coord2 = getCoordVisualierCircle(object.object,object.base.arg3,object.base.arg4,object.base.ids,circum? 3:2); 
    if (circum) var coord3 = getCoordVisualierCircle(object.object,object.base.arg5,object.base.arg6,object.base.ids,3); 

    if(!circum){
        jsCode = `
        var circle_${object.object.id} = board.create('circle',[`
        typeof(coord1) === 'string' ? jsCode += `${coord1},`: jsCode +=`[${coord1}],`
        typeof(coord2) === 'string' ? jsCode += `${coord2}`: jsCode +=`[${coord2}]`
    }
    else{
        jsCode = `
        var circumcircle_${object.object.id} = board.create('circumcircle',[`
        typeof(coord1) === 'string' ? jsCode += `${coord1},`: jsCode +=`[${coord1}],`
        typeof(coord2) === 'string' ? jsCode += `${coord2},`: jsCode +=`[${coord2}],`
        typeof(coord3) === 'string' ? jsCode += `${coord3}`: jsCode +=`[${coord3}]`
    }
    jsCode += `],
    {
        id : '${object.object.id}',
        dash : ${object.object.getAttribute('dash')},
        visible : ${object.object.getAttribute("visible")},
        withLabel : true ,
        name : '${object.object.name}',
        fixed : ${object.object.getAttribute('fixed')},
        strokeWidth : ${object.object.getAttribute('strokewidth')},
        strokeColor : '${object.object.getAttribute('strokecolor')}',
        label : {
            fontSize :  ${object.object.label.getAttribute('fontsize')},
            strokecolor : '${object.object.getAttribute('label').strokecolor}',
        },
        fillColor : '${object.object.getAttribute('fillcolor')}'
        
    });\n`
    isCircle = false;
    return jsCode;
}
function getPolygonCode(object){
    var jsCode;
    var pointPoly= '';
    for(i=0; i<object.object.vertices.length -1; i++){
        var coord = getCoordVisualierPolygon(object.object, object.base.point[i][0], object.base.point[i][1], object.base.ids,i);
        if(i == object.object.vertices.length-2){
            typeof(coord) === 'string' ? pointPoly += `${coord},` : pointPoly += `[${coord}]`
        }else {
            typeof(coord) === 'string' ? pointPoly += `${coord},` : pointPoly += `[${coord}],`
        }
    }

    jsCode = `
    var polygon_${object.object.id} = board.create('polygon',[${pointPoly}],
    {
        id : '${object.object.id}',
        visible : ${object.object.getAttribute("visible")},  
        name: '${object.object.name}',
        trace : ${object.object.getAttribute("trace")},
        fillColor: '${object.object.getAttribute("fillColor")}', 
        fillOpacity: ${object.object.getAttribute("fillOpacity")},        
        fixed: ${object.object.getAttribute("fixed")},            
        withLabel: ${object.object.getAttribute("withLabel")},  
        label : {
            fontSize :  ${object.object.label.getAttribute('fontsize')},
            strokecolor : '${object.object.getAttribute('label').strokecolor}',
        }, 
        name : '${object.object.name}',
        vertices: {visible : ${object.object.getAttribute('vertices').visible}},
        borders: {visible : ${object.object.getAttribute('borders').visible}},
    });\n`;
    return jsCode;
}
function getAnimationCode(obj){
    var jsCode = ''
    if(functionsCreationAnimation !== ''){
        jsCode += `function nextStep() {
            ${remplacerChaine(functionsCreationAnimation)}
        }`
    }
    if(functionsMoveAnimation !== ''){
        jsCode += 'function startAnimation() {'
        obj.base == 'importer' ? jsCode += `${functionsMoveAnimationImporter}}` : jsCode += `${modifyStringAnimation(transformExprePointVisualiser(obj.base.arg1,obj.base.ids),functionsCreationAnimation !== ''? 'an':null)}
        }`
    }
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
    var htmlCode = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <!-------------------------------------------- SECTION JSXGRAPH ------------------------------------------------->;
            <link rel="stylesheet" type="text/css" href="https://jsxgraph.org/distrib/jsxgraph.css" />
            <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
            <script type="text/javascript" src="https://jsxgraph.org/distrib/jsxgraphcore.js"></script>
            <title>Editor</title>
        </head>
        <body>
            <div id="box" style="background-image: ${$('#box').css('background-image')}; background-repeat:no-repeat;background-size:cover;"> </div >`
            if (functionsMoveAnimation !== '')  htmlCode +=`<img src="./start.png" width="50" height="50" title="reactualise" 
            onclick="startAnimation();" data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">`
            else if (functionsMoveAnimation === '' && functionsCreationAnimation !== '')  htmlCode +=`<img src="./start.png" width="50" height="50" title="reactualise" 
             onclick="nextStep();" data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">`
            htmlCode +=`</body>
    </html>`;
    
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
    JXG.Options.text.useMathJax = true;	
    board.renderer.container.style.backgroundColor = "${rgbToHex(board.renderer.container.style.backgroundColor)}";\n`

    jsCode += getAxiCode(xaxis,'axix');
    jsCode += getAxiCode(yaxis,'yaxis');
    jsCode += `var grid = board.create('grid', [],{ visible:${grid.getAttribute('visible')}});\n`;

    objects.forEach((obj) => {
        switch (obj.type) {
            case 'point':
                jsCode += getPointCode(obj);
                break;
            case 'slider':
                jsCode += getSliderCode(obj.object);
                break;
            case 'polygon':
                jsCode += getPolygonCode(obj);
                break;
            case 'functionGraph':
                jsCode += getFunctionCode(obj);
                break;
            case 'text':
                jsCode += getTextCode(obj);
                break;
            case 'line':
                jsCode += getLineCode(obj);
                break;
            case 'image':
                jsCode += getImageCode(obj);
                break;
            case 'circle':
                jsCode += getCircleCode(obj);
                break;
            case 'circumcircle':
                jsCode += getCircleCode(obj,1);
                break;
            case 'button':
                jsCode += getAnimationCode(obj);
                break;
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
        objects.forEach((obj) => {
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
/*
* ************************** ******************* Partie Image background ******************** ************************
*/
$('#backgroundImage').on('change', function(event) {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        backgroundImageUrl = this.result;
        $('#box').css('background-image','url(' + backgroundImageUrl + ')');
        $('.background').css('display', 'inline');    
        $(event.target).val('');
    };
    fileReader.readAsDataURL(event.target.files[0]);
    picHere = true;
});
$('#uploadButton').on('click', function() {
    $('#backgroundImage').click();
});
/*
* ************************** ******************* Partie importation ******************** **************************
*/
$('#importerButton').on('click', function() {
    $('#importerInput').click();
});
function extractTypes(code) {
    var types = [];
  
    var regex = /board\.create\('(\w+)'[^)]*\)/g;
    var match;
  
    while ((match = regex.exec(code)) !== null) {
        var variableName = match[1];
        var variableType = variableName.replace(/[0-9]/g, '');
        types.push(variableType);
    }
  
    return types;
}
function supprimerNextStep(str) {
    var startIdx = str.indexOf("function nextStep() {") + 20;
    var endIndex = str.lastIndexOf("}");
    
    var openBracketsCount = 0;
    var closedBracketsCount = 0;
    if (str.indexOf("function nextStep() {") > 0 || str.includes('nextStep()')){
        for (var i = startIdx; i <= endIndex; i++) {
        if (str[i] === "{") {
            openBracketsCount++;
            if (openBracketsCount === 1) {
            startIdx = i + 1;
            }
        } else if (str[i] === "}") {
            closedBracketsCount++;
            
            if (openBracketsCount === closedBracketsCount) {
            endIndex = i;
            break;
            }
        }
        }
        const animationCode = str.slice(startIdx, endIndex).trim();
        str = str.substring(0, startIdx) + str.substring(endIndex + 1);
    }
    return str;
}
function extraireCreations(code) {
    const regex = /board\.create\([\s\S]+?}\);/g;
    const matches = code.match(regex);
  
    if (matches) {
      return matches.map(match => match.trim());
    } else {
      return [];
    }
}
function replaceObjectsInString(str) {
    return str.replace(/point_p(\d+)/g, function(match, number) {
      var index = findIndex("p" + number);
      if (index !== -1) {
        return "objects[" + index + "].object";
      } else {
        return match;
      }
    }).replace(/circle_c(\d+)/g, function(match, number) {
      var index = findIndex("c" + number);
      if (index !== -1) {
        return "objects[" + index + "].object";
      } else {
        return match;
    }
    }).replace(/slider_s(\d+)/g, function(match, number) {
    var index = findIndex("s" + number);
    if (index !== -1) {
      return "objects[" + index + "].object";
    } else {
      return match; 
    }
  }).replace(/image_im(\d+)/g, function(match, number) {
    var index = findIndex("im" + number);
    if (index !== -1) {
      return "objects[" + index + "].object";
    } else {
      return match; 
    }
  }).replace(/circumcircle_cr(\d+)/g, function(match, number) {
    var index = findIndex("cr" + number);
    if (index !== -1) {
      return "objects[" + index + "].object";
    } else {
      return match;
    }
  });
}
function findIndex(id) {
for (var index = 0; index < objects.length; index++) {
    var object = objects[index].object;
    if (object.id === id) {
    return index;
    }
}
return -1; 
}
function trouverIdsBase(code) {
    const regex = /(point|slider|circle|circumcircle)_(\w+)/g;
    const matches = code.match(regex);
    
    if (matches) {
      return matches.map(match => match.split('_')[1]);
    }

    return [];
} 
function parseBoardCode(code) {

  const regex = /board\.create\(['"](?:slider|circle|circumcircle|functiongraph|image|polygon|point|axis|grid|line|text)['"],\s*\[([\s\S]*?)\](?:,\s*\{([\s\S]*?)\})?\)/g;
  const results = [];

  let match;
  while ((match = regex.exec(code)) !== null) {
    const params = match[1];
    results.push(params);
  }

  return results;
}
function parseStringList(str) {
    const result = [];
    let current = '';
    let count = 0;
  
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '[') {
        count++;
      } else if (str[i] === ']') {
        count--;
      }
  
      current += str[i];
  
      if (str[i] === ',' && count === 0) {
        result.push(current.slice(0, -1).trim()); // Exclure la virgule finale
        current = '';
      }
    }
  
    if (current !== '') {
      result.push(current.trim());
    }
  
    return result;
}
function supprimerDoublons(tableau) {
    return [...new Set(tableau)];
}
function ExpressionToCoord(str) {
  if (isNaN(str)) {
    if (
      (str.includes("function") && str.includes("return") && str.includes(";")) ||
      /^point_p\d+$/.test(str) ||
      /^circle_c\d+$/.test(str)
    ) {
      let result = "";
      if (str.includes("return") && str.includes(";")) {
        const startIndex = str.indexOf("return") + 6;
        const endIndex = str.lastIndexOf(";");
        result = str.slice(startIndex, endIndex).trim();
      } else {
        result = str;
      }
      result = result.replace(/point_p(\d+)/g, "p$1");
      result = result.replace(/circle_c(\d+)/g, "c$1");
      result = result.replace(/circumcircle_cr(\d+)/g, "cr$1");
      result = result.replace(/slider_s(\d+)/g, "s$1");
      result = result.replace(/\.X\(\)/g, ".x");
      result = result.replace(/\.Y\(\)/g, ".y");
      result = result.replace(/\.Radius\(\)/g, ".r");
      result = result.replace(/\.Value\(\)/g, "");

      return result;
    } else {
      return "La chaîne n'est pas une fonction valide.";
    }
  } else {
    return str;
  }
}
function parseStringToArray(inputString) {
    const trimmedString = inputString.slice(1, -1);
    const array = trimmedString.split(',');
    const trimmedArray = array.map(item => item.trim());
    return trimmedArray;
}
function getBoundingBoxFunction(inputText){
    const regex = /boundingbox:\s*\[([\d\s,-]+)\]/;
    const match = inputText.match(regex);
    
    if (match && match.length > 1) {
      return match[1].split(',').map(Number);
    }
}
function getFunctionCreationAnimaton(str) {
    var startIdx = str.indexOf("function nextStep() {") + 20;
    var endIndex = str.lastIndexOf("}");
    
    var openBracketsCount = 0;
    var closedBracketsCount = 0;
    if (str.indexOf("function nextStep() {") > 0 || str.includes('nextStep()')){
        for (var i = startIdx; i <= endIndex; i++) {
        if (str[i] === "{") {
            openBracketsCount++;
            if (openBracketsCount === 1) {
            startIdx = i + 1;
            }
        } else if (str[i] === "}") {
            closedBracketsCount++;
            
            if (openBracketsCount === closedBracketsCount) {
            endIndex = i;
            break;
            }
        }
        }
        const animationCode = str.slice(startIdx, endIndex).trim();
        return animationCode;
    }
    return '';
}
function getFunctionMoveAnimaton(str) {
    var startIdx = str.indexOf("function startAnimation() {") + 26;
    var endIndex = str.lastIndexOf("}");
    
    var openBracketsCount = 0;
    var closedBracketsCount = 0;
    
    if (str.indexOf("function startAnimation() {") > 0 || str.includes('startAnimation()')){
    for (var i = startIdx; i <= endIndex; i++) {
      if (str[i] === "{") {
        openBracketsCount++;
        if (openBracketsCount === 1) {
          startIdx = i + 1;
        }
      } else if (str[i] === "}") {
        closedBracketsCount++;
        
        if (openBracketsCount === closedBracketsCount) {
          endIndex = i;
          break;
        }
      }
    }
    const animationCode = str.slice(startIdx, endIndex).trim();
    return animationCode;
    }
    return '';
}
$('#importerInput').on('change', function(event) {
    objects.forEach((obj) => {
        obj.object.setAttribute({visible :!obj.object.getAttribute('visible')});
        board.removeObject(obj.object);
    });
    objects = [];
    functionsCreationAnimation = '';
    functionsMoveAnimation = '';
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var importedCode = this.result;
        var creationObjects = extraireCreations(supprimerNextStep(importedCode));
        var variablesTypes = extractTypes(supprimerNextStep(importedCode));   
        console.log(creationObjects)
        console.log(variablesTypes)
        board.setBoundingBox(getBoundingBoxFunction(importedCode));
        variablesTypes.forEach((obj,index) => {
        switch(obj){
            case 'grid' :
                gridImpo = eval(creationObjects[index]);
                grid.setAttribute({visible: gridImpo.getAttribute('visible')})
                break;
            case 'axis':
                 if(parseStringList(parseBoardCode(creationObjects[index])[0])[1][0] == 1)
                    xaxis = eval(creationObjects[index])
                else
                    yaxis = eval(creationObjects[index])
                break;
            case 'text' :
                cmpText++
                text = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabString = parseBoardCode(creationObjects[index]);
                tabCoords = parseStringList(tabString[0]);
                callFunctionText(text,{ids:tabIds,arg1 :ExpressionToCoord(tabCoords[0]) , arg2:ExpressionToCoord(tabCoords[1]) , arg3 :ExpressionToCoord(tabCoords[2])});
                break;
            case 'image' :
                cmpImage++;
                image = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabString = parseBoardCode(creationObjects[index]);
                tabCoords = parseStringList(tabString[0]);
                callFunctionImage(image,{ids:tabIds,arg1 :ExpressionToCoord(parseStringToArray(tabCoords[1])[0]), 
                    arg2:ExpressionToCoord(parseStringToArray(tabCoords[1])[1]),
                    arg3:ExpressionToCoord(parseStringToArray(tabCoords[2])[0]),
                    arg4:ExpressionToCoord(parseStringToArray(tabCoords[2])[1]),
                    url :tabCoords[0].replace(/'/g, '')});
                break;
            case 'point':
                cmpPoint++;
                var point = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabCoords = parseStringList(tabString[0]);
                callFunctionPoint(point,tabIds.length > 0 ? true : false,{ids:tabIds,coordX : ExpressionToCoord(tabCoords[0]), coordY: ExpressionToCoord(tabCoords[1])});
                break;
            case 'slider':
                cmpSlider++;
                var slider = eval(creationObjects[index]);
                callFunctionSlider(slider);
                break;
            case 'functiongraph':
                cmpFunction++;
                var functiongraph = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabCoords = parseStringList(tabString[0]);   
                callFunctionGraph(functiongraph,{arg1:ExpressionToCoord(tabCoords[0]),arg2:ExpressionToCoord(tabCoords[1]),
                    arg3:ExpressionToCoord(tabCoords[2]),ids:tabIds});
                break;
            case 'polygon':
                cmpPolygon++;
                pointsVisualiser = [];
                polygon = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabCoords = parseStringList(tabString[0]);
                for (var j = 0; j < tabCoords.length ; j++) {    
                    tabCoords[j].includes('[') ? pointsVisualiser.push([ExpressionToCoord(parseStringToArray(tabCoords[j])[0]),ExpressionToCoord(parseStringToArray(tabCoords[j])[1])]) : pointsVisualiser.push([ExpressionToCoord(tabCoords[j]),ExpressionToCoord(tabCoords[j])]);
                }               
                callFunctionPolygon(polygon,{ids:tabIds,point : pointsVisualiser});
                break;
            case 'line':
                cmpLine++;
                line = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabCoords = parseStringList(tabString[0]);             
                callFunctionLine(line,{ids:tabIds,
                    arg1: tabCoords[0].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[0])[0]) : ExpressionToCoord(tabCoords[0]),
                    arg2: tabCoords[0].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[0])[1]) : ExpressionToCoord(tabCoords[0]),
                    arg3: tabCoords[1].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[1])[0]) : ExpressionToCoord(tabCoords[1]),
                    arg4: tabCoords[1].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[1])[1]) : ExpressionToCoord(tabCoords[1]),
                });
                break;
            case 'circle':
                cmpCircle++;
                circle = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabCoords = parseStringList(tabString[0]);    
                callFunctionCircle(circle,{ids:tabIds,
                     arg1: tabCoords[0].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[0])[0]) : ExpressionToCoord(tabCoords[0]),
                     arg2: tabCoords[0].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[0])[1]) : ExpressionToCoord(tabCoords[0]),
                     arg3: tabCoords[1].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[1])[0]) : ExpressionToCoord(tabCoords[1]),
                     arg4: tabCoords[1].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[1])[1]) : ExpressionToCoord(tabCoords[1]),
                    });
                break;
            case 'circumcircle':
                cmpCircumcle++;
                circumcircle = eval(replaceObjectsInString(creationObjects[index]));
                tabString = parseBoardCode(creationObjects[index]);
                tabIds = supprimerDoublons(trouverIdsBase(tabString[0]));
                tabCoords = parseStringList(tabString[0]);    
                callFunctionCircle(circumcircle,{ids:tabIds,
                     arg1: tabCoords[0].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[0])[0]) : ExpressionToCoord(tabCoords[0]),
                     arg2: tabCoords[0].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[0])[1]) : ExpressionToCoord(tabCoords[0]),
                     arg3: tabCoords[1].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[1])[0]) : ExpressionToCoord(tabCoords[1]),
                     arg4: tabCoords[1].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[1])[1]) : ExpressionToCoord(tabCoords[1]),
                     arg5: tabCoords[2].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[2])[0]) : ExpressionToCoord(tabCoords[2]),
                     arg6: tabCoords[2].includes('[') ? ExpressionToCoord(parseStringToArray(tabCoords[2])[1]) : ExpressionToCoord(tabCoords[2]),
                    },'circ');
                break;
        }
        });
        functionsCreationAnimation = replaceObjectsInString(getFunctionCreationAnimaton(importedCode))
        functionsMoveAnimationImporter = getFunctionMoveAnimaton(importedCode)
        functionsMoveAnimation = replaceObjectsInString(getFunctionMoveAnimaton(importedCode))
        if (functionsMoveAnimation !== ''){
            $('.button-animation').html(`<img src="./start.png" width="50" height="50" title="reactualise" 
            onclick="startAnimation();" data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">
            `)
            callFunctionAnimation('importer');
        }
        else if (functionsMoveAnimation == '' && functionsCreationAnimation !== ''){
            $('.button-animation').html(`<img src="./start.png" width="50" height="50" title="reactualise" 
            onclick="nextStep();" data-toggle="tooltip" style="text-decoration:none;cursor:pointer;">
            `)
            callFunctionAnimation();
        }
        $(event.target).val('');
    };
    fileReader.readAsText(event.target.files[0]);
});