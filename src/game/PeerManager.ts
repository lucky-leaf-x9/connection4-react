import Peer, { DataConnection } from "peerjs";

class PeerManager {
    opponentConnection: DataConnection | null;
    connectionState: "trying" | "failed" | "success";
    playerName: string;
    peer: Peer;

    private opponentMove: ((column: number) => void) | undefined;
    private onConnect: ((peerName: string) => void) | undefined;
    private onInit: ((id: string) => void) | undefined;

    constructor(playerName: string, connectTo: string | undefined) {
        console.log("created peer with");
        console.log({ playerName, connectTo });
        this.opponentConnection = null;
        this.connectionState = "trying";
        this.playerName = playerName;
        this.peer = new Peer();

        // Listen for when a connection is established
        this.peer.on("open", (id) => {
            this.connectionState = "success";
            if (this.onInit) this.onInit(id);
            console.log(id);

            // Try to connect to other
            if (connectTo) {
                const conn = this.peer.connect(connectTo);
                console.log(`trying to connect to ${connectTo}`);

                conn.on("open", () => {
                    //console.log(`connected to ${connectTo}`);

                    conn.send({
                        type: "connectionDetails",
                        data: {
                            name: this.playerName,
                        },
                    });

                    this.opponentConnection = conn;
                });

                conn.on("data", (data: any) => this.recieveMessage(data));

                conn.on("close", () => {
                    //console.log(" connection was closed");
                    //window.location.href = window.location.href.split("?")[0];
                    window.history.pushState(window.location.href.split("?")[0], "");
                });
            }

            // Listen for incoming connections
            else {
                this.peer.on("connection", (conn) => {
                    //console.log("Incoming connection from: " + conn.peer);

                    conn.on("open", () => {
                        if (this.opponentConnection) {
                            conn.send({
                                type: "Rejection",
                                message: "already has peer",
                            });
                            conn.close();
                            //console.log("\tConnection Rejected");
                            return;
                        }
                        //console.log("\tConnection Accepted");
                        this.opponentConnection = conn;
                        conn.send({
                            type: "connectionDetails",
                            data: {
                                name: playerName,
                            },
                        });
                    });

                    conn.on("data", (data) => this.recieveMessage(data));

                    conn.on("close", () => {
                        //console.log(conn.peer + "has disconnected");
                        this.opponentConnection = null;
                    });
                });
            }
        });
        this.peer.on("error", () => (this.connectionState = "failed"));
    }

    setOpponentMoveCallback = (opponentMove: (column: number) => void) => (this.opponentMove = opponentMove);
    setOnConnectCallback = (onConnect: (peerName: string) => void) => (this.onConnect = onConnect);
    setOnInitCallback = (onInit: (id: string) => void) => (this.onInit = onInit);

    recieveMessage = (message: any) => {
        switch (message.type) {
            case "connectionDetails":
                //$("#player2").html(`${message.data.name}`);
                console.log(`connected to ${message.data.name}`);
                if (this.onConnect) this.onConnect(message.data.name);
                break;
            case "move":
                if (!this.opponentMove) {
                    console.log("ERROR: no opponent move callback defined");
                    break;
                }
                this.opponentMove(message.data.column);
                break;
            default:
                console.error(`unknown message type: ${message.type}`);
        }
    };

    sendMoveData(column: number) {
        if (this.opponentConnection === null) {
            console.log("No connection!!");
            return;
        }
        this.opponentConnection.send({
            type: "move",
            data: {
                column,
            },
        });
    }
}

export default PeerManager;
