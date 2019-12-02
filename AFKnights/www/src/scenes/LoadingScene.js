class LoadingScene extends Phaser.Scene {
    constructor() {
        super({key: 'LoadingScene'});
    }
    
    init (data) {
        this.level_data = data.level_data;
        
        let loading_message = this.add.text(320, 240, "Loading");
    }
    
    preload () {
        let assets = this.level_data.assets;
        for (let asset_key in assets) {
            let asset = assets[asset_key];
            switch (asset.type) {
                case 'image':
                    this.load.image(asset_key, asset.source);
                    break;
                case 'spritesheet':
                    this.load.spritesheet(asset_key, asset.source, {frameWidth: asset.frame_width, frameHeight: asset.frame_height, frames: asset.frames, margin: asset.margin, spacing: asset.spacing});
                    break;
                case 'text':
                    sprite = this.add.text(sprite_data.position.x, sprite_data.position.y,
                        sprite_data.text, sprite_data.style);
                    break;

                    
            }
        }
        

    }
    
    create (data) {
        this.scene.start(data.scene, {level_data: this.level_data,
            extra_parameters: data.extra_parameters});
    }
}

export default LoadingScene;