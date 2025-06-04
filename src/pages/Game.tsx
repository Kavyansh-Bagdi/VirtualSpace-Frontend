import Phaser from "phaser";
import { getToken } from "../scripts/token";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function Game() {
    const navigate = useNavigate();
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        // Check authentication
        if (!getToken()) {
            alert("User is not Logined");
            // Destroy Phaser game if it exists
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            navigate("/auth");
            return;
        }

        class Example extends Phaser.Scene {
            preload() {
                this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
                this.load.image('sky', 'assets/skies/space3.png');
                this.load.image('logo', 'assets/sprites/phaser3-logo.png');
                this.load.image('red', 'assets/particles/red.png');
            }
            create() {
                this.add.image(400, 300, 'sky');
                const particles = this.add.particles(0, 0, 'red', {
                    speed: 100,
                    scale: { start: 1, end: 0 },
                    blendMode: 'ADD'
                });
                const logo = this.physics.add.image(400, 100, 'logo');
                logo.setVelocity(100, 200);
                logo.setBounce(1, 1);
                logo.setCollideWorldBounds(true);
                particles.startFollow(logo);
            }
        }

        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: Example,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 }
                }
            }
        };

        // Create Phaser game
        gameRef.current = new Phaser.Game(config);

        // Cleanup on unmount
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [navigate]);

    return <></>;
}

export default Game;