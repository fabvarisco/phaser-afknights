import { Scene } from "phaser";
import PlayerData from "../prefabs/playerData";

const COLORS = {
  button: 0xcc2222,
  muted:  0x8a9ab0,
};

class LoginScene extends Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  preload() {
    if (!this.cache.json.has("default_data")) {
      this.load.json("default_data", "assets/default_data.json");
    }
    if (!this.textures.exists("background_image")) {
      this.load.image("background_image", "assets/images/background/titleScreen.png");
    }
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const cx = W / 2;

    this._drawBg(W, H);
    this._drawForm(cx, H);
  }

  _drawBg(W, H) {
    const bg = this.add.image(0, 0, "background_image").setOrigin(0, 0);
    bg.setDisplaySize(W, H);
  }

  _drawForm(cx, H) {
    // "Login" heading — left-aligned with the input fields
    this.add.text(cx - 116, 238, "Login", {
      fontFamily: "Nunito, sans-serif",
      fontSize: "26px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
    }).setOrigin(0, 1);

    // email input
    this._emailDom = this.add.dom(cx, 263).createFromHTML(
      `<input name="email" type="email" placeholder="Email address"
       style="width:232px;height:40px;border:none;border-radius:0;
              padding:0 12px;font-size:13px;font-family:Nunito,sans-serif;
              outline:none;color:#1a202c;background:#ffffff;box-sizing:border-box;">`
    );

    // password input
    this._passDom = this.add.dom(cx, 315).createFromHTML(
      `<input name="pass" type="password" placeholder="Password"
       style="width:232px;height:40px;border:none;border-radius:0;
              padding:0 12px;font-size:13px;font-family:Nunito,sans-serif;
              outline:none;color:#1a202c;background:#ffffff;box-sizing:border-box;">`
    );

    // "Forgot your password?" right-aligned
    this.add.text(cx + 116, 356, "Forgot your password?", {
      fontFamily: "Nunito, sans-serif",
      fontSize: "11px",
      color: "#c0cfe0",
    }).setOrigin(1, 0.5).setInteractive({ cursor: "pointer" })
      .on("pointerover",  function() { this.setStyle({ color: "#ffffff" }); })
      .on("pointerout",   function() { this.setStyle({ color: "#c0cfe0" }); })
      .on("pointerup",    () => this._onForgotPassword());

    // "Log In" button
    this._makeButton(cx, 415, "Log In", {
      fill: COLORS.button,
      hoverFill: 0xe03030,
      activeFill: 0xa01818,
      textColor: "#ffffff",
      onClick: () => this._onLogin(),
    });

    // "Play as guest" button
    this._makeButton(cx, 475, "Play as guest", {
      fill: 0x2a2a3a,
      hoverFill: 0x3a3a4e,
      activeFill: 0x1a1a28,
      textColor: "#c0cfe0",
      onClick: () => this._onGuest(),
    });

    // "Don't have an account?" bottom link
    this.add.text(cx, H - 42, "Don't have an account?", {
      fontFamily: "Nunito, sans-serif",
      fontSize: "13px",
      color: "#8a9ab0",
    }).setOrigin(0.5).setInteractive({ cursor: "pointer" })
      .on("pointerover",  function() { this.setStyle({ color: "#c0cfe0" }); })
      .on("pointerout",   function() { this.setStyle({ color: "#8a9ab0" }); })
      .on("pointerup",    () => this._onCreateAccount());
  }

  _makeButton(x, y, label, { fill, hoverFill, activeFill, textColor, onClick }) {
    const BW = 240, BH = 48, R = 0;

    const gfx = this.add.graphics();
    const draw = (color) => {
      gfx.clear();
      gfx.fillStyle(color, 1);
      gfx.fillRoundedRect(x - BW / 2, y - BH / 2, BW, BH, R);
    };

    draw(fill);

    this.add.text(x, y, label, {
      fontFamily: "Nunito, sans-serif",
      fontSize: "15px",
      fontStyle: "bold",
      color: textColor,
      letterSpacing: 1,
    }).setOrigin(0.5).setDepth(1);

    const hit = this.add.rectangle(x, y, BW, BH)
      .setInteractive({ cursor: "pointer" }).setDepth(2);
    hit.on("pointerover",  () => draw(hoverFill));
    hit.on("pointerout",   () => draw(fill));
    hit.on("pointerdown",  () => draw(activeFill));
    hit.on("pointerup",    () => { draw(hoverFill); onClick(); });
  }

  _onGuest() {
    const default_data = this.cache.json.get("default_data");
    this.cache.game.player_data = new PlayerData(default_data.player_data);
    this.scene.start("BootScene", { scene: "game" });
  }

  _onLogin() {
    const email = this._emailDom.getChildByName("email").value;
    const pass  = this._passDom.getChildByName("pass").value;
    // TODO: connect to auth backend with email/pass
    console.log("login", email, pass);
  }

  _onCreateAccount() {
    // TODO: navigate to sign-up screen
  }

  _onForgotPassword() {
    // TODO: password reset flow
  }
}

export default LoginScene;
