var monster_update1 = 0;
var monster_update2 = 0;
var monster_update3 = 0;
var speed;
var lastState = new Array();
lastState[1]=0;
lastState[2]=0;
lastState[3]=0;
const HighValue = 50;
var context = document.getElementById("canvas").getContext("2d");
var e ;
var numberOfMonster;
var shape;
var monster1;
var monster2;
var monster3;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var p_5;
var p_15;
var p_25;
var drawFlag = false;
var x;
var lifes = 3;
var firstTime = true;
function User(user, password, first, last, email, date) {
    this.user_name = user;
    this.password = password;
    this.firstName = first;
    this.lastName = last;
    this.email = email;
    this.bday = date;
}
var deafult = new User("a", "a");
var current_user;
var userDB = [];
userDB[0] = deafult;
var lastmove;
//Start();
//about 
$(document).ready(function () {
    $("#welcome_screen").css("display", "block");
    $("#up_info").css("display", "none");
    $("#board").css("display", "none");
    $("#exampleModalCenter").modal('hide');
    context.canvas.width = window.innerWidth - 385;
    context.canvas.height = window.innerHeight - 205;

    $("#sign_in").click(function () {
        $("#form").toggle();
    });
});
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
function sound()
{
    var audio = new Audio('pacman_beginning.WAV');
    audio.play();
}
// make the sign in
$("#submit").click(function () {
    var user = $("#user_name").val();
    var pass = $("#password").val();
    var first = $("#inputFName").val();
    var last = $("#inputLName").val();
    var mail = $("#inputEmail").val();
    var bday = $("#date").val();
    //check if one of the fields is empty
    if (user == '' || pass == '' || first == '' || last == '' || mail == '') {
        alert("One of the fields is missing");
    }
    //check that the password contains at least 8 chars
    else if (pass.length < 8) {
        alert("password must contain at least 8 characters");
    }
    else if (!validatePass(pass)) {
        alert("password must contain letters and numbers")
    }
    // check that first & last name doesn't contain digits
    else if (/(?=.*\d)/.test(first) || /(?=.*\d)/.test(last)) {
        alert("please make sure that your first and last name doesn't contain any numbers");
    }
    else if (!isEmail(mail)) {
        alert("incorrect email");
    }
    else {
        userDB.push(new User(user, pass, first, last, mail, bday));
        alert("your registration has been successfully completed");
    }

});
$("#login").click(function () {
    $("#login_form").toggle();
});
function validatePass(password) {
    if (/(?=.*[a-z])/.test(password)) {
        if (/\d/.test(password)) {
            return true;
        }
    }
    return false;
}
//login part - check IF the user exists
$("#confirm").click(function () {
    var name = $("#user_name_pass").val();
    var pass = $("#password_pass").val();
    if (name != '' && pass != '') {
        var flag = false;
        for (var index = 0; index < userDB.length; index++) {
            var user = userDB[index];
            //to think if to add condition for the deafult user
            if (name == user.user_name && pass == user.password) {
                flag = true;
                current_user = user.user_name;
                break;
            }
        }
        if (flag) {
            $("#welcome_screen").css("display", "none");
            $("#options_screen").css("display", "block");
            $("body").css("background-image", "none")
        }
        else {
            alert("incorrect user name or password");
        }
    }

});
$("#btn_options").click(function () {
    $("#options_screen").css("display", "none");
    e= document.getElementById("monsterLevel");
    numberOfMonster = e.options[e.selectedIndex].value;
    var d= document.getElementById("speed");
    speed= d.options[d.selectedIndex].value;
    p_5 = ($("#ball_num").val() * 0.6);
    p_15 = ($("#ball_num").val() * 0.3);
    p_25 = ($("#ball_num").val() * 0.1);
    Start();
    Draw();
});
$("#play_again").click(function () {
    $("#exampleModalCenter").modal('hide');
    $("#board").css("display", "none");
    $("#up_info").css("display", "none");
    $("#options_screen").css("display", "block");
    lifes = 3;
    for (i = 1; i <= 3; i++) {
        $("#add").append('<img id="l' + i + '" class="live" height="50" width="90" src="life.jpg">');
    }
});

