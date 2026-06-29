# 开发工具集合

一个基于纯HTML/CSS/JavaScript的开发工具网站，采用组件化架构设计。

## 功能特性

- **JSON工具**: 格式化、压缩、验证JSON数据
- **正则表达式工具**: 测试和调试正则表达式
- **编码工具**: URL编码、Base64编码解码、HTML实体编码
- **颜色工具**: 颜色选择、转换、调色板生成

## 技术栈

- HTML5
- CSS3 (使用CSS变量)
- JavaScript (ES6+)
- 组件化架构设计

## 项目结构

```
dev-tools-site/
├── index.html              # 主页面
├── css/
│   ├── main.css            # 全局样式
│   └── components.css      # 组件样式
├── js/
│   ├── app.js              # 主应用逻辑
│   ├── components/
│   │   ├── BaseComponent.js    # 组件基类
│   │   └── HomePage.js         # 主页组件
│   └── tools/
│       ├── JsonTool.js         # JSON工具组件
│       ├── RegexTool.js        # 正则表达式工具组件
│       ├── EncodeTool.js       # 编码工具组件
│       └── ColorTool.js        # 颜色工具组件
└── assets/                 # 静态资源
```

## 使用方法

1. 克隆或下载项目
2. 在项目目录中运行:
   ```bash
   # 使用Python内置服务器
   python -m http.server 8000
   
   # 或使用Node.js的serve包
   npx serve .
   
   # 或使用项目自带的脚本
   npm start
   ```
3. 打开浏览器访问 `http://localhost:8000`

## 开发说明

### 添加新工具

1. 在 `js/tools/` 目录下创建新的工具组件文件
2. 继承 `BaseComponent` 基类
3. 实现 `render()` 方法返回HTML模板
4. 在 `app.js` 中注册路由
5. 在导航栏添加链接

### 组件化架构

项目采用组件化架构，每个工具都是独立的组件：

- `BaseComponent`: 基类，提供组件生命周期管理
- `HomePage`: 主页组件
- `JsonTool`: JSON工具组件
- `RegexTool`: 正则表达式工具组件
- `EncodeTool`: 编码工具组件
- `ColorTool`: 颜色工具组件

### 响应式设计

- 使用CSS Grid和Flexbox布局
- 媒体查询适配不同屏幕尺寸
- 移动端友好的导航菜单

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 10+
- Edge 79+

## 许可证

MIT License