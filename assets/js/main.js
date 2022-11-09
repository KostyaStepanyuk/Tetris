"use strict";

// Параметры поля
let fieldScreenParam = {
    width: 400,
    height: 880
}

// Создаём общий "мешок" фигурок
let mainBag = Array(7);
(function createMainBag() {
    // Заполняем главный мешок 9 мешков по 7 элементов:
    for (let i = 0; i < 9; i++) {
        // Создаём внутренний мешок
        let innerBag = createInnerBag(); 
        
        // Закидываем готовый внутренний мешок в главный
        mainBag[i] = innerBag;
    }
})();

function createInnerBag() {
    let innerBag;
    // Генерируем готовый внутренний мешок
    for (let j = 0; j < 7; j++) {
        innerBag = Array.from({length: 7}, (_, i) => i + 1); // Заполняем внутренний мешок числами от 1 до 7
        shuffle(innerBag); // Перемешиваем содержимое 'мешка'
    }
    return innerBag;
}

// Счётчик текущей фигуры
let currentShapeNumber = 0;


let blockSize = fieldScreenParam.width / 10;                                        // Ширина/высота кубика
let outlineWidth = 4;                                                               // Ширина линии обводки
let outlineGap = outlineWidth / 2;                                                  // Ширина промежутка линии обводки
let fieldLeft = fieldScreenParam.width / 2 + outlineGap,                            // Левый край поля
    fieldRight = fieldScreenParam.width / 2 + fieldScreenParam.width + outlineGap;  // Правый край поля

// Поиск канваса
let canvas = document.getElementById("canvas");
canvas.width = fieldScreenParam.width * 2;    // Устанавливаем ширину канваса
canvas.height = fieldScreenParam.height;      // Устанавливаем высоту канваса
let context = canvas.getContext('2d');  // Получаем контекст для рисования

// Создаём экземпляр поля
let field = new Field(context);
// Создаём экземпляр фигурки
let shape = new Shape(context);

// Передвинуть фигурку
function moveShape(EO){
    EO = EO || window.event;
    EO.preventDefault();

    // Получить текущие координаты и фигурку
    let currentValues = {
        shape : shape.shape,
        x: shape.x,
        y: shape.y
    }
    console.log(EO.key);
    // Проверяем доступность хода и изменяем текущие координаты
    if (EO.key === 'ArrowLeft') 
        if (isNextMoveAvaible(field, shape, EO.key)) shape.move('moveLeft');
    if (EO.key === 'ArrowRight') 
        if (isNextMoveAvaible(field, shape, EO.key)) shape.move('moveRight');
    if (EO.key === 'ArrowDown') 
        if (isNextMoveAvaible(field, shape, EO.key)) shape.move('moveDown');
    if (EO.key === 'ArrowUp') shape.move('rotate');
    if (EO.key === ' ') shape.move('hardDrop');

    

    // Обновляем новые координаты
    field.updateCoordinates(shape);

    // Очищаем поле
    field.redraw();
    
    // Перерисовываем фигурку
    shape.draw(field);
}

// Проверить доступность следующего хода
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
                if (currentShape.y + i + posibleY > field.grid.length - 1) 
                    return false;
                if (field.grid[currentShape.y + i + posibleY][currentShape.x + j + posibleX] >= 1 && 
                    field.grid[currentShape.y + i + posibleY][currentShape.x + j + posibleX] <= 7) 
                    return false;
            }
        }
    }
    return true;
}

// Начать игру
function play(){
    // Обнуляем поле
    field.reset();

    // Добавляем обработчик события нажатия на стрелочки
    document.addEventListener('keydown', moveShape);

    // Генерируем фигурку
    shape.spawnShape();

    // Обновляем массив поля
    //field.updateCoordinates(shape);

    // Отрисовываем фигурку
    shape.draw(field);

    animate();
}

const time = { start: 0, elapsed: 0, level: 1000 };

function animate(now = 0) {
    time.elapsed = now - time.start; // Истёкшее время

    if (time.elapsed > time.level) {
        time.start = now; // Начать отсчёт сначала
        
        if (isNextMoveAvaible(field, shape, 'ArrowDown')) shape.move("moveDown"); // Опустить фигурку на 1 блок
        else{
            setTimeout(field.freeze(shape), 2000);
            shape.spawnShape();
            field.updateCoordinates(shape);
            shape.draw(field);
        }
    }

    if (shape.isHardDropped){
        field.freeze(shape);
    }

    // Очищаем линии
    field.clearLines();

    // Очищаем поле
    field.redraw();

    // Обновляем новые координаты
    field.updateCoordinates(shape);
    
    // Перерисовываем фигурку
    shape.draw(field);

    requestAnimationFrame(animate);
    // setTimeout(animate, 1000);
}


function immitateProblem(){
    debugger;
    shape.move('hardDrop');
    shape.move('moveRight');
    
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}