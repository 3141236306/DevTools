import { BaseComponent } from '../components/BaseComponent.js';

export class ImageTool extends BaseComponent {
    constructor() {
        super();
        this.file = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    render() {
        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>图片压缩工具</h2>
                    <p>支持 JPG、PNG、WebP 格式，可调节压缩质量和目标尺寸</p>

                    <div class="upload-zone" id="uploadZone">
                        <div class="upload-icon">&#128247;</div>
                        <p class="upload-text">拖拽图片到此处，或点击选择</p>
                        <p class="upload-hint">支持 JPG / PNG / WebP，最大 50MB</p>
                        <input type="file" id="fileInput" accept="image/*" hidden>
                    </div>

                    <div class="preview-row" id="previewRow" style="display:none;">
                        <div class="preview-box">
                            <span class="preview-label">原图</span>
                            <img id="originalPreview" alt="原图预览">
                            <span class="preview-info" id="originalInfo"></span>
                        </div>
                        <div class="preview-arrow">&#10132;</div>
                        <div class="preview-box" id="compressedBox">
                            <span class="preview-label">压缩后</span>
                            <div class="compressed-placeholder" id="compressedPlaceholder">点击"开始压缩"查看结果</div>
                            <img id="compressedPreview" alt="压缩后预览" style="display:none;">
                            <span class="preview-info" id="compressedInfo"></span>
                        </div>
                    </div>

                    <div class="settings-panel" id="settingsPanel" style="display:none;">
                        <div class="setting-row">
                            <label>输出格式</label>
                            <div class="format-btns">
                                <button class="btn btn-ghost active" data-format="jpeg">JPG</button>
                                <button class="btn btn-ghost" data-format="png">PNG</button>
                                <button class="btn btn-ghost" data-format="webp">WebP</button>
                            </div>
                        </div>

                        <div class="setting-row">
                            <label>压缩质量 <span id="qualityValue">80</span>%</label>
                            <input type="range" id="qualitySlider" min="1" max="100" value="80" class="range-slider">
                        </div>

                        <div class="setting-row">
                            <label>等比缩放 <span id="scaleValue">100</span>%</label>
                            <input type="range" id="scaleSlider" min="10" max="100" value="100" class="range-slider">
                        </div>

                        <div class="estimate-bar" id="estimateBar">
                            <span class="estimate-label">预估大小</span>
                            <span class="estimate-value" id="estimateSize">—</span>
                        </div>

                        <div class="setting-row">
                            <label>
                                <input type="checkbox" id="keepAspect" checked> 保持宽高比
                            </label>
                        </div>

                        <div class="button-group">
                            <button id="compressBtn" class="btn">开始压缩</button>
                            <button id="downloadBtn" class="btn btn-accent" disabled>下载压缩图</button>
                            <button id="resetBtn" class="btn btn-ghost">重新选择</button>
                        </div>

                        <div class="result-area" id="compressResult"></div>
                    </div>
                </div>

                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>支持格式</h3>
                        <ul>
                            <li><strong>JPG</strong> — 有损压缩，适合照片类图片</li>
                            <li><strong>PNG</strong> — 无损压缩，支持透明通道</li>
                            <li><strong>WebP</strong> — 新一代格式，压缩率更高</li>
                        </ul>
                    </div>
                    <div class="tool-section">
                        <h3>使用说明</h3>
                        <ul>
                            <li>所有处理在浏览器本地完成</li>
                            <li>图片不会上传到任何服务器</li>
                            <li>质量越低文件越小，但画质下降</li>
                            <li>缩放可大幅减小文件体积</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        this.uploadZone = this.querySelector('#uploadZone');
        this.fileInput = this.querySelector('#fileInput');
        this.previewRow = this.querySelector('#previewRow');
        this.settingsPanel = this.querySelector('#settingsPanel');
        this.originalPreview = this.querySelector('#originalPreview');
        this.compressedPreview = this.querySelector('#compressedPreview');
        this.compressedPlaceholder = this.querySelector('#compressedPlaceholder');
        this.originalInfo = this.querySelector('#originalInfo');
        this.compressedInfo = this.querySelector('#compressedInfo');
        this.qualitySlider = this.querySelector('#qualitySlider');
        this.qualityValue = this.querySelector('#qualityValue');
        this.scaleSlider = this.querySelector('#scaleSlider');
        this.scaleValue = this.querySelector('#scaleValue');
        this.compressBtn = this.querySelector('#compressBtn');
        this.downloadBtn = this.querySelector('#downloadBtn');
        this.resetBtn = this.querySelector('#resetBtn');
        this.compressResult = this.querySelector('#compressResult');
        this.estimateSize = this.querySelector('#estimateSize');

        this.formatBtns = this.querySelectorAll('.format-btns .btn');
        this.currentFormat = 'jpeg';
        this.cachedImg = null;
        this._previewTimer = null;

        this.addEventListener(this.uploadZone, 'click', () => this.fileInput.click());
        this.addEventListener(this.fileInput, 'change', (e) => this.handleFile(e.target.files[0]));

        this.addEventListener(this.uploadZone, 'dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('dragover');
        });
        this.addEventListener(this.uploadZone, 'dragleave', () => {
            this.uploadZone.classList.remove('dragover');
        });
        this.addEventListener(this.uploadZone, 'drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                this.handleFile(e.dataTransfer.files[0]);
            }
        });

        this.formatBtns.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.formatBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFormat = btn.getAttribute('data-format');
                this.schedulePreview();
            });
        });

        this.addEventListener(this.qualitySlider, 'input', () => {
            this.qualityValue.textContent = this.qualitySlider.value;
            this.schedulePreview();
        });
        this.addEventListener(this.scaleSlider, 'input', () => {
            this.scaleValue.textContent = this.scaleSlider.value;
            this.schedulePreview();
        });

        this.addEventListener(this.compressBtn, 'click', () => this.compress());
        this.addEventListener(this.downloadBtn, 'click', () => this.download());
        this.addEventListener(this.resetBtn, 'click', () => this.reset());
    }

    handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            alert('文件大小不能超过 50MB');
            return;
        }

        this.file = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalPreview.src = e.target.result;
            this.originalInfo.textContent = `${file.name} — ${this.formatSize(file.size)}`;
            this.previewRow.style.display = 'flex';
            this.settingsPanel.style.display = 'block';
            this.uploadZone.style.display = 'none';
            this.compressedPreview.src = '';
            this.compressedPreview.style.display = 'none';
            this.compressedPlaceholder.style.display = '';
            this.compressedInfo.textContent = '';
            this.downloadBtn.disabled = true;
            this.compressResult.textContent = '';
            this.compressResult.classList.remove('success', 'error');

            const img = new Image();
            img.onload = () => {
                this.cachedImg = img;
                this.updatePreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    schedulePreview() {
        if (!this.cachedImg) return;
        clearTimeout(this._previewTimer);
        this._previewTimer = setTimeout(() => this.updatePreview(), 150);
    }

    updatePreview() {
        if (!this.cachedImg || !this.file) return;

        const img = this.cachedImg;
        const scale = this.scaleSlider.value / 100;
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.drawImage(img, 0, 0, w, h);

        const quality = this.qualitySlider.value / 100;
        const mimeType = `image/${this.currentFormat}`;
        const dataUrl = this.canvas.toDataURL(mimeType, quality);
        const compressedSize = Math.round((dataUrl.length - 'data:image/*;base64,'.length) * 3 / 4);

        this.estimateSize.textContent = `${this.formatSize(compressedSize)}  ·  ${w}×${h}  ·  ${this.currentFormat.toUpperCase()}`;
    }

    compress() {
        if (!this.file) return;

        const img = new Image();
        img.onload = () => {
            const scale = this.scaleSlider.value / 100;
            let w = Math.round(img.width * scale);
            let h = Math.round(img.height * scale);

            this.canvas.width = w;
            this.canvas.height = h;
            this.ctx.clearRect(0, 0, w, h);
            this.ctx.drawImage(img, 0, 0, w, h);

            const quality = this.qualitySlider.value / 100;
            const mimeType = `image/${this.currentFormat}`;
            const dataUrl = this.canvas.toDataURL(mimeType, quality);

            this.compressedPreview.src = dataUrl;
            this.compressedPreview.style.display = '';
            this.compressedPlaceholder.style.display = 'none';
            this.compressedDataUrl = dataUrl;

            const originalSize = this.file.size;
            const compressedSize = Math.round((dataUrl.length - 'data:image/*;base64,'.length) * 3 / 4);
            const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

            this.compressedInfo.textContent = `压缩后 — ${this.formatSize(compressedSize)}`;
            this.compressResult.innerHTML = `
                原始大小: ${this.formatSize(originalSize)}
压缩后大小: ${this.formatSize(compressedSize)}
压缩率: ${ratio}%
尺寸: ${w} × ${h}
格式: ${this.currentFormat.toUpperCase()}
            `;
            this.compressResult.classList.remove('error');
            this.compressResult.classList.add('success');
            this.downloadBtn.disabled = false;
        };
        img.src = this.originalPreview.src;
    }

    download() {
        if (!this.compressedDataUrl) return;
        const link = document.createElement('a');
        const ext = this.currentFormat === 'jpeg' ? 'jpg' : this.currentFormat;
        const baseName = this.file.name.replace(/\.[^.]+$/, '');
        link.download = `${baseName}_compressed.${ext}`;
        link.href = this.compressedDataUrl;
        link.click();
    }

    reset() {
        this.file = null;
        this.compressedDataUrl = null;
        this.fileInput.value = '';
        this.uploadZone.style.display = '';
        this.previewRow.style.display = 'none';
        this.settingsPanel.style.display = 'none';
        this.downloadBtn.disabled = true;
        this.compressResult.textContent = '';
        this.compressResult.classList.remove('success', 'error');
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}