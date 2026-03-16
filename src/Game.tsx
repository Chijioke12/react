import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

const GAME_WIDTH = 240;
const GAME_HEIGHT = 320;

class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isGameOver: boolean = false;
  private highscore: number = 0;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/atlas.json');
    this.load.audio('jump', 'assets/jump.wav');
    this.load.audio('fall', 'assets/fall.wav');
    this.load.audio('break', 'assets/break.wav');
  }

  create() {
    this.isGameOver = false;
    this.score = 0;

    // Background
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xF0F0F0).setOrigin(0);

    // Platforms
    this.platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    // Initial platforms
    for (let i = 0; i < 6; i++) {
      this.createPlatform(GAME_HEIGHT - i * 60);
    }

    // Player
    this.player = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 100, 'sprites', 'doodler_right');
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(false);
    (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(600);

    // Collisions
    this.physics.add.collider(this.player, this.platforms, this.handlePlatformCollision, undefined, this);

    // Score
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', color: '#000' });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // KaiOS Keypad support (4, 6, 5)
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (this.isGameOver && (event.key === 'Enter' || event.key === '5')) {
        this.scene.restart();
      }
    });
  }

  createPlatform(y: number) {
    const x = Phaser.Math.Between(30, GAME_WIDTH - 30);
    const type = Phaser.Math.Between(0, 10);
    let frame = 'platform_green';
    
    if (type > 8) frame = 'platform_blue'; // Moving
    else if (type > 7) frame = 'platform_brown'; // Breaking

    const platform = this.platforms.create(x, y, 'sprites', frame);
    const body = platform.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.down = false;
    body.checkCollision.left = false;
    body.checkCollision.right = false;

    if (frame === 'platform_blue') {
      platform.setData('moving', true);
      platform.setData('speed', Phaser.Math.Between(50, 100));
      platform.setData('direction', Phaser.Math.Between(0, 1) === 0 ? 1 : -1);
    }
    
    if (frame === 'platform_brown') {
      platform.setData('breaking', true);
    }

    return platform;
  }

  handlePlatformCollision(player: any, platform: any) {
    if (player.body.velocity.y > 0 && player.y < platform.y) {
      if (platform.getData('breaking')) {
        this.sound.play('break');
        platform.destroy();
        return;
      }
      
      player.setVelocityY(-400);
      this.sound.play('jump');
    }
  }

  update() {
    if (this.isGameOver) return;

    // Movement
    if (this.cursors.left.isDown || this.input.keyboard.addKey('4').isDown) {
      this.player.setVelocityX(-160);
      this.player.setFrame('doodler_left');
    } else if (this.cursors.right.isDown || this.input.keyboard.addKey('6').isDown) {
      this.player.setVelocityX(160);
      this.player.setFrame('doodler_right');
    } else {
      this.player.setVelocityX(0);
    }

    // Wrap around
    if (this.player.x < 0) this.player.x = GAME_WIDTH;
    else if (this.player.x > GAME_WIDTH) this.player.x = 0;

    // Camera follow (manual)
    if (this.player.y < GAME_HEIGHT / 2) {
      const diff = GAME_HEIGHT / 2 - this.player.y;
      this.player.y = GAME_HEIGHT / 2;
      this.score += Math.floor(diff);
      this.scoreText.setText(`Score: ${this.score}`);

      this.platforms.children.iterate((child: any) => {
        child.y += diff;
        if (child.y > GAME_HEIGHT) {
          child.destroy();
          this.createPlatform(0);
        }
        return true;
      });
    }

    // Moving platforms
    this.platforms.children.iterate((child: any) => {
      if (child.getData('moving')) {
        child.x += child.getData('speed') * child.getData('direction') * (1/60);
        if (child.x < 30 || child.x > GAME_WIDTH - 30) {
          child.setData('direction', child.getData('direction') * -1);
        }
      }
      return true;
    });

    // Game Over
    if (this.player.y > GAME_HEIGHT) {
      this.gameOver();
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.sound.play('fall');
    this.physics.pause();
    this.player.setTint(0xff0000);
    
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'GAME OVER', {
      fontSize: '24px',
      color: '#f00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, `Highscore: ${this.highscore}\nPress 5 to Restart`, {
      fontSize: '14px',
      color: '#000',
      align: 'center'
    }).setOrigin(0.5);
  }
}

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: MainScene,
      pixelArt: true,
      backgroundColor: '#ffffff'
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900 p-4">
      <div className="relative border-4 border-stone-700 rounded-lg overflow-hidden shadow-2xl">
        <div ref={gameRef} />
      </div>
      <div className="mt-4 text-stone-400 text-xs font-mono uppercase tracking-widest">
        Doodle Jump KaiOS Edition
      </div>
      <div className="mt-2 flex gap-4 text-[10px] text-stone-500 font-mono">
        <span>4: LEFT</span>
        <span>6: RIGHT</span>
        <span>5: START</span>
      </div>
    </div>
  );
};

export default Game;
