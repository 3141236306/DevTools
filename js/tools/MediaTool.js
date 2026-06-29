import { BaseComponent } from '../components/BaseComponent.js';

export class MediaTool extends BaseComponent {
    constructor() {
        super();
        this.file = null;
        this.videoElement = null;
        this.isVideo = false;
        this.isCompressing = false;
    }

    render() {
        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>视频压缩工具</h2>
                    <p>支持 MP4、WebM、MOV 等格式，可调节输出格式、质量和分辨率</p>

                    <div class="upload-zone" id="mediaUploadZone">
                        <div class="upload-icon">&#127909;</div>
                        <p class="upload-text">拖拽视频文件到此处，或点击选择</p>
                        <p class="upload-hint">支持 MP4 / WebM / MOV / AVI，最大 500MB</p>
                        <input type="file" id="mediaFileInput" accept="video/*" hidden>
                    </div>

                    <div class="media-workspace" id="mediaWorkspace" style="display:none;">
                        <div class="media-info" id="mediaInfo"></div>
                        <div class="media-preview" id="mediaPreview"></div>

                        <div class="media-compress-panel">
                            <div class="setting-row">
                                <label>输出格式</label>
                                <div class="format-btns">
                                    <button class="btn btn-ghost active" data-mime="video/webm" data-ext="webm">WebM</button>
                                    <button class="btn btn-ghost" data-mime="video/mp4" data-ext="mp4">MP4</button>
                                    <button class="btn btn-ghost" data-mime="video/ogg" data-ext="ogv">OGV</button>
                                </div>
                            </div>

                            <div class="setting-row">
                                <label>视频质量 <span id="vQualityVal">2500</span> kbps</label>
                                <input type="range" id="videoQuality" min="100" max="10000" value="2500" step="100" class="range-slider">
                                <div class="range-hints">
                                    <span>高压缩</span><span>高质量</span>
                                </div>
                            </div>

                            <div class="setting-row">
                                <label>分辨率缩放 <span id="vScaleVal">100</span>%</label>
                                <input type="range" id="videoScale" min="10" max="100" value="100" class="range-slider">
                                <div class="range-hints">
                                    <span>小尺寸</span><span>原始</span>
                                </div>
                            </div>

                            <div class="setting-row">
                                <label>帧率 <span id="vFpsVal">30</span> fps</label>
                                <input type="range" id="videoFps" min="10" max="60" value="30" class="range-slider">
                            </div>

                            <div class="estimate-bar">
                                <span class="estimate-label">输出预估</span>
                                <span class="estimate-value" id="videoEstimate">—</span>
                            </div>

                            <div class="button-group">
                                <button id="startCompressBtn" class="btn">开始压缩</button>
                                <button id="stopCompressBtn" class="btn btn-accent" disabled>停止</button>
                                <button id="downloadVideoBtn" class="btn btn-secondary" disabled>下载视频</button>
                                <button id="mediaResetBtn" class="btn btn-ghost">重新选择</button>
                            </div>

                            <div class="compress-progress" id="compressProgress" style="display:none;">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="progressFill"></div>
                                </div>
                                <span class="progress-text" id="progressText">0%</span>
                            </div>

                            <div class="result-area" id="mediaResult"></div>
                        </div>
                    </div>
                </div>

                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>输出格式</h3>
                        <ul>
                            <li><strong>WebM</strong> — 浏览器原生支持，压缩率高，推荐首选</li>
                            <li><strong>MP4</strong> — 兼容性最好，部分浏览器支持</li>
                            <li><strong>OGV</strong> — 开放格式，兼容性一般</li>
                        </ul>
                    </div>
                    <div class="tool-section">
                        <h3>压缩原理</h3>
                        <ul>
                            <li>通过 canvas 逐帧重绘视频画面</li>
                            <li>使用 MediaRecorder API 重新编码</li>
                            <li>降低码率和分辨率来减小文件体积</li>
                            <li>所有处理在浏览器本地完成</li>
                        </ul>
                    </div>
                    <div class="tool-section">
                        <h3>注意事项</h3>
                        <ul>
                            <li>大文件压缩耗时较长，请耐心等待</li>
                            <li>压缩期间请勿切换页面</li>
                            <li>建议先用 WebM 格式测试效果</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        this.uploadZone = this.querySelector('#mediaUploadZone');
        this.fileInput = this.querySelector('#mediaFileInput');
        this.workspace = this.querySelector('#mediaWorkspace');
        this.mediaInfo = this.querySelector('#mediaInfo');
        this.mediaPreview = this.querySelector('#mediaPreview');
        this.result = this.querySelector('#mediaResult');
        this.progressWrap = this.querySelector('#compressProgress');
        this.progressFill = this.querySelector('#progressFill');
        this.progressText = this.querySelector('#progressText');
        this.startBtn = this.querySelector('#startCompressBtn');
        this.stopBtn = this.querySelector('#stopCompressBtn');
        this.downloadBtn = this.querySelector('#downloadVideoBtn');
        this.estimateEl = this.querySelector('#videoEstimate');

        this.qualitySlider = this.querySelector('#videoQuality');
        this.qualityVal = this.querySelector('#vQualityVal');
        this.scaleSlider = this.querySelector('#videoScale');
        this.scaleVal = this.querySelector('#vScaleVal');
        this.fpsSlider = this.querySelector('#videoFps');
        this.fpsVal = this.querySelector('#vFpsVal');

        this.outputMime = 'video/webm';
        this.outputExt = 'webm';
        this.outputBlob = null;

        this.setupUpload();
        this.setupFormatBtns();
        this.setupSliders();
        this.setupActions();
    }

