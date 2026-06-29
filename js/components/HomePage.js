import { BaseComponent } from './BaseComponent.js';

const TOOLS = [
    { name: 'JSON 工具', desc: '格式化、压缩、排序、验证 JSON 数据', icon: '{ }', hash: 'json', tags: 'json 格式化 压缩 验证' },
    { name: '正则表达式', desc: '实时测试正则匹配，内置常用表达式', icon: '.*', hash: 'regex', tags: '正则 regex 匹配 测试' },
    { name: '编码工具', desc: 'URL / Base64 / HTML 实体编码解码、图片Base64', icon: '&lt;/&gt;', hash: 'encode', tags: '编码 解码 base64 url html 图片' },
    { name: '颜色工具', desc: '取色、HEX / RGB / HSL 互转、随机配色', icon: '●', hash: 'color', tags: '颜色 配色 hex rgb hsl 取色' },
    { name: '图片压缩', desc: 'JPG / PNG / WebP 压缩、缩放、导出', icon: '🖼', hash: 'image', tags: '图片 压缩 jpg png webp 缩放' },
    { name: '视频压缩', desc: '视频格式转换、截帧、尺寸调整、压缩导出', icon: '🎬', hash: 'media', tags: '视频 媒体 截帧 转换 压缩' },
    { name: '实用计算器', desc: '个税计算、汇率换算、工资计算', icon: '🧮', hash: 'calc', tags: '计算器 税费 汇率 工资 个税 换算' },
    { name: '技术栈导航', desc: '前端/后端/博客常用技术栈官网地址一键跳转', icon: '📚', hash: 'tech', tags: '技术栈 前端 后端 vue react java' },
    { name: 'AI 工具集合', desc: '国内外AI工具导航，对话/绘画/编程/视频/音频', icon: '🤖', hash: 'ai', tags: 'ai 人工智能 chatgpt 绘画 编程 工具' },
];

export class HomePage extends BaseComponent {
    render() {
        const toolItems = TOOLS.map(t => `
            <a href="#${t.hash}" class="tool-item" data-search="${t.tags} ${t.name.toLowerCase()}">
                <div class="tool-item-icon">${t.icon}</div>
                <h3>${t.name}</h3>
                <p>${t.desc}</p>
            </a>
        `).join('');

        return `
            <div class="home-page">
                <section class="hero-section">
                    <h1>开发者的<span class="gradient-text">效率工具箱</span></h1>
                    <p>轻量、快速、优雅的在线开发工具集合，纯前端实现，数据不离开浏览器。</p>

                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="toolSearch" class="search-input" placeholder="搜索工具，如 JSON、压缩、Vue...">
                        <span class="search-clear" id="searchClear" style="display:none;">✕</span>
                    </div>
                </section>

                <section class="tools-section">
                    <div class="tools-grid" id="toolsGrid">${toolItems}</div>
                </section>

                <div class="search-empty" id="searchEmpty" style="display:none;">
                    <p>没有找到匹配的工具</p>
                </div>

                <section class="features-section">
                    <h2>为什么选择 DevTools</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-card-icon">🔒</div>
                            <h3>隐私优先</h3>
                            <p>纯前端运行，数据不上传，保护你的敏感信息</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-card-icon">⚡</div>
                            <h3>极速响应</h3>
                            <p>无服务器延迟，所有计算在浏览器内即时完成</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-card-icon">📱</div>
                            <h3>多端适配</h3>
                            <p>响应式设计，桌面、平板、手机均可流畅使用</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-card-icon">🎨</div>
                            <h3>主题切换</h3>
                            <p>支持亮色 / 暗色主题，保护眼睛，随心切换</p>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    afterMount() {
        const input = this.querySelector('#toolSearch');
        const clearBtn = this.querySelector('#searchClear');
        const empty = this.querySelector('#searchEmpty');
        const allItems = this.querySelectorAll('.tool-item');

        this.addEventListener(input, 'input', () => {
            const q = input.value.trim().toLowerCase();
            clearBtn.style.display = q ? '' : 'none';

            let found = 0;
            allItems.forEach(item => {
                const search = (item.getAttribute('data-search') || '').toLowerCase();
                const show = !q || search.includes(q);
                item.style.display = show ? '' : 'none';
                if (show) found++;
            });

            empty.style.display = q && found === 0 ? '' : 'none';
        });

        this.addEventListener(clearBtn, 'click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            allItems.forEach(item => { item.style.display = ''; });
            empty.style.display = 'none';
            input.focus();
        });
    }
}