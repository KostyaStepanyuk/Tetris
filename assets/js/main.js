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

    // Записываем старые координаты
    shape.oldX = shape.x;
    shape.oldY = shape.y;
    
    // Изменяем текущие координаты
    if (EO.key === 'ArrowLeft') 
        if (isNextMoveAvaible(field, currentValues, EO.key)) shape.move('moveLeft');
    if (EO.key === 'ArrowRight') 
        if (isNextMoveAvaible(field, currentValues, EO.key)) shape.move('moveRight');
    if (EO.key === 'ArrowDown') 
        if (isNextMoveAvaible(field, currentValues, EO.key)) shape.move('moveDown');
    if (EO.key === 'ArrowUp') 
        // if (isNextMoveAvaible(field, currentValues, EO.key)) 
        shape.move('rotate');

    // Очищаем поле
    field.redraw();

    // Обновляем новые координаты
    field.updateCoordinates(shape);
    
    // Перерисовываем фигурку
    shape.draw(shape, field);

    console.table(field.grid);
}

function isNextMoveAvaible(field, currentShape, nextMove) {
    let posibleX = 0, posibleY = 0;
    
    if (nextMove === 'ArrowLeft') posibleX = -1;
    if (nextMove === 'ArrowRight') posibleX = 1;
    if (nextMove === 'ArrowDown') posibleY = 1;
    
    for (let i = 0; i < currentShape.shape.length; i++){
        for (let j = 0; j < currentShape.shape[i].length; j++){
            if (currentShape.shape[i][j] > 0){
                if (currentShape.x + j + posibleX < 0 || currentShape.x + j + posibleX > field.grid[0].length - 1) 
                    return false;
                if (currentShape.y + i + posibleY < 0 || currentShape.y + i + posibleY > field.grid.length - 1) 
                    return false;
                if (field.grid[currentShape.y + i + posibleY][currentShape.x + j + posibleX] >= 1 && 
                    field.grid[currentShape.y + i + posibleY][currentShape.x + j + posibleX] <= 7) 
                    return false;
            }
        }
    }
    return true;
}


    

    

let shape = new Shape(context, colors[1], shapes.Z, [3, 0]);

function play(){
    field.reset();
    document.addEventListener('keydown', moveShape);
    field.updateCoordinates(shape);
    shape.draw(shape, field);
}