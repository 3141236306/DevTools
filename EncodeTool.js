import { BaseComponent } from '../components/BaseComponent.js';

export class EncodeTool extends BaseComponent {
    constructor() {
        super();
        this.currentTab = 'url';
    }

    render() {
        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>编码/解码工具</h2>
                    <p>URL编码、Base64编码解码、HTML实体编码、图片Base64转换</p>

                    <div class="tabs">
                        <button class="tab-btn active" data-tab="url">URL</button>
                        <button class="tab-btn" data-tab="base64">Base64文本</button>
                        <button class="tab-btn" data-tab="html">HTML实体</button>
                        <button class="tab-btn" data-tab="img">图片Base64</button>
                        <button class="tab-btn" data-tab="doc">文档Base64</button>
                    </div>

                    <div class="tab-content active" id="url-tab">
                        <div class="form-group">
                            <label for="urlInput">输入文本：</label>
                            <textarea id="urlInput" placeholder="输入要编码/解码的URL或文本..."></textarea>
                        </div>
                        <div class="button-group">
                            <button id="urlEncodeBtn" class="btn">URL编码</button>
                            <button id="urlDecodeBtn" class="btn btn-secondary">URL解码</button>
                            <button id="urlCopyBtn" class="btn btn-accent">复制结果</button>
                        </div>
                    </div>

                    <div class="tab-content" id="base64-tab">
                        <div class="form-group">
                            <label for="base64Input">输入文本：</label>
                            <textarea id="base64Input" placeholder="输入要编码/解码的文本..."></textarea>
                        </div>
                        <div class="button-group">
                            <button id="base64EncodeBtn" class="btn">Base64编码</button>
                            <button id="base64DecodeBtn" class="btn btn-secondary">Base64解码</button>
                            <button id="base64CopyBtn" class="btn btn-accent">复制结果</button>
                        </div>
                    </div>

                    <div class="tab-content" id="html-tab">
                        <div class="form-group">
                            <label for="htmlInput">输入HTML：</label>
                            <textarea id="htmlInput" placeholder="输入要编码/解码的HTML..."></textarea>
                        </div>
                        <div class="button-group">
                            <button id="htmlEncodeBtn" class="btn">HTML编码</button>
                            <button id="htmlDecodeBtn" class="btn btn-secondary">HTML解码</button>
                            <button id="htmlCopyBtn" class="btn btn-accent">复制结果</button>
                        </div>
                    </div>

                    <div class="tab-content" id="img-tab">
                        <div class="img-encode-section">
                            <div class="img-encode-mode-tabs">
                                <button class="btn btn-ghost active" id="imgEncodeModeBtn">图片 → Base64</button>
                                <button class="btn btn-ghost" id="imgDecodeModeBtn">Base64 → 图片</button>
                            </div>

                            <div id="imgEncodePanel">
                                <div class="upload-zone" id="imgUploadZone">
                                    <div class="upload-icon">&#128247;</div>
                                    <p class="upload-text">拖拽图片到此处，或点击选择</p>
                                    <p class="upload-hint">支持 JPG / PNG / GIF / WebP / SVG</p>
                                    <input type="file" id="imgFileInput" accept="image/*" hidden>
                                </div>
                                <div class="img-preview-row" id="imgPreviewRow" style="display:none;">
                                    <div class="img-preview-box">
                                        <img id="imgPreview" alt="预览">
                                    </div>
                                    <div class="img-preview-info" id="imgPreviewInfo"></div>
                                </div>
                                <div class="button-group">
                                    <button id="imgEncodeBtn" class="btn" disabled>编码为Base64</button>
                                    <button id="imgCopyStrBtn" class="btn btn-accent" disabled>复制Base64字符串</button>
                                    <button id="imgDownloadStrBtn" class="btn btn-secondary" disabled>下载为txt</button>
                                    <button id="imgResetBtn" class="btn btn-ghost">重新选择</button>
                                </div>
                                <div class="form-group" id="imgBase64ResultGroup" style="display:none;">
                                    <label>Base64结果：</label>
                                    <div id="imgBase64Result" class="result-area"></div>
                                </div>
                            </div>

                            <div id="imgDecodePanel" style="display:none;">
                                <div class="form-group">
                                    <label for="imgBase64Input">粘贴Base64字符串：</label>
                                    <textarea id="imgBase64Input" placeholder="粘贴图片的Base64编码字符串（支持带 data:image/xxx;base64, 前缀或纯字符串）..."></textarea>
                                </div>
                                <div class="button-group">
                                    <button id="imgDecodeBtn" class="btn">解码为图片</button>
                                    <button id="imgDecodeCopyBtn" class="btn btn-accent" disabled>复制图片</button>
                                    <button id="imgDecodeDownloadBtn" class="btn btn-secondary" disabled>下载图片</button>
                                    <button id="imgDecodeResetBtn" class="btn btn-ghost">重新输入</button>
                                </div>
                                <div class="img-preview-row" id="imgDecodePreviewRow" style="display:none;">
                                    <div class="img-preview-box">
                                        <img id="imgDecodePreview" alt="解码预览">
                                    </div>
                                    <div class="img-preview-info" id="imgDecodePreviewInfo"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" id="doc-tab">
                        <div class="img-encode-section">
                            <div class="img-encode-mode-tabs">
                                <button class="btn btn-ghost active" id="docEncodeModeBtn">文档 → Base64</button>
                                <button class="btn btn-ghost" id="docDecodeModeBtn">Base64 → 文档</button>
                            </div>

                            <div id="docEncodePanel">
                                <div class="upload-zone" id="docUploadZone">
                                    <div class="upload-icon">&#128196;</div>
                                    <p class="upload-text">拖拽文档到此处，或点击选择</p>
                                    <p class="upload-hint">支持 Excel / PDF / Word / PPT / TXT / CSV</p>
                                    <input type="file" id="docFileInput" accept=".xls,.xlsx,.pdf,.doc,.docx,.txt,.csv,.ppt,.pptx" hidden>
                                </div>
                                <div class="img-preview-row" id="docPreviewRow" style="display:none;">
                                    <div class="img-preview-box doc-file-icon" id="docFileIcon"></div>
                                    <div class="img-preview-info" id="docPreviewInfo"></div>
                                </div>
                                <div class="button-group">
                                    <button id="docEncodeBtn" class="btn" disabled>编码为Base64</button>
                                    <button id="docCopyStrBtn" class="btn btn-accent" disabled>复制Base64字符串</button>
                                    <button id="docDownloadStrBtn" class="btn btn-secondary" disabled>下载为txt</button>
                                    <button id="docResetBtn" class="btn btn-ghost">重新选择</button>
                                </div>
                                <div class="form-group" id="docBase64ResultGroup" style="display:none;">
                                    <label>Base64结果：</label>
                                    <div id="docBase64Result" class="result-area"></div>
                                </div>
                            </div>

                            <div id="docDecodePanel" style="display:none;">
                                <div class="form-group">
                                    <label for="docBase64Input">粘贴Base64字符串：</label>
                                    <textarea id="docBase64Input" placeholder="粘贴文档的Base64编码字符串（支持带 data:mime;base64, 前缀或纯字符串）..."></textarea>
                                </div>
                                <div class="form-group">
                                    <label>文档类型：</label>
                                    <div class="doc-type-radios">
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="application/pdf" checked><span>PDF</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="application/vnd.ms-excel"><span>Excel (.xls)</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"><span>Excel (.xlsx)</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="application/msword"><span>Word (.doc)</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="application/vnd.openxmlformats-officedocument.wordprocessingml.document"><span>Word (.docx)</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="text/plain"><span>TXT</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="application/vnd.ms-powerpoint"><span>PowerPoint (.ppt)</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="application/vnd.openxmlformats-officedocument.presentationml.presentation"><span>PowerPoint (.pptx)</span></label>
                                        <label class="doc-type-radio"><input type="radio" name="docMime" value="text/csv"><span>CSV</span></label>
                                    </div>
                                </div>
                                <div class="button-group">
                                    <button id="docDecodeBtn" class="btn">解码为文档</button>
                                    <button id="docCopyDecodedBtn" class="btn btn-accent" disabled>复制Base64</button>
                                    <button id="docDecodeDownloadBtn" class="btn btn-secondary" disabled>下载文档</button>
                                    <button id="docDecodeResetBtn" class="btn btn-ghost">重新输入</button>
                                </div>
                                <div class="img-preview-row" id="docDecodePreviewRow" style="display:none;">
                                    <div class="img-preview-box doc-file-icon" id="docDecodeFileIcon"></div>
                                    <div class="img-preview-info" id="docDecodePreviewInfo"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group" id="textResultGroup">
                        <label>结果：</label>
                        <div id="encodeOutput" class="result-area"></div>
                    </div>
                </div>

                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>编码说明</h3>
                        <div class="encoding-info">
                            <h4>URL编码</h4>
                            <p>用于在URL中安全传输特殊字符，如空格、中文等。</p>

                            <h4>Base64编码</h4>
                            <p>将二进制数据转换为ASCII字符，常用于邮件传输、数据嵌入。</p>

                            <h4>HTML实体编码</h4>
                            <p>将特殊字符转换为HTML实体，防止XSS攻击。</p>

                            <h4>图片Base64</h4>
                            <p>将图片转换为Base64字符串，可用于CSS内嵌图片、JSON传输等场景。</p>

                            <h4>文档Base64</h4>
                            <p>将文档（Excel、PDF、Word、PPT等）转换为Base64字符串，用于数据传输、存储或嵌入。支持解码Base64字符串还原为文档文件。</p>
                        </div>
                    </div>

                    <div class="tool-section">
                        <h3>常用编码对照</h3>
                        <table class="encoding-table">
                            <tr><th>字符</th><th>URL编码</th><th>HTML实体</th></tr>
                            <tr><td>空格</td><td>%20</td><td>&amp;nbsp;</td></tr>
                            <tr><td>&lt;</td><td>%3C</td><td>&amp;lt;</td></tr>
                            <tr><td>&gt;</td><td>%3E</td><td>&amp;gt;</td></tr>
                            <tr><td>&amp;</td><td>%26</td><td>&amp;amp;</td></tr>
                            <tr><td>"</td><td>%22</td><td>&amp;quot;</td></tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        this.setupTabs();
        this.setupUrl();
        this.setupBase64();
        this.setupHtml();
        this.setupImage();
        this.setupDoc();
    }

