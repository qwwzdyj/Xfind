# 故障排除指南

## 常见错误及解决方案

### 错误码 23700：Agent节点执行失败

**错误信息**：
```
Agent节点执行失败(模型返回的推理内容格式不正确,无效的推理格式，缺少必要的标识字段)
```

**原因**：
- API期望特定的输入格式
- Few-shot提示词格式不符合Agent预期
- 缺少必要的标识字段

**解决方案**：

#### 方案1：关闭Few-shot（推荐）
在 `backend.py` 第36行：
```python
use_fewshot = False  # 直接发送原始输入
```

#### 方案2：检查API文档
查看API是否需要：
- 特定的输入格式
- 特殊的标识字段
- 特定的参数设置

#### 方案3：调整ext参数
在 `backend.py` 的请求数据中：
```python
data = {
    "flow_id": FLOW_ID,
    "uid": "123",
    "parameters": {"AGENT_USER_INPUT": user_input},
    "ext": {
        "bot_id": "paper_recommendation",  # 可能需要调整
        "caller": "workflow"  # 可能需要调整
    },
    "stream": False,
}
```

### 错误：无法连接到后端

**症状**：
- 前端显示"无法连接到后端服务器"
- 浏览器控制台显示 `Failed to fetch`

**解决方案**：
1. 检查后端是否在运行：`python backend.py`
2. 检查端口是否被占用：访问 `http://localhost:5000`
3. 如果使用 `file://` 协议，改用HTTP服务器：
   ```bash
   python -m http.server 8080
   ```

### 错误：CORS跨域问题

**症状**：
- 浏览器控制台显示 `CORS` 相关错误
- 错误信息包含 `Access-Control-Allow-Origin`

**解决方案**：
1. 确认已安装 Flask-CORS：`pip install Flask-CORS`
2. 使用HTTP服务器启动前端（避免 `file://` 协议）
3. 检查 `backend.py` 中有 `CORS(app)`

### 错误：论文数据解析失败

**症状**：
- 后端日志显示"解析响应失败"
- 前端显示模拟数据而不是真实论文

**解决方案**：
1. 运行测试脚本查看API响应结构：
   ```bash
   python test_api.py
   ```
2. 检查后端日志中的响应结构
3. 根据实际响应格式调整 `parse_api_response` 函数

### 错误：储存库是空的

**症状**：
- 明明保存了论文，但储存库显示为空

**可能原因**：
1. 使用了不同的浏览器
2. 清除了浏览器缓存
3. 使用了隐私/无痕模式

**解决方案**：
1. 在保存论文的同一浏览器中查看
2. 不要清除浏览器缓存
3. 避免使用隐私模式

### 错误：API Key无效

**症状**：
- 401 Unauthorized
- API返回认证错误

**解决方案**：
1. 检查 `config.py` 中的API凭证是否正确
2. 确认API Key和Secret没有过期
3. 检查Authorization头格式：`Bearer KEY:SECRET`

## 调试技巧

### 1. 查看后端日志
后端会打印详细的请求和响应信息：
```
============================================================
📝 用户输入: xxx
🚀 发送请求到API...
✅ 收到API响应
📦 原始响应: {...}
🔍 开始解析响应，数据类型: dict
✅ 格式X: 找到papers
✨ 解析后数据: {...}
============================================================
```

### 2. 查看前端控制台
按 `F12` 打开浏览器开发者工具，查看Console标签：
```
🔍 发送请求到: http://localhost:5000/api/get-papers
📋 研究方向: xxx
📡 响应状态: 200
✅ 收到数据: {...}
🔧 开始解析响应数据...
```

### 3. 使用测试脚本
直接测试API调用：
```bash
python test_api.py
```

会显示完整的响应结构和分析。

### 4. 检查网络请求
在浏览器开发者工具的Network标签：
1. 找到 `/api/get-papers` 请求
2. 查看Request Headers（请求头）
3. 查看Request Payload（请求体）
4. 查看Response（响应内容）

### 5. 逐步测试

#### 步骤1：测试后端是否运行
访问：`http://localhost:5000`
应该看到紫色渐变的提示页面

#### 步骤2：测试API连接
运行：`python test_api.py`
查看是否能成功连接API

#### 步骤3：测试前后端通信
在浏览器打开前端，F12查看控制台，尝试搜索

#### 步骤4：测试完整流程
搜索 → 滑动 → 保存 → 查看储存库

## API配置检查清单

- [ ] `config.py` 中的API Key正确
- [ ] `config.py` 中的API Secret正确
- [ ] `config.py` 中的Flow ID正确
- [ ] API地址和端点正确
- [ ] 后端已重启（修改config.py后）
- [ ] 网络连接正常
- [ ] 防火墙未阻止连接

## 前端问题检查清单

- [ ] 浏览器支持（Chrome/Firefox/Edge）
- [ ] JavaScript已启用
- [ ] localStorage可用（非隐私模式）
- [ ] 使用HTTP协议打开（不是file://）
- [ ] 后端API地址正确（http://localhost:5000）

## 获取帮助

### 1. 导出日志
将后端终端的输出复制保存为文本文件

### 2. 导出前端日志
在浏览器控制台右键 → Save as...

### 3. 运行测试
```bash
python test_api.py > test_output.txt 2>&1
```

### 4. 检查版本
```bash
python --version
pip list | grep Flask
```

## 重置和清理

### 完全重置
```bash
# 1. 停止所有服务
# 按 Ctrl+C 停止后端

# 2. 清除浏览器数据
# 在浏览器中按 F12 → Application → Local Storage → 右键清除

# 3. 重新安装依赖
pip install -r requirements.txt --force-reinstall

# 4. 重启后端
python backend.py
```

### 清除储存库数据
在浏览器控制台执行：
```javascript
localStorage.clear();
location.reload();
```

## 性能问题

### API响应慢
- 检查网络连接
- 增加timeout设置（config.py）
- 查看API服务状态

### 前端卡顿
- 清除浏览器缓存
- 关闭其他标签页
- 检查是否有JavaScript错误

### 储存库加载慢
- 清理旧数据（删除不需要的论文）
- 浏览器localStorage空间可能不足
- 考虑分批加载（未来功能）

---

如果问题仍未解决，请：
1. 收集上述所有日志
2. 记录重现步骤
3. 截图错误信息
4. 在项目仓库提交Issue


