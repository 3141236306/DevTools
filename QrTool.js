import { BaseComponent } from '../components/BaseComponent.js';

const ECL = {
    L: { index: 0, formatBits: 1, label: '低' },
    M: { index: 1, formatBits: 0, label: '中' },
    Q: { index: 2, formatBits: 3, label: '较高' },
    H: { index: 3, formatBits: 2, label: '高' },
};

const ECC_CODEWORDS_PER_BLOCK = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];

const NUM_ERROR_CORRECTION_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

const textEncoder = new TextEncoder();

class BitBuffer {
    constructor() {
        this.bits = [];
    }

    append(value, length) {
        if (length < 0 || value >>> length !== 0) {
            throw new Error('编码数据超出位数限制');
        }
        for (let i = length - 1; i >= 0; i--) {
            this.bits.push((value >>> i) & 1);
        }
    }

    appendBytes(bytes) {
        bytes.forEach(byte => this.append(byte, 8));
    }

    toBytes() {
        const result = [];
        for (let i = 0; i < this.bits.length; i += 8) {
            let value = 0;
            for (let j = 0; j < 8; j++) {
                value = (value << 1) | (this.bits[i + j] || 0);
            }
            result.push(value);
        }
        return result;
    }
}

class QrEncoder {
    static encode(text, errorLevel = 'H') {
        const bytes = Array.from(textEncoder.encode(text));
        const ecl = ECL[errorLevel] || ECL.H;
        const version = this.findVersion(bytes.length, ecl.index);
        if (!version) {
            throw new Error('内容过大，二维码最多约支持 2.9KB 文本或压缩后的图片数据');
        }

        const dataCodewords = this.makeDataCodewords(bytes, version, ecl.index);
        const codewords = this.addErrorCorrection(dataCodewords, version, ecl.index);
        const matrix = this.makeMatrix(codewords, version, ecl);
        return { matrix, version, bytes: bytes.length };
    }

    static findVersion(byteLength, eclIndex) {
        for (let version = 1; version <= 40; version++) {
            const countBits = version < 10 ? 8 : 16;
            const bitLength = 4 + countBits + byteLength * 8;
            if (bitLength <= this.getNumDataCodewords(version, eclIndex) * 8) {
                return version;
            }
        }
        return null;
    }

    static makeDataCodewords(bytes, version, eclIndex) {
        const dataCapacityBits = this.getNumDataCodewords(version, eclIndex) * 8;
        const bitBuffer = new BitBuffer();
        bitBuffer.append(0x4, 4);
        bitBuffer.append(bytes.length, version < 10 ? 8 : 16);
        bitBuffer.appendBytes(bytes);

        bitBuffer.append(0, Math.min(4, dataCapacityBits - bitBuffer.bits.length));
        while (bitBuffer.bits.length % 8 !== 0) {
            bitBuffer.append(0, 1);
        }

        const result = bitBuffer.toBytes();
        for (let pad = 0xEC; result.length < dataCapacityBits / 8; pad ^= 0xEC ^ 0x11) {
            result.push(pad);
        }
        return result;
    }

