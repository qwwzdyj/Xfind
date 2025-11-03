"""
API配置文件示例
复制此文件为 config.py 并填入你的真实API信息
"""

import os

# API配置
API_CONFIG = {
    # API主机地址
    "host": "xingchen-api.xf-yun.com",
    
    # 从环境变量读取，或直接填写（不推荐）
    "api_key": os.getenv('XFIND_API_KEY', 'your_api_key_here'),
    
    # API密钥（Secret）
    "api_secret": os.getenv('XFIND_API_SECRET', 'your_api_secret_here'),
    
    # Flow ID
    "flow_id": os.getenv('XFIND_FLOW_ID', 'your_flow_id_here'),
    
    # API端点
    "endpoint": "/workflow/v1/chat/completions",
    
    # 超时设置（秒）
    "timeout": 120,
}

# 获取完整的API URL
def get_api_url():
    """返回完整的API URL"""
    return f"https://{API_CONFIG['host']}{API_CONFIG['endpoint']}"

# 获取授权头
def get_auth_header():
    """返回授权头"""
    return f"Bearer {API_CONFIG['api_key']}:{API_CONFIG['api_secret']}"

