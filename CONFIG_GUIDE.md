# API配置更改指南

## 📝 如何更改API配置

所有API配置都集中在 `config.py` 文件中，方便统一管理。

### 配置文件位置
```
D:\PROGRAM\2\新建文件夹\config.py
```

### 可配置项

打开 `config.py`，你会看到以下配置：

```python
API_CONFIG = {
    # API主机地址
    "host": "xingchen-api.xf-yun.com",
    
    # API密钥
    "api_key": "a070a6ba2fdbfb3c9334e99830f9cdec",
    
    # API密钥（Secret）
    "api_secret": "OWJmYTg4MGY3NTEzYTcwNTA1ODM5YmRj",
    
    # Flow ID
    "flow_id": "7390399875893088258",
    
    # API端点
    "endpoint": "/workflow/v1/chat/completions",
    
    # 超时设置（秒）
    "timeout": 120,
}
```

## 🔧 更改步骤

### 1. 打开配置文件
用任何文本编辑器打开 `config.py`

### 2. 修改需要的配置项
例如，如果Flow ID变更了：

**修改前：**
```python
"flow_id": "7390399875893088258",
```

**修改后：**
```python
"flow_id": "新的Flow_ID",
```

### 3. 保存文件
按 `Ctrl + S` 保存

### 4. 重启后端服务器
在运行后端的终端：
1. 按 `Ctrl + C` 停止
2. 重新运行 `python backend.py`

### 5. 验证配置
后端启动时会显示：
```
🔧 API配置加载成功:
   主机: xingchen-api.xf-yun.com
   Flow ID: 你的新Flow_ID
   端点: /workflow/v1/chat/completions
```

## 📋 常见配置场景

### 场景1: Flow ID更改
```python
"flow_id": "新的Flow_ID",
```

### 场景2: API密钥更改
```python
"api_key": "新的API_Key",
"api_secret": "新的API_Secret",
```

### 场景3: 更换API服务器
```python
"host": "新的API地址.com",
"endpoint": "/新的端点路径",
```

### 场景4: 调整超时时间
```python
"timeout": 180,  # 改为3分钟
```

## ✅ 测试配置

### 方法1: 运行测试脚本
```bash
python config.py
```

会显示当前配置信息

### 方法2: 启动后端查看
```bash
python backend.py
```

查看启动信息中的配置

### 方法3: 在浏览器测试
1. 打开前端页面
2. 输入研究方向进行搜索
3. 查看后端终端的日志输出

## 🔒 安全建议

### 1. 不要提交到Git
配置文件已经在 `.gitignore` 中，不会被提交。

### 2. 备份配置
修改前先备份：
```bash
copy config.py config.py.backup
```

### 3. 环境变量（可选）
对于生产环境，可以使用环境变量：

```python
import os

API_CONFIG = {
    "api_key": os.getenv('API_KEY', '默认值'),
    "api_secret": os.getenv('API_SECRET', '默认值'),
    # ...
}
```

## 🆘 常见问题

### Q: 修改配置后没有生效？
A: 确保已重启后端服务器（`python backend.py`）

### Q: 配置文件格式错误？
A: 检查Python语法，特别是引号和逗号

### Q: 如何恢复默认配置？
A: 使用备份文件，或重新从Git拉取

### Q: 可以在前端修改配置吗？
A: 不可以，配置只能在后端 `config.py` 中修改

## 📞 获取新的API信息

如果需要新的API凭证：
1. 访问星火API管理平台
2. 登录你的账号
3. 在工作流管理中找到你的Flow
4. 复制新的Flow ID和API凭证
5. 更新到 `config.py`

## 🎯 配置检查清单

更改配置后，确认：
- [ ] 配置文件语法正确
- [ ] 已保存文件
- [ ] 已重启后端
- [ ] 启动日志显示正确配置
- [ ] 前端测试功能正常

---

**当前配置（从你提供的信息）：**
- API地址：`https://xingchen-api.xf-yun.com/workflow/v1/chat/completions`
- API Key：`a070a6ba2fdbfb3c9334e99830f9cdec`
- API Secret：`OWJmYTg4MGY3NTEzYTcwNTA1ODM5YmRj`
- Flow ID：`7390399875893088258`

如果这些信息有变更，请按照上述步骤更新 `config.py` 文件！


