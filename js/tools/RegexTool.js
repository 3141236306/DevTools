import { BaseComponent } from '../components/BaseComponent.js';

export class RegexTool extends BaseComponent {
    constructor() {
        super();
        this.regexInput = null;
        this.testString = null;
        this.testBtn = null;
        this.resultArea = null;
        this.flagsCheckboxes = {};
    }
    
    render() {
        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>正则表达式测试工具</h2>
                    <p>测试和调试正则表达式</p>
                    
                    <div class="form-group">
                        <label for="regexInput">正则表达式：</label>
                        <div class="regex-input-group">
                            <span class="regex-delimiter">/</span>
                            <input type="text" id="regexInput" placeholder="输入正则表达式..." class="regex-field">
                            <span class="regex-delimiter">/</span>
                            <input type="text" id="regexFlags" value="g" class="regex-flags" placeholder="标志">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>标志选项：</label>
                        <div class="flags-group">
                            <label><input type="checkbox" id="flagG" checked> g (全局匹配)</label>
                            <label><input type="checkbox" id="flagI"> i (忽略大小写)</label>
                            <label><input type="checkbox" id="flagM"> m (多行模式)</label>
                            <label><input type="checkbox" id="flagS"> s (点号匹配换行)</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="testString">测试字符串：</label>
                        <textarea id="testString" placeholder="输入要测试的字符串..."></textarea>
                    </div>
                    
                    <div class="button-group">
                        <button id="testBtn" class="btn">测试匹配</button>
                        <button id="clearBtn" class="btn btn-secondary">清空</button>
                    </div>
                    
                    <div class="form-group">
                        <label>匹配结果：</label>
                        <div id="resultArea" class="result-area"></div>
                    </div>
                    
                    <div class="form-group">
                        <label>匹配详情：</label>
                        <div id="matchDetails" class="result-area"></div>
                    </div>
                </div>
                
                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>常用正则表达式</h3>
                        <div class="regex-examples">
                            <div class="regex-example" data-regex="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$">
                                <span class="example-name">邮箱验证</span>
                                <code>^[\\w.-]+@[\\w.-]+\\.\\w+$</code>
                            </div>
                            <div class="regex-example" data-regex="^1[3-9]\\d{9}$">
                                <span class="example-name">手机号验证</span>
                                <code>^1[3-9]\\d{9}$</code>
                            </div>
                            <div class="regex-example" data-regex="^https?:\\/\\/.+">
                                <span class="example-name">URL验证</span>
                                <code>^https?://.+</code>
                            </div>
                            <div class="regex-example" data-regex="^\\d{4}-\\d{2}-\\d{2}$">
                                <span class="example-name">日期格式</span>
                                <code>^\\d{4}-\\d{2}-\\d{2}$</code>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-section">
                        <h3>正则表达式说明</h3>
                        <ul>
                            <li><code>.</code> - 匹配任意字符</li>
                            <li><code>\\d</code> - 匹配数字</li>
                            <li><code>\\w</code> - 匹配字母数字</li>
                            <li><code>\\s</code> - 匹配空白字符</li>
                            <li><code>*</code> - 0次或多次</li>
                            <li><code>+</code> - 1次或多次</li>
                            <li><code>?</code> - 0次或1次</li>
                            <li><code>{n}</code> - 恰好n次</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    afterMount() {
        this.regexInput = this.querySelector('#regexInput');
        this.regexFlags = this.querySelector('#regexFlags');
        this.testString = this.querySelector('#testString');
        this.testBtn = this.querySelector('#testBtn');
        this.clearBtn = this.querySelector('#clearBtn');
        this.resultArea = this.querySelector('#resultArea');
        this.matchDetails = this.querySelector('#matchDetails');
        
        this.flagsCheckboxes = {
            g: this.querySelector('#flagG'),
            i: this.querySelector('#flagI'),
            m: this.querySelector('#flagM'),
            s: this.querySelector('#flagS')
        };
        
        this.addEventListener(this.testBtn, 'click', () => this.testRegex());
        this.addEventListener(this.clearBtn, 'click', () => this.clearAll());
        
        // 标志复选框事件
        Object.values(this.flagsCheckboxes).forEach(checkbox => {
            this.addEventListener(checkbox, 'change', () => this.updateFlags());
        });
        
        // 示例点击事件
        const examples = this.querySelectorAll('.regex-example');
        examples.forEach(example => {
            this.addEventListener(example, 'click', () => {
                const regex = example.getAttribute('data-regex');
                this.regexInput.value = regex;
                this.testRegex();
            });
        });
    }
    
    updateFlags() {
        let flags = '';
        Object.entries(this.flagsCheckboxes).forEach(([flag, checkbox]) => {
            if (checkbox.checked) {
                flags += flag;
            }
        });
        this.regexFlags.value = flags;
    }
    
    testRegex() {
        try {
            const pattern = this.regexInput.value.trim();
            const flags = this.regexFlags.value.trim();
            const testStr = this.testString.value;
            
            if (!pattern) {
                this.showError('请输入正则表达式');
                return;
            }
            
            const regex = new RegExp(pattern, flags);
            const matches = [];
            let match;
            
            // 根据标志收集所有匹配
            if (flags.includes('g')) {
                while ((match = regex.exec(testStr)) !== null) {
                    matches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                    
                    // 防止无限循环
                    if (!regex.global) break;
                }
            } else {
                match = regex.exec(testStr);
                if (match) {
                    matches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                }
            }
            
            this.displayResults(matches, testStr);
            
        } catch (error) {
            this.showError(`正则表达式错误: ${error.message}`);
        }
    }
    
    displayResults(matches, testStr) {
        if (matches.length === 0) {
            this.resultArea.innerHTML = '<div class="no-match">没有找到匹配项</div>';
            this.matchDetails.innerHTML = '';
            return;
        }
        
        // 显示高亮匹配
        let highlighted = testStr;
        let offset = 0;
        
        matches.forEach(match => {
            const start = match.index + offset;
            const end = start + match.value.length;
            const before = highlighted.substring(0, start);
            const after = highlighted.substring(end);
            highlighted = before + `<span class="highlight">${match.value}</span>` + after;
            offset += '<span class="highlight">'.length + '</span>'.length;
        });
        
        this.resultArea.innerHTML = highlighted;
        
        // 显示匹配详情
        let detailsHtml = `<div class="match-count">找到 ${matches.length} 个匹配</div>`;
        matches.forEach((match, index) => {
            detailsHtml += `
                <div class="match-item">
                    <strong>匹配 ${index + 1}:</strong> "${match.value}" (位置: ${match.index})
                    ${match.groups.length > 0 ? `<br>分组: ${match.groups.join(', ')}` : ''}
                </div>
            `;
        });
        
        this.matchDetails.innerHTML = detailsHtml;
    }
    
    clearAll() {
        this.regexInput.value = '';
        this.regexFlags.value = 'g';
        this.testString.value = '';
        this.resultArea.innerHTML = '';
        this.matchDetails.innerHTML = '';
        
        // 重置标志复选框
        this.flagsCheckboxes.g.checked = true;
        this.flagsCheckboxes.i.checked = false;
        this.flagsCheckboxes.m.checked = false;
        this.flagsCheckboxes.s.checked = false;
    }
    
    showError(message) {
        this.resultArea.innerHTML = `<div class="error-message">${message}</div>`;
        this.matchDetails.innerHTML = '';
    }
}