import { BaseComponent } from '../components/BaseComponent.js';

const FE_DATA = {
    '语言': [
        { name: 'HTML', desc: '网页结构标记语言，所有网站的基础', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML', icon: 'Ht', tags: 'html 标记语言 网页 结构' },
        { name: 'CSS', desc: '网页样式描述语言，控制页面布局与视觉效果', url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS', icon: 'Cs', tags: 'css 样式 语言 布局' },
        { name: 'JavaScript', desc: '前端核心语言，浏览器原生支持，生态最丰富', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', icon: 'JS', tags: 'javascript js 语言 前端' },
        { name: 'TypeScript', desc: 'JavaScript 的超集，添加静态类型检查，提升代码质量', url: 'https://www.typescriptlang.org/', icon: 'Ts', tags: 'typescript 类型 js 语言' },
        { name: 'Dart', desc: 'Google 出品，Flutter 开发语言，编译为高性能原生代码', url: 'https://dart.dev/', icon: 'Dt', tags: 'dart 语言 flutter 跨平台' },
        { name: 'WebAssembly', desc: '浏览器级字节码，C/C++/Rust 等语言可编译运行', url: 'https://webassembly.org/', icon: 'Wa', tags: 'wasm webassembly 底层 性能' },
        { name: 'CoffeeScript', desc: '编译为 JavaScript 的简洁语言，语法更优雅', url: 'https://coffeescript.org/', icon: 'Cf', tags: 'coffeescript 语言 编译' },
        { name: 'Elm', desc: '函数式前端语言，零运行时异常', url: 'https://elm-lang.org/', icon: 'El', tags: 'elm 函数式 语言 前端' },
    ],
    '框架': [
        { name: 'Vue.js', desc: '渐进式 JavaScript 框架，易学易用，国内最流行', url: 'https://cn.vuejs.org/', icon: 'V', tags: 'vue 前端 框架 mvvm' },
        { name: 'React', desc: 'Meta 出品，用于构建用户界面的 JS 库，全球使用最广泛', url: 'https://react.dev/', icon: 'R', tags: 'react 前端 框架' },
        { name: 'Angular', desc: 'Google 出品的企业级前端框架，适合大型 SPA 项目', url: 'https://angular.cn/', icon: 'A', tags: 'angular 前端 框架' },
        { name: 'Svelte', desc: '编译型前端框架，无虚拟 DOM，打包体积小，性能极致', url: 'https://svelte.dev/', icon: 'S', tags: 'svelte 前端 框架' },
    ],
    '全栈框架': [
        { name: 'Next.js', desc: 'React 全栈框架，支持 SSR/SSG/ISR，Vercel 出品', url: 'https://nextjs.org/', icon: 'N', tags: 'nextjs react 全栈 ssr' },
        { name: 'Nuxt', desc: 'Vue 全栈框架，支持服务端渲染，开箱即用', url: 'https://nuxt.com/', icon: 'Nu', tags: 'nuxt vue 全栈 ssr' },
    ],
    '跨平台': [
        { name: 'UniApp', desc: '一套代码编译到 iOS/Android/小程序/Web', url: 'https://uniapp.dcloud.net.cn/', icon: 'U', tags: 'uniapp 跨平台 小程序' },
        { name: 'Taro', desc: '京东出品，支持 React/Vue 多端统一开发', url: 'https://taro.jd.com/', icon: 'Ta', tags: 'taro 跨平台 小程序' },
        { name: 'Flutter', desc: 'Google 跨平台 UI 框架，Dart 语言，一套代码编译多端', url: 'https://flutter.dev/', icon: 'Fl', tags: 'flutter 跨平台 移动端 dart' },
        { name: 'Electron', desc: '使用 Web 技术构建桌面应用，VS Code/Slack 基于此', url: 'https://www.electronjs.org/', icon: 'El', tags: 'electron 桌面 应用' },
    ],
    '构建工具': [
        { name: 'Vite', desc: '下一代前端构建工具，基于 ESM，极速冷启动', url: 'https://cn.vitejs.dev/', icon: 'Vi', tags: 'vite 构建 工具 打包' },
        { name: 'Webpack', desc: '经典的静态模块打包工具，前端工程化核心', url: 'https://webpack.js.org/', icon: 'W', tags: 'webpack 打包 工具 工程化' },
    ],
    'UI 库': [
        { name: 'Ant Design', desc: '蚂蚁金服出品的企业级 UI 组件库', url: 'https://ant.design/', icon: 'Ad', tags: 'antd ui 组件库' },
        { name: 'Element Plus', desc: '基于 Vue 3 的桌面端 UI 组件库', url: 'https://element-plus.org/', icon: 'Ep', tags: 'element ui 组件库 vue' },
        { name: 'Vant', desc: '有赞出品的轻量级移动端 Vue 组件库', url: 'https://vant-ui.github.io/vant/', icon: 'Vt', tags: 'vant ui 组件库 移动端 vue' },
        { name: 'uView', desc: '多平台兼容的 uni-app UI 组件库', url: 'https://uviewui.com/', icon: 'Uv', tags: 'uview ui 组件库 uniapp 移动端' },
        { name: 'uView Plus', desc: 'uView 的 Vue3 版本，支持 uni-app X', url: 'https://uviewui.com/', icon: 'Up', tags: 'uview plus ui 组件库 vue3 uniapp' },
        { name: 'Naive UI', desc: 'Vue 3 组件库，TypeScript 友好，主题定制强', url: 'https://www.naiveui.com/', icon: 'Nv', tags: 'naive ui 组件库 vue' },
        { name: 'Arco Design', desc: '字节跳动出品的企业级设计系统', url: 'https://arco.design/', icon: 'Ar', tags: 'arco design ui 组件库 字节' },
        { name: 'NutUI', desc: '京东出品的移动端 Vue 组件库', url: 'https://nutui.jd.com/', icon: 'Nu', tags: 'nutui ui 组件库 移动端 vue' },
        { name: 'Vuetify', desc: 'Vue 的 Material Design 组件框架', url: 'https://vuetifyjs.com/', icon: 'Vu', tags: 'vuetify ui 组件库 vue material' },
        { name: 'Tailwind CSS', desc: '实用优先的原子化 CSS 框架，快速构建现代化 UI', url: 'https://tailwindcss.com/', icon: 'Tw', tags: 'tailwind css 样式 ui' },
        { name: 'WeUI', desc: '微信官方设计团队出品的 UI 库', url: 'https://weui.io/', icon: 'We', tags: 'weui ui 组件库 微信 小程序' },
    ],
};

const ICON_DATA = {
    '图标库': [
        { name: '阿里矢量图标库', desc: '国内最大的图标资源库，支持自定义下载', url: 'https://www.iconfont.cn/', icon: 'Al', tags: 'iconfont 阿里 图标 svg' },
        { name: 'Iconify', desc: '统一图标框架，集成 100+ 图标库', url: 'https://iconify.design/', icon: 'Ic', tags: 'iconify 图标 框架 统一' },
        { name: 'Heroicons', desc: 'Tailwind CSS 团队出品的 SVG 图标库', url: 'https://heroicons.com/', icon: 'He', tags: 'heroicons 图标 svg tailwind' },
        { name: 'Lucide', desc: '简洁美观的开源图标库，Feather 的继承者', url: 'https://lucide.dev/', icon: 'Lu', tags: 'lucide 图标 开源 简洁' },
        { name: 'Phosphor Icons', desc: '灵活的开源图标库，6 种风格可选', url: 'https://phosphoricons.com/', icon: 'Ph', tags: 'phosphor 图标 开源 风格' },
        { name: 'Remix Icon', desc: '开源图标库，风格统一，数量丰富', url: 'https://remixicon.com/', icon: 'Rm', tags: 'remix 图标 开源' },
        { name: 'Material Icons', desc: 'Google Material Design 官方图标库', url: 'https://fonts.google.com/icons', icon: 'Mi', tags: 'material icons 图标 google' },
        { name: 'Font Awesome', desc: '最流行的 Web 图标字体库', url: 'https://fontawesome.com/', icon: 'Fa', tags: 'font awesome 图标 字体' },
    ],
};

const PLATFORM_DATA = {
    '公众平台': [
        { name: '微信公众平台', desc: '微信公众号管理、内容发布、用户运营', url: 'https://mp.weixin.qq.com/', icon: 'Mp', tags: '微信 公众号 公众平台 内容 运营' },
        { name: '微信小程序', desc: '微信小程序开发与管理平台', url: 'https://mp.weixin.qq.com/', icon: 'Wm', tags: '微信 小程序 开发 管理' },
        { name: '百度智能小程序', desc: '百度搜索生态的小程序平台', url: 'https://smartprogram.baidu.com/', icon: 'Bs', tags: '百度 小程序 智能 搜索' },
        { name: '抖音小程序', desc: '抖音/字节跳动小程序开放平台', url: 'https://developer.open-douyin.com/', icon: 'Dy', tags: '抖音 小程序 字节跳动' },
        { name: '支付宝小程序', desc: '支付宝生活号/小程序管理平台', url: 'https://open.alipay.com/', icon: 'Zx', tags: '支付宝 小程序 生活号' },
        { name: 'QQ 小程序', desc: 'QQ 小程序开发与管理平台', url: 'https://q.qq.com/', icon: 'Qq', tags: 'qq 小程序 腾讯' },
        { name: '快手小程序', desc: '快手小程序开放平台', url: 'https://open.kuaishou.com/', icon: 'Ks', tags: '快手 小程序 短视频' },
        { name: '飞书开放平台', desc: '飞书应用开发、机器人、审批流等', url: 'https://open.feishu.cn/', icon: 'Fs', tags: '飞书 开放平台 企业 应用' },
        { name: '钉钉开放平台', desc: '钉钉应用开发、工作台、审批流等', url: 'https://open.dingtalk.com/', icon: 'Dk', tags: '钉钉 开放平台 企业 应用' },
        { name: '企业微信', desc: '企业微信应用开发与管理', url: 'https://open.work.weixin.qq.com/', icon: 'Qw', tags: '企业微信 开放平台 企业 应用' },
    ],
    '开放平台': [
        { name: '微信开放平台', desc: '微信公众号/小程序/开放能力接入', url: 'https://open.weixin.qq.com/', icon: 'Wx', tags: '微信 开放平台 小程序 公众号' },
        { name: '支付宝开放平台', desc: '支付宝小程序/生活号/支付接入', url: 'https://open.alipay.com/', icon: 'Zf', tags: '支付宝 开放平台 小程序 支付' },
        { name: '高德地图开放平台', desc: '地图/定位/导航/轨迹 等 LBS 服务', url: 'https://lbs.amap.com/', icon: 'Gd', tags: '高德 地图 开放平台 lbs 定位' },
        { name: '百度地图开放平台', desc: '地图/定位/轨迹/地理编码 等服务', url: 'https://lbsyun.baidu.com/', icon: 'Bd', tags: '百度 地图 开放平台 lbs 定位' },
        { name: '腾讯地图开放平台', desc: '地图/定位/导航 等位置服务', url: 'https://lbs.qq.com/', icon: 'Tx', tags: '腾讯 地图 开放平台 lbs 定位' },
    ],
    '云服务': [
        { name: '腾讯云', desc: '云计算/云存储/CDN/域名 等服务', url: 'https://cloud.tencent.com/', icon: 'Ty', tags: '腾讯云 云服务 云存储 cdn' },
        { name: '阿里云', desc: '国内最大的云服务平台，电商级基础设施', url: 'https://www.aliyun.com/', icon: 'Ay', tags: '阿里云 云服务 云存储 cdn' },
        { name: '华为云', desc: '华为云服务，AI/大数据/物联网', url: 'https://www.huaweicloud.com/', icon: 'Hw', tags: '华为云 云服务 ai 物联网' },
        { name: '七牛云', desc: '专注音视频/图片/存储的云服务', url: 'https://www.qiniu.com/', icon: 'Qn', tags: '七牛云 云存储 音视频 图片' },
    ],
};

const BE_DATA = {
    '语言': [
        { name: 'Java', desc: '企业级编程语言，生态最成熟，后端开发首选', url: 'https://www.oracle.com/cn/java/technologies/downloads/', icon: 'J', tags: 'java 后端 语言 企业' },
        { name: 'Python', desc: '简洁优雅，AI/数据分析/爬虫首选语言', url: 'https://www.python.org/', icon: 'Py', tags: 'python 语言 ai 数据' },
        { name: 'Go', desc: 'Google 出品，语法简洁，高并发后端首选', url: 'https://go.dev/', icon: 'Go', tags: 'go golang 后端 语言 高并发' },
        { name: 'Rust', desc: '高性能系统语言，内存安全，无 GC', url: 'https://www.rust-lang.org/', icon: 'Rs', tags: 'rust 系统 语言 高性能' },
        { name: 'Node.js', desc: '基于 V8 引擎的 JS 运行时，前后端语言统一', url: 'https://nodejs.org/', icon: 'No', tags: 'nodejs js 运行时 后端' },
    ],
    '框架': [
        { name: 'Spring Boot', desc: 'Java 微服务框架，约定优于配置，快速构建后端', url: 'https://spring.io/projects/spring-boot', icon: 'Sb', tags: 'spring java 微服务 框架' },
    ],
    '数据库': [
        { name: 'MySQL', desc: '最流行的开源关系型数据库，Web 应用标配', url: 'https://www.mysql.com/', icon: 'My', tags: 'mysql 数据库 sql 关系型' },
        { name: 'PostgreSQL', desc: '功能最强大的开源关系型数据库，支持 JSON/地理数据', url: 'https://www.postgresql.org/', icon: 'Pg', tags: 'postgresql 数据库 sql 关系型' },
        { name: 'Redis', desc: '高速内存数据库，常用作缓存/消息队列/会话存储', url: 'https://redis.io/', icon: 'Re', tags: 'redis 缓存 内存数据库 nosql' },
        { name: 'MongoDB', desc: '流行的 NoSQL 文档数据库，灵活的 JSON 存储', url: 'https://www.mongodb.com/', icon: 'Mb', tags: 'mongodb nosql 文档数据库' },
    ],
    '运维部署': [
        { name: 'Docker', desc: '容器化平台，实现应用环境隔离，一次构建到处运行', url: 'https://www.docker.com/', icon: 'Dk', tags: 'docker 容器 部署 运维' },
        { name: 'Kubernetes', desc: '容器编排平台，自动化部署/扩缩容/服务发现', url: 'https://kubernetes.io/', icon: 'K8', tags: 'kubernetes k8s 编排 容器' },
        { name: 'Nginx', desc: '高性能 Web 服务器/反向代理/负载均衡', url: 'https://nginx.org/', icon: 'Ng', tags: 'nginx 服务器 反向代理' },
        { name: 'Git', desc: '分布式版本控制系统，代码管理与协作的基础设施', url: 'https://git-scm.com/', icon: 'Gt', tags: 'git 版本控制 代码管理' },
        { name: 'Linux', desc: '开源操作系统，服务器/嵌入式/超级计算机的基石', url: 'https://www.kernel.org/', icon: 'Lx', tags: 'linux 操作系统 服务器' },
    ],
    'API': [
        { name: 'GraphQL', desc: 'API 查询语言，按需获取数据，取代 REST 的新方案', url: 'https://graphql.org/', icon: 'Gq', tags: 'graphql api 查询' },
    ],
};

const GIT_DATA = {
    '代码托管': [
        { name: 'GitHub', desc: '全球最大的代码托管平台，开源社区首选', url: 'https://github.com/', icon: 'Gh', tags: 'github git 代码 托管 仓库 开源' },
        { name: 'GitLab', desc: '自托管的 Git 平台，CI/CD 集成完善', url: 'https://gitlab.com/', icon: 'Gl', tags: 'gitlab git 代码 托管 仓库 devops' },
        { name: 'Gitee', desc: '国内代码托管平台，访问速度快', url: 'https://gitee.com/', icon: 'Ge', tags: 'gitee git 代码 托管 仓库 国内' },
        { name: 'Bitbucket', desc: 'Atlassian 出品，与 Jira/Confluence 深度集成', url: 'https://bitbucket.org/', icon: 'Bb', tags: 'bitbucket git 代码 托管 仓库' },
        { name: 'Coding', desc: '腾讯云旗下 DevOps 平台，企业级代码管理', url: 'https://coding.net/', icon: 'Cd', tags: 'coding git 代码 托管 仓库 腾讯' },
        { name: 'Codeberg', desc: '非营利的开源代码托管平台，社区驱动', url: 'https://codeberg.org/', icon: 'Cb', tags: 'codeberg git 代码 托管 仓库 开源' },
    ],
    'Git 工具': [
        { name: 'Git', desc: '分布式版本控制系统，代码管理与协作的基础设施', url: 'https://git-scm.com/', icon: 'Gt', tags: 'git 版本控制 代码管理 工具' },
        { name: 'GitHub Desktop', desc: 'GitHub 官方桌面客户端，可视化 Git 操作', url: 'https://desktop.github.com/', icon: 'GD', tags: 'github desktop 客户端 git 工具' },
        { name: 'SourceTree', desc: '免费的 Git/Mercurial 桌面客户端，功能强大', url: 'https://www.sourcetreeapp.com/', icon: 'ST', tags: 'sourcetree 客户端 git 工具' },
        { name: 'TortoiseGit', desc: 'Windows 下的 Git 客户端，集成右键菜单', url: 'https://tortoisegit.org/', icon: 'TG', tags: 'tortoisegit 客户端 git 工具 windows' },
        { name: 'GitKraken', desc: '跨平台 Git 客户端，界面美观，功能丰富', url: 'https://www.gitkraken.com/', icon: 'GK', tags: 'gitkraken 客户端 git 工具 跨平台' },
    ],
    'CI/CD': [
        { name: 'GitHub Actions', desc: 'GitHub 内置的 CI/CD 平台，自动化工作流', url: 'https://github.com/features/actions', icon: 'GA', tags: 'github actions ci cd 自动化' },
        { name: 'GitLab CI/CD', desc: 'GitLab 内置的 CI/CD 工具，与代码仓库深度集成', url: 'https://docs.gitlab.com/ee/ci/', icon: 'GC', tags: 'gitlab ci cd 自动化 devops' },
        { name: 'Jenkins', desc: '开源的自动化服务器，插件生态丰富', url: 'https://www.jenkins.io/', icon: 'Jk', tags: 'jenkins ci cd 自动化 服务器' },
        { name: 'Travis CI', desc: '云端 CI 服务，与 GitHub 集成紧密', url: 'https://www.travis-ci.com/', icon: 'TC', tags: 'travis ci 云 服务 自动化' },
    ],
};

const BLOG_DATA = {
    '技术社区': [
        { name: 'CSDN', desc: '国内最大的 IT 社区，技术文章资源丰富', url: 'https://www.csdn.net/', icon: 'Cs', tags: 'csdn 博客 技术社区 国内' },
        { name: '掘金', desc: '高质量技术社区，前端/后端/移动端内容精选', url: 'https://juejin.cn/', icon: 'Jj', tags: '掘金 博客 技术社区 国内' },
        { name: '博客园', desc: '老牌技术博客平台，.NET/Java 等开发者聚集地', url: 'https://www.cnblogs.com/', icon: 'By', tags: '博客园 博客 技术社区 国内' },
        { name: 'SegmentFault', desc: '国内技术问答社区，类似 Stack Overflow', url: 'https://segmentfault.com/', icon: 'Sf', tags: '思否 segmentfault 问答 技术社区' },
        { name: 'V2EX', desc: '创意工作者社区，技术/设计/创业话题活跃', url: 'https://www.v2ex.com/', icon: 'Vx', tags: 'v2ex 社区 技术 讨论' },
        { name: '开源中国', desc: '国内开源技术社区，开源项目资讯与聚合', url: 'https://www.oschina.net/', icon: 'Osc', tags: '开源中国 oschina 开源 社区' },
    ],
    'CMS 建站': [
        { name: 'WordPress', desc: '全球最流行的 CMS，插件生态丰富，小白也能建站', url: 'https://wordpress.org/', icon: 'Wp', tags: 'wordpress cms 博客 建站' },
        { name: 'Ghost', desc: '专业发布平台，现代设计，适合内容创作者', url: 'https://ghost.org/', icon: 'Gs', tags: 'ghost 博客 发布' },
        { name: 'Grav', desc: '基于 PHP 的 Flat-File CMS，无需数据库，轻量快速', url: 'https://getgrav.org/', icon: 'Gv', tags: 'grav cms 博客 php' },
        { name: 'Drupal', desc: '企业级开源 CMS，高度可扩展，适合复杂网站', url: 'https://www.drupal.org/', icon: 'Dr', tags: 'drupal cms 博客 建站' },
        { name: 'Typecho', desc: 'PHP 轻量级博客程序，简单高效，国产开源', url: 'https://typecho.org/', icon: 'Tc', tags: 'typecho 博客 php' },
    ],
    '静态博客': [
        { name: 'Hexo', desc: '基于 Node.js 的静态博客框架，快速简洁，主题丰富', url: 'https://hexo.io/', icon: 'Hx', tags: 'hexo 博客 静态 nodejs' },
        { name: 'Hugo', desc: 'Go 语言编写的静态站点生成器，速度极快', url: 'https://gohugo.io/', icon: 'Hu', tags: 'hugo 博客 静态 go' },
        { name: 'Jekyll', desc: 'Ruby 编写的静态博客生成器，GitHub Pages 原生支持', url: 'https://jekyllrb.com/', icon: 'Jk', tags: 'jekyll 博客 静态 ruby' },
        { name: 'VitePress', desc: 'Vite 驱动，Vue 驱动的文档/博客生成器', url: 'https://vitepress.dev/', icon: 'Vp', tags: 'vitepress 博客 文档 vue' },
        { name: 'Docusaurus', desc: 'Meta 出品的文档网站生成器，React 驱动', url: 'https://docusaurus.io/', icon: 'Ds', tags: 'docusaurus 博客 文档 react' },
        { name: 'Astro', desc: '内容驱动的 Web 框架，零 JS 默认，构建极速', url: 'https://astro.build/', icon: 'As', tags: 'astro 博客 静态 框架' },
    ],
    '协作工具': [
        { name: 'Notion', desc: '全能协作工具，可搭建知识库/博客/项目管理', url: 'https://www.notion.so/', icon: 'Nn', tags: 'notion 笔记 知识库 博客' },
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
                    <div class="tool-item-icon ${colorClass.replace('-tech', '-icon')}">${l.icon}</div>
                    <h3>${l.name}</h3>
                    <p>${l.desc}</p>
                    <span class="tech-link-hint">访问官网 →</span>
                </a>`;
        });
        html += '</div>';
    }
    return html;
}

function getAllItems(data) {
    const items = [];
    for (const list of Object.values(data)) {
        items.push(...list);
    }
    return items;
}

export class TechStack extends BaseComponent {
    constructor() {
        super();
    }

    render() {
        const feHtml = renderCategory(FE_DATA, 'fe-tech');
        const beHtml = renderCategory(BE_DATA, 'be-tech');
        const blogHtml = renderCategory(BLOG_DATA, 'blog-tech');
        const gitHtml = renderCategory(GIT_DATA, 'git-tech');
        const iconHtml = renderCategory(ICON_DATA, 'icon-tech');
        const platformHtml = renderCategory(PLATFORM_DATA, 'platform-tech');

        return `
            <div class="tool-page">
                <div class="tool-section" style="grid-column: 1 / -1;">
                    <h2>技术栈导航</h2>
                    <p>常用前端 / 后端 / 博客 / Git / 图标库 / 第三方平台在线文档与官网地址</p>

                    <div class="search-box" style="max-width:480px; margin-bottom:20px;">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="techSearch" class="search-input" placeholder="搜索技术栈，如 Vue、Docker、GitHub...">
                        <span class="search-clear" id="techClear" style="display:none;">✕</span>
                    </div>

                    <div class="tabs tech-tabs-scroll">
                        <button class="tab-btn active" data-tab="fe">前端</button>
                        <button class="tab-btn" data-tab="be">后端</button>
                        <button class="tab-btn" data-tab="blog">博客</button>
                        <button class="tab-btn" data-tab="git">Git</button>
                        <button class="tab-btn" data-tab="icon">图标库</button>
                        <button class="tab-btn" data-tab="platform">第三方平台</button>
                    </div>

                    <div class="tab-content active" id="fe-tab">${feHtml}</div>
                    <div class="tab-content" id="be-tab">${beHtml}</div>
                    <div class="tab-content" id="blog-tab">${blogHtml}</div>
                    <div class="tab-content" id="git-tab">${gitHtml}</div>
                    <div class="tab-content" id="icon-tab">${iconHtml}</div>
                    <div class="tab-content" id="platform-tab">${platformHtml}</div>

                    <div class="search-empty" id="techEmpty" style="display:none;">
                        <p>没有找到匹配的技术栈</p>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        const tabBtns = this.querySelectorAll('.tabs .tab-btn');
        tabBtns.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                this.querySelector(`#${btn.getAttribute('data-tab')}-tab`).classList.add('active');
            });
        });

        const input = this.querySelector('#techSearch');
        const clearBtn = this.querySelector('#techClear');
        const empty = this.querySelector('#techEmpty');
        const allItems = this.querySelectorAll('.tech-item');

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

            this.querySelectorAll('.tech-category-title').forEach(title => {
                const grid = title.nextElementSibling;
                if (!grid) return;
                const visibleItems = grid.querySelectorAll('.tech-item:not([style*="display: none"])');
                title.style.display = visibleItems.length === 0 ? 'none' : '';
            });

            empty.style.display = q && found === 0 ? '' : 'none';
        });

        this.addEventListener(clearBtn, 'click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            allItems.forEach(item => { item.style.display = ''; });
            this.querySelectorAll('.tech-category-title').forEach(t => { t.style.display = ''; });
            empty.style.display = 'none';
            input.focus();
        });
    }
}