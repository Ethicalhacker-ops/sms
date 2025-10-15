# Offline Message

## Project Overview
This project allows devices to send and receive messages offline, using Wi-Fi LAN or Bluetooth. It includes a user-friendly web interface and an optional server to handle LAN messaging. Bluetooth is implemented as a demo using the Web Bluetooth API to connect to nearby BLE devices.

## Core Features
- **Wi-Fi LAN Messaging:** Real-time message exchange between devices on the same LAN.
- **Bluetooth Messaging:** Scan and connect to nearby BLE devices for messaging (demo).
- **User-Friendly Interface:** Clean and responsive chat window.
- **Security:** Optional room codes for LAN access.

## Setup and Usage
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/offline-message.git
   cd offline-message
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the server:**
   ```bash
   npm start
   ```
4. **Open the application:**
   - Open `index.html` in your web browser.
   - To connect to the LAN, enter the IP address of the machine running the server and the port (e.g., `ws://192.168.1.10:8080`). For local testing, `ws://localhost:8080` is sufficient.
   - To use Bluetooth, click the "Connect Bluetooth" button and follow the browser prompts.

## Security
- **LAN Access:** Anyone on the same LAN can access the server if the IP and port are known. Use the provided room codes to restrict access.
- **Bluetooth:** The Web Bluetooth API requires user permission for security.

## Important Notes
- This is a demonstration project.
- Web Bluetooth has limitations and is not supported on all browsers or operating systems.
- For LAN messaging, all devices must be connected to the same Wi-Fi network.
