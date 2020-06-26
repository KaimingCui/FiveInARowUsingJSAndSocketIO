var app = require('http').createServer()
var io = require('socket.io')(app)

var PORT = 3000

app.listen(PORT)

var players = [];
var online = 0;
var num_rooms = 20;
var rooms = new Array(num_rooms);
var non_player = {name:"",roomId:-1,type:"looking"};
function init_rooms(){
	for(let i = 0; i < num_rooms; i++){
		rooms[i] = {};
		rooms[i].id = i;
		rooms[i].player1 = non_player;  //player1 on left seat
		rooms[i].player2 = non_player;  //player2 on right seat
	}
}


init_rooms();
io.on('connection',function(socket){
	socket.emit('rooms',rooms);
	// console.log("connect");
	var player = {name:null,roomId:-1,type:null};
	online++;
	var samename = false;

	//receive the player created by client, check if there are same name , if not, add that player into the server's player list
	socket.on('player',function(data){
		samename = false;
		player = data;
		if(player.name == ""){
			socket.emit("same_name","cannot be empty.");
		}
		else if(player.name == null){
			//why is null be valid name
			samename = false;
		}
		else{
			for(let i = 0; i < players.length;++i){
				if(players[i].name == player.name){
					msg = "Sorry, the username is already occupied. Please use another username.";
					socket.emit('same_name',msg);
					samename = true;
					break;
				}
			}
		}

		if(samename == false){
			players.push(player);
			// console.log(players.length);
			io.emit('new_player',player);
			socket.emit('welcome',player);
			// socket.emit('rooms',rooms);
			// console.log(players);
		}
	});

	//server forward the message to all clients
	socket.on('message',function(str){
		io.emit('message',player.name+": "+str);
	});

	//when a client enter a room, the server need to update room list and tell all client that change
	socket.on('seat_down',function(data){
		player = data;
		which_room = player.roomId;
		if(player.type == "player1"){
			rooms[which_room].player1 = player;
		}else{
			rooms[which_room].player2 = player;
		}
		// socket.emit("your_room",rooms[which_room]);
		// socket.emit("responde");
		io.emit('update_room',rooms[which_room]);
	});


	//a client left his room, server need to update room list and tell all clients
	socket.on("fight_finish",function(data,data2,data3){
		player = data;  //更新server上的player,其实不用temp_p, 直接用server上存的player就可以，不过用改了
		temp_p = data;
		// console.log(temp_p);
		theRoomid = data2;
		player_type = data3;
		for(let i = 0; i < players.length;i++){
			if(players[i].name == temp_p.name){
				players[i] = temp_p;
				break;
			}
		}
		for(let i = 0;i < rooms.length;i++){
			if(rooms[i].id == theRoomid){
				if(player_type == "player1"){
					rooms[i].player1 = non_player;
				}
				else if(player_type == "player2"){
					rooms[i].player2 = non_player;
				}

				io.emit('update_room',rooms[i]);
				socket.broadcast.emit('escape',theRoomid);
			}
		}
	})


	//the message for exactly one room, room's chat system
	socket.on('rmessage',function(data1,data2){
		mes = data1;
		theR = data2.roomId;
		io.emit('mes_to_room',mes,theR);
	});


	//a player go one step in the fight html, draw a piece
	socket.on("gostep",function(data1,data2){
		// console.log("gostep");
		piece = data1;
		theroom = data2.roomId;
		which_player = data2.type;
		if(rooms[theroom].player1.name == ""||rooms[theroom].player2.name == ""){
			socket.emit("no_against");
		}else{
			io.emit("update_draw_piece",piece,theroom,which_player);
		}
	})

	//or use broadcast instead of io.emit
	socket.on('newGame',function(data){
		theRoomid = data.roomId;
		io.emit('newgame',theRoomid);
	});

	socket.on('regret', function(roomId, lastPcs, turn){
		if(turn == lastPcs) {
			numOfPcs = 1;
		} else {
			numOfPcs = 2;
		}
		io.emit('regret', roomId, numOfPcs);
	});

	socket.on("disconnect",function(){
		// console.log("disconnect");
		if(player.name != ""){
			io.emit("leave",player);
		}
		if(player.roomId != -1){
			// console.log("clear");
			if(player.type == "player1"){
				rooms[player.roomId].player1 = non_player;
			}else{
				rooms[player.roomId].player2 = non_player;
			}
			io.emit('update_room',rooms[player.roomId]);
			socket.broadcast.emit('escape',player.roomId);
		}

		for(let i = 0; i < players.length;i++){
			if(players[i].name == player.name){
				players.splice(i,1);
				break;
			}
		}
		// console.log(players.length);
		// players.remove(player.name);
	});

	// socket.on('error',function(error){
	// 	console.log(error);
	// });
	// socket.on('hello',function(data){
	// 	console.log("hello"+data);
	// 	io.emit('responde',"hi");
	// });


})