    static addErrorCorrection(data, version, eclIndex) {
        const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[eclIndex][version];
        const blockEccLen = ECC_CODEWORDS_PER_BLOCK[eclIndex][version];
        const rawCodewords = Math.floor(this.getNumRawDataModules(version) / 8);
        const numShortBlocks = numBlocks - rawCodewords % numBlocks;
        const shortBlockLen = Math.floor(rawCodewords / numBlocks);
        const rsDiv = this.reedSolomonComputeDivisor(blockEccLen);
        const blocks = [];
        let offset = 0;

        for (let i = 0; i < numBlocks; i++) {
            const dataLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
            const dat = data.slice(offset, offset + dataLen);
            offset += dataLen;
            const ecc = this.reedSolomonComputeRemainder(dat, rsDiv);
            if (i < numShortBlocks) {
                dat.push(0);
            }
            blocks.push(dat.concat(ecc));
        }

        const result = [];
        for (let i = 0; i < blocks[0].length; i++) {
            blocks.forEach((block, j) => {
                if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
                    result.push(block[i]);
                }
            });
        }
        return result;
    }

    static makeMatrix(codewords, version, ecl) {
        const size = version * 4 + 17;
        const modules = Array.from({ length: size }, () => Array(size).fill(false));
        const isFunction = Array.from({ length: size }, () => Array(size).fill(false));

        const setFunctionModule = (x, y, isDark) => {
            modules[y][x] = isDark;
            isFunction[y][x] = true;
        };

        this.drawFunctionPatterns(version, modules, isFunction, setFunctionModule);
        this.drawCodewords(codewords, modules, isFunction);
        this.fillUnsetModules(modules);

        let bestMask = 0;
        let minPenalty = Infinity;
        for (let mask = 0; mask < 8; mask++) {
            this.applyMask(mask, modules, isFunction);
            this.drawFormatBits(ecl.formatBits, mask, modules, setFunctionModule);
            const penalty = this.getPenaltyScore(modules);
            if (penalty < minPenalty) {
                bestMask = mask;
                minPenalty = penalty;
            }
            this.applyMask(mask, modules, isFunction);
        }

        this.applyMask(bestMask, modules, isFunction);
        this.drawFormatBits(ecl.formatBits, bestMask, modules, setFunctionModule);
        return modules;
    }

    static drawFunctionPatterns(version, modules, isFunction, setFunctionModule) {
        const size = modules.length;
        this.drawFinderPattern(3, 3, modules, setFunctionModule);
        this.drawFinderPattern(size - 4, 3, modules, setFunctionModule);
        this.drawFinderPattern(3, size - 4, modules, setFunctionModule);

        const alignPositions = this.getAlignmentPatternPositions(version);
        alignPositions.forEach((x, i) => {
            alignPositions.forEach((y, j) => {
                if (!((i === 0 && j === 0) || (i === 0 && j === alignPositions.length - 1) || (i === alignPositions.length - 1 && j === 0))) {
                    this.drawAlignmentPattern(x, y, setFunctionModule);
                }
            });
        });

        for (let i = 0; i < size; i++) {
            if (!isFunction[6][i]) {
                setFunctionModule(i, 6, i % 2 === 0);
            }
            if (!isFunction[i][6]) {
                setFunctionModule(6, i, i % 2 === 0);
            }
        }

        this.drawFormatBits(0, 0, modules, setFunctionModule);
        this.drawVersion(version, modules, setFunctionModule);
    }

    static drawFinderPattern(cx, cy, modules, setFunctionModule) {
        const size = modules.length;
        for (let dy = -4; dy <= 4; dy++) {
            for (let dx = -4; dx <= 4; dx++) {
                const x = cx + dx;
                const y = cy + dy;
                if (x < 0 || y < 0 || x >= size || y >= size) continue;
                const dist = Math.max(Math.abs(dx), Math.abs(dy));
                setFunctionModule(x, y, dist !== 2 && dist !== 4);
            }
        }
    }

    static drawAlignmentPattern(cx, cy, setFunctionModule) {
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                setFunctionModule(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
            }
        }
    }

    static drawFormatBits(errorFormatBits, mask, modules, setFunctionModule) {
        const size = modules.length;
        const data = (errorFormatBits << 3) | mask;
        let rem = data;
        for (let i = 0; i < 10; i++) {
            rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
        }
        const bits = ((data << 10) | rem) ^ 0x5412;

        for (let i = 0; i <= 5; i++) {
            setFunctionModule(8, i, this.getBit(bits, i));
        }
        setFunctionModule(8, 7, this.getBit(bits, 6));
        setFunctionModule(8, 8, this.getBit(bits, 7));
        setFunctionModule(7, 8, this.getBit(bits, 8));
        for (let i = 9; i < 15; i++) {
            setFunctionModule(14 - i, 8, this.getBit(bits, i));
        }
        for (let i = 0; i < 8; i++) {
            setFunctionModule(size - 1 - i, 8, this.getBit(bits, i));
        }
        for (let i = 8; i < 15; i++) {
            setFunctionModule(8, size - 15 + i, this.getBit(bits, i));
        }
        setFunctionModule(8, size - 8, true);
    }

    static drawVersion(version, modules, setFunctionModule) {
        if (version < 7) return;

        const size = modules.length;
        let rem = version;
        for (let i = 0; i < 12; i++) {
            rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
        }
        const bits = (version << 12) | rem;

        for (let i = 0; i < 18; i++) {
            const bit = this.getBit(bits, i);
            const a = size - 11 + i % 3;
            const b = Math.floor(i / 3);
            setFunctionModule(a, b, bit);
            setFunctionModule(b, a, bit);
        }
    }

    static drawCodewords(data, modules, isFunction) {
        const size = modules.length;
        let bitIndex = 0;

        for (let right = size - 1; right >= 1; right -= 2) {
            if (right === 6) {
                right = 5;
            }
            for (let vert = 0; vert < size; vert++) {
                for (let j = 0; j < 2; j++) {
                    const x = right - j;
                    const upward = ((right + 1) & 2) === 0;
                    const y = upward ? size - 1 - vert : vert;
                    if (!isFunction[y][x] && bitIndex < data.length * 8) {
                        modules[y][x] = this.getBit(data[Math.floor(bitIndex / 8)], 7 - bitIndex % 8);
                        bitIndex++;
                    }
                }
            }
        }
    }

    static fillUnsetModules(modules) {
        modules.forEach(row => {
            row.forEach((value, index) => {
                if (value === null || typeof value === 'undefined') {
                    row[index] = false;
                }
            });
        });
    }

    static applyMask(mask, modules, isFunction) {
        const size = modules.length;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (!isFunction[y][x] && this.getMaskBit(mask, x, y)) {
                    modules[y][x] = !modules[y][x];
                }
            }
        }
    }

    static getMaskBit(mask, x, y) {
        switch (mask) {
            case 0: return (x + y) % 2 === 0;
            case 1: return y % 2 === 0;
            case 2: return x % 3 === 0;
            case 3: return (x + y) % 3 === 0;
            case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
            case 5: return ((x * y) % 2 + (x * y) % 3) === 0;
            case 6: return (((x * y) % 2 + (x * y) % 3) % 2) === 0;
            case 7: return (((x + y) % 2 + (x * y) % 3) % 2) === 0;
            default: throw new Error('无效的掩模');
        }
    }

    static getPenaltyScore(modules) {
        const size = modules.length;
        let penalty = 0;

        for (let y = 0; y < size; y++) {
            let runColor = modules[y][0];
            let runLength = 1;
            for (let x = 1; x < size; x++) {
                if (modules[y][x] === runColor) {
                    runLength++;
                    if (runLength === 5) penalty += 3;
                    else if (runLength > 5) penalty++;
                } else {
                    runColor = modules[y][x];
                    runLength = 1;
                }
            }
        }

        for (let x = 0; x < size; x++) {
            let runColor = modules[0][x];
            let runLength = 1;
            for (let y = 1; y < size; y++) {
                if (modules[y][x] === runColor) {
                    runLength++;
                    if (runLength === 5) penalty += 3;
                    else if (runLength > 5) penalty++;
                } else {
                    runColor = modules[y][x];
                    runLength = 1;
                }
            }
        }

        for (let y = 0; y < size - 1; y++) {
            for (let x = 0; x < size - 1; x++) {
                const color = modules[y][x];
                if (color === modules[y][x + 1] && color === modules[y + 1][x] && color === modules[y + 1][x + 1]) {
                    penalty += 3;
                }
            }
        }

        const patternA = '10111010000';
        const patternB = '00001011101';
        for (let y = 0; y < size; y++) {
            let row = '';
            for (let x = 0; x < size; x++) {
                row += modules[y][x] ? '1' : '0';
            }
            for (let x = 0; x <= size - 11; x++) {
                const slice = row.slice(x, x + 11);
                if (slice === patternA || slice === patternB) penalty += 40;
            }
        }
        for (let x = 0; x < size; x++) {
            let col = '';
            for (let y = 0; y < size; y++) {
                col += modules[y][x] ? '1' : '0';
            }
            for (let y = 0; y <= size - 11; y++) {
                const slice = col.slice(y, y + 11);
                if (slice === patternA || slice === patternB) penalty += 40;
            }
        }

        let dark = 0;
        modules.forEach(row => row.forEach(cell => { if (cell) dark++; }));
        const total = size * size;
        penalty += Math.floor(Math.abs(dark * 20 - total * 10) / total) * 10;

        return penalty;
    }

    static getAlignmentPatternPositions(version) {
        if (version === 1) return [];

        const size = version * 4 + 17;
        const numAlign = Math.floor(version / 7) + 2;
        const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2;
        const result = [6];
        for (let pos = size - 7; result.length < numAlign; pos -= step) {
            result.splice(1, 0, pos);
        }
        return result;
    }

    static getNumRawDataModules(version) {
        let result = (16 * version + 128) * version + 64;
        if (version >= 2) {
            const numAlign = Math.floor(version / 7) + 2;
            result -= (25 * numAlign - 10) * numAlign - 55;
            if (version >= 7) {
                result -= 36;
            }
        }
        return result;
    }

    static getNumDataCodewords(version, eclIndex) {
        return Math.floor(this.getNumRawDataModules(version) / 8)
            - ECC_CODEWORDS_PER_BLOCK[eclIndex][version] * NUM_ERROR_CORRECTION_BLOCKS[eclIndex][version];
    }

    static reedSolomonComputeDivisor(degree) {
        const result = Array(degree).fill(0);
        result[degree - 1] = 1;
        let root = 1;
        for (let i = 0; i < degree; i++) {
            for (let j = 0; j < result.length; j++) {
                result[j] = this.galoisMultiply(result[j], root);
                if (j + 1 < result.length) {
                    result[j] ^= result[j + 1];
                }
            }
            root = this.galoisMultiply(root, 0x02);
        }
        return result;
    }

    static reedSolomonComputeRemainder(data, divisor) {
        const result = Array(divisor.length).fill(0);
        data.forEach(byte => {
            const factor = byte ^ result.shift();
            result.push(0);
            divisor.forEach((coef, i) => {
                result[i] ^= this.galoisMultiply(coef, factor);
            });
        });
        return result;
    }

    static galoisMultiply(x, y) {
        let z = 0;
        for (let i = 7; i >= 0; i--) {
            z = (z << 1) ^ ((z >>> 7) * 0x11D);
            z ^= ((y >>> i) & 1) * x;
        }
        return z & 0xFF;
    }

    static getBit(value, index) {
        return ((value >>> index) & 1) !== 0;
    }
}

