export class ChatServer {
    start(app: any, io: any) {
        var STATIC_CHANNELS = [{
            name: 'Global chat',
            participants: 0,
            id: 1,
            sockets: []
        }, {
            name: 'Funny',
            participants: 0,
            id: 2,
            sockets: []
        }];

        app.get('/api/getChannels', (req: any, res: any) => {
            res.json({
                channels: STATIC_CHANNELS
            })
        });

        io.on('connection', (socket: any) => {
            socket.on('channel-join', (id: any) => {
                console.log('channel join', id);
                STATIC_CHANNELS.forEach(c => {
                    if (c.id === id) {
                        if (c.sockets.indexOf(socket.id as never) == (-1)) {
                            c.sockets.push(socket.id as never);
                            c.participants++;
                            io.emit('channel', c);
                        }
                    } else {
                        let index = c.sockets.indexOf(socket.id as never);
                        if (index != (-1)) {
                            c.sockets.splice(index, 1);
                            c.participants--;
                            io.emit('channel', c);
                        }
                    }
                });

                return id;
            });

            socket.on('send-message', (message: any) => {
                io.emit('message', message);
            });

            socket.on('disconnect', () => {
                STATIC_CHANNELS.forEach(c => {
                    let index = c.sockets.indexOf(socket.id as never);
                    if (index != (-1)) {
                        c.sockets.splice(index, 1);
                        c.participants--;
                        io.emit('channel', c);
                    }
                });
            });
        });
    }
}