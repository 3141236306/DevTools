import { BaseComponent } from '../components/BaseComponent.js';

export class ColorTool extends BaseComponent {
    constructor() {
        super();
        this.colorPicker = null;
        this.hexInput = null;
        this.rgbInput = null;
        this.hslInput = null;
        this.colorPreview = null;
    }
    
    render() {
        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>颜色工具</h2>
                    <p>颜色选择、转换、调色板生成</p>
                    
                    <div class="color-picker-section">
                        <div class="form-group">
                            <label for="colorPicker">颜色选择器：</label>
                            <input type="color" id="colorPicker" value="#3498db" class="color-picker">
                        </div>
                        
                        <div class="color-formats">
                            <div class="form-group">
                                <label for="hexInput">HEX：</label>
                                <input type="text" id="hexInput" value="#3498db" placeholder="#RRGGBB">
                            </div>
                            
                            <div class="form-group">
                                <label for="rgbInput">RGB：</label>
                                <input type="text" id="rgbInput" value="rgb(52, 152, 219)" placeholder="rgb(0, 0, 0)">
                            </div>
                            
                            <div class="form-group">
                                <label for="hslInput">HSL：</label>
                                <input type="text" id="hslInput" value="hsl(204, 70%, 53%)" placeholder="hsl(0, 0%, 0%)">
                            </div>
                        </div>
                        
                        <div class="button-group">
                            <button id="convertBtn" class="btn">转换颜色</button>
                            <button id="randomBtn" class="btn btn-secondary">随机颜色</button>
                            <button id="copyBtn" class="btn btn-accent">复制颜色值</button>
                        </div>
                    </div>
                    
                    <div class="color-preview-section">
                        <div class="form-group">
                            <label>颜色预览：</label>
                            <div id="colorPreview" class="color-preview"></div>
                        </div>
                    </div>
                </div>
                
                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>颜色格式说明</h3>
                        <div class="color-info">
                            <h4>HEX格式</h4>
                            <p>十六进制颜色表示，如 #FF0000 表示红色。</p>
                            
                            <h4>RGB格式</h4>
                            <p>红绿蓝三原色组合，如 rgb(255, 0, 0)。</p>
                            
                            <h4>HSL格式</h4>
                            <p>色调、饱和度、亮度，如 hsl(0, 100%, 50%)。</p>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>常用颜色</h3>
                        <div class="color-palette">
                            <div class="color-swatch" data-color="#FF0000" style="background-color: #FF0000;"></div>
                            <div class="color-swatch" data-color="#00FF00" style="background-color: #00FF00;"></div>
                            <div class="color-swatch" data-color="#0000FF" style="background-color: #0000FF;"></div>
                            <div class="color-swatch" data-color="#FFFF00" style="background-color: #FFFF00;"></div>
                            <div class="color-swatch" data-color="#FF00FF" style="background-color: #FF00FF;"></div>
                            <div class="color-swatch" data-color="#00FFFF" style="background-color: #00FFFF;"></div>
                            <div class="color-swatch" data-color="#000000" style="background-color: #000000;"></div>
                            <div class="color-swatch" data-color="#FFFFFF" style="background-color: #FFFFFF; border: 1px solid #ccc;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    afterMount() {
        this.colorPicker = this.querySelector('#colorPicker');
        this.hexInput = this.querySelector('#hexInput');
        this.rgbInput = this.querySelector('#rgbInput');
        this.hslInput = this.querySelector('#hslInput');
        this.colorPreview = this.querySelector('#colorPreview');
        this.convertBtn = this.querySelector('#convertBtn');
        this.randomBtn = this.querySelector('#randomBtn');
        this.copyBtn = this.querySelector('#copyBtn');
        
        this.addEventListener(this.colorPicker, 'input', () => {
            this.updateFromPicker();
        });
        
        this.addEventListener(this.convertBtn, 'click', () => {
            this.convertColor();
        });
        
        this.addEventListener(this.randomBtn, 'click', () => {
            this.generateRandomColor();
        });
        
        this.addEventListener(this.copyBtn, 'click', () => {
            this.copyColor();
        });
        
        // 颜色样本点击事件
        const swatches = this.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            this.addEventListener(swatch, 'click', () => {
                const color = swatch.getAttribute('data-color');
                this.setColor(color);
            });
        });
        
        // 初始化预览
        this.updatePreview();
    }
    
    updateFromPicker() {
        const color = this.colorPicker.value;
        this.hexInput.value = color.toUpperCase();
        
        // 转换为RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        this.rgbInput.value = `rgb(${r}, ${g}, ${b})`;
        
        // 转换为HSL
        const hsl = this.rgbToHsl(r, g, b);
        this.hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        this.updatePreview();
    }
    
    convertColor() {
        // 尝试从HEX转换
        if (this.hexInput.value.match(/^#[0-9A-Fa-f]{6}$/)) {
            this.setColor(this.hexInput.value);
            return;
        }
        
        // 尝试从RGB转换
        const rgbMatch = this.rgbInput.value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            const hex = this.rgbToHex(r, g, b);
            this.setColor(hex);
            return;
        }
        
        // 尝试从HSL转换
        const hslMatch = this.hslInput.value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
            const h = parseInt(hslMatch[1]);
            const s = parseInt(hslMatch[2]);
            const l = parseInt(hslMatch[3]);
            const rgb = this.hslToRgb(h, s, l);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            this.setColor(hex);
            return;
        }
        
        alert('请输入有效的颜色值');
    }
    
    setColor(hex) {
        this.colorPicker.value = hex;
        this.hexInput.value = hex.toUpperCase();
        
        // 转换为RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        this.rgbInput.value = `rgb(${r}, ${g}, ${b})`;
        
        // 转换为HSL
        const hsl = this.rgbToHsl(r, g, b);
        this.hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        this.updatePreview();
    }
    
    generateRandomColor() {
        const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        this.setColor(randomHex);
    }
    
    updatePreview() {
        const color = this.colorPicker.value;
        this.colorPreview.style.backgroundColor = color;
        
        // 根据亮度调整文字颜色
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        if (brightness > 128) {
            this.colorPreview.style.color = '#000000';
        } else {
            this.colorPreview.style.color = '#FFFFFF';
        }
        
        this.colorPreview.textContent = color.toUpperCase();
    }
    
    copyColor() {
        const color = this.colorPicker.value;
        navigator.clipboard.writeText(color).then(() => {
            alert('颜色值已复制到剪贴板');
        }).catch(() => {
            // 回退方案
            const textarea = document.createElement('textarea');
            textarea.value = color;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('颜色值已复制到剪贴板');
        });
    }
    
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }
    
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}