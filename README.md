# Xfind - 智能论文推荐平台

<div align="center">

![Xfind Logo](https://img.shields.io/badge/Xfind-PaperSwipe-blueviolet?style=for-the-badge)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-lightgrey?style=flat-square)](/)

**为研究生提供个性化论文推荐和组会灵感的智能平台**

[在线演示](https://your-demo-link.com) • [使用文档](#使用说明) • [Android版](#android-版本)

</div>

---

## ✨ 功能特点

### 🎯 核心功能
- **智能推荐** - 基于星火大模型API，输入研究方向即可获取5篇相关论文
- **卡片交互** - 类Tinder的直观滑动操作体验
  - 👈 左滑跳过 - 快速筛选不感兴趣的论文
  - 👉 右滑保存 - 收藏到个人储存库
- **论文储存库** - 完整的论文管理系统
  - 本地持久化存储
  - 搜索和过滤功能
  - 多种排序方式
  - 论文详情查看
- **跨平台支持** - Web版和Android版，数据独立管理

### 🎨 界面设计
- 美国大厂风格的现代化UI
- 深色主题，护眼舒适
- 流畅的动画和过渡效果
- 响应式布局，完美适配移动端

## 🚀 快速开始

### Web版

#### 前置要求
- Python 3.8+
- 现代浏览器（Chrome/Firefox/Edge）

#### 安装和运行

```bash
# 1. 克隆仓库
git clone git@github.com:qwwzdyj/Xfind.git
cd Xfind

# 2. 安装依赖
pip install -r requirements.txt

# 3. 启动后端
python backend.py

# 4. 打开前端
# 方法A: 直接打开 index.html
# 方法B: 使用HTTP服务器
python -m http.server 8080
# 然后访问 http://localhost:8080
```

### Android版

#### 前置要求
- Android Studio Hedgehog (2023.1.1) 或更高版本
- Android SDK (minSdk 24, targetSdk 36)
- JDK 11+

#### 构建步骤

```bash
# 1. 打开Android项目
cd APP
# 在Android Studio中打开此文件夹

# 2. 同步Gradle
# File → Sync Project with Gradle Files

# 3. 构建并运行
# 点击 Run 按钮或 Shift+F10
```

## 📖 使用说明

### Web版使用流程

1. **搜索论文**
   - 在首页输入研究方向（例如："机器学习在医疗诊断中的应用"）
   - 点击"开始探索"

2. **浏览和选择**
   - 查看推荐的5篇论文
   - 左滑或点击 ❌ 跳过
   - 右滑或点击 ❤️ 保存

3. **管理储存库**
   - 点击右上角"X 已保存"查看储存库
   - 搜索、排序、删除论文
   - 查看详细信息

### Android版使用流程

1. **安装应用**
   - 通过Android Studio运行
   - 或安装编译好的APK

2. **搜索和浏览**
   - 与Web版相同的交互体验
   - 原生Android性能

3. **本地存储**
   - 使用DataStore持久化
   - 离线访问已保存的论文

## 🏗️ 项目结构

```
Xfind/
├── Web版/
│   ├── index.html              # 主页面
│   ├── library.html            # 储存库页面
│   ├── style.css              # 样式表
│   ├── library.css            # 储存库样式
│   ├── script.js              # 主逻辑
│   ├── library.js             # 储存库逻辑
│   ├── backend.py             # Flask后端API
│   ├── config.py              # API配置
│   └── requirements.txt       # Python依赖
│
├── Android版/
│   └── APP/
│       ├── app/
│       │   ├── src/main/
│       │   │   ├── assets/
│       │   │   │   └── index.html
│       │   │   ├── java/.../
│       │   │   │   ├── MainActivity.kt
│       │   │   │   ├── LibraryActivity.kt
│       │   │   │   ├── models/
│       │   │   │   ├── network/
│       │   │   │   └── data/
│       │   │   └── AndroidManifest.xml
│       │   └── build.gradle.kts
│       └── ...
│
├── 文档/
│   ├── README.md              # 项目说明（本文件）
│   ├── CONFIG_GUIDE.md        # 配置指南
│   ├── API_FORMAT_GUIDE.md   # API格式说明
│   ├── QUICKSTART.md          # 快速开始
│   ├── TROUBLESHOOTING.md     # 故障排除（Web）
│   └── TROUBLESHOOTING_ANDROID.md  # 故障排除（Android）
│
└── workflow/
    ├── spark_workflow_config.yml  # 星火工作流配置
    └── README.md                  # 工作流配置说明
│
└── 测试/
    ├── test_api.py            # API测试脚本
    ├── test_parse.py          # JSON解析测试
    └── expected_format.json   # 预期格式示例
```

## 🔧 配置说明

### 工作流配置

如果你需要在星火平台重新创建工作流，可以使用 `workflow/spark_workflow_config.yml`：

1. 导入到星火大模型工作流平台
2. 替换配置中的占位符（`YOUR_USER_ID`, `YOUR_APP_ID`等）
3. 获取Flow ID并配置到应用中

详细说明请查看 [workflow/README.md](workflow/README.md)

### API配置

API配置在 `config.py` 中统一管理：

```python
API_CONFIG = {
    "host": "xingchen-api.xf-yun.com",
    "api_key": "your_api_key",
    "api_secret": "your_api_secret",
    "flow_id": "your_flow_id",
    "endpoint": "/workflow/v1/chat/completions",
    "timeout": 120,
}
```

**修改配置步骤：**
1. 编辑 `config.py`
2. 保存文件
3. 重启后端服务

详细说明请参考 [CONFIG_GUIDE.md](CONFIG_GUIDE.md)

### Android版API配置

在 `app/src/main/java/.../network/ApiService.kt` 中：

```kotlin
private const val API_KEY = "your_api_key"
private const val API_SECRET = "your_api_secret"
private const val FLOW_ID = "your_flow_id"
```

## 🛠️ 技术栈

### Web版
- **前端**
  - HTML5 + CSS3
  - Vanilla JavaScript
  - 响应式设计
  
- **后端**
  - Python 3.8+
  - Flask（Web框架）
  - Retrofit（网络请求）
  - Gson（JSON解析）

### Android版
- **开发语言**: Kotlin
- **UI框架**: Jetpack Compose + WebView
- **网络层**: Retrofit 2 + OkHttp 3
- **数据层**: DataStore + Kotlin Flow
- **架构**: MVVM + Repository模式

## 📊 API格式

### 请求格式

```json
{
  "flow_id": "your_flow_id",
  "uid": "user_id",
  "parameters": {
    "AGENT_USER_INPUT": "机器学习在医疗诊断中的应用"
  },
  "ext": {
    "bot_id": "paper_recommendation",
    "caller": "workflow"
  },
  "stream": false
}
```

### 响应格式

```json
{
  "code": 0,
  "message": "Success",
  "choices": [{
    "delta": {
      "content": "{\"papers\": [...]}"
    }
  }]
}
```

### 论文数据格式

```json
{
  "papers": [
    {
      "title": "论文标题",
      "authors": "作者列表",
      "abstract": "论文摘要",
      "year": 2024,
      "venue": "会议或期刊",
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

详细说明请参考 [API_FORMAT_GUIDE.md](API_FORMAT_GUIDE.md)

## 🐛 故障排除

### 常见问题

#### Web版
- **CORS跨域错误** → 使用HTTP服务器启动前端
- **API调用失败** → 检查config.py中的API凭证
- **论文不显示** → 查看浏览器控制台和后端日志

详细解决方案请参考 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

#### Android版
- **中文路径问题** → 移动项目到英文路径或添加 `android.overridePathCheck=true`
- **网络错误** → 检查模拟器网络连接和DNS配置
- **WebView空白** → 确认assets/index.html存在

详细解决方案请参考 [TROUBLESHOOTING_ANDROID.md](APP/TROUBLESHOOTING_ANDROID.md)

## 🎯 功能演示

### Web版截图

```
主页 → 搜索 → 卡片展示 → 滑动选择 → 储存库
```

### Android版截图

```
启动 → 搜索界面 → 论文卡片 → 储存库列表
```

## 🗺️ 开发路线图

### ✅ 已完成
- [x] 论文推荐系统
- [x] 卡片滑动交互
- [x] 本地储存库
- [x] Web版完整功能
- [x] Android版基础功能
- [x] API配置管理
- [x] Few-shot提示词优化

### 🚧 进行中
- [ ] Android原生UI版本
- [ ] 性能优化

### 📋 计划中
- [ ] 用户认证系统
- [ ] 云端数据同步
- [ ] 每日推送功能
- [ ] 笔记和标注
- [ ] 导出功能（PDF/Markdown）
- [ ] 标签管理系统
- [ ] iOS版本
- [ ] 浏览器扩展

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 贡献流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

### 代码规范
- Python: PEP 8
- JavaScript: ESLint
- Kotlin: Kotlin Style Guide

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- **星火大模型** - 提供论文推荐API
- **Flask** - 轻量级Web框架
- **Jetpack Compose** - 现代Android UI
- **所有贡献者** - 感谢你们的支持

## 📞 联系方式

- **项目地址**: [https://github.com/qwwzdyj/Xfind](https://github.com/qwwzdyj/Xfind)
- **问题反馈**: [Issues](https://github.com/qwwzdyj/Xfind/issues)
- **功能建议**: [Discussions](https://github.com/qwwzdyj/Xfind/discussions)

## 🌟 Star History

如果这个项目对你有帮助，请给个 ⭐️ Star！

---

<div align="center">

**Made with ❤️ for Researchers**

[⬆ 回到顶部](#xfind---智能论文推荐平台)

</div>
