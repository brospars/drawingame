angular.module('myApp.roomCtrl', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/room', {
        templateUrl: 'views/roomView.html',
        controller: 'RoomCtrl'
    });
}])

.controller('RoomCtrl', function ($rootScope, $scope, $location) {
    if ($rootScope.pseudo) {
        // SCOPE Var & Functions
        $scope.messages = [];
        $scope.selectedTool = 'pencil';

        $scope.sendMessage = function () {
            if ($scope.input) {
                socket.emit('chatMessage', {
                    "text": this.input,
                    "pseudo": $rootScope.pseudo
                });
                $scope.input = '';
            }
        }

        $scope.changeTool = function(tool) {
            switch (tool) {
                case 'pencil':
                    $scope.selectedColor = 'black';
                    $scope.selectedTool = 'pencil';
                    break;
                case 'eraser':
                    $scope.selectedColor = 'white';
                    $scope.selectedTool = 'eraser';
                    break;
                case 'reset':
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    break;
                default:
                    break;
            }
        }

        // CANVAS Events
        var canvas = angular.element(document).find('canvas'),
            doc = angular.element(document),
            ctx = canvas[0].getContext('2d'),
            drawing = false,
            prev = {},
            lastEmit = Date.now();

        var ctxScale = canvas[0].offsetWidth / 1920;
        var ctxX = canvas.parent()[0].offsetLeft;
        var ctxY = canvas.parent()[0].offsetTop;
        
        //canvas init
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 15;

        //update scale on resize
        window.onresize = function () {
            ctxScale = canvas[0].offsetWidth / 1920;
            ctxX = canvas.parent()[0].offsetLeft;
            ctxY = canvas.parent()[0].offsetTop;
        }

        canvas.width = 1920;
        canvas.height = 1080;

        //Mouse down on canvas → start drawing
        canvas.on('mousedown', function (e) {
            e.preventDefault();
            drawing = true;
            prev.x = e.pageX * (1 / ctxScale) - ctxX * (1 / ctxScale);
            prev.y = e.pageY * (1 / ctxScale) - ctxY * (1 / ctxScale);
        });

        //Mouse up → stop drawing
        doc.bind('mouseup mouseleave', function () {
            drawing = false;
        });

        //Mouse move → draw the line
        doc.on('mousemove', function (e) {

            var x = e.pageX * (1 / ctxScale) - ctxX * (1 / ctxScale);
            var y = e.pageY * (1 / ctxScale) - ctxY * (1 / ctxScale);

            if (Date.now() - lastEmit > 30) {
                socket.emit('mousemove', {
                    'x': x,
                    'y': y,
                    'color' : $scope.selectedColor,
                    'drawing': drawing
                });
                lastEmit = Date.now();

                if (drawing) {
                    drawLine(prev.x, prev.y, x, y, $scope.selectedColor);
                    prev.x = x;
                    prev.y = y;
                }
            }
        });

        //Draw a line between 2 coordinates
        function drawLine(fromx, fromy, tox, toy, color) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(fromx, fromy);
            ctx.lineTo(tox, toy);
            ctx.stroke();
            ctx.closePath();         
        }


        // SOCKET IO
        var socket = io($rootScope.config.baseUrl, {
            query: "pseudo=" + $rootScope.pseudo,
            reconnection: false
        });

        socket.on('error', function (err) {
            console.log('authentication error : ' + err);

            delete $rootScope.pseudo;

            $location.path("/home");
            $scope.$apply();
        });

        socket.on('chatMessage', function (msg) {
            $scope.messages.push(msg);
            $scope.$apply();
        });

        socket.on('moving', function (data) {
            if (data.drawing) {
                drawLine(data.prevx, data.prevy, data.x, data.y, data.color);
            }
        });
    } else {
        $location.path("/home");
    }

});