const MyBackend = (function(){
    const baseUrl = "{{base_url}}/integra7";
    const socket = io(baseUrl);
    this.callback = null;
    socket.on('connect', () => {
        console.info("backend connected");
    });
    socket.on('message_received', (args) => {
        this.callback(args.index, args.hexString);
    });
    const sendMidi = (index, hexString) => {
        socket.emit('send_midi', {index, hexString});
    }
    const connectOutput = (index, outputId) => {
        socket.emit('connect_output', {index, outputId});
    }
    const connectInput = (index, inputId) => {
        socket.emit('connect_input', {index, inputId});
    }
    const setCallback = (callback) => {
        this.callback = callback;
    }
    return {
        sendMidi,
        connectOutput,
        connectInput,
        setCallback
    };
})();