function Start() {
    $("#up_info").css("display", "block");
    $("#lblLive").val(lifes);
    $("#lblName").val(current_user);
    board = new Array();
    shape = new Object();
    if (numberOfMonster >= 1) {
        monster1 = new Object();
        monster1.z="monster1";
    }
    if (numberOfMonster >= 2) {
        monster2 = new Object();
        monster2.z="monster2";
    }
    if (numberOfMonster == 3) {
        monster3 = new Object();
        monster3.z="monster3";
    }
    score = 0;
    var firstTime = true;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = $("#ball_num").val();
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < 15; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 7; j++) {
            // if ((i == 3 && j == 3) || (i == 3 && j == 4) || (i == 3 && j == 5) || (i == 6 && j == 1) || (i == 6 && j == 2)) {
            //     board[i][j] = 4;
            // }
            // else {
            var randomNum = Math.random();
            if (randomNum <= 1.0 * food_remain / cnt) {
                food_remain--;
                board[i][j] = 1;
            }
            else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                //     shape.i = i;
                //     shape.j = j;
                //     pacman_remain--;
                board[i][j] = 4;
            }
            else {
                board[i][j] = 0;
            }
            cnt--;
            if (numberOfMonster >= 1) {
                if (i == 14 && j == 6) {
                    monster1.i = 14;
                    monster1.j = 6;
                    board[14][6] = "monster1";
                }
            }
            if (numberOfMonster >= 2) {
                //monster2
                if (i == 0 && j == 6) {
                    monster2.i = 0;
                    monster2.j = 6;
                    board[0][6] = "monster2";
                }
            }
            if (numberOfMonster == 3) {
                //monster3
                if (i == 0 && j == 0) {
                    //monster
                    monster3.i = 0;
                    monster3.j = 0;
                    board[0][0] = "monster3";
                }
            }
        }

    }
    if (firstTime) {
        firstInit(board, shape);
        firstTime = false;
        pacman_remain--;
    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);

    //do every 250 ms
    interval = setInterval(main, 250);
    setInterval(sound, 4500);
}

//first initiallize the board with pacmen and bonuses
function firstInit(board, shape) {
    var pac_cell = findRandomEmptyCell(board);
    board[pac_cell[0]][pac_cell[1]] = 2;
    shape.i = pac_cell[0];
    shape.j = pac_cell[1];
    var life_cell = findRandomEmptyCell(board);
    board[life_cell[0]][life_cell[1]] = 9;
    var star_cell = findRandomEmptyCell(board);
    board[star_cell[0]][star_cell[1]] = 5;
}

function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * 10) + 1);
    var j = Math.floor((Math.random() * 6) + 1);
    while (board[i][j] != 0) {
        i = Math.floor((Math.random() * 10) + 1);
        j = Math.floor((Math.random() * 6) + 1);
    }
    return [i, j];
}

function main() {
    if (numberOfMonster==1){
        ghostUpdatePosition(monster1, 1);
    }
    else if (numberOfMonster==2) {
        ghostUpdatePosition(monster1, 1);
        ghostUpdatePosition(monster2, 2);
    }
    else if (numberOfMonster==3) {
        ghostUpdatePosition(monster1, 1);
        ghostUpdatePosition(monster2, 2);
        ghostUpdatePosition(monster3, 3);
    } 
    UpdatePosition();
    Draw();
}