    setupTabs() {
        const tabBtns = this.querySelectorAll('.tabs .tab-btn');
        tabBtns.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.getAttribute('data-tab');
                this.querySelector(`#${tab}-tab`).classList.add('active');
                this.currentTab = tab;

                const textResult = this.querySelector('#textResultGroup');
                textResult.style.display = (tab === 'img' || tab === 'doc') ? 'none' : '';
            });
        });
    }

    setupUrl() {
        this.addEventListener(this.querySelector('#urlEncodeBtn'), 'click', () => this.urlOp(true));
        this.addEventListener(this.querySelector('#urlDecodeBtn'), 'click', () => this.urlOp(false));
        this.addEventListener(this.querySelector('#urlCopyBtn'), 'click', () => this.copyOutput());
    }

    urlOp(isEncode) {
        const input = this.querySelector('#urlInput').value;
        const output = this.querySelector('#encodeOutput');
        try {
            const result = isEncode ? encodeURIComponent(input) : decodeURIComponent(input);
            output.textContent = result;
            output.classList.remove('error');
            output.classList.add('success');
        } catch (e) {
            output.textContent = '解码失败，请检查输入内容';
            output.classList.remove('success');
            output.classList.add('error');
        }
    }

    setupBase64() {
        this.addEventListener(this.querySelector('#base64EncodeBtn'), 'click', () => this.base64Op(true));
        this.addEventListener(this.querySelector('#base64DecodeBtn'), 'click', () => this.base64Op(false));
        this.addEventListener(this.querySelector('#base64CopyBtn'), 'click', () => this.copyOutput());
    }

    base64Op(isEncode) {
        const input = this.querySelector('#base64Input').value;
        const output = this.querySelector('#encodeOutput');
        if (!input.trim()) {
            output.textContent = '请输入内容';
            output.classList.remove('success');
            output.classList.add('error');
            return;
        }
        try {
            let result;
            if (isEncode) {
                result = btoa(unescape(encodeURIComponent(input)));
            } else {
                const cleaned = input.replace(/\s/g, '');
                if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
                    throw new Error('输入不是有效的 Base64 字符串');
                }
                result = decodeURIComponent(escape(atob(cleaned)));
            }
            output.textContent = result;
            output.classList.remove('error');
            output.classList.add('success');
        } catch (e) {
            const msg = e.message.includes('atob') || e.message.includes('Base64')
                ? 'Base64 解码失败，请检查输入内容是否正确'
                : e.message;
            output.textContent = msg;
            output.classList.remove('success');
            output.classList.add('error');
        }
    }

    setupHtml() {
        this.addEventListener(this.querySelector('#htmlEncodeBtn'), 'click', () => this.htmlOp(true));
        this.addEventListener(this.querySelector('#htmlDecodeBtn'), 'click', () => this.htmlOp(false));
        this.addEventListener(this.querySelector('#htmlCopyBtn'), 'click', () => this.copyOutput());
    }

    htmlOp(isEncode) {
        const input = this.querySelector('#htmlInput').value;
        const output = this.querySelector('#encodeOutput');
        try {
            let result;
            if (isEncode) {
                result = input
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            } else {
                const ta = document.createElement('textarea');
                ta.innerHTML = input;
                result = ta.value;
            }
            output.textContent = result;
            output.classList.remove('error');
            output.classList.add('success');
        } catch (e) {
            output.textContent = '处理失败: ' + e.message;
            output.classList.remove('success');
            output.classList.add('error');
        }
    }

    setupImage() {
        this.imgFile = null;
        this.imgDataUrl = null;
        this.decodedBlob = null;

        const uploadZone = this.querySelector('#imgUploadZone');
        const fileInput = this.querySelector('#imgFileInput');

        this.addEventListener(uploadZone, 'click', () => fileInput.click());
        this.addEventListener(fileInput, 'change', (e) => {
            if (e.target.files[0]) this.handleImgFile(e.target.files[0]);
        });
        this.addEventListener(uploadZone, 'dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        this.addEventListener(uploadZone, 'dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        this.addEventListener(uploadZone, 'drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) this.handleImgFile(e.dataTransfer.files[0]);
        });

        this.addEventListener(this.querySelector('#imgEncodeBtn'), 'click', () => this.encodeImg());
        this.addEventListener(this.querySelector('#imgCopyStrBtn'), 'click', () => this.copyImgBase64());
        this.addEventListener(this.querySelector('#imgDownloadStrBtn'), 'click', () => this.downloadImgBase64());
        this.addEventListener(this.querySelector('#imgResetBtn'), 'click', () => this.resetImgEncode());

        this.addEventListener(this.querySelector('#imgEncodeModeBtn'), 'click', () => {
            this.querySelector('#imgEncodeModeBtn').classList.add('active');
            this.querySelector('#imgDecodeModeBtn').classList.remove('active');
            this.querySelector('#imgEncodePanel').style.display = '';
            this.querySelector('#imgDecodePanel').style.display = 'none';
        });
        this.addEventListener(this.querySelector('#imgDecodeModeBtn'), 'click', () => {
            this.querySelector('#imgDecodeModeBtn').classList.add('active');
            this.querySelector('#imgEncodeModeBtn').classList.remove('active');
            this.querySelector('#imgDecodePanel').style.display = '';
            this.querySelector('#imgEncodePanel').style.display = 'none';
        });

        this.addEventListener(this.querySelector('#imgDecodeBtn'), 'click', () => this.decodeImg());
        this.addEventListener(this.querySelector('#imgDecodeCopyBtn'), 'click', () => this.copyDecodedImg());
        this.addEventListener(this.querySelector('#imgDecodeDownloadBtn'), 'click', () => this.downloadDecodedImg());
        this.addEventListener(this.querySelector('#imgDecodeResetBtn'), 'click', () => this.resetImgDecode());
    }

    setupDoc() {
        this.docFile = null;
        this.docDataUrl = null;
        this.decodedDocBlob = null;

        const uploadZone = this.querySelector('#docUploadZone');
        const fileInput = this.querySelector('#docFileInput');

        this.addEventListener(uploadZone, 'click', () => fileInput.click());
        this.addEventListener(fileInput, 'change', (e) => {
            if (e.target.files[0]) this.handleDocFile(e.target.files[0]);
        });
        this.addEventListener(uploadZone, 'dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        this.addEventListener(uploadZone, 'dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        this.addEventListener(uploadZone, 'drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) this.handleDocFile(e.dataTransfer.files[0]);
        });

        this.addEventListener(this.querySelector('#docEncodeBtn'), 'click', () => this.encodeDoc());
        this.addEventListener(this.querySelector('#docCopyStrBtn'), 'click', () => this.copyDocBase64());
        this.addEventListener(this.querySelector('#docDownloadStrBtn'), 'click', () => this.downloadDocBase64());
        this.addEventListener(this.querySelector('#docResetBtn'), 'click', () => this.resetDocEncode());

        this.addEventListener(this.querySelector('#docEncodeModeBtn'), 'click', () => {
            this.querySelector('#docEncodeModeBtn').classList.add('active');
            this.querySelector('#docDecodeModeBtn').classList.remove('active');
            this.querySelector('#docEncodePanel').style.display = '';
            this.querySelector('#docDecodePanel').style.display = 'none';
        });
        this.addEventListener(this.querySelector('#docDecodeModeBtn'), 'click', () => {
            this.querySelector('#docDecodeModeBtn').classList.add('active');
            this.querySelector('#docEncodeModeBtn').classList.remove('active');
            this.querySelector('#docDecodePanel').style.display = '';
            this.querySelector('#docEncodePanel').style.display = 'none';
        });

        this.addEventListener(this.querySelector('#docDecodeBtn'), 'click', () => this.decodeDoc());
        this.addEventListener(this.querySelector('#docDecodeDownloadBtn'), 'click', () => this.downloadDecodedDoc());
        this.addEventListener(this.querySelector('#docCopyDecodedBtn'), 'click', () => this.copyDecodedDocBase64());
        this.addEventListener(this.querySelector('#docDecodeResetBtn'), 'click', () => this.resetDocDecode());
    }

    getDocIcon(ext) {
        const icons = {
            pdf: '&#128196;', xls: '&#128202;', xlsx: '&#128202;',
            doc: '&#128196;', docx: '&#128196;',
            ppt: '&#128247;', pptx: '&#128247;',
            txt: '&#128196;', csv: '&#128202;'
        };
        return icons[ext] || '&#128196;';
    }

    handleDocFile(file) {
        if (!file) {
            alert('请选择文档文件');
            return;
        }
        const allowedTypes = [
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/csv',
            'application/octet-stream'
        ];
        const allowedExts = ['.xls', '.xlsx', '.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.csv'];
        const fileName = file.name.toLowerCase();
        const hasValidExt = allowedExts.some(ext => fileName.endsWith(ext));
        if (!allowedTypes.includes(file.type) && !hasValidExt) {
            alert('不支持的文件类型，请选择 Excel/PDF/Word/PPT/TXT/CSV 文件');
            return;
        }
        this.docFile = file;
        this.docFileExt = fileName.split('.').pop();
        const reader = new FileReader();
        reader.onload = (e) => {
            this.docDataUrl = e.target.result;
            const sizeStr = this.formatSize(file.size);
            this.querySelector('#docFileIcon').innerHTML = this.getDocIcon(this.docFileExt);
            this.querySelector('#docPreviewInfo').textContent = `${file.name} — ${sizeStr} — ${file.type || this.docFileExt}`;
            this.querySelector('#docPreviewRow').style.display = 'flex';
            this.querySelector('#docUploadZone').style.display = 'none';
            this.querySelector('#docEncodeBtn').disabled = false;
            this.querySelector('#docCopyStrBtn').disabled = true;
            this.querySelector('#docDownloadStrBtn').disabled = true;
        };
        reader.readAsDataURL(file);
    }

    encodeDoc() {
        if (!this.docDataUrl) return;
        const resultGroup = this.querySelector('#docBase64ResultGroup');
        const resultArea = this.querySelector('#docBase64Result');
        resultArea.textContent = this.docDataUrl;
        resultArea.classList.remove('error');
        resultArea.classList.add('success');
        resultGroup.style.display = '';
        this.querySelector('#docCopyStrBtn').disabled = false;
        this.querySelector('#docDownloadStrBtn').disabled = false;
    }

    copyDocBase64() {
        if (!this.docDataUrl) return;
        navigator.clipboard.writeText(this.docDataUrl).then(() => {
            alert('Base64 字符串已复制到剪贴板');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = this.docDataUrl;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Base64 字符串已复制到剪贴板');
        });
    }

    downloadDocBase64() {
        if (!this.docDataUrl) return;
        const blob = new Blob([this.docDataUrl], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${this.docFile.name.replace(/\.[^.]+$/, '')}_base64.txt`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    resetDocEncode() {
        this.docFile = null;
        this.docDataUrl = null;
        this.docFileExt = null;
        this.querySelector('#docFileInput').value = '';
        this.querySelector('#docUploadZone').style.display = '';
        this.querySelector('#docPreviewRow').style.display = 'none';
        this.querySelector('#docBase64ResultGroup').style.display = 'none';
        this.querySelector('#docEncodeBtn').disabled = true;
        this.querySelector('#docCopyStrBtn').disabled = true;
        this.querySelector('#docDownloadStrBtn').disabled = true;
    }

    decodeDoc() {
        const input = this.querySelector('#docBase64Input').value.trim();
        const checkedRadio = this.querySelector('input[name="docMime"]:checked');
        const previewRow = this.querySelector('#docDecodePreviewRow');
        const info = this.querySelector('#docDecodePreviewInfo');

        if (!input) {
            alert('请输入Base64字符串');
            return;
        }

        let dataUrl = input;
        let mime = checkedRadio ? checkedRadio.value : 'application/pdf';
        let ext = '';

        if (dataUrl.startsWith('data:')) {
            const mimeMatch = dataUrl.match(/data:([^;]+);/);
            if (mimeMatch) {
                mime = mimeMatch[1];
            }
        } else {
            dataUrl = `data:${mime};base64,${dataUrl}`;
        }

        const mimeExtMap = {
            'application/pdf': 'pdf',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'text/plain': 'txt',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'text/csv': 'csv'
        };
        ext = mimeExtMap[mime] || 'bin';

        try {
            const byteStr = atob(dataUrl.split(',')[1] || '');
            const size = byteStr.length;

            this.querySelector('#docDecodeFileIcon').innerHTML = this.getDocIcon(ext);
            info.textContent = `类型: ${mime} — 大小: ${this.formatSize(size)} — 格式: .${ext}`;
            previewRow.style.display = 'flex';

            this._decodedDocDataUrl = dataUrl;
            this._decodedDocMime = mime;
            this._decodedDocExt = ext;
            this.querySelector('#docDecodeDownloadBtn').disabled = false;
            this.querySelector('#docCopyDecodedBtn').disabled = false;
        } catch (e) {
            alert('Base64 解码失败，请检查字符串是否为有效的文档数据');
            previewRow.style.display = 'none';
            this.querySelector('#docDecodeDownloadBtn').disabled = true;
            this.querySelector('#docCopyDecodedBtn').disabled = true;
        }
    }

    downloadDecodedDoc() {
        if (!this._decodedDocDataUrl) return;
        const byteStr = atob(this._decodedDocDataUrl.split(',')[1] || '');
        const ab = new ArrayBuffer(byteStr.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteStr.length; i++) {
            ia[i] = byteStr.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: this._decodedDocMime || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `decoded_document.${this._decodedDocExt || 'bin'}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    copyDecodedDocBase64() {
        if (!this._decodedDocDataUrl) return;
        const raw = this._decodedDocDataUrl.split(',')[1] || '';
        navigator.clipboard.writeText(raw).then(() => {
            alert('Base64 字符串已复制到剪贴板');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = raw;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Base64 字符串已复制到剪贴板');
        });
    }

    resetDocDecode() {
        this._decodedDocDataUrl = null;
        this._decodedDocMime = null;
        this._decodedDocExt = null;
        this.querySelector('#docBase64Input').value = '';
        this.querySelector('#docDecodePreviewRow').style.display = 'none';
        this.querySelector('#docDecodeDownloadBtn').disabled = true;
        this.querySelector('#docCopyDecodedBtn').disabled = true;
    }

    handleImgFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        this.imgFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imgDataUrl = e.target.result;
            this.querySelector('#imgPreview').src = e.target.result;
            this.querySelector('#imgPreviewInfo').textContent = `${file.name} — ${this.formatSize(file.size)} — ${file.type}`;
            this.querySelector('#imgPreviewRow').style.display = 'flex';
            this.querySelector('#imgUploadZone').style.display = 'none';
            this.querySelector('#imgEncodeBtn').disabled = false;
            this.querySelector('#imgCopyStrBtn').disabled = true;
            this.querySelector('#imgDownloadStrBtn').disabled = true;
        };
        reader.readAsDataURL(file);
    }

    encodeImg() {
        if (!this.imgDataUrl) return;
        const resultGroup = this.querySelector('#imgBase64ResultGroup');
        const resultArea = this.querySelector('#imgBase64Result');
        resultArea.textContent = this.imgDataUrl;
        resultArea.classList.remove('error');
        resultArea.classList.add('success');
        resultGroup.style.display = '';
        this.querySelector('#imgCopyStrBtn').disabled = false;
        this.querySelector('#imgDownloadStrBtn').disabled = false;
    }

    copyImgBase64() {
        if (!this.imgDataUrl) return;
        navigator.clipboard.writeText(this.imgDataUrl).then(() => {
            alert('Base64 字符串已复制到剪贴板');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = this.imgDataUrl;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Base64 字符串已复制到剪贴板');
        });
    }

    downloadImgBase64() {
        if (!this.imgDataUrl) return;
        const blob = new Blob([this.imgDataUrl], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${this.imgFile.name.replace(/\.[^.]+$/, '')}_base64.txt`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    resetImgEncode() {
        this.imgFile = null;
        this.imgDataUrl = null;
        this.querySelector('#imgFileInput').value = '';
        this.querySelector('#imgUploadZone').style.display = '';
        this.querySelector('#imgPreviewRow').style.display = 'none';
        this.querySelector('#imgBase64ResultGroup').style.display = 'none';
        this.querySelector('#imgEncodeBtn').disabled = true;
        this.querySelector('#imgCopyStrBtn').disabled = true;
        this.querySelector('#imgDownloadStrBtn').disabled = true;
    }

    decodeImg() {
        const input = this.querySelector('#imgBase64Input').value.trim();
        const previewRow = this.querySelector('#imgDecodePreviewRow');
        const previewImg = this.querySelector('#imgDecodePreview');
        const info = this.querySelector('#imgDecodePreviewInfo');

        if (!input) {
            alert('请输入Base64字符串');
            return;
        }

        let dataUrl = input;
        if (!dataUrl.startsWith('data:')) {
            dataUrl = 'data:image/png;base64,' + dataUrl;
        }

        const img = new Image();
        img.onload = () => {
            previewImg.src = dataUrl;
            this.decodedDataUrl = dataUrl;

            const byteStr = atob(dataUrl.split(',')[1] || '');
            const size = byteStr.length;
            const mimeMatch = dataUrl.match(/data:([^;]+);/);
            const mime = mimeMatch ? mimeMatch[1] : 'image/png';
            const ext = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1];

            info.textContent = `格式: ${mime} — 大小: ${this.formatSize(size)} — ${img.naturalWidth}×${img.naturalHeight}`;
            previewRow.style.display = 'flex';
            this.querySelector('#imgDecodeCopyBtn').disabled = false;
            this.querySelector('#imgDecodeDownloadBtn').disabled = false;
            this._decodedExt = ext;
        };
        img.onerror = () => {
            alert('Base64 解码失败，请检查字符串是否为有效的图片数据');
            previewRow.style.display = 'none';
            this.querySelector('#imgDecodeCopyBtn').disabled = true;
            this.querySelector('#imgDecodeDownloadBtn').disabled = true;
        };
        img.src = dataUrl;
    }

    copyDecodedImg() {
        if (!this.decodedDataUrl) return;
        const img = this.querySelector('#imgDecodePreview');
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) return;
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
                alert('图片已复制到剪贴板');
            }).catch(() => {
                alert('复制失败，请尝试使用下载功能');
            });
        }, 'image/png');
    }

    downloadDecodedImg() {
        if (!this.decodedDataUrl) return;
        const link = document.createElement('a');
        link.download = `decoded_image.${this._decodedExt || 'png'}`;
        link.href = this.decodedDataUrl;
        link.click();
    }

    resetImgDecode() {
        this.decodedDataUrl = null;
        this._decodedExt = null;
        this.querySelector('#imgBase64Input').value = '';
        this.querySelector('#imgDecodePreviewRow').style.display = 'none';
        this.querySelector('#imgDecodeCopyBtn').disabled = true;
        this.querySelector('#imgDecodeDownloadBtn').disabled = true;
    }

    copyOutput() {
        const output = this.querySelector('#encodeOutput');
        const text = output.textContent;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('已复制到剪贴板');
        });
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}