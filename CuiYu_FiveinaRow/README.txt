Project Name:CSCI 536 Data Communication & Network Websocket based FiveinaRow
Author: Kaiming Cui, Xiaoyuan Yu
Email: cuik@iu.edu

Document:
The zip file contains 6 items: a js file that is the server "gameLobbyServer.js", two html files that are "index.html" and "fight.html", a README.txt, a folder called jslib which include a jQuery library, and a report.


Dependency:
nodejs v13.1.0
npm 6.12.1
socketio 2.3.0(just install from npm, any version is okay)
jQuery 3.4.1 (already in the zip file)


nodejs-websocket 1.7.2 (this is optional, I used this package before, but now this project uses socketio)
I did not use express frame, but it seems using express is a better way

Building and Testing:
important: if you start the serve on your own PC, then you need to open index.html, look at the first script tag, change the ip address in src attribute to your own local ip address. And then look at the second script tag, there is a variable called IPaddress, change it to your own local ip address.

1.install environment:
	install homebrew, I use the following command but you can install it from other website
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

	install nodejs and npm
	brew install node

	check your version
	node -v
	npm -v

	install socket.io
	npm install socket.io (or install a specific version npm install socket.io@2.3.0, but newest version is okay)


2. start a simple http server so that client can get index.html page from the server
   cd to the unziped folder
   input the cmd: http-server -c-1
   now a very simple http server is rinning in your computer

   Yes, the index.html page is not in the nodejs server, I tried to let the client get index.html directly from the nodejs server, but there was problems I have not solve them. But in here, this simple http server has only one responsibility that is give the clients the index.html page. Once the clients get the index.html page, this http server has nothing with the after connection and communication, it is no use. The index.html will create the connection to nodejs game serer (look at the script code of index.html, you would find a line "var socket = io.connect("http://" + IPaddress + ":3000");" this line create the connection to server)

3. start the nodejs game lobby server
	node gameLobbyServer.js

4. open your browser and input the url yourLANaddress:8080

5. then you should see the index.html, once your browser open the index.html, it will create a connection to the nodejs server

5. now you can play, the other clients need to type in the url yourLANaddress:8080 to connect with the server and enter the game lobby