export class QrTool extends BaseComponent {
    constructor() {
        super();
        this.currentMode = 'text';
        this.imageDataUrl = '';
        this.logoDataUrl = '';
        this.latestPayload = '';
    }

    render() {
        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>二维码生成工具</h2>
                    <p>文本、链接、小图片生成二维码，可叠加中心图片</p>

                    <div class="tabs">
                        <button class="tab-btn active" data-mode="text">文本</button>
                        <button class="tab-btn" data-mode="link">链接</button>
                        <button class="tab-btn" data-mode="image">图片</button>
                    </div>

                    <div class="qr-mode-panel active" id="textModePanel">
                        <div class="form-group">
                            <label for="qrTextInput">文本内容</label>
                            <textarea id="qrTextInput" placeholder="输入要生成二维码的文本"></textarea>
                        </div>
                    </div>

                    <div class="qr-mode-panel" id="linkModePanel">
                        <div class="form-group">
                            <label for="qrLinkInput">链接地址</label>
                            <input type="text" id="qrLinkInput" placeholder="https://example.com">
                        </div>
                    </div>

                    <div class="qr-mode-panel" id="imageModePanel">
                        <div class="upload-zone" id="qrImageUploadZone">
                            <div class="upload-icon">&#128247;</div>
                            <p class="upload-text">选择要写入二维码的小图片</p>
                            <p class="upload-hint">会压缩为 Data URL，建议使用小图标或缩略图</p>
                            <input type="file" id="qrImageInput" accept="image/*" hidden>
                        </div>
                        <div class="img-preview-row" id="qrImagePreviewRow" style="display:none;">
                            <div class="img-preview-box">
                                <img id="qrImagePreview" alt="图片预览">
                            </div>
                            <div class="img-preview-info" id="qrImageInfo"></div>
                        </div>
                        <div class="setting-row">
                            <label>图片压缩尺寸 <span id="qrImageSizeValue">48</span>px</label>
                            <input type="range" id="qrImageSize" min="24" max="96" value="48" step="4" class="range-slider">
                        </div>
                        <div class="setting-row">
                            <label>图片压缩质量 <span id="qrImageQualityValue">65</span>%</label>
                            <input type="range" id="qrImageQuality" min="30" max="90" value="65" step="5" class="range-slider">
                        </div>
                    </div>

                    <div class="qr-output-layout">
                        <div class="qr-settings">
                            <div class="form-group">
                                <label for="qrErrorLevel">纠错等级</label>
                                <select id="qrErrorLevel">
                                    <option value="H" selected>高 H</option>
                                    <option value="Q">较高 Q</option>
                                    <option value="M">中 M</option>
                                    <option value="L">低 L</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="qrSize">导出尺寸</label>
                                <select id="qrSize">
                                    <option value="256">256px</option>
                                    <option value="384" selected>384px</option>
                                    <option value="512">512px</option>
                                    <option value="768">768px</option>
                                </select>
                            </div>
                            <div class="color-formats">
                                <div class="form-group">
                                    <label for="qrDarkColor">二维码颜色</label>
                                    <input type="color" id="qrDarkColor" value="#111827" class="qr-color-input">
                                </div>
                                <div class="form-group">
                                    <label for="qrLightColor">背景颜色</label>
                                    <input type="color" id="qrLightColor" value="#ffffff" class="qr-color-input">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>中心图片</label>
                                <div class="qr-logo-row">
                                    <button id="qrLogoBtn" class="btn btn-secondary" type="button">选择图片</button>
                                    <button id="qrLogoClearBtn" class="btn btn-ghost" type="button" disabled>移除</button>
                                    <input type="file" id="qrLogoInput" accept="image/*" hidden>
                                </div>
                                <div class="qr-logo-preview" id="qrLogoPreview" style="display:none;"></div>
                            </div>
                            <div class="setting-row">
                                <label>中心图片大小 <span id="qrLogoSizeValue">18</span>%</label>
                                <input type="range" id="qrLogoSize" min="10" max="28" value="18" class="range-slider">
                            </div>
                            <div class="button-group">
                                <button id="qrGenerateBtn" class="btn">生成二维码</button>
                                <button id="qrDownloadBtn" class="btn btn-accent" disabled>下载 PNG</button>
                                <button id="qrCopyBtn" class="btn btn-secondary" disabled>复制图片</button>
                                <button id="qrClearBtn" class="btn btn-ghost">清空</button>
                            </div>
                        </div>

                        <div class="qr-preview-card">
                            <canvas id="qrCanvas" class="qr-canvas" width="384" height="384" aria-label="二维码预览"></canvas>
                            <div id="qrMeta" class="qr-meta">等待生成</div>
                        </div>
                    </div>

                    <div id="qrResult" class="result-area"></div>
                </div>

                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>二维码容量</h3>
                        <ul>
                            <li>链接和普通文本可直接生成</li>
                            <li>图片模式适合小图标、头像和缩略图</li>
                            <li>中心图片越大，建议纠错等级越高</li>
                        </ul>
                    </div>
                    <div class="tool-section">
                        <h3>输出</h3>
                        <ul>
                            <li>本地 Canvas 生成，不上传内容</li>
                            <li>支持 PNG 下载和复制到剪贴板</li>
                            <li>深浅颜色均可自定义</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        this.canvas = this.querySelector('#qrCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.result = this.querySelector('#qrResult');
        this.meta = this.querySelector('#qrMeta');

        this.setupModeTabs();
        this.setupImageInput();
        this.setupLogoInput();
        this.setupControls();
        this.drawEmptyCanvas();
    }

    setupModeTabs() {
        const modeBtns = this.querySelectorAll('.tabs .tab-btn');
        modeBtns.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                this.querySelectorAll('.qr-mode-panel').forEach(panel => panel.classList.remove('active'));
                btn.classList.add('active');
                this.currentMode = btn.getAttribute('data-mode');
                this.querySelector(`#${this.currentMode}ModePanel`).classList.add('active');
            });
        });
    }

    setupImageInput() {
        const uploadZone = this.querySelector('#qrImageUploadZone');
        const imageInput = this.querySelector('#qrImageInput');
        const imageSize = this.querySelector('#qrImageSize');
        const imageQuality = this.querySelector('#qrImageQuality');

        this.addEventListener(uploadZone, 'click', () => imageInput.click());
        this.addEventListener(imageInput, 'change', (e) => {
            if (e.target.files[0]) {
                this.handleQrImage(e.target.files[0]);
            }
        });
        this.addEventListener(uploadZone, 'dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        this.addEventListener(uploadZone, 'dragleave', () => uploadZone.classList.remove('dragover'));
        this.addEventListener(uploadZone, 'drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                this.handleQrImage(e.dataTransfer.files[0]);
            }
        });

        this.addEventListener(imageSize, 'input', () => {
            this.querySelector('#qrImageSizeValue').textContent = imageSize.value;
            if (this.imageFile) this.handleQrImage(this.imageFile);
        });
        this.addEventListener(imageQuality, 'input', () => {
            this.querySelector('#qrImageQualityValue').textContent = imageQuality.value;
            if (this.imageFile) this.handleQrImage(this.imageFile);
        });
    }

    setupLogoInput() {
        const logoBtn = this.querySelector('#qrLogoBtn');
        const logoClearBtn = this.querySelector('#qrLogoClearBtn');
        const logoInput = this.querySelector('#qrLogoInput');
        const logoSize = this.querySelector('#qrLogoSize');

        this.addEventListener(logoBtn, 'click', () => logoInput.click());
        this.addEventListener(logoInput, 'change', (e) => {
            if (e.target.files[0]) {
                this.handleLogoImage(e.target.files[0]);
            }
        });
        this.addEventListener(logoClearBtn, 'click', () => {
            this.logoDataUrl = '';
            logoInput.value = '';
            logoClearBtn.disabled = true;
            this.querySelector('#qrLogoPreview').style.display = 'none';
            if (this.latestPayload) this.generate();
        });
        this.addEventListener(logoSize, 'input', () => {
            this.querySelector('#qrLogoSizeValue').textContent = logoSize.value;
            if (this.latestPayload) this.generate();
        });
    }

    setupControls() {
        this.addEventListener(this.querySelector('#qrGenerateBtn'), 'click', () => this.generate());
        this.addEventListener(this.querySelector('#qrDownloadBtn'), 'click', () => this.downloadPng());
        this.addEventListener(this.querySelector('#qrCopyBtn'), 'click', () => this.copyPng());
        this.addEventListener(this.querySelector('#qrClearBtn'), 'click', () => this.clearAll());

        ['#qrErrorLevel', '#qrSize', '#qrDarkColor', '#qrLightColor'].forEach(selector => {
            this.addEventListener(this.querySelector(selector), 'change', () => {
                if (this.latestPayload) this.generate();
            });
        });
    }

    async handleQrImage(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('请选择图片文件');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            this.showError('图片不能超过 10MB');
            return;
        }

        this.imageFile = file;
        const maxSize = parseInt(this.querySelector('#qrImageSize').value, 10);
        const quality = parseInt(this.querySelector('#qrImageQuality').value, 10) / 100;
        this.imageDataUrl = await this.compressImageToDataUrl(file, maxSize, quality);

        this.querySelector('#qrImagePreview').src = this.imageDataUrl;
        this.querySelector('#qrImageInfo').textContent = `${file.name} · ${this.formatSize(this.imageDataUrl.length)} Data URL`;
        this.querySelector('#qrImagePreviewRow').style.display = 'flex';
        this.querySelector('#qrImageUploadZone').style.display = 'none';
    }

    async handleLogoImage(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('请选择中心图片文件');
            return;
        }

        this.logoDataUrl = await this.compressImageToDataUrl(file, 256, 0.9);
        const preview = this.querySelector('#qrLogoPreview');
        preview.style.backgroundImage = `url("${this.logoDataUrl}")`;
        preview.style.display = '';
        this.querySelector('#qrLogoClearBtn').disabled = false;
        if (this.latestPayload) this.generate();
    }

    compressImageToDataUrl(file, maxSize, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('读取图片失败'));
            reader.onload = () => {
                const img = new Image();
                img.onerror = () => reject(new Error('图片加载失败'));
                img.onload = () => {
                    const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
                    const width = Math.max(1, Math.round(img.naturalWidth * scale));
                    const height = Math.max(1, Math.round(img.naturalHeight * scale));
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async generate() {
        try {
            const payload = this.getPayload();
            if (!payload) {
                this.showError('请输入内容或选择图片');
                return;
            }

            const level = this.querySelector('#qrErrorLevel').value;
            const qr = QrEncoder.encode(payload, level);
            this.latestPayload = payload;
            await this.drawQr(qr);

            const eclLabel = ECL[level].label;
            this.meta.textContent = `版本 ${qr.version} · ${qr.matrix.length}×${qr.matrix.length} · ${qr.bytes} bytes · 纠错${eclLabel}`;
            this.showSuccess('二维码已生成');
            this.querySelector('#qrDownloadBtn').disabled = false;
            this.querySelector('#qrCopyBtn').disabled = false;
        } catch (error) {
            this.showError(error.message);
            this.querySelector('#qrDownloadBtn').disabled = true;
            this.querySelector('#qrCopyBtn').disabled = true;
        }
    }

    getPayload() {
        if (this.currentMode === 'text') {
            return this.querySelector('#qrTextInput').value.trim();
        }

        if (this.currentMode === 'link') {
            const input = this.querySelector('#qrLinkInput').value.trim();
            if (!input) return '';
            if (/^[a-z][a-z0-9+.-]*:/i.test(input)) {
                return input;
            }
            return `https://${input}`;
        }

        return this.imageDataUrl || '';
    }

    async drawQr(qr) {
        const outputSize = parseInt(this.querySelector('#qrSize').value, 10);
        const quietZone = 4;
        const moduleCount = qr.matrix.length;
        const scale = Math.max(1, Math.floor(outputSize / (moduleCount + quietZone * 2)));
        const canvasSize = (moduleCount + quietZone * 2) * scale;

        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        this.canvas.style.width = `${Math.min(canvasSize, 384)}px`;
        this.canvas.style.height = `${Math.min(canvasSize, 384)}px`;

        const darkColor = this.querySelector('#qrDarkColor').value;
        const lightColor = this.querySelector('#qrLightColor').value;
        this.ctx.fillStyle = lightColor;
        this.ctx.fillRect(0, 0, canvasSize, canvasSize);
        this.ctx.fillStyle = darkColor;

        qr.matrix.forEach((row, y) => {
            row.forEach((isDark, x) => {
                if (isDark) {
                    this.ctx.fillRect((x + quietZone) * scale, (y + quietZone) * scale, scale, scale);
                }
            });
        });

        if (this.logoDataUrl) {
            await this.drawLogo(canvasSize);
        }
    }

    drawLogo(canvasSize) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const logoRatio = parseInt(this.querySelector('#qrLogoSize').value, 10) / 100;
                const logoSize = Math.round(canvasSize * logoRatio);
                const padding = Math.max(6, Math.round(logoSize * 0.16));
                const boxSize = logoSize + padding * 2;
                const x = Math.round((canvasSize - boxSize) / 2);
                const y = x;

                this.ctx.fillStyle = this.querySelector('#qrLightColor').value;
                this.roundRect(this.ctx, x, y, boxSize, boxSize, Math.max(8, Math.round(boxSize * 0.12)));
                this.ctx.fill();
                this.ctx.drawImage(img, x + padding, y + padding, logoSize, logoSize);
                resolve();
            };
            img.onerror = () => resolve();
            img.src = this.logoDataUrl;
        });
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    }

    drawEmptyCanvas() {
        const size = 384;
        this.canvas.width = size;
        this.canvas.height = size;
        this.ctx.fillStyle = this.querySelector('#qrLightColor').value;
        this.ctx.fillRect(0, 0, size, size);
        this.ctx.strokeStyle = '#cbd5e1';
        this.ctx.setLineDash([8, 8]);
        this.ctx.strokeRect(24, 24, size - 48, size - 48);
        this.ctx.setLineDash([]);
    }

    downloadPng() {
        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    copyPng() {
        if (!navigator.clipboard || !window.ClipboardItem) {
            this.showError('当前浏览器不支持复制图片，请使用下载');
            return;
        }

        this.canvas.toBlob(blob => {
            if (!blob) {
                this.showError('复制失败');
                return;
            }
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item])
                .then(() => this.showSuccess('二维码图片已复制'))
                .catch(() => this.showError('复制失败，请使用下载'));
        }, 'image/png');
    }

    clearAll() {
        this.querySelector('#qrTextInput').value = '';
        this.querySelector('#qrLinkInput').value = '';
        this.querySelector('#qrImageInput').value = '';
        this.querySelector('#qrLogoInput').value = '';
        this.imageFile = null;
        this.imageDataUrl = '';
        this.logoDataUrl = '';
        this.latestPayload = '';
        this.querySelector('#qrImageUploadZone').style.display = '';
        this.querySelector('#qrImagePreviewRow').style.display = 'none';
        this.querySelector('#qrLogoPreview').style.display = 'none';
        this.querySelector('#qrLogoClearBtn').disabled = true;
        this.querySelector('#qrDownloadBtn').disabled = true;
        this.querySelector('#qrCopyBtn').disabled = true;
        this.meta.textContent = '等待生成';
        this.result.textContent = '';
        this.result.classList.remove('success', 'error');
        this.drawEmptyCanvas();
    }

    showError(message) {
        this.result.textContent = message;
        this.result.classList.remove('success');
        this.result.classList.add('error');
    }

    showSuccess(message) {
        this.result.textContent = message;
        this.result.classList.remove('error');
        this.result.classList.add('success');
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}
