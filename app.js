// Librerias
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express');
var path = require('path');
var five = require('johnny-five');
// Fin Librerias

server.listen(80); //Puerto escucha

app.use('/static', express.static(path.join(__dirname, 'public'))); /*No se está usando*/

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
}); /*Ruta index*/

var board = new five.Board(); //LLamando la placa del arduino

board.on('ready', function () {
    var led = new five.Led(13, {
        isAnode: true
    });

    var comando, blink;
    comando = null;
    led.blink();
    blink = true;

    io.on('connection', function (socket) {
        socket.on('stop', function () {
            if (blink) {
                led.stop();
                blink = false;
            } else {
                led.blink();
                blink = true;
            }
        });

        socket.on('off', function () {
            if (blink) {
                led.stop();
                led.off();
                blink = false;
            } else {
                led.off();
            }
            // console.log('Apagado')
        });
        socket.on('on', function () {
            if (blink) {
                led.stop();
                led.on();
                blink = false;
            } else {
                led.on();
            }
            // console.log('Encendido')
        });
    });
})
