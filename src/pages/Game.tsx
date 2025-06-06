import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { io } from "socket.io-client";
import { getToken, readToken } from "../scripts/token";
import { useNavigate } from "react-router-dom";

function Game() {
    const navigate = useNavigate();
    const gameRef = useRef<Phaser.Game | null>(null);
    const phaserRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<ReturnType<typeof io> | null>(null);

    useEffect(() => {
        if (!getToken()) {
            alert("User is not Logined");
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            navigate("/auth");
            return;
        }

        socketRef.current = io("http://localhost:3000/space"); // Connect to /space namespace
        socketRef.current.emit("join", readToken()?.name);
        let playerSprites: { [key: string]: Phaser.GameObjects.Sprite } = {};
        let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

        class GameScene extends Phaser.Scene {
            constructor() {
                super("GameScene");
            }
            preload() {
                this.load.image("tiles", "map/Dungeon forest.png");
                this.load.tilemapTiledJSON("map", "map/devMap.json");
                this.load.spritesheet("player", "player1.png", { frameWidth: 32, frameHeight: 48 });
            }
            create() {
                // Load map and tileset
                const map = this.make.tilemap({ key: "map" });
                const tileset = map.addTilesetImage("Dungeon forest", "tiles");
                const layer = map.createLayer("Tile Layer 1", tileset, 0, 0);
                layer.setDepth(-1); // Set the depth to -1
                // Set world bounds

                // Setup keyboard
                cursors = this.input.keyboard.createCursorKeys();
            }
            update() {
                if (cursors.left.isDown) {
                    socketRef.current.emit("left_movement");
                }
                if (cursors.right.isDown) {
                    socketRef.current.emit("right_movement");
                }
                if (cursors.up.isDown) {
                    socketRef.current.emit("up_movement");
                }
                if (cursors.down.isDown) {
                    socketRef.current.emit("down_movement");
                }
            }
        }

        const config = {
            type: Phaser.AUTO,
            width: 320,
            height: 320,
            parent: phaserRef.current,
            scene: GameScene,
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        // Handle player updates from the server
        socketRef.current.on("update", (players: any[]) => {
            const scene = game.scene.getScene("GameScene") as Phaser.Scene;
            if (!scene) return;
            console.log(players);
            players.forEach((p) => {
                if (!playerSprites[p.socketId]) {
                    playerSprites[p.socketId] = scene.add.sprite(p.coordinate.x, p.coordinate.y, "player");
                } else {
                    playerSprites[p.socketId].x = p.coordinate.x;
                    playerSprites[p.socketId].y = p.coordinate.y;
                }
            });

            // Clean up disconnected players
            Object.keys(playerSprites).forEach((id) => {
                if (!players.find((p) => p.socketId === id)) {
                    playerSprites[id].destroy();
                    delete playerSprites[id];
                }
            });
        });

        return () => {
            socketRef.current.disconnect();
            game.destroy(true);
        };
    }, [navigate]);

    return <div ref={phaserRef} />;
}

export default Game;