function StartAfterStrike() {
    var emptyCell = findRandomEmptyCell(board);
    shape.i = emptyCell[0];
    shape.j = emptyCell[1];
    board[emptyCell[0]][emptyCell[1]] = 2;
    if (numberOfMonster >= 1) {
        monster1.i = 14;
        monster1.j = 6;
        board[14][6] = "monster1";
    }
    if (numberOfMonster >= 2) {
        monster2.i = 0;
        monster2.j = 6;
        board[0][6] = "monster2";
    }
    if (numberOfMonster == 3) {
        monster3.i = 0;
        monster3.j = 0;
        board[0][0] = "monster3";
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);

    //do every 250 ms
    interval = setInterval(main, 250);

}
function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) {
        return 2;
    }
    if (keysDown[37]) {
        return 3;
    }
    if (keysDown[39]) {
        return 4;
    }
}
var stop = $("#minutes").val();
function Draw() {
    //needs to move from here
    $("#board").css("display", "block");
    $("#welcome_screen").css("display", "none");
    if (time_elapsed > (stop) * 60) {
        alert("stop!");
        window.clearInterval(interval);
    }
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 7; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 2) {
                drawpacman(center);
                drawEye(center);
            } else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                var color = BallsColor();
                board[i][j] = color;
                context.fillStyle = color; //color 
                context.fill();
            }
            else if (board[i][j] == "black") {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color 
                context.fill();
            }
            else if (board[i][j] == "red") {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "red"; //color 
                context.fill();
            }
            else if (board[i][j] == "#7FFF00") {
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = "#7FFF00"; //color 
                context.fill();
            }

            else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "grey"; //color 
                context.fill();
            }
            else if (board[i][j] == "monster1") {
                var image = new Image();
                image.src = "monster1.PNG";
                context.drawImage(image, center.x - 30, center.y - 30, 50, 50);
            }
            else if (board[i][j] == "monster2") {
                var image = new Image();
                image.src = "monster2.PNG";
                context.drawImage(image, center.x - 30, center.y - 30, 50, 50);
            }
            else if (board[i][j] == "monster3") {
                var image = new Image();
                image.src = "monster3.PNG";
                context.drawImage(image, center.x - 30, center.y - 30, 50, 50);
            }
            else if (board[i][j] == 5) {
                var image = new Image();
                image.src = "star.jpg";
                context.drawImage(image, center.x - 30, center.y - 30, 50, 50);
            }
            else if (board[i][j] == 9) {
                var image = new Image();
                image.src = "heart.png";
                context.drawImage(image, center.x - 30, center.y - 30, 50, 50);
            }

        }
    }
}


