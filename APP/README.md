# PaperSwipe Android App

📱 Android版本的PaperSwipe论文推荐应用

## 🎯 功能特点

- ✅ WebView加载现有前端代码（所有逻辑完全不变）
- ✅ 原生Android储存库界面（Jetpack Compose）
- ✅ 本地数据持久化（DataStore）
- ✅ 网络请求（Retrofit + OkHttp）
- ✅ 支持Android 7.0+ (API 24+)

## 📂 项目结构

```
app/
├── src/main/
│   ├── assets/
│   │   └── index.html          # WebView加载的前端页面
│   ├── java/com/example/myapplication/
│   │   ├── MainActivity.kt     # 主Activity（WebView）
│   │   ├── LibraryActivity.kt  # 储存库Activity
│   │   ├── PaperSwipeApp.kt    # Application类
│   │   ├── models/
│   │   │   └── Paper.kt        # 数据模型
│   │   ├── network/
│   │   │   └── ApiService.kt   # API服务
│   │   └── data/
│   │       └── PaperRepository.kt # 数据存储
│   ├── res/
│   │   ├── values/
│   │   │   └── strings.xml     # 字符串资源
│   │   └── ...
│   └── AndroidManifest.xml     # 清单文件
└── build.gradle.kts            # 构建配置
```

## 🔧 技术栈

### 核心技术
- **Kotlin** - 开发语言
- **Jetpack Compose** - 现代UI框架
- **WebView** - 加载HTML/CSS/JS

### 网络层
- **Retrofit 2** - RESTful API客户端
- **OkHttp 3** - HTTP客户端
- **Gson** - JSON解析

### 数据层
- **DataStore** - 本地数据存储
- **Kotlin Coroutines** - 异步编程
- **Flow** - 响应式数据流

## 🚀 构建和运行

### 前置条件
- Android Studio Hedgehog (2023.1.1) 或更高版本
- JDK 11 或更高版本
- Android SDK (compileSdk 36, minSdk 24)

### 构建步骤

1. **打开项目**
   ```bash
   # 在Android Studio中打开 APP 文件夹
   ```

2. **同步Gradle**
   ```bash
   # 点击 File > Sync Project with Gradle Files
   # 或点击工具栏的 Sync 按钮
   ```

3. **构建APK**
   ```bash
   # 命令行方式
   cd D:\PROGRAM\2\新建文件夹\APP
   .\gradlew assembleDebug
   
   # 或在Android Studio中
   # Build > Build Bundle(s) / APK(s) > Build APK(s)
   ```

4. **安装到设备**
   ```bash
   # 连接Android设备或启动模拟器
   # 点击 Run 按钮 (绿色播放按钮)
   ```

## 📱 使用说明

### 主界面
1. 启动应用，看到搜索界面
2. 输入研究方向（例如："机器学习在医疗诊断中的应用"）
3. 点击"开始探索"

### 浏览论文
1. 查看返回的5篇论文
2. 点击 ✕ 跳过论文
3. 点击 ♥ 保存论文
4. 完成所有论文后自动保存

### 查看储存库
1. 点击右上角"X 已保存"
2. 查看所有保存的论文
3. 可以删除不需要的论文

## 🔑 API配置

API配置在 `ApiService.kt` 中：

```kotlin
private const val API_KEY = "a070a6ba2fdbfb3c9334e99830f9cdec"
private const val API_SECRET = "OWJmYTg4MGY3NTEzYTcwNTA1ODM5YmRj"
private const val FLOW_ID = "7390399875893088258"
```

如需修改，编辑该文件并重新构建。

## 📐 架构说明

### WebView方式
- **优点**：快速开发，逻辑完全不变，前端代码直接复用
- **实现**：MainActivity使用WebView加载assets中的HTML
- **通信**：通过JavascriptInterface实现Android与JS互调

### 数据流
```
用户输入 → WebView(JS) → JavascriptInterface 
    → ApiService(Retrofit) → 星火API
    → 返回JSON → 解析 → WebView显示
    → 用户选择 → Repository(DataStore) → 本地存储
```

### 储存方式
- **前端**：WebView中的临时状态
- **后端**：DataStore Preferences（键值对）
- **格式**：JSON字符串存储

## 🐛 常见问题

### 1. 编译错误
```bash
# 清理构建
.\gradlew clean

# 重新构建
.\gradlew build
```

### 2. WebView不加载
- 检查网络权限
- 查看Logcat日志
- 确认assets/index.html存在

### 3. API调用失败
- 检查网络连接
- 确认API凭证正确
- 查看Logcat中的API响应

### 4. 数据不保存
- 检查DataStore初始化
- 查看Logcat错误日志
- 清除应用数据重试

## 📊 性能优化

### 已实现
- ✅ 异步网络请求（Coroutines）
- ✅ WebView缓存
- ✅ 懒加载列表（LazyColumn）

### 待优化
- [ ] 图片缓存（如果添加图片）
- [ ] 数据库替代DataStore（大量数据）
- [ ] 离线模式

## 🔄 版本历史

### v1.0.0 (当前)
- ✅ WebView集成前端代码
- ✅ API调用和数据解析
- ✅ 本地数据存储
- ✅ 储存库界面
- ✅ 支持Android 7.0+

## 🚧 开发计划

### 近期计划
- [ ] 优化UI动画
- [ ] 添加下拉刷新
- [ ] 搜索历史记录
- [ ] 分享功能

### 长期计划
- [ ] 纯原生Compose UI版本
- [ ] 论文详情页
- [ ] 标签系统
- [ ] 云端同步
- [ ] Material You主题

## 📝 开发注意事项

### WebView安全
- 已启用JavaScript（必需）
- 已设置JavascriptInterface
- 建议添加URL白名单

### 网络安全
- 使用HTTPS
- 添加证书pin
ning（生产环境）
- 混淆API密钥

### 数据安全
- DataStore加密（考虑）
- 防止SQL注入（如使用数据库）
- 用户隐私保护

## 📄 许可证

MIT License

## 🙏 致谢

- 前端代码来自Web版PaperSwipe
- API由星火大模型提供
- UI参考Material Design 3

## 📧 联系方式

如有问题请查看Logcat日志或提交Issue。

