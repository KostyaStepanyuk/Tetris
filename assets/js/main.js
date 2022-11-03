"use strict";

// Переменные
let fieldParam = {
    width: 400,
    height: 800
}

let shapes = {
    I: 1,
    O: 2,
    Z: 3,
    S: 4,
    T: 5,
    L: 6,
    J: 7
}

let blockSize = fieldParam.width / 10; // Ширина/высота ячейки/кубика
let outlineWidth = 4; // Ширина линии обводки
let outlineGap = outlineWidth / 2; // Ширина линии обводки
let fieldLeft = fieldParam.width / 2 + outlineGap,
    fieldRight = fieldParam.width / 2 + fieldParam.width + outlineGap;



// Поиск канваса
let canvas = document.getElementById("canvas");
canvas.width = fieldParam.width * 2;
canvas.height = fieldParam.height;
let context = canvas.getContext('2d');



let field = new Field(context);
let shape = new Shape(context);



function drawShape(shapeID, startingPos){

    switch(shapeID){
        case 1:
            context.fillStyle = "red";
            
    }
}

drawShape(shapes.L, [4, 3]);