# WebOSC system

The client allows for users to send Open Sound Control (OSC) commands over a streaming connection (websocket) to a local or remote server. The server relays the websocket messages to a local UDP address.

The project consists of two applications: `webosc-client` and `webosc-server`. The `webosc-client` is a basic implementation of a Ionic Angular project which communicates with the `webosc-server` which is a server side Node.js application broadcasting the sent messages to a local UDP port.
