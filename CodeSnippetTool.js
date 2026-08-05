import { BaseComponent } from '../components/BaseComponent.js';

const STORAGE_KEY = 'devtools.codeSnippets.v1';

const LANGUAGES = [
    'JavaScript',
    'TypeScript',
    'Vue',
    'HTML',
    'CSS',
    'JSON',
    'Python',
    'Java',
    'SQL',
    'Shell',
    'Markdown',
    'Text',
];

const DEFAULT_SNIPPETS = [
    {
        id: 'sample-fetch',
        title: 'Fetch JSON 请求',
        language: 'JavaScript',
        tags: ['api', 'fetch'],
        code: `fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });`,
        createdAt: 1774407845000,
        updatedAt: 1774407845000,
    },
    {
        id: 'sample-css-center',
        title: 'Flex 居中',
        language: 'CSS',
        tags: ['layout', 'flex'],
        code: `.container {
    display: flex;
    align-items: center;
    justify-content: center;
}`,
        createdAt: 1774407845000,
        updatedAt: 1774407845000,
    },
];

const SNIPPET_TEMPLATES = [
    {
        value: 'js-function',
        label: 'JavaScript 函数',
        language: 'JavaScript',
        defaultTitle: '工具函数',
        defaultContext: '描述函数用途',
        defaultTags: ['javascript', 'function'],
        build({ title, context }) {
            const name = toCamelCase(title, 'utils');
            const note = context || 'Describe the function purpose.';
            return {
                title: title || '工具函数',
                language: 'JavaScript',
                tags: ['javascript', 'function', 'generated'],
                code: `/**
 * ${note}
 */
export function ${name}(input) {
    return input;
}`,
            };
        },
    },
    {
        value: 'async-request',
        label: '异步请求',
        language: 'JavaScript',
        defaultTitle: 'API 请求',
        defaultContext: '/api/data',
        defaultTags: ['api', 'fetch'],
        build({ title, context }) {
            const name = toCamelCase(title, 'fetchData');
            const endpoint = context || '/api/data';
            return {
                title: title || 'API 请求',
                language: 'JavaScript',
                tags: ['api', 'fetch', 'generated'],
                code: `export async function ${name}() {
    const response = await fetch(${JSON.stringify(endpoint)});

    if (!response.ok) {
        throw new Error(\`Request failed: \${response.status}\`);
    }

    return response.json();
}`,
            };
        },
    },
    {
        value: 'react-component',
        label: 'React 组件',
        language: 'JavaScript',
        defaultTitle: '组件',
        defaultContext: '可选说明文本',
        defaultTags: ['react', 'component'],
        build({ title, context }) {
            const componentName = toPascalCase(title, 'GeneratedComponent');
            const className = toKebabCase(title, 'generated-component');
            const note = context || componentName;
            return {
                title: title || 'React 组件',
                language: 'JavaScript',
                tags: ['react', 'component', 'generated'],
                code: `export default function ${componentName}() {
    return (
        <section className="${className}">
            <h1>${note}</h1>
        </section>
    );
}`,
            };
        },
    },
    {
        value: 'vue-component',
        label: 'Vue 组件',
        language: 'Vue',
        defaultTitle: 'Vue 组件',
        defaultContext: '可选说明文本',
        defaultTags: ['vue', 'component'],
        build({ title, context }) {
            const componentName = toPascalCase(title, 'GeneratedComponent');
            const className = toKebabCase(title, 'generated-component');
            const note = context || componentName;
            return {
                title: title || 'Vue 组件',
                language: 'Vue',
                tags: ['vue', 'component', 'generated'],
                code: `<template>
  <section class="${className}">
    <h1>${note}</h1>
  </section>
</template>

<script setup>
defineOptions({ name: '${componentName}' });
</script>

<style scoped>
.${className} {
  padding: 16px;
}
</style>`,
            };
        },
    },
    {
        value: 'html-page',
        label: 'HTML 页面',
        language: 'HTML',
        defaultTitle: 'HTML 页面',
        defaultContext: '页面说明',
        defaultTags: ['html', 'page'],
        build({ title, context }) {
            const pageName = toKebabCase(title, 'page');
            const note = context || '页面说明';
            return {
                title: title || 'HTML 页面',
                language: 'HTML',
                tags: ['html', 'page', 'generated'],
                code: `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'HTML 页面'}</title>
</head>
<body>
  <main class="${pageName}">
    <h1>${title || 'HTML 页面'}</h1>
    <p>${note}</p>
  </main>
</body>
</html>`,
            };
        },
    },
    {
        value: 'css-style',
        label: 'CSS 样式',
        language: 'CSS',
        defaultTitle: '样式片段',
        defaultContext: '布局说明',
        defaultTags: ['css', 'style'],
        build({ title, context }) {
            const className = toKebabCase(title, 'snippet');
            const note = context || '布局说明';
            return {
                title: title || '样式片段',
                language: 'CSS',
                tags: ['css', 'style', 'generated'],
                code: `.${className} {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    /* ${note} */
}`,
            };
        },
    },
    {
        value: 'python-function',
        label: 'Python 函数',
        language: 'Python',
        defaultTitle: 'Python 函数',
        defaultContext: '函数说明',
        defaultTags: ['python', 'function'],
        build({ title, context }) {
            const name = toSnakeCase(title, 'generated_function');
            const note = context || 'Describe the function purpose.';
            return {
                title: title || 'Python 函数',
                language: 'Python',
                tags: ['python', 'function', 'generated'],
                code: `def ${name}(value):
    """${note}"""
    return value`,
            };
        },
    },
    {
        value: 'sql-query',
        label: 'SQL 查询',
        language: 'SQL',
        defaultTitle: 'SQL 查询',
        defaultContext: 'table_name',
        defaultTags: ['sql', 'query'],
        build({ title, context }) {
            const table = toSnakeCase(context || title, 'table_name');
            return {
                title: title || 'SQL 查询',
                language: 'SQL',
                tags: ['sql', 'query', 'generated'],
                code: `SELECT *
FROM ${table}
WHERE id = ?;`,
            };
        },
    },
    {
        value: 'shell-script',
        label: 'Shell 脚本',
        language: 'Shell',
        defaultTitle: 'Shell 脚本',
        defaultContext: '脚本说明',
        defaultTags: ['shell', 'script'],
        build({ title, context }) {
            const note = context || '脚本说明';
            return {
                title: title || 'Shell 脚本',
                language: 'Shell',
                tags: ['shell', 'script', 'generated'],
                code: `#!/usr/bin/env bash
set -euo pipefail

# ${note}
echo "Hello, world!"`,
            };
        },
    },
    {
        value: 'markdown-note',
        label: 'Markdown 模板',
        language: 'Markdown',
        defaultTitle: 'Markdown 笔记',
        defaultContext: '记录内容',
        defaultTags: ['markdown', 'note'],
        build({ title, context }) {
            const note = context || '记录内容';
            return {
                title: title || 'Markdown 笔记',
                language: 'Markdown',
                tags: ['markdown', 'note', 'generated'],
                code: `# ${title || 'Markdown 笔记'}

- ${note}`,
            };
        },
    },
];

