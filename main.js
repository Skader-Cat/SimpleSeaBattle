let gameField1 = document.getElementById("f1");
let gameField2 = document.getElementById("f2");  //получаем html элементы
let game_info = document.getElementById("f3");


let length_y = 11;
let length_x = 11; //задаем размеры поля

let cells_1 = [];
let cells_2 = [];

function set_cells(cells){ //инициализируем дивы, которые и являются ячейками. Добавляем им атрибуты, которые будут хранить информацию о ячейке
    for(let i = 0; i < (length_x * length_y); i++){
        let div = document.createElement("div");
        div.id = i;
        if(cells == cells_1){
            div.className =  "cells_1";
        }
        else{
            div.className = "cells_2";
        }
        div.setAttribute("used", "false");
        Object.assign(div,{
            used: false, //использована ли ячейка
            ship: false, //есть ли на ячейке корабль
            shipId: 0, //кол-во палуб в корабле
            shipPart: 0, //номер палубы
            symb: "", //символ, который будет отображаться в ячейке
        });
        cells[i] = div.cloneNode(true); //клонируем див, чтобы не было проблем с ссылками
        cells[i].symb = "🌊"; //задаем символ для пустой ячейки
    }
}

function check(cells, pos){ //проверяем, можно ли поставить корабль в ячейку
    console.log(pos);
    if((pos % length_x == 0 || pos % length_x == length_x-1 || pos < 10 || pos > (length_x * length_y)-13)){
        return false; //проверяем, не выходит ли корабль за границы поля
    }
    if(cells[pos].used == true){
        return false; //проверяем, не занята ли ячейка
    }
    else{
        //проверяем, не заняты ли соседние ячейки
        if(cells[pos - 1].used == true || cells[pos + 1].used == true || cells[pos - length_x].used == true || cells[pos + length_x].used == true || cells[pos - (length_x + 1)].used == true || cells[pos + (length_x + 1)].used == true || cells[pos - (length_x - 1)].used == true || cells[pos + (length_x - 1)].used == true){
            return false;
        }
    }
    return true;
}

function make_ship(cells, pos, shipId, shipPart, axis_x_possible, axis_y_possible){ //рекурсивная функция, которая создает корабль
    if(shipPart == shipId){ //если это первая палуба, то проверяем, можно ли начиная с неё поставить ячейки для всего корабля
        let normal_pos = false; 
        axis_x_possible = true; //проверяем, поместится ли корабль, если расставлять его по оси x
        axis_y_possible = true; //проверяем, можно ли поставить корабль, если расставлять его по оси y
        while(normal_pos == false){ //пока не найдем нормальную позицию для первой палубы
            for(let i = 0; i < shipId; i++){ //проверяем, можно ли поставить ячейки для всего корабля
                if(check(cells, pos + i, shipId) == false){ //если нельзя, то ставим флаг, что корабль по оси x не поместится
                    axis_x_possible = false;
                }
                if(check(cells, pos + i * length_x, shipId) == false){ //если нельзя, то ставим флаг, что корабль по оси y не поместится
                    axis_y_possible = false;
                }
            }

            if(axis_x_possible == false && axis_y_possible == false){ //если ни по оси x, ни по оси y нельзя поставить корабль, то выбираем новую позицию для первой палубы
                return make_ship(cells, Math.floor(Math.random() * (110) + 1), shipId, shipPart); //тут кстати иногда возникает баг, когда корабль не может быть поставлен, но функция не возвращает false, а пытается поставить корабль в другое место и превышает глубину рекурсии
            } //я пофиксил этот баг, увеличив размер поля. Теперь спорных ситуций не возникает
            else{
                normal_pos = true; //если корабль можно поставить, то выходим из цикла
            }
        }
    }
    //Задаем параметры ячейки
    cells[pos].used = true;
    cells[pos].setAttribute("used", "true");
    cells[pos].setAttribute("killed", "false")
    cells[pos].shipId = shipId;
    cells[pos].shipPart = shipPart;
    cells[pos].symb = "🚢";
    //cells[pos].style.backgroundColor = "green";
    if(axis_x_possible === true){ //если корабль можно поставить по оси x, то ставим его по оси x
        if(shipPart > 1){
            make_ship(cells, pos + 1, shipId, shipPart - 1, true, false);
        }
    }
    else if(axis_y_possible === true){ //если корабль можно поставить по оси y, то ставим его по оси y
        if(shipPart > 1){
            make_ship(cells, pos + length_x, shipId, shipPart - 1, false, true);
        }
    }
}

function setShips(cell){ //функция, которая расставляет корабли
    let start_pos = Math.floor(Math.random() * (110) + 1); //рандомная позиция для первой палубы

    for(let i = 1; i < 5; i++){ //цикл, который ставит корабли (просто математическая задачка)
        for(let j = 0; j < i; j++){ 
            make_ship(cell, start_pos, 5 - i, 5 - i, false, false);
        }
    }
}

function setField(gameField, cells){ //функция, которая создает игровое поле
    let symb = document.createElement("div"); 
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    symb.innerHTML = "\\/";
    symb.style.backgroundColor = "red";
    symb.style.width = "29px";
    gameField.appendChild(symb);
    for(let i = 1; i < length_x; i++){ //цикл, который создает верхнюю строку с цифрами
        cells[i].used = i;
        let div_header = document.createElement("div");
        div_header.style.backgroundColor = "black";
        div_header.innerHTML = i;
        div_header.style.width = "29px";
        gameField.appendChild(div_header);
    }

    for(let i = 0; i < (length_x * length_y)-length_x; i++){ //цикл, который создает игровое поле
        cells[i].innerHTML = "🌊" ;     
        //cells[i].innerHTML = i;
        if(i % length_x == 0){
            cells[i].innerHTML = alphabet[i/length_x]; //цикл, который создает левый столбик с буквами
            cells[i].style.backgroundColor = "black"; 
            cells[i].style.width = "29px";
        }
        if(i % length_x == length_x-1){ 
            cells[i].style.borderRight = "2px solid black";
        }
        gameField.appendChild(cells[i].cloneNode(true));
    }
}

function who_now(player){
    let who_now = document.getElementById("p1").innerHTML = "Сейчас ходит " + player + "!"; //функция, которая показывает, кто сейчас ходит
}

//создаем игровые поля
set_cells(cells_1);
setShips(cells_1);
setField(gameField1, cells_1);

set_cells(cells_2);
setShips(cells_2);
setField(gameField2, cells_2);

alert("Игра начинается. Игрок 1 - по левую сторону ринга, игрок 2 - по правую. Цель: уничтожить все корабли противника. FIGHTT!!!!!!");
let player_name_1 = prompt("Введите своё имя: ");
let player_name_2 = prompt("Введите имя противника: ");

let player1_killed_ships = 0;
let player2_killed_ships = 0;

let counter_hodov = 0;
let counter_table = document.getElementById("hod")
function main_game(){ //функция, которая запускает игру
    let flag = true; //флаг, который показывает, кто сейчас ходит
    who_now(player_name_1); //показываем на экране, кто сейчас ходит
    gameField2.addEventListener("click", function(event){ //обработчик событий, который отслеживает клики по игровому полю №2
        if(flag == true){ //если сейчас ходит игрок №1
            who_now(player_name_1); //показываем на экране, кто сейчас ходит
            counter_hodov++; //увеличиваем счетчик ходов
            counter_table.innerHTML = counter_hodov; //показываем на экране, сколько ходов сделано
        }
        if(event.target.getAttribute("used") == "true" && flag == true && event.target.getAttribute("killed") == "false"){ //если игрок попал по кораблю
            event.target.style.backgroundColor = "red";
            event.target.innerHTML = "🔥"; 
            event.target.setAttribute("killed", "true"); //помечаем ячейку, как использованную
            player2_killed_ships++; 
            if(player2_killed_ships == 20){ //если игрок уничтожил все корабли
                    alert("Игра окончена. " + player_name_1 + " победил!");
                    return;
            }
        }
        else if(event.target.getAttribute("used") == "false" && flag == true){   //если игрок промахнулся
            event.target.setAttribute("killed", "true"); 
            event.target.style.backgroundColor = "yellow";
            event.target.innerHTML = "💥";
            flag = false;
            who_now(player_name_2);
        }
    });


    gameField1.addEventListener("click", function(event){  //обработчик событий, который отслеживает клики по игровому полю №1
        if(flag == false){ //если сейчас ходит игрок №2
            who_now(player_name_2); //показываем на экране, кто сейчас ходит
            counter_hodov++;  
            counter_table.innerHTML = counter_hodov; 
        }
        if(event.target.getAttribute("used") == "true" && flag == false  && event.target.getAttribute("killed") == "false"){ //если игрок попал по кораблю
            event.target.style.backgroundColor = "red"; 
            event.target.setAttribute("killed", "true"); 
            event.target.innerHTML = "🔥";
            player1_killed_ships++;
            if(player1_killed_ships == 20){ //если игрок уничтожил все корабли
                alert("Игра окончена. " + player_name_2 + " победил!");
                return;
            }
        }
        else if(event.target.getAttribute("used") == "false" && flag == false){ //если игрок промахнулся
            event.target.setAttribute("killed", "true");
            event.target.style.backgroundColor = "yellow";
            event.target.innerHTML = "💥";
            flag = true;
            who_now(player_name_1);
            return;
        }
    });
}
main_game();

let player_wins = JSON.parse(localStorage.player_2_wins).win;
(player_wins)++;
localStorage.player_2_wins = JSON.stringify({win: player_wins});