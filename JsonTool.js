import { BaseComponent } from '../components/BaseComponent.js';

export class JsonTool extends BaseComponent {
    constructor() {
        super();
        this.inputJson = null;
        this.outputJson = null;
        this.formatBtn = null;
        this.compressBtn = null;
        this.copyBtn = null;
    }
    
    render() {
        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>JSON格式化工具</h2>
                    <p>格式化、压缩、验证JSON数据</p>
                    
                    <div class="form-group">
                        <label for="jsonInput">输入JSON：</label>
                        <textarea id="jsonInput" placeholder="请输入JSON数据..."></textarea>
                    </div>
                    
                    <div class="button-group">
                        <button id="formatBtn" class="btn">格式化</button>
                        <button id="compressBtn" class="btn btn-secondary">压缩</button>
                        <button id="copyBtn" class="btn btn-accent">复制结果</button>
                        <button id="clearBtn" class="btn">清空</button>
                    </div>
                    
                    <div class="form-group">
                        <label for="jsonOutput">格式化结果：</label>
                        <div id="jsonOutput" class="result-area" contenteditable="true"></div>
                    </div>
                </div>
                
                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>JSON工具选项</h3>
                        <div class="form-group">
                            <label for="indentSize">缩进大小：</label>
                            <select id="indentSize">
                                <option value="2" selected>2空格</option>
                                <option value="4">4空格</option>
                                <option value="tab">Tab</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="sortKeys" checked> 键排序
                            </label>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>使用说明</h3>
                        <ul>
                            <li>粘贴或输入JSON数据</li>
                            <li>点击"格式化"美化JSON</li>
                            <li>点击"压缩"生成紧凑JSON</li>
                            <li>支持直接编辑输出结果</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    afterMount() {
        this.inputJson = this.querySelector('#jsonInput');
        this.outputJson = this.querySelector('#jsonOutput');
        this.formatBtn = this.querySelector('#formatBtn');
        this.compressBtn = this.querySelector('#compressBtn');
        this.copyBtn = this.querySelector('#copyBtn');
        this.clearBtn = this.querySelector('#clearBtn');
        this.indentSize = this.querySelector('#indentSize');
        this.sortKeys = this.querySelector('#sortKeys');
        
        this.addEventListener(this.formatBtn, 'click', () => this.formatJson());
        this.addEventListener(this.compressBtn, 'click', () => this.compressJson());
        this.addEventListener(this.copyBtn, 'click', () => this.copyResult());
        this.addEventListener(this.clearBtn, 'click', () => this.clearAll());
    }
    
    formatJson() {
        try {
            const input = this.inputJson.value.trim();
            if (!input) {
                this.showError('请输入JSON数据');
                return;
            }
            
            const parsed = JSON.parse(input);
            const indent = this.indentSize.value === 'tab' ? '\t' : parseInt(this.indentSize.value);
            const sorted = this.sortKeys.checked ? this.sortObjectKeys(parsed) : parsed;
            const formatted = JSON.stringify(sorted, null, indent);
            
            this.outputJson.textContent = formatted;
            this.outputJson.classList.remove('error');
            this.outputJson.classList.add('success');
        } catch (error) {
            this.showError(`JSON格式错误: ${error.message}`);
        }
    }
    
    compressJson() {
        try {
            const input = this.inputJson.value.trim();
            if (!input) {
                this.showError('请输入JSON数据');
                return;
            }
            
            const parsed = JSON.parse(input);
            const compressed = JSON.stringify(parsed);
            
            this.outputJson.textContent = compressed;
            this.outputJson.classList.remove('error');
            this.outputJson.classList.add('success');
        } catch (error) {
            this.showError(`JSON格式错误: ${error.message}`);
        }
    }
    
    sortObjectKeys(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.sortObjectKeys(item));
        }
        
        const sorted = {};
        const keys = Object.keys(obj).sort();
        keys.forEach(key => {
            sorted[key] = this.sortObjectKeys(obj[key]);
        });
        return sorted;
    }
    
    copyResult() {
        const text = this.outputJson.textContent;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccess('已复制到剪贴板');
            }).catch(() => {
                // 回退方案
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showSuccess('已复制到剪贴板');
            });
        }
    }
    
    clearAll() {
        this.inputJson.value = '';
        this.outputJson.textContent = '';
        this.outputJson.classList.remove('error', 'success');
    }
    
    showError(message) {
        this.outputJson.textContent = message;
        this.outputJson.classList.remove('success');
        this.outputJson.classList.add('error');
    }
    
    showSuccess(message) {
        const originalText = this.outputJson.textContent;
        this.outputJson.textContent = message;
        this.outputJson.classList.remove('error');
        this.outputJson.classList.add('success');
        
        setTimeout(() => {
            this.outputJson.textContent = originalText;
        }, 2000);
    }
}