function splitWords(value) {
    return String(value || '')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function toPascalCase(value, fallback = 'GeneratedComponent') {
    const words = splitWords(value);
    if (!words.length) return fallback;
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

function toCamelCase(value, fallback = 'generatedFunction') {
    const words = splitWords(value);
    if (!words.length) return fallback;
    return words
        .map((word, index) => {
            const lower = word.toLowerCase();
            return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
}

function toSnakeCase(value, fallback = 'generated_function') {
    const words = splitWords(value);
    if (!words.length) return fallback;
    return words.map(word => word.toLowerCase()).join('_');
}

function toKebabCase(value, fallback = 'generated-component') {
    const words = splitWords(value);
    if (!words.length) return fallback;
    return words.map(word => word.toLowerCase()).join('-');
}

export class CodeSnippetTool extends BaseComponent {
    constructor() {
        super();
        this.snippets = [];
        this.activeId = null;
        this.filters = {
            query: '',
            language: 'all',
        };
    }

    render() {
        const languageOptions = LANGUAGES.map(lang => `<option value="${lang}">${lang}</option>`).join('');
        const templateOptions = SNIPPET_TEMPLATES.map(template => `
            <option value="${template.value}">${template.label}</option>
        `).join('');
        const filterOptions = ['all', ...LANGUAGES].map(lang => {
            const label = lang === 'all' ? '全部语言' : lang;
            return `<option value="${lang}">${label}</option>`;
        }).join('');

        return `
            <div class="tool-page snippet-page">
                <div class="tool-section snippet-editor-section">
                    <div class="snippet-title-row">
                        <div>
                            <h2>代码片段工具</h2>
                            <p>保存、检索、复制常用代码片段，数据存储在浏览器本地</p>
                        </div>
                        <button type="button" class="btn btn-secondary" id="snippetNewBtn">新建片段</button>
                    </div>

                    <div class="snippet-form-grid">
                        <div class="form-group">
                            <label for="snippetTitle">标题</label>
                            <input type="text" id="snippetTitle" placeholder="片段标题">
                        </div>
                        <div class="form-group">
                            <label for="snippetLanguage">语言</label>
                            <select id="snippetLanguage">${languageOptions}</select>
                        </div>
                        <div class="form-group snippet-tags-field">
                            <label for="snippetTags">标签</label>
                            <input type="text" id="snippetTags" placeholder="api, utils, dom">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="snippetCode">代码</label>
                        <textarea id="snippetCode" class="snippet-code-editor" spellcheck="false" placeholder="粘贴或输入代码片段..."></textarea>
                    </div>

                    <div class="snippet-meta-row">
                        <span id="snippetStats">0 行 · 0 字符</span>
                        <span id="snippetSavedAt">未保存</span>
                    </div>

                    <div class="button-group snippet-actions">
                        <button type="button" class="btn" id="snippetSaveBtn">保存片段</button>
                        <button type="button" class="btn btn-ghost" id="snippetCopyBtn">复制代码</button>
                        <button type="button" class="btn btn-secondary" id="snippetExportBtn">导出 JSON</button>
                        <button type="button" class="btn btn-secondary" id="snippetImportBtn">导入 JSON</button>
                        <button type="button" class="btn btn-accent" id="snippetDeleteBtn">删除片段</button>
                        <input type="file" id="snippetImportInput" accept="application/json,.json" hidden>
                    </div>

                    <div class="snippet-status" id="snippetStatus"></div>
                </div>

                <div class="tool-sidebar snippet-sidebar">
                    <div class="tool-section snippet-generator-section">
                        <h3>生成片段</h3>
                        <div class="snippet-generator-stack">
                            <div class="form-group">
                                <label for="snippetTemplate">模板</label>
                                <select id="snippetTemplate" class="snippet-filter-select">${templateOptions}</select>
                            </div>
                            <div class="form-group">
                                <label for="snippetTemplateContext">模板参数</label>
                                <input type="text" id="snippetTemplateContext" class="snippet-search-input" placeholder="${SNIPPET_TEMPLATES[0].defaultContext}">
                            </div>
                        </div>
                        <div class="snippet-generator-hint" id="snippetTemplateHint">${SNIPPET_TEMPLATES[0].defaultTags.join(' · ')}</div>
                        <div class="button-group snippet-generator-actions">
                            <button type="button" class="btn btn-secondary" id="snippetGenerateBtn">生成到编辑器</button>
                            <button type="button" class="btn btn-ghost" id="snippetGenerateSaveBtn">生成并保存</button>
                        </div>
                    </div>

                    <div class="tool-section">
                        <h3>片段库</h3>
                        <div class="snippet-filter-stack">
                            <input type="text" id="snippetSearch" class="snippet-search-input" placeholder="搜索标题、标签或代码">
                            <select id="snippetLanguageFilter" class="snippet-filter-select">${filterOptions}</select>
                        </div>
                        <div class="snippet-list" id="snippetList"></div>
                    </div>

                    <div class="tool-section">
                        <h3>统计</h3>
                        <div class="snippet-summary-grid">
                            <div>
                                <span>片段数</span>
                                <strong id="snippetTotalCount">0</strong>
                            </div>
                            <div>
                                <span>语言数</span>
                                <strong id="snippetLanguageCount">0</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        this.titleInput = this.querySelector('#snippetTitle');
        this.languageSelect = this.querySelector('#snippetLanguage');
        this.tagsInput = this.querySelector('#snippetTags');
        this.codeInput = this.querySelector('#snippetCode');
        this.statsEl = this.querySelector('#snippetStats');
        this.savedAtEl = this.querySelector('#snippetSavedAt');
        this.statusEl = this.querySelector('#snippetStatus');
        this.listEl = this.querySelector('#snippetList');
        this.searchInput = this.querySelector('#snippetSearch');
        this.languageFilter = this.querySelector('#snippetLanguageFilter');
        this.importInput = this.querySelector('#snippetImportInput');
        this.templateSelect = this.querySelector('#snippetTemplate');
        this.templateContextInput = this.querySelector('#snippetTemplateContext');
        this.templateHintEl = this.querySelector('#snippetTemplateHint');
        this.totalCountEl = this.querySelector('#snippetTotalCount');
        this.languageCountEl = this.querySelector('#snippetLanguageCount');

        this.snippets = this.loadSnippets();
        this.activeId = this.snippets[0]?.id || null;

        this.bindEvents();
        this.renderList();
        this.syncForm();
        this.updateTemplateHint();
        this.updateSummary();
    }

    bindEvents() {
        this.addEventListener(this.querySelector('#snippetNewBtn'), 'click', () => this.createDraft());
        this.addEventListener(this.querySelector('#snippetSaveBtn'), 'click', () => this.saveSnippet());
        this.addEventListener(this.querySelector('#snippetCopyBtn'), 'click', () => this.copyCurrentCode());
        this.addEventListener(this.querySelector('#snippetDeleteBtn'), 'click', () => this.deleteSnippet());
        this.addEventListener(this.querySelector('#snippetExportBtn'), 'click', () => this.exportSnippets());
        this.addEventListener(this.querySelector('#snippetImportBtn'), 'click', () => this.importInput.click());
        this.addEventListener(this.querySelector('#snippetGenerateBtn'), 'click', () => this.generateSnippet());
        this.addEventListener(this.querySelector('#snippetGenerateSaveBtn'), 'click', () => this.generateSnippet(true));

        this.addEventListener(this.importInput, 'change', () => this.importSnippets());
        this.addEventListener(this.templateSelect, 'change', () => this.updateTemplateHint());
        this.addEventListener(this.searchInput, 'input', () => {
            this.filters.query = this.searchInput.value.trim().toLowerCase();
            this.renderList();
        });
        this.addEventListener(this.languageFilter, 'change', () => {
            this.filters.language = this.languageFilter.value;
            this.renderList();
        });
        this.addEventListener(this.codeInput, 'input', () => this.updateEditorStats());

        this.addEventListener(this.listEl, 'click', (event) => {
            const item = event.target.closest('.snippet-list-item');
            if (!item) return;
            this.activeId = item.dataset.id;
            this.renderList();
            this.syncForm();
        });
    }

    generateSnippet(saveAfterGenerate = false) {
        const template = this.getSelectedTemplate();
        const currentTitle = this.titleInput.value.trim();
        const context = this.templateContextInput.value.trim();
        const generated = template.build({
            title: currentTitle || template.defaultTitle,
            context,
        });

        this.activeId = null;
        this.titleInput.value = generated.title;
        this.languageSelect.value = LANGUAGES.includes(generated.language) ? generated.language : 'Text';
        this.tagsInput.value = generated.tags.join(', ');
        this.codeInput.value = generated.code;
        this.savedAtEl.textContent = '未保存';
        this.updateEditorStats();
        this.renderList();

        if (saveAfterGenerate) {
            this.saveSnippet();
            return;
        }

        this.setStatus('已生成片段草稿，确认后可保存');
        this.codeInput.focus();
    }

    getSelectedTemplate() {
        return SNIPPET_TEMPLATES.find(template => template.value === this.templateSelect.value) || SNIPPET_TEMPLATES[0];
    }

    updateTemplateHint() {
        const template = this.getSelectedTemplate();
        this.templateHintEl.textContent = `${template.language} · ${template.defaultTags.join(' · ')}`;
        this.templateContextInput.placeholder = template.defaultContext;
    }

    loadSnippets() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [...DEFAULT_SNIPPETS];

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [...DEFAULT_SNIPPETS];

            return parsed
                .map(item => this.normalizeSnippet(item))
                .filter(Boolean)
                .sort((a, b) => b.updatedAt - a.updatedAt);
        } catch (error) {
            return [...DEFAULT_SNIPPETS];
        }
    }

    persistSnippets() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.snippets));
    }

    normalizeSnippet(item) {
        if (!item || typeof item !== 'object') return null;

        const now = Date.now();
        const code = typeof item.code === 'string' ? item.code : '';
        const title = typeof item.title === 'string' && item.title.trim() ? item.title.trim() : '未命名片段';
        const language = LANGUAGES.includes(item.language) ? item.language : 'Text';
        const tags = Array.isArray(item.tags)
            ? item.tags.map(tag => String(tag).trim()).filter(Boolean)
            : String(item.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);

        return {
            id: typeof item.id === 'string' && item.id ? item.id : this.createId(),
            title,
            language,
            tags,
            code,
            createdAt: Number.isFinite(item.createdAt) ? item.createdAt : now,
            updatedAt: Number.isFinite(item.updatedAt) ? item.updatedAt : now,
        };
    }

    createDraft() {
        this.activeId = null;
        this.titleInput.value = '';
        this.languageSelect.value = 'JavaScript';
        this.tagsInput.value = '';
        this.codeInput.value = '';
        this.savedAtEl.textContent = '未保存';
        this.updateEditorStats();
        this.renderList();
        this.setStatus('正在编辑新片段');
        this.titleInput.focus();
    }

    saveSnippet() {
        const now = Date.now();
        const existing = this.snippets.find(snippet => snippet.id === this.activeId);
        const snippet = {
            id: existing?.id || this.createId(),
            title: this.titleInput.value.trim() || '未命名片段',
            language: this.languageSelect.value,
            tags: this.parseTags(this.tagsInput.value),
            code: this.codeInput.value,
            createdAt: existing?.createdAt || now,
            updatedAt: now,
        };

        if (existing) {
            this.snippets = this.snippets.map(item => item.id === snippet.id ? snippet : item);
        } else {
            this.snippets = [snippet, ...this.snippets];
        }

        this.snippets.sort((a, b) => b.updatedAt - a.updatedAt);
        this.activeId = snippet.id;
        this.persistSnippets();
        this.renderList();
        this.syncForm();
        this.updateSummary();
        this.setStatus('片段已保存');
    }

    deleteSnippet() {
        if (!this.activeId) {
            this.createDraft();
            return;
        }

        const active = this.getActiveSnippet();
        if (!active || !window.confirm(`删除「${active.title}」？`)) return;

        this.snippets = this.snippets.filter(snippet => snippet.id !== this.activeId);
        this.activeId = this.snippets[0]?.id || null;
        this.persistSnippets();
        this.renderList();
        this.syncForm();
        this.updateSummary();
        this.setStatus('片段已删除');
    }

    copyCurrentCode() {
        const text = this.codeInput.value;
        if (!text.trim()) {
            this.setStatus('没有可复制的代码', true);
            return;
        }

        this.copyText(text)
            .then(() => this.setStatus('代码已复制'))
            .catch(() => this.setStatus('复制失败，请手动复制', true));
    }

    exportSnippets() {
        const data = JSON.stringify(this.snippets, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `code-snippets-${this.formatDateForFilename(new Date())}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.setStatus('片段库已导出');
    }

    importSnippets() {
        const file = this.importInput.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result || '[]'));
                if (!Array.isArray(parsed)) throw new Error('Invalid snippets');

                const imported = parsed.map(item => this.normalizeSnippet(item)).filter(Boolean);
                const merged = new Map(this.snippets.map(item => [item.id, item]));
                imported.forEach(item => merged.set(item.id, item));

                this.snippets = Array.from(merged.values()).sort((a, b) => b.updatedAt - a.updatedAt);
                this.activeId = imported[0]?.id || this.snippets[0]?.id || null;
                this.persistSnippets();
                this.renderList();
                this.syncForm();
                this.updateSummary();
                this.setStatus(`已导入 ${imported.length} 个片段`);
            } catch (error) {
                this.setStatus('导入失败，请检查 JSON 文件', true);
            } finally {
                this.importInput.value = '';
            }
        };
        reader.readAsText(file);
    }

    renderList() {
        const snippets = this.getFilteredSnippets();

        if (!snippets.length) {
            this.listEl.innerHTML = `<div class="snippet-empty">没有匹配的片段</div>`;
            return;
        }

        this.listEl.innerHTML = snippets.map(snippet => {
            const active = snippet.id === this.activeId ? 'active' : '';
            const tags = snippet.tags.map(tag => `<span>${this.escapeHtml(tag)}</span>`).join('');
            return `
                <button type="button" class="snippet-list-item ${active}" data-id="${this.escapeHtml(snippet.id)}">
                    <div class="snippet-list-main">
                        <strong>${this.escapeHtml(snippet.title)}</strong>
                        <small>${this.escapeHtml(snippet.language)} · ${this.formatRelativeTime(snippet.updatedAt)}</small>
                    </div>
                    <div class="snippet-list-tags">${tags}</div>
                </button>
            `;
        }).join('');
    }

    syncForm() {
        const snippet = this.getActiveSnippet();

        if (!snippet) {
            this.titleInput.value = '';
            this.languageSelect.value = 'JavaScript';
            this.tagsInput.value = '';
            this.codeInput.value = '';
            this.savedAtEl.textContent = '未保存';
            this.updateEditorStats();
            return;
        }

        this.titleInput.value = snippet.title;
        this.languageSelect.value = snippet.language;
        this.tagsInput.value = snippet.tags.join(', ');
        this.codeInput.value = snippet.code;
        this.savedAtEl.textContent = `更新于 ${this.formatDateTime(snippet.updatedAt)}`;
        this.updateEditorStats();
    }

    updateEditorStats() {
        const code = this.codeInput.value;
        const lineCount = code ? code.split(/\r\n|\r|\n/).length : 0;
        this.statsEl.textContent = `${lineCount} 行 · ${code.length} 字符`;
    }

    updateSummary() {
        const languages = new Set(this.snippets.map(snippet => snippet.language));
        this.totalCountEl.textContent = String(this.snippets.length);
        this.languageCountEl.textContent = String(languages.size);
    }

    getFilteredSnippets() {
        return this.snippets.filter(snippet => {
            const matchesLanguage = this.filters.language === 'all' || snippet.language === this.filters.language;
            const text = [
                snippet.title,
                snippet.language,
                snippet.tags.join(' '),
                snippet.code,
            ].join(' ').toLowerCase();
            const matchesQuery = !this.filters.query || text.includes(this.filters.query);
            return matchesLanguage && matchesQuery;
        });
    }

    getActiveSnippet() {
        return this.snippets.find(snippet => snippet.id === this.activeId) || null;
    }

    parseTags(value) {
        return value.split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
            .slice(0, 8);
    }

    setStatus(message, isError = false) {
        this.statusEl.textContent = message;
        this.statusEl.classList.toggle('error', isError);
    }

    createId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
        return `snippet-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    formatDateTime(timestamp) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(timestamp)).replace(/\//g, '-');
    }

    formatRelativeTime(timestamp) {
        const diff = Date.now() - timestamp;
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;

        if (diff < minute) return '刚刚';
        if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
        if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
        if (diff < day * 7) return `${Math.floor(diff / day)} 天前`;
        return this.formatDateTime(timestamp);
    }

    formatDateForFilename(date) {
        const pad = value => String(value).padStart(2, '0');
        return [
            date.getFullYear(),
            pad(date.getMonth() + 1),
            pad(date.getDate()),
        ].join('');
    }

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                const copied = document.execCommand('copy');
                document.body.removeChild(textarea);
                copied ? resolve() : reject(new Error('Copy command failed'));
            } catch (error) {
                document.body.removeChild(textarea);
                reject(error);
            }
        });
    }
}