function ghostUpdatePosition(monster, number) {
    var rounds;
    if (speed=="slow") {
        rounds=4;
    }
    else if (speed=="medium") {
        rounds=3;
    }
    else {
        rounds=2;
    }
    if (number == 1) {
        if (monster_update1 < rounds) {
            monster_update1++;
            return;
        }
        else if (monster_update1 == rounds) {
            monster_update1 = 0;
        }
    }
    else if (number == 2) {
        if (monster_update2 < rounds) {
            monster_update2++;
            return;
        }
        else if (monster_update2 == rounds) {
            monster_update2 = 0;
        }
    }
    else if (number == 3) {
        if (monster_update3 < rounds) {
            monster_update3++;
            return;
        }
        else if (monster_update3 == rounds) {
            monster_update3 = 0;
        }
    }
    var movement = new Array();
    var move = false;
    //up
    if (monster.j > 0 && board[monster.i][monster.j - 1] != 4 
    && board[monster.i][monster.j - 1] != "monster1"
    && board[monster.i][monster.j - 1] != "monster2"
    && board[monster.i][monster.j - 1] != "monster3") {
        //future distance up
        var deltYU = Math.abs(shape.j - (monster.j - 1));
        var delXU = Math.abs(shape.i - monster.i);
        movement.push(delXU + deltYU);
        move = true;
    }
    else {
        movement.push(HighValue);
    }
    //down
    if (monster.j < 6 && board[monster.i][monster.j + 1] != 4 
    && board[monster.i][monster.j + 1] != "monster1"
    && board[monster.i][monster.j + 1] != "monster2"
    && board[monster.i][monster.j + 1] != "monster3") {
        //future distance down
        var deltYD = Math.abs(shape.j - (monster.j + 1));
        var delXD = Math.abs(shape.i - monster.i);
        movement.push(delXD + deltYD);
        move = true;
    }
    else {
        movement.push(HighValue);
    }
    //left    
    if (monster.i > 0 && board[monster.i - 1][monster.j] != 4 
    && board[monster.i -1][monster.j ] != "monster1"
    && board[monster.i -1][monster.j ] != "monster2"
    && board[monster.i -1][monster.j ] != "monster3") {
        //future distance leftz
        var deltYL = Math.abs(shape.j - monster.j);
        var delXL = Math.abs(shape.i - (monster.i - 1));
        movement.push(delXL + deltYL);
        move = true;
    }
    else {
        movement.push(HighValue);
    }
    //right
    if (monster.i < 14 && board[monster.i + 1][monster.j] != 4 
    && board[monster.i +1][monster.j ] != "monster1"
    && board[monster.i +1][monster.j] != "monster2"
    && board[monster.i +1][monster.j] != "monster3") {
        //future distance right
        var deltYR = Math.abs(shape.j - monster.j);
        var delXR = Math.abs(shape.i - (monster.i + 1));
        movement.push(delXR + deltYR);
        move = true;
    }
    else {
        movement.push(HighValue);
    }

    var minIndex = indexOfMin(movement);
    if (move) {
        board[monster.i][monster.j] = lastState[number];
        //up
        if (minIndex == 0) {
            monster.j = monster.j - 1;
        }
        //down
        if (minIndex == 1) {
            monster.j = monster.j + 1;
        }
        //left 
        if (minIndex == 2) {
            monster.i = monster.i - 1;
        }
        //right
        if (minIndex == 3) {
            monster.i = monster.i + 1;
        }
        //the ghost eat the pacman
        if (board[monster.i][monster.j] == 2) {
            if (numberOfMonster>=1) {
                board[monster1.i][monster1.j] = lastState[1];
                lastState[1]=0;
            } 
            if (numberOfMonster>=2) {
                board[monster2.i][monster2.j] = lastState[2];
                lastState[2]=0;
            }
           if (numberOfMonster>=3) {
                board[monster3.i][monster3.j] = lastState[3];
                lastState[3]=0;
           } 
            window.clearInterval(interval);
            window.alert("loser!!!");
            $("#l" + lifes).remove();
            lifes--;
            if (lifes > 0) {
                StartAfterStrike();
            }
            else {
                $("#exampleModalCenter").modal('show');
            }
            $("#lblLive").val(lifes);
        }
        else {
            lastState[number] = board[monster.i][monster.j];
            board[monster.i][monster.j] = monster.z;
        }
        move = false;
    }
}
function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    x = GetKeyPressed()
    if (x == 1) {

        if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
            firstTime = false;
            lastmove = 1;
            shape.j--;
        }
    }
    if (x == 2) {
        if (shape.j < 6 && board[shape.i][shape.j + 1] != 4) {
            firstTime = false;
            lastmove = 2;
            shape.j++;
        }
    }
    if (x == 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
            firstTime = false;
            lastmove = 3;
            shape.i--;
        }
    }
    if (x == 4) {
        if (shape.i < 14 && board[shape.i + 1][shape.j] != 4) {
            firstTime = false;
            lastmove = 4;
            shape.i++;
        }
    }
    if (board[shape.i][shape.j] == "red") {
        score += 15
    }
    if (board[shape.i][shape.j] == "black") {
        score += 5;
    }
    if (board[shape.i][shape.j] == "#7FFF00") {
        score += 25;
    }
    if (board[shape.i][shape.j] == "monster1" || board[shape.i][shape.j] == "monster2" || board[shape.i][shape.j] == "monster3") {
        if (numberOfMonster>=1) {
            board[monster1.i][monster1.j] = lastState[1];
            lastState[1]=0;
        } 
        if (numberOfMonster>=2) {
            board[monster2.i][monster2.j] = lastState[2];
            lastState[2]=0;
        }
       if (numberOfMonster>=3) {
            board[monster3.i][monster3.j] = lastState[3];
            lastState[3]=0;
       } 
        window.clearInterval(interval);
        window.alert("me");
        $("#l" + lifes).remove();
        //  $("#l" + lifes).css("display", "none");
        lifes--;
        if (lifes > 0) {
            StartAfterStrike();
        }
        else {
            $("#exampleModalCenter").modal('show');
        }
        $("#lblLive").val(lifes);
    }
    if (board[shape.i][shape.j] == 9) {
        lifes++;
        $("#add").append('<img id="l' + lifes + '" class="live" height="50" width="90" src="life.jpg">');
        $("#lblLive").val(lifes);
    }

    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    // if (score >= 20 && time_elapsed <= 10) {
    //     pac_color = "green";
    // }
    // if (score == 50) {
    //     window.clearInterval(interval);
    //     window.alert("Game completed");
    // }
}
function drawEye(center) {
    context.beginPath();
    if (x == 1) {
        context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
    }
    else if (x == 2) {
        context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
    }
    else if (x == 3 || x == 4) {
        context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
    }
    else if (firstTime) {
        context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI);
    }
    //last move saver 
    //up
    else if (lastmove == 1) {
        context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
    }
    //down
    else if (lastmove == 2) {
        context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI);
    }
    //left
    else if (lastmove == 3) {
        context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI);
    }
    //right
    else if (lastmove == 4) {
        context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI);
    }
    context.fillStyle = "black"; //color 
    context.fill();
}
function drawpacman(center) {
    context.beginPath();
    //up
    if (x == 1) {
        context.arc(center.x, center.y, 25, -0.39 * Math.PI, 1.5 * Math.PI);
        context.lineTo(center.x, center.y);
        context.fillStyle = pac_color; //color 
        context.fill();
        context.arc(center.x, center.y, 25, -0.33 * Math.PI, 1.4 * Math.PI);
    }
    //down
    else if (x == 2) {
        context.arc(center.x, center.y, 25, 0.5 * Math.PI, 0.35 * Math.PI);
        context.lineTo(center.x, center.y);
        context.fillStyle = pac_color; //color 
        context.fill();
        context.arc(center.x, center.y, 25, 0.7 * Math.PI, 0.3 * Math.PI);
    }
    //left
    else if (x == 3) {
        context.arc(center.x, center.y, 25, 1.1 * Math.PI, Math.PI);
        context.lineTo(center.x, center.y);
        context.fillStyle = pac_color; //color 
        context.fill();
        context.arc(center.x, center.y, 25, 1.2 * Math.PI, 0.9 * Math.PI);
    }
    //right
    else if (x == 4) {
        context.arc(center.x, center.y, 25, 0.2222, 6.2);
        context.lineTo(center.x, center.y);
        context.fillStyle = pac_color; //color 
        context.fill();
        context.arc(center.x, center.y, 25, 0.5235987756, 5.7595865316);
    }
    //first time 
    else if (firstTime) {
        context.arc(center.x, center.y, 25, 2.0943951024, 1.0471975512);
    }
    //last move saver 
    //up
    else if (lastmove == 1) {
        context.arc(center.x, center.y, 25, -0.33 * Math.PI, 1.4 * Math.PI);
    }
    //down
    else if (lastmove == 2) {
        context.arc(center.x, center.y, 25, 0.7 * Math.PI, 0.3 * Math.PI);
    }
    //left
    else if (lastmove == 3) {
        context.arc(center.x, center.y, 25, 1.25 * Math.PI, 0.7 * Math.PI);
    }
    //right
    else if (lastmove == 4) {
        context.arc(center.x, center.y, 25, 0.5235987756, 5.7595865316);
    }
    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color 
    context.fill();
}
//help function that gets u the smallest move
function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var min = arr[0];
    var minIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }
    return minIndex;
}
function BallsColor() {
    if (p_15 > 0 && p_25 > 0 && p_5 > 0) {
        var num = (Math.random());
        if (num < 0.25 && p_15 > 0) {
            p_5--;
            return "black";
        }
        else if (num >= 0.25 && num <= 0.4 && p_5 > 0) {
            p_15--;
            return "red";
        }
        else if (p_25 > 0) {
            p_25--;
            return "#7FFF00";
        }
    }
    else if (p_15 > 0 && p_25 > 0 && p_5 == 0) {
        var num = (Math.random());
        if (num < 0.5 && p_15 > 0) {
            p_5--;
            return "black";
        }
        else if (p_25 > 0) {
            p_25--;
            return "#7FFF00";
        }
    }
    else if (p_15 > 0 && p_25 == 0 && p_5 > 0) {
        var num = (Math.random());
        if (num < 0.5 && p_15 > 0) {
            p_5--;
            return "black";
        }
        else if (p_5 > 0) {
            p_15--;
            return "red";
        }
    }
    else if (p_15 == 0 && p_25 > 0 && p_5 > 0) {
        var num = (Math.random());
        if (num < 0.3 && p_15 > 0) {
            p_5--;
            return "black";
        }
        else if (p_25 > 0) {
            p_25--;
            return "#7FFF00";
        }
    }
    else if (p_5 > 0) { p_5--; return "black"; }
    else if (p_15 > 0) { p_15--; return "red"; }
    else if (p_25 > 0) { p_25--; return "#7FFF00"; }
}


