# 安全配置指南

## ⚠️ API密钥安全

### 重要提醒
**永远不要**将API密钥提交到Git仓库！

### 配置步骤

#### Web版

1. **复制示例配置文件**
```bash
cp config.example.py config.py
```

2. **编辑config.py，填入真实API信息**
```python
API_CONFIG = {
    "api_key": "你的真实API_KEY",
    "api_secret": "你的真实API_SECRET",
    "flow_id": "你的真实FLOW_ID",
}
```

3. **使用环境变量（推荐）**
```bash
# Linux/Mac
export XFIND_API_KEY="your_api_key"
export XFIND_API_SECRET="your_api_secret"
export XFIND_FLOW_ID="your_flow_id"

# Windows PowerShell
$env:XFIND_API_KEY="your_api_key"
$env:XFIND_API_SECRET="your_api_secret"
$env:XFIND_FLOW_ID="your_flow_id"
```

#### Android版

1. **方法1: 使用local.properties（推荐）**

在 `APP/local.properties` 中添加：
```properties
xfind.api.key=你的API_KEY
xfind.api.secret=你的API_SECRET
xfind.flow.id=你的FLOW_ID
```

然后在 `build.gradle.kts` 中读取：
```kotlin
android {
    defaultConfig {
        val properties = Properties()
        properties.load(project.rootProject.file("local.properties").inputStream())
        
        buildConfigField("String", "API_KEY", "\"${properties.getProperty("xfind.api.key")}\"")
        buildConfigField("String", "API_SECRET", "\"${properties.getProperty("xfind.api.secret")}\"")
        buildConfigField("String", "FLOW_ID", "\"${properties.getProperty("xfind.flow.id")}\"")
    }
}
```

2. **方法2: 直接编辑ApiConfig.kt**

编辑 `APP/app/src/main/java/.../network/ApiConfig.kt`：
```kotlin
const val API_KEY = "你的真实API_KEY"
const val API_SECRET = "你的真实API_SECRET"
const val FLOW_ID = "你的真实FLOW_ID"
```

⚠️ 注意：`ApiConfig.kt`也应该添加到.gitignore

### 如果密钥已泄露

如果你已经将密钥提交到Git：

1. **立即重新生成密钥**
   - 访问星火API平台
   - 重新生成API Key和Secret

2. **从Git历史中删除**
```bash
# 删除最后一次提交（如果还没push）
git reset --hard HEAD~1

# 或使用git filter-branch删除历史
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch config.py" \
  --prune-empty --tag-name-filter cat -- --all
```

3. **强制推送（如果已经push）**
```bash
git push origin main --force
```

### .gitignore 配置

确保以下文件在 `.gitignore` 中：
```
# 敏感配置
config.py
local.properties
ApiConfig.kt
.env
*.key
*.secret
```

### 最佳实践

1. ✅ 使用环境变量
2. ✅ 使用 `.gitignore` 排除配置文件
3. ✅ 提供 `.example` 示例文件
4. ✅ 在README中说明配置步骤
5. ❌ 永远不要硬编码密钥
6. ❌ 永远不要提交密钥到Git
7. ❌ 永远不要在文档中使用真实密钥

### 检查是否泄露

```bash
# 搜索可能的密钥
git log -p | grep -i "api_key"
git log -p | grep -i "secret"
```

### 紧急联系

如果发现密钥泄露：
1. 立即在API平台撤销密钥
2. 重新生成新密钥
3. 清理Git历史
4. 通知相关人员

---

**记住：安全第一！永远不要在代码中硬编码密钥！**

