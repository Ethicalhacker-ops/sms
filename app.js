const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const lanConnectButton = document.getElementById('lan-connect-button');
const btConnectButton = document.getElementById('bt-connect-button');
const roomCodeInput = document.getElementById('room-code-input');
const serverIpInput = document.getElementById('server-ip-input');
const usernameInput = document.getElementById('username-input');
const userList = document.getElementById('user-list');

let socket;
let bleDevice;
let bleCharacteristic;

lanConnectButton.addEventListener('click', () => {
    const roomCode = roomCodeInput.value;
    const serverIp = serverIpInput.value;
    // The server URL will be the IP address of the machine running the server on the LAN
    // For local testing, we use ws://localhost:8080
    socket = new WebSocket(`ws://${serverIp}:8080`);

    socket.onopen = () => {
        console.log('Connected to LAN server');
        const username = usernameInput.value;
        socket.send(JSON.stringify({ type: 'join', room: roomCode, username }));
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Connected to LAN server';
        messages.appendChild(messageElement);
    };

    socket.onmessage = event => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
            const messageElement = document.createElement('div');
            const senderElement = document.createElement('span');
            senderElement.className = 'sender';
            senderElement.textContent = `${data.username}: `;
            messageElement.appendChild(senderElement);
            messageElement.append(data.content);
            messages.appendChild(messageElement);
        } else if (data.type === 'users') {
            userList.innerHTML = '<h3>Connected Users</h3>';
            data.users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.textContent = user;
                userList.appendChild(userElement);
            });
        }
    };

    socket.onclose = () => {
        console.log('Disconnected from LAN server');
        messages.innerHTML += '<div>Disconnected from LAN server</div>';
    };
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (socket && socket.readyState === WebSocket.OPEN) {
        const roomCode = roomCodeInput.value;
        socket.send(JSON.stringify({ type: 'message', room: roomCode, content: message }));
        const messageElement = document.createElement('div');
        messageElement.textContent = `Me: ${message}`;
        messages.appendChild(messageElement);
        messageInput.value = '';
    } else if (bleCharacteristic) {
        const encoder = new TextEncoder();
        bleCharacteristic.writeValue(encoder.encode(message));
        const messageElement = document.createElement('div');
        messageElement.textContent = `Me (BT): ${message}`;
        messages.appendChild(messageElement);
        messageInput.value = '';
    }
});

btConnectButton.addEventListener('click', async () => {
    try {
        // This is a demonstration of a Web Bluetooth chat client.
        // To use this, you need a corresponding BLE peripheral device
        // that advertises the following custom service and characteristics.

        // Custom Service UUID
        const CHAT_SERVICE_UUID = '0000beef-0000-1000-8000-00805f9b34fb';
        // Characteristic for sending messages (client to peripheral)
        const MESSAGE_TX_CHARACTERISTIC_UUID = '0000b001-0000-1000-8000-00805f9b34fb';
        // Characteristic for receiving messages (peripheral to client)
        const MESSAGE_RX_CHARACTERISTIC_UUID = '0000b002-0000-1000-8000-00805f9b34fb';

        console.log('Requesting Bluetooth device...');
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [CHAT_SERVICE_UUID] }]
        });

        console.log('Connecting to GATT Server...');
        const server = await bleDevice.gatt.connect();

        console.log('Getting Service...');
        const service = await server.getPrimaryService(CHAT_SERVICE_UUID);

        console.log('Getting Characteristics...');
        const txCharacteristic = await service.getCharacteristic(MESSAGE_TX_CHARACTERISTIC_UUID);
        const rxCharacteristic = await service.getCharacteristic(MESSAGE_RX_CHARACTERISTIC_UUID);

        // Store the writable characteristic globally
        bleCharacteristic = txCharacteristic;

        // Start listening for notifications from the readable characteristic
        await rxCharacteristic.startNotifications();

        rxCharacteristic.addEventListener('characteristicvaluechanged', event => {
            const value = event.target.value;
            const decoder = new TextDecoder();
            const message = decoder.decode(value);
            const messageElement = document.createElement('div');
            messageElement.textContent = `BT User: ${message}`;
            messages.appendChild(messageElement);
        });

        console.log('Connected to Bluetooth device');
        const messageElement = document.createElement('div');
        messageElement.textContent = 'Connected to Bluetooth device';
        messages.appendChild(messageElement);

    } catch (error) {
        console.error('Bluetooth connection failed:', error);
        messages.innerHTML += '<div>Bluetooth connection failed</div>';
    }
});