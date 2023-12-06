const MyBackend = (function(){
    const baseUrl = "{{base_url}}/integra7";
    const socket = io(baseUrl);
    socket.on('connect', () => {
        console.info("backend connected");
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
    return {
        sendMidi,
        connectOutput,
        connectInput
    };
})();