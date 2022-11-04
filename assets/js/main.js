"use strict";

// Переменные
let fieldParam = {
    width: 400,
    height: 800
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





function moveShape(EO){
    EO = EO || window.event;
    EO.preventDefault();
    // Получить текущие координаты и фигурку
    let currentValues = {
        shape : shape.shape,
        x: shape.x,
        y: shape.y
    }
    // TODO: Добавить проверку

    // Изменить текущие координаты
    if (EO.key === 'ArrowLeft') shape.move('moveLeft');
    if (EO.key === 'ArrowRight') shape.move('moveRight');
    if (EO.key === 'ArrowDown') shape.move('moveDown');
    if (EO.key === 'ArrowUp') shape.move('rotate');
    // Очистить поле
    field.redraw();
    // Перерисовать фигурку
    shape.draw(shape);

    field.updateCoordinates(shape);
    console.table(field.grid);
}


function play(){
    field.reset();
    document.addEventListener('keydown', moveShape);
    
    
}


let shape = new Shape(context, colors.Z, shapes.Z, [3, 0]);
shape.draw(shape);