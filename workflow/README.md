# 星火工作流配置

## 📋 配置文件说明

`spark_workflow_config.yml` 是Xfind项目使用的星火大模型工作流配置文件。

## 🔧 配置内容

### 工作流结构
- **开始节点** - 接收用户输入（AGENT_USER_INPUT）
- **决策节点** - 判断用户意图
- **大模型节点** - 将中文查询翻译成英文
- **Agent节点** - 调用论文搜索工具（arXiv）
- **数据库节点** - 存储和查询论文数据
- **结束节点** - 返回JSON格式的论文列表

### 关键配置

#### 提示词模板
工作流包含Few-shot提示词，确保API返回标准JSON格式：
```yaml
query: |+
  {{history[0]}}}返回jason格式：用户5篇论文的标题，作者，简介。
  你要严格遵循这个jason格式不能有半点出错
  {
    "papers": [...]
  }
```

#### 使用的工具
- **论文搜索 - arXiv** (`tool@72b113b2c021000`)
- 搜索并返回相关论文

#### 使用的模型
- **DeepSeek-V3** - Agent决策和最终输出
- **Spark Pro** - 中英文翻译

#### 数据库配置
工作流包含数据库节点用于：
- 查询已有论文
- 保存用户选择的论文

SQL示例：
```sql
INSERT INTO dasda (uid, create_time, title, abstract)
VALUES
('user001', datetime('now'), '{{input.selected_papers[0].title}}', '...')
```

## 📝 使用方法

### 1. 导入到星火平台

1. 登录星火大模型平台
2. 进入工作流管理
3. 导入 `spark_workflow_config.yml` 文件
4. 配置以下参数：
   - `uid`: 你的用户ID
   - `appId`: 你的应用ID
   - `dbId`: 你的数据库ID（如果使用数据库节点）

### 2. 配置参数

文件中的占位符需要替换：
- `YOUR_USER_ID` → 你的星火平台用户ID
- `YOUR_APP_ID` → 你的应用ID
- `YOUR_DATABASE_ID` → 你的数据库ID（如果使用数据库）

### 3. 获取Flow ID

导入后，在星火平台获取Workflow的Flow ID，然后在：
- Web版：`config.py` 中设置
- Android版：`ApiConfig.kt` 中设置

## 🔄 工作流执行流程

```
用户输入
  ↓
开始节点 (AGENT_USER_INPUT)
  ↓
决策节点 (判断意图)
  ↓
大模型节点 (翻译成英文)
  ↓
Agent节点 (调用论文搜索工具)
  ↓
返回JSON格式论文列表
  ↓
（可选）保存到数据库
  ↓
结束节点 (输出结果)
```

## 📊 输入输出格式

### 输入
- `AGENT_USER_INPUT`: 用户的研究方向（中文）
  例如："机器学习在医疗诊断中的应用"

### 输出
- JSON格式的论文数组：
```json
{
  "papers": [
    {
      "title": "论文标题",
      "authors": "作者列表",
      "abstract": "摘要",
      "year": 2024,
      "venue": "会议或期刊",
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

## ⚠️ 注意事项

1. **配置参数**：必须替换 `YOUR_USER_ID`, `YOUR_APP_ID` 等占位符
2. **数据库**：如果使用数据库节点，需要先创建对应的数据库表
3. **工具权限**：确保你的账号有权限使用"论文搜索 - arXiv"工具
4. **Flow ID**：导入后获取Flow ID并配置到应用中

## 🔗 相关文档

- [API格式指南](../API_FORMAT_GUIDE.md) - 详细的JSON格式说明
- [配置指南](../CONFIG_GUIDE.md) - API配置方法
- [README](../README.md) - 项目总览

## 🛠️ 自定义

你可以根据需要修改：
- 提示词模板（Few-shot示例）
- 返回论文数量（当前是5篇）
- 添加更多工具（除了arXiv）
- 修改数据库表结构

## 📝 版本信息

- **DSL版本**: v1
- **最后更新**: 2025-11-03
- **适用平台**: 星火大模型工作流平台

---

**提示**：这是工作流配置的示例文件，使用前请替换所有占位符为实际值！

