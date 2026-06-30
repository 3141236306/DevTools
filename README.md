# DevTools - 开发工具集合

一个基于纯 HTML/CSS/JavaScript 的开发工具网站，采用组件化架构设计，支持深色/浅色主题切换。

## 功能特性

- **JSON 工具**: 格式化、压缩、验证 JSON 数据，可配置缩进大小
- **正则表达式工具**: 实时测试和调试正则表达式，内置常用正则示例
- **编码工具**: URL 编码/解码、Base64 文本编解码、HTML 实体编码、图片 Base64 转换、文档 Base64 编解码（支持 Excel/PDF/Word/PPT/TXT/CSV）
- **颜色工具**: 颜色选择器、HEX/RGB/HSL 转换、调色板生成
- **图片工具**: 图片压缩，支持 JPG/PNG/WebP 格式，可调节压缩质量和目标尺寸
- **媒体工具**: 视频压缩，支持 MP4/WebM/MOV/AVI 格式，可调节输出格式、质量和分辨率
- **计算器工具**: 科学计算器、单位换算、汇率换算（实时汇率）
- **AI 工具**: AI 对话、文本生成、代码辅助
- **技术栈导航**: 前端/后端/博客/Git/图标库/第三方平台/在线工具资源导航，支持搜索

## 技术栈

- HTML5
- CSS3（CSS 变量、CSS Grid、Flexbox）
- JavaScript ES6+（模块化、类继承）
- 组件化架构设计
- 响应式布局（移动优先）

## 项目结构

```
dev-tools-site/
├── index.html                  # 主页面
├── package.json                # 项目配置
├── css/
│   ├── main.css                # 全局样式、主题变量、响应式布局
│   └── components.css          # 组件样式（工具页面、按钮、表单、上传区域、下拉框等）
├── js/
│   ├── app.js                  # 主应用逻辑、路由管理
│   ├── components/
│   │   ├── BaseComponent.js    # 组件基类（生命周期管理）
│   │   └── HomePage.js         # 首页组件
│   └── tools/
│       ├── JsonTool.js         # JSON 工具
│       ├── RegexTool.js        # 正则表达式工具
│       ├── EncodeTool.js       # 编码工具（URL/Base64/HTML/图片/文档）
│       ├── ColorTool.js        # 颜色工具
│       ├── ImageTool.js        # 图片压缩工具
│       ├── MediaTool.js        # 视频压缩工具
│       ├── CalculatorTool.js   # 计算器工具
│       ├── AiTool.js           # AI 工具
│       └── TechStack.js        # 技术栈导航
└── assets/                     # 静态资源
```

## 使用方法

1. 克隆或下载项目
2. 在项目目录中运行:
   ```bash
   # 使用项目自带脚本（推荐）
   npm start

   # 或使用 Node.js 的 serve 包
   npx serve .

   # 或使用 Python 内置服务器
   python -m http.server 3000
   ```
3. 打开浏览器访问 `http://localhost:3000`

## 开发说明

### 添加新工具

1. 在 `js/tools/` 目录下创建新的工具组件文件
2. 继承 `BaseComponent` 基类
3. 实现 `render()` 方法返回 HTML 模板
4. 实现 `afterMount()` 方法绑定事件
5. 在 `app.js` 中注册路由
6. 在 `index.html` 导航栏添加链接

### 组件化架构

项目采用组件化架构，每个工具都是独立的组件：

| 组件 | 文件 | 说明 |
|------|------|------|
| `BaseComponent` | `BaseComponent.js` | 基类，提供组件生命周期管理（mount/unmount/afterMount） |
| `HomePage` | `HomePage.js` | 首页，展示工具列表和特性介绍 |
| `JsonTool` | `JsonTool.js` | JSON 格式化、压缩、验证 |
| `RegexTool` | `RegexTool.js` | 正则表达式测试和调试 |
| `EncodeTool` | `EncodeTool.js` | URL/Base64/HTML/图片/文档 编解码 |
| `ColorTool` | `ColorTool.js` | 颜色选择、转换、调色板 |
| `ImageTool` | `ImageTool.js` | 图片压缩（JPG/PNG/WebP） |
| `MediaTool` | `MediaTool.js` | 视频压缩（MP4/WebM/MOV/AVI） |
| `CalculatorTool` | `CalculatorTool.js` | 科学计算、单位换算、汇率换算 |
| `AiTool` | `AiTool.js` | AI 对话和文本生成 |
| `TechStack` | `TechStack.js` | 技术栈资源导航 |

### 响应式设计

- 使用 CSS Grid 和 Flexbox 布局
- 三个断点适配：1024px（平板）、768px（手机）、480px（小屏手机）
- 移动端友好的导航菜单（汉堡菜单）
- 上传区域、下拉框、单选按钮等组件均适配移动端

### UI 组件规范

- **上传区域**: 统一使用虚线边框 + 拖拽图标 + 提示文字结构
- **下拉框**: 自定义箭头图标，支持 hover/focus 状态
- **单选按钮**: 标签式按钮样式，选中态高亮
- **标签页**: 水平滚动，支持移动端

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 10+
- Edge 79+

## 许可证

MIT License
