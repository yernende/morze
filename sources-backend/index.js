const path = require("path");
const Hapi = require("@hapi/hapi");
const inert = require("@hapi/inert");
const WebSocket = require("ws");

 (async () => {
   const server = new Hapi.server({
     port: 8000,
     host: "localhost"
   });

   await server.register(inert);

   server.route({
     method: 'GET',
     path: '/{path*}',
     handler: {
       directory: {
         path: path.join(__dirname, "../www")
       }
     }
   });

   const webSocketServer = new WebSocket.Server({server: server.listener});
   const channelSubcriptions = new WeakMap();
   const sounding = new Array(14);

   for (let i = 0; i < 14; i++) {
     sounding[i] = new Set();
   }

   webSocketServer.on("connection", (socket, req) => {
     let execData = /\/channels\/(\d+)/.exec(req.url);

     if (execData != null) {
       let channelId = parseInt(execData[1]) - 1;
       channelSubcriptions.set(socket, channelId);

       function broadcast() {
         for (let anotherSocket of webSocketServer.clients) {
           let message = 0;

           for (let socketSounding of sounding[channelId]) {
             if (socketSounding != anotherSocket) {
               message = 1;
               break;
             }
           }

           if (anotherSocket != socket
              && channelSubcriptions.get(anotherSocket) == channelId
              && anotherSocket.readyState === WebSocket.OPEN
            ) {
             anotherSocket.send(message);
           }
         }
       }

       socket.on("message", (message) => {
         switch (message) {
           case "1": sounding[channelId].add(socket); break;
           case "0": sounding[channelId].delete(socket); break;
         }

         broadcast();
       });

       socket.on("close", () => {
         if (sounding[channelId].has(socket)) {
           sounding[channelId].delete(socket);
         }

         broadcast();
       });

       if (sounding[channelId].size > 0) {
         socket.send(1);
       }
     }
   });

   await server.start();
   console.log(`Server is ready to rock on port ${server.info.uri}`);
 })();
