# Android版故障排除指南

## 🔍 常见问题

### 1. 显示"Hello Android!"而不是PaperSwipe界面

**原因**：代码未重新编译或MainActivity未正确加载

**解决方案**：
```bash
# 方法1：Android Studio
1. Build → Clean Project
2. Build → Rebuild Project  
3. Run → Run 'app' (或按 Shift+F10)

# 方法2：命令行
cd D:\PROGRAM\2\新建文件夹\APP
.\gradlew clean
.\gradlew assembleDebug
.\gradlew installDebug
```

### 2. WebView显示空白

**原因**：assets/index.html未加载或JavaScript未启用

**检查步骤**：
1. 查看Logcat是否有错误
2. 确认 `assets/index.html` 存在
3. 检查网络权限

**解决**：
- 确保 MainActivity.kt 中 `settings.javaScriptEnabled = true`
- 确保 AndroidManifest.xml 有 `INTERNET` 权限

### 3. Gradle同步失败

**症状**：红色错误提示，无法构建

**解决**：
```bash
# 方法1
File → Invalidate Caches → Invalidate and Restart

# 方法2
删除 .gradle 和 build 文件夹
重新 Sync Project with Gradle Files
```

### 4. 找不到符号错误

**症状**：`Cannot resolve symbol 'Paper'` 等

**原因**：Kotlin文件未正确创建或包名不匹配

**解决**：
1. 检查所有 `.kt` 文件的 package 名称是否为 `com.example.myapplication`
2. Build → Clean Project
3. File → Sync Project with Gradle Files

### 5. API调用失败

**症状**：点击搜索后loading一直转，或显示错误toast

**检查**：
1. 打开Logcat，筛选 "MainActivity"
2. 查看API响应日志
3. 确认API密钥正确

**解决**：
- 检查网络连接
- 确认 `ApiService.kt` 中的 API_KEY, API_SECRET, FLOW_ID 正确
- 查看后端是否返回 code=0

### 6. 储存库为空

**症状**：点击"已保存"进入储存库，显示空

**原因**：
- 还没有保存任何论文
- DataStore未正确初始化

**解决**：
1. 先完成一次论文选择并保存
2. 检查Logcat中的 "PaperRepository" 相关日志
3. 清除应用数据重试

## 🔧 调试技巧

### 查看WebView日志
```kotlin
// 在MainActivity.kt中添加
WebView.setWebContentsDebuggingEnabled(true)
```

然后在Chrome浏览器访问：
```
chrome://inspect/#devices
```

### 查看API请求
在Logcat中筛选：
```
Tag: MainActivity
Tag: OkHttp
```

### 查看网络请求详情
```kotlin
// ApiService.kt 中已添加 HttpLoggingInterceptor
// 会在Logcat中显示完整的请求和响应
```

## 📱 测试检查清单

- [ ] 已清理并重新构建项目
- [ ] assets/index.html 存在
- [ ] AndroidManifest.xml 包含网络权限
- [ ] API密钥配置正确
- [ ] WebView JavaScript已启用
- [ ] Logcat无错误信息
- [ ] 模拟器或真机网络连接正常

## 🚀 完整重置步骤

如果以上都不行，完全重置：

```bash
# 1. 清理所有构建文件
cd D:\PROGRAM\2\新建文件夹\APP
rm -r .gradle
rm -r app/build
rm -r build

# 2. Android Studio
File → Invalidate Caches → Invalidate and Restart

# 3. 重新打开项目
Open APP folder in Android Studio

# 4. Gradle Sync
File → Sync Project with Gradle Files

# 5. Clean & Rebuild
Build → Clean Project
Build → Rebuild Project

# 6. Run
Run → Run 'app'
```

## 📋 Logcat关键错误信息

### 错误1：WebView加载失败
```
E/MainActivity: WebResourceError: net::ERR_FILE_NOT_FOUND
```
**原因**：assets/index.html路径错误
**解决**：确认文件在 `app/src/main/assets/index.html`

### 错误2：JavaScript接口错误
```
E/chromium: [ERROR:..] Uncaught ReferenceError: Android is not defined
```
**原因**：JavascriptInterface未正确添加
**解决**：确认 `addJavascriptInterface(WebAppInterface(), "Android")`

### 错误3：网络权限拒绝
```
E/MainActivity: java.net.SocketException: Permission denied
```
**原因**：未添加INTERNET权限
**解决**：AndroidManifest.xml添加 `<uses-permission android:name="android.permission.INTERNET" />`

### 错误4：CORS或cleartext错误
```
E/chromium: [ERROR:..] net::ERR_CLEARTEXT_NOT_PERMITTED
```
**原因**：Android 9+默认禁止HTTP
**解决**：AndroidManifest.xml添加 `android:usesCleartextTraffic="true"`

## 💡 快速验证

### 测试WebView是否工作
临时修改 MainActivity.kt：
```kotlin
webView.loadData("<html><body><h1>Test</h1></body></html>", "text/html", "UTF-8")
```

如果显示"Test"，说明WebView正常，问题在assets加载。

### 测试API是否工作
查看Logcat，搜索 "API响应"，应该看到：
```
D/MainActivity: API响应: code=0
D/MainActivity: Content前100字符: { "papers": [...]
```

## 📞 需要帮助？

1. **导出Logcat日志**：
   - Logcat → 右键 → Save As
   - 发送完整日志

2. **检查关键信息**：
   - 应用是否成功安装
   - 模拟器Android版本
   - 是否有网络连接

3. **提供错误截图**：
   - 应用界面截图
   - Logcat错误信息
   - Build输出

---

**记住**：每次修改代码后必须重新编译和运行！

