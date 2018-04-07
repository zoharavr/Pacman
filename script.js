
var context = document.getElementById("canvas").getContext("2d");
var shape=new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;    
var interval;
var x;
var firstTime=true;
function User(user,password,first, last, email) {
    this.user_name=user;
    this.password=password;
    this.firstName = first;
    this.lastName = last;
    this.email=email;
 //   this.bday=bday;
}
var deafult= new User("a","a");
var userDB=[];
userDB[0]=deafult;


//about 
//Draw();
$(document).ready(function(){ 
    $("#welcome_screen").css("display", "block");
    $("#score").css("display", "none");
    $("#board").css("display", "none");

   $("#sign_in").click(function(){
       $("#form").toggle();
   });
});
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
// make the sign in
$("#submit").click(function(){
    var user = $("#user_name").val();
    var pass= $("#password").val();
    var first= $("#inputFName").val();
    var last= $("#inputLName").val();
    var mail= $("#inputEmail").val();
    //check if one of the fields is empty
    if(user =='' || pass==''|| first==''|| last==''||mail=='' ){
        alert("One of the fields is missing");
    }
    //check that the password contains at least 8 chars
    else if(pass.length < 8){
        alert("password must contain at least 8 characters");
    }
    else if(!/^[0-9a-zA-Z]{8,}$/.test(pass)){
        alert("password must contain letters and numbers")
    }
    // check that first & last name doesn't contain digits
    else if(/(?=.*\d)/.test(first) || /(?=.*\d)/.test(last)){
        alert("please make sure that your first and last name doesn't contain any numbers");
    }
    else if(!isEmail(mail)){
        alert("incorrect email");
    }
    else{
        userDB.push(new User(user,pass,first,last,mail));
        alert("your registration has been successfully completed");
    }

});
$("#login").click(function(){
    $("#login_form").toggle();
});
//login part - check that the user exists
$("#confirm").click(function(){
    var name=$("#user_name_pass").val();
    var pass=$("#password_pass").val();
    if(name !='' && pass!=''){
        var flag=false;
		for (var index=0; index<userDB.length; index++) {
            var user=userDB[index];
            //to think if to add condition for the deafult user
            if(name == user.user_name && pass == user.password){
                flag=true;
                break;
            }
        }
        if(flag){
            Start();
            Draw();
        }
        else {
            alert("incorrect user name or password");
        } 
    }
      
});
function Start() {
    board = new Array();
    score = 0;
    pac_color="yellow";
    var cnt = 100;
    var food_remain = 50;
    var pacman_remain = 1;
    start_time= new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            {
                board[i][j] = 4;
            }
            else{
            var randomNum = Math.random();
            if (randomNum <= 1.0 * food_remain / cnt) {
                food_remain--;
                board[i][j] = 1;
            } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                shape.i=i;
                shape.j=j;
                pacman_remain--;
                board[i][j] = 2;
            } else {
                board[i][j] = 0;
            }
            cnt--;
            }
            }
    }
    while(food_remain>0){
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

    interval=setInterval(UpdatePosition, 250);
}


 function findRandomEmptyCell(board){
     var i = Math.floor((Math.random() * 9) + 1);
     var j = Math.floor((Math.random() * 9) + 1);
    while(board[i][j]!=0)
    {
         i = Math.floor((Math.random() * 9) + 1);
         j = Math.floor((Math.random() * 9) + 1);
    }
    return [i,j];             
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

function Draw() {
    $("#board").css("display", "block");
    $("#score").css("display", "block");
    $("#welcome_screen").css("display", "none");

    canvas.width=canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 2) {
                context.beginPath();
                //up
                if (x==1) {
                    //context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); 
                    context.arc(center.x, center.y, 30,-0.33*Math.PI,1.4*Math.PI);
                }//
                //down
                else if (x==2) {
                    //context.arc(center.x, center.y, 30,0.7 * Math.PI, 0.3 * Math.PI );
                    context.arc(center.x, center.y, 30,0.7 * Math.PI, 0.3 * Math.PI );
                }
                //left
                else if (x==3){
                    context.arc(center.x, center.y, 30, 1.25*Math.PI, 0.7* Math.PI );
                }
                //right
                else if (x==4){
                    context.arc(center.x, center.y, 30, 0.5235987756, 5.7595865316 );
                }
                else if (firstTime) {
                    context.arc(center.x, center.y, 30, 2.0943951024, 1.0471975512 ); 
                    firstTime=false;
                }
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color 
                context.fill();
                context.beginPath();
                context.arc(center.x + 14, center.y -13, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color 
                context.fill();
            } else if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color 
                context.fill();
            }
            else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x-30, center.y-30, 60, 60);
                context.fillStyle = "grey"; //color 
                context.fill();
            }
        }
    }

   
}

function UpdatePosition() {
    board[shape.i][shape.j]=0;
     x = GetKeyPressed()
    if(x==1)
    {
       
        if(shape.j>0 && board[shape.i][shape.j-1]!=4)
        {
            shape.j--;
        }
    }
    if(x==2)
    {
        if(shape.j<9 && board[shape.i][shape.j+1]!=4)
        {
            shape.j++;
        }
    }
    if(x==3)
    {
        if(shape.i>0 && board[shape.i-1][shape.j]!=4)
        {
            shape.i--;
        }
    }
    if(x==4)
    {
        if(shape.i<9 && board[shape.i+1][shape.j]!=4)
        {
            shape.i++;
        }
    }
    if(board[shape.i][shape.j]==1)
    {
        score++;
    }
    board[shape.i][shape.j]=2;
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    if(score>=20&&time_elapsed<=10)
    {
        pac_color="green";
    }
    if(score==50)
    {
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    else
    {
        Draw();
    }
}