    setupUpload() {
        this.addEventListener(this.uploadZone, 'click', () => this.fileInput.click());
        this.addEventListener(this.fileInput, 'change', (e) => {
            if (e.target.files[0]) this.handleFile(e.target.files[0]);
        });
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
            if (e.dataTransfer.files.length) this.handleFile(e.dataTransfer.files[0]);
        });
    }

    setupFormatBtns() {
        const btns = this.querySelectorAll('.format-btns .btn');
        btns.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.outputMime = btn.getAttribute('data-mime');
                this.outputExt = btn.getAttribute('data-ext');
            });
        });
    }

    setupSliders() {
        const update = () => this.updateEstimate();
        this.addEventListener(this.qualitySlider, 'input', () => {
            this.qualityVal.textContent = this.qualitySlider.value;
            update();
        });
        this.addEventListener(this.scaleSlider, 'input', () => {
            this.scaleVal.textContent = this.scaleSlider.value;
            update();
        });
        this.addEventListener(this.fpsSlider, 'input', () => {
            this.fpsVal.textContent = this.fpsSlider.value;
            update();
        });
    }

    updateEstimate() {
        if (!this.videoDuration || !this.videoWidth || !this.videoHeight) {
            this.estimateEl.textContent = '—';
            return;
        }
        const bitrate = parseInt(this.qualitySlider.value) * 1000;
        const scale = parseInt(this.scaleSlider.value) / 100;
        const fps = parseInt(this.fpsSlider.value);
        const outW = Math.round(this.videoWidth * scale);
        const outH = Math.round(this.videoHeight * scale);
        const estimatedBytes = (bitrate / 8) * this.videoDuration;
        this.estimateEl.textContent = `~${this.formatSize(estimatedBytes)}  ·  ${outW}×${outH}  ·  ${fps}fps`;
    }

    setupActions() {
        this.addEventListener(this.startBtn, 'click', () => this.startCompress());
        this.addEventListener(this.stopBtn, 'click', () => this.stopCompress());
        this.addEventListener(this.downloadBtn, 'click', () => this.downloadVideo());
        this.addEventListener(this.querySelector('#mediaResetBtn'), 'click', () => this.reset());
    }

    handleFile(file) {
        if (!file || !file.type.startsWith('video/')) {
            alert('请选择视频文件');
            return;
        }
        if (file.size > 500 * 1024 * 1024) {
            alert('文件大小不能超过 500MB');
            return;
        }

        this.file = file;
        this.uploadZone.style.display = 'none';
        this.workspace.style.display = 'block';

        const size = this.formatSize(file.size);
        const duration = this.file.duration ? `${this.file.duration.toFixed(1)}s` : '';
        this.mediaInfo.textContent = `${file.name} — ${file.type} — ${size} ${duration ? '— ' + duration : ''}`;

        this.mediaPreview.innerHTML = '';
        const video = document.createElement('video');
        video.className = 'media-preview-video';
        video.controls = true;
        video.muted = true;
        video.preload = 'auto';
        this.mediaPreview.appendChild(video);
        this.videoElement = video;

        video.addEventListener('loadedmetadata', () => {
            this.videoWidth = video.videoWidth;
            this.videoHeight = video.videoHeight;
            this.videoDuration = video.duration;
            this.updateEstimate();
        });

        const url = URL.createObjectURL(file);
        video.src = url;

        this.outputBlob = null;
        this.downloadBtn.disabled = true;
        this.result.textContent = '';
        this.result.classList.remove('success', 'error');
        this.progressWrap.style.display = 'none';
    }

    async startCompress() {
        if (!this.videoElement || this.isCompressing) return;

        const video = this.videoElement;
        if (!video.duration || video.duration === Infinity) {
            alert('视频尚未加载完成，请稍候再试');
            return;
        }

        this.isCompressing = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.downloadBtn.disabled = true;
        this.outputBlob = null;
        this.progressWrap.style.display = 'flex';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = '准备中...';
        this.result.textContent = '正在压缩，请勿切换页面...';
        this.result.classList.remove('error', 'success');

        const bitrate = parseInt(this.qualitySlider.value) * 1000;
        const scale = parseInt(this.scaleSlider.value) / 100;
        const fps = parseInt(this.fpsSlider.value);

        const outW = Math.round(this.videoWidth * scale);
        const outH = Math.round(this.videoHeight * scale);

        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');

        const stream = canvas.captureStream(fps);

        if (video.captureStream) {
            const audioStream = video.captureStream();
            const audioTracks = audioStream.getAudioTracks();
            audioTracks.forEach(t => stream.addTrack(t));
        }

        const chunks = [];
        let mimeType = this.outputMime;
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp8';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm';
            }
        }

        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: bitrate
        });

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
            this.outputBlob = new Blob(chunks, { type: mimeType });
            this.isCompressing = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.downloadBtn.disabled = false;

            const originalSize = this.file.size;
            const compressedSize = this.outputBlob.size;
            const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

            this.result.innerHTML = `
压缩完成!
原始大小: ${this.formatSize(originalSize)}
压缩后大小: ${this.formatSize(compressedSize)}
压缩率: ${ratio}%
输出格式: ${mimeType}
分辨率: ${outW}×${outH}
            `;
            this.result.classList.remove('error');
            this.result.classList.add('success');
            this.progressFill.style.width = '100%';
            this.progressText.textContent = '100%';
        };

        video.currentTime = 0;
        await new Promise(r => { video.onseeked = r; });

        video.play();
        this.mediaRecorder.start(100);

        const totalDuration = video.duration;
        const frameInterval = 1000 / fps;

        const drawFrame = () => {
            if (!this.isCompressing || video.paused || video.ended) {
                if (this.mediaRecorder.state === 'recording') {
                    this.mediaRecorder.stop();
                }
                video.pause();
                return;
            }

            ctx.drawImage(video, 0, 0, outW, outH);

            const progress = Math.min((video.currentTime / totalDuration) * 100, 100);
            this.progressFill.style.width = progress + '%';
            this.progressText.textContent = Math.round(progress) + '%';

            requestAnimationFrame(drawFrame);
        };

        video.onended = () => {
            if (this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
            }
            this.isCompressing = false;
        };

        requestAnimationFrame(drawFrame);
    }

    stopCompress() {
        if (!this.isCompressing) return;
        this.isCompressing = false;
        if (this.videoElement) this.videoElement.pause();
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.result.textContent = '压缩已停止';
        this.result.classList.remove('success');
    }

    downloadVideo() {
        if (!this.outputBlob) return;
        const url = URL.createObjectURL(this.outputBlob);
        const link = document.createElement('a');
        const baseName = this.file.name.replace(/\.[^.]+$/, '');
        link.download = `${baseName}_compressed.${this.outputExt}`;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    }

    reset() {
        this.stopCompress();
        this.file = null;
        this.videoElement = null;
        this.outputBlob = null;
        this.fileInput.value = '';
        this.uploadZone.style.display = '';
        this.workspace.style.display = 'none';
        this.result.textContent = '';
        this.result.classList.remove('success', 'error');
        this.progressWrap.style.display = 'none';
        this.downloadBtn.disabled = true;
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}