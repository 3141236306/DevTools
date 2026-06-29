import { BaseComponent } from '../components/BaseComponent.js';

const AI_DATA = {
    '对话助手': [
        { name: 'ChatGPT', desc: 'OpenAI 出品，全球最流行的 AI 对话助手', url: 'https://chat.openai.com/', icon: '🤖', tags: 'chatgpt 对话 ai openai' },
        { name: 'Claude', desc: 'Anthropic 出品，擅长长文本分析与创作', url: 'https://claude.ai/', icon: '🧠', tags: 'claude 对话 ai anthropic' },
        { name: '文心一言', desc: '百度出品，中文理解能力强', url: 'https://yiyan.baidu.com/', icon: '💬', tags: '文心一言 百度 对话 ai' },
        { name: '通义千问', desc: '阿里云出品，支持多模态交互', url: 'https://tongyi.aliyun.com/', icon: '🔮', tags: '通义千问 阿里 对话 ai' },
        { name: '豆包', desc: '字节跳动出品，轻量级 AI 助手', url: 'https://www.doubao.com/', icon: '🫘', tags: '豆包 字节 对话 ai' },
        { name: 'Kimi', desc: '月之暗面出品，支持超长文本处理', url: 'https://kimi.moonshot.cn/', icon: '🌙', tags: 'kimi 月之暗面 对话 ai' },
        { name: 'DeepSeek', desc: '深度求索出品，开源大模型，性价比高', url: 'https://chat.deepseek.com/', icon: '🔍', tags: 'deepseek 深度求索 对话 ai 开源' },
        { name: 'Gemini', desc: 'Google 出品，多模态 AI 助手', url: 'https://gemini.google.com/', icon: '✨', tags: 'gemini google 对话 ai' },
        { name: 'MiMo', desc: '小米出品，智能对话助手，支持多场景交互', url: 'https://mimo.mi.com/', icon: '📱', tags: 'mimo 小米 对话 ai 助手' },
    ],
    'AI 绘画': [
        { name: 'Midjourney', desc: '高质量 AI 绘画工具，艺术创作首选', url: 'https://www.midjourney.com/', icon: '🎨', tags: 'midjourney 绘画 ai 画图' },
        { name: 'DALL·E', desc: 'OpenAI 出品的 AI 图像生成工具', url: 'https://openai.com/dall-e-3', icon: '🖼', tags: 'dalle 绘画 ai openai 画图' },
        { name: 'Stable Diffusion', desc: '开源 AI 绘画模型，可本地部署', url: 'https://stability.ai/', icon: '📷', tags: 'stable diffusion 绘画 ai 开源' },
        { name: 'Leonardo.AI', desc: '专业 AI 绘画平台，支持多种风格', url: 'https://leonardo.ai/', icon: '✏️', tags: 'leonardo 绘画 ai 画图' },
        { name: '通义万相', desc: '阿里出品的 AI 绘画工具', url: 'https://tongyi.aliyun.com/wanxiang/', icon: '🏮', tags: '通义万相 阿里 绘画 ai' },
    ],
    'AI 编程': [
        { name: 'GitHub Copilot', desc: 'GitHub + OpenAI，AI 编程助手，代码自动补全', url: 'https://github.com/features/copilot', icon: '💻', tags: 'copilot github 编程 ai 代码' },
        { name: 'Codex', desc: 'OpenAI 代码生成模型，ChatGPT 内置编程能力', url: 'https://openai.com/index/introducing-codex/', icon: '⚡', tags: 'codex openai 编程 代码 生成' },
        { name: 'Cursor', desc: 'AI 驱动的代码编辑器，智能编程体验', url: 'https://cursor.sh/', icon: '📝', tags: 'cursor 编程 ai 编辑器' },
        { name: 'CodeGeeX', desc: '智谱 AI 出品的免费编程助手', url: 'https://codegeex.cn/', icon: '🔧', tags: 'codegeex 编程 ai 代码' },
        { name: 'Codeium', desc: '免费 AI 编程助手，支持多种 IDE', url: 'https://codeium.com/', icon: '⚙️', tags: 'codeium 编程 ai 免费' },
        { name: 'Tabnine', desc: 'AI 代码补全工具，支持全语言', url: 'https://www.tabnine.com/', icon: '⏩', tags: 'tabnine 编程 ai 代码补全' },
    ],
    'AI 视频': [
        { name: 'Sora', desc: 'OpenAI 出品的 AI 视频生成模型', url: 'https://openai.com/sora', icon: '🎬', tags: 'sora 视频 ai openai' },
        { name: 'Runway', desc: '专业 AI 视频编辑与生成平台', url: 'https://runwayml.com/', icon: '🎞', tags: 'runway 视频 ai 编辑' },
        { name: 'Pika', desc: 'AI 视频生成工具，简单易用', url: 'https://pika.art/', icon: '📹', tags: 'pika 视频 ai 生成' },
        { name: '可灵', desc: '快手出品的 AI 视频生成工具', url: 'https://klingai.kuaishou.com/', icon: '🎞', tags: '可灵 快手 视频 ai' },
    ],
    'AI 音频': [
        { name: 'ElevenLabs', desc: 'AI 语音合成，支持多语言多音色', url: 'https://elevenlabs.io/', icon: '🎤', tags: 'elevenlabs 语音 ai 配音' },
        { name: 'Suno', desc: 'AI 音乐生成，输入文字即可创作歌曲', url: 'https://suno.com/', icon: '🎵', tags: 'suno 音乐 ai 创作' },
        { name: 'Udio', desc: 'AI 音乐生成平台，高质量音乐创作', url: 'https://www.udio.com/', icon: '🎶', tags: 'udio 音乐 ai 创作' },
    ],
    'AI 办公': [
        { name: 'Notion AI', desc: 'Notion 集成的 AI 助手，智能笔记与写作', url: 'https://www.notion.so/', icon: '📋', tags: 'notion ai 办公 笔记' },
        { name: 'Gamma', desc: 'AI 一键生成精美 PPT 演示文稿', url: 'https://gamma.app/', icon: '📊', tags: 'gamma ppt ai 演示' },
        { name: '秘塔 AI 搜索', desc: '无广告 AI 搜索引擎，直接给答案', url: 'https://metaso.cn/', icon: '🔎', tags: '秘塔 搜索 ai' },
    ],
};

function renderCategory(data, colorClass) {
    let html = '';
    for (const [cat, items] of Object.entries(data)) {
        html += `<h3 class="tech-category-title">${cat}</h3>`;
        html += '<div class="tools-grid">';
        items.forEach(l => {
            html += `
                <a href="${l.url}" target="_blank" rel="noopener" class="tool-item tech-item ${colorClass}" data-search="${l.tags} ${l.name.toLowerCase()} ${cat}">
                    <div class="tool-item-icon ai-icon">${l.icon}</div>
                    <h3>${l.name}</h3>
                    <p>${l.desc}</p>
                    <span class="tech-link-hint">访问官网 →</span>
                </a>`;
        });
        html += '</div>';
    }
    return html;
}

export class AiTool extends BaseComponent {
    constructor() {
        super();
    }

    render() {
        const aiHtml = renderCategory(AI_DATA, 'ai-tech');

        return `
            <div class="tool-page">
                <div class="tool-section" style="grid-column: 1 / -1;">
                    <h2>AI 工具集合</h2>
                    <p>精选国内外 AI 工具，涵盖对话、绘画、编程、视频、音频、办公等场景</p>

                    <div class="search-box" style="max-width:480px; margin-bottom:20px;">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="aiSearch" class="search-input" placeholder="搜索 AI 工具，如 ChatGPT、绘画、编程...">
                        <span class="search-clear" id="aiClear" style="display:none;">✕</span>
                    </div>

                    <div class="ai-tabs" id="aiTabs">
                        <button class="ai-tab-btn active" data-cat="all">全部</button>
                        ${Object.keys(AI_DATA).map(cat =>
                            `<button class="ai-tab-btn" data-cat="${cat}">${cat}</button>`
                        ).join('')}
                    </div>

                    <div id="aiContent">${aiHtml}</div>

                    <div class="search-empty" id="aiEmpty" style="display:none;">
                        <p>没有找到匹配的 AI 工具</p>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        const tabBtns = this.querySelectorAll('.ai-tab-btn');
        const content = this.querySelector('#aiContent');

        tabBtns.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.getAttribute('data-cat');

                if (cat === 'all') {
                    content.innerHTML = renderCategory(AI_DATA, 'ai-tech');
                } else {
                    const filtered = { [cat]: AI_DATA[cat] };
                    content.innerHTML = renderCategory(filtered, 'ai-tech');
                }

                this.bindSearch();
            });
        });

        this.bindSearch();
    }

    bindSearch() {
        const input = this.querySelector('#aiSearch');
        const clearBtn = this.querySelector('#aiClear');
        const empty = this.querySelector('#aiEmpty');
        const allItems = this.querySelectorAll('.tech-item');

        const searchHandler = () => {
            const q = input.value.trim().toLowerCase();
            clearBtn.style.display = q ? '' : 'none';

            let found = 0;
            allItems.forEach(item => {
                const search = (item.getAttribute('data-search') || '').toLowerCase();
                const show = !q || search.includes(q);
                item.style.display = show ? '' : 'none';
                if (show) found++;
            });

            this.querySelectorAll('.tech-category-title').forEach(title => {
                const grid = title.nextElementSibling;
                if (!grid) return;
                const visibleItems = grid.querySelectorAll('.tech-item:not([style*="display: none"])');
                title.style.display = visibleItems.length === 0 ? 'none' : '';
            });

            empty.style.display = q && found === 0 ? '' : 'none';
        };

        if (!input._bound) {
            input.addEventListener('input', searchHandler);
            input._bound = true;
        }
        if (!clearBtn._bound) {
            clearBtn.addEventListener('click', () => {
                input.value = '';
                clearBtn.style.display = 'none';
                this.querySelectorAll('.tech-item').forEach(item => { item.style.display = ''; });
                this.querySelectorAll('.tech-category-title').forEach(t => { t.style.display = ''; });
                empty.style.display = 'none';
                input.focus();
            });
            clearBtn._bound = true;
        }
    }
}