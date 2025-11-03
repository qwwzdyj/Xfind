"""
API测试脚本 - 用于测试API响应和解析
"""

import http.client
import json
from config import API_CONFIG

def test_api(user_input):
    """测试API调用"""
    print("=" * 70)
    print(f"📝 测试输入: {user_input}")
    print("=" * 70)
    
    # API配置
    headers = {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Authorization": f"Bearer {API_CONFIG['api_key']}:{API_CONFIG['api_secret']}",
    }
    
    # 测试1: 直接发送原始输入
    print("\n【测试1】直接发送原始输入:")
    print(f"发送内容: {user_input}\n")
    
    data = {
        "flow_id": API_CONFIG['flow_id'],
        "uid": "test_user",
        "parameters": {"AGENT_USER_INPUT": user_input},
        "ext": {"bot_id": "test", "caller": "test"},
        "stream": False,
    }
    
    try:
        conn = http.client.HTTPSConnection(API_CONFIG['host'], timeout=API_CONFIG['timeout'])
        conn.request(
            "POST", 
            API_CONFIG['endpoint'], 
            json.dumps(data), 
            headers, 
            encode_chunked=True
        )
        res = conn.getresponse()
        response_data = res.read()
        
        print(f"响应状态: {res.status}")
        print(f"响应头: {dict(res.headers)}\n")
        
        result = json.loads(response_data.decode("utf-8"))
        
        print("原始响应结构:")
        print(json.dumps(result, ensure_ascii=False, indent=2)[:1000])
        print("\n" + "=" * 70)
        
        # 分析响应结构
        print("\n📊 响应分析:")
        print(f"- 数据类型: {type(result)}")
        
        if isinstance(result, dict):
            print(f"- 顶层字段: {list(result.keys())}")
            
            # 检查是否直接包含papers
            if 'papers' in result:
                print(f"✅ 直接包含 'papers' 字段")
                print(f"   论文数量: {len(result['papers'])}")
            else:
                print("❌ 顶层不包含 'papers'")
                
                # 深入检查每个字段
                for key, value in result.items():
                    print(f"\n  检查字段 '{key}':")
                    print(f"    类型: {type(value)}")
                    
                    if isinstance(value, dict):
                        print(f"    子字段: {list(value.keys())}")
                        if 'papers' in value:
                            print(f"    ✅ 在 '{key}' 中找到 'papers'!")
                            print(f"    论文数量: {len(value['papers'])}")
                    
                    elif isinstance(value, list) and len(value) > 0:
                        print(f"    数组长度: {len(value)}")
                        if isinstance(value[0], dict):
                            print(f"    第一个元素的字段: {list(value[0].keys())}")
                            
                            # 检查 choices 格式
                            if key == 'choices':
                                choice = value[0]
                                print(f"    📊 分析 choices[0]:")
                                
                                # 检查 delta
                                if 'delta' in choice:
                                    print(f"      ✅ 包含 delta 字段")
                                    if 'content' in choice['delta']:
                                        content = choice['delta']['content']
                                        print(f"      ✅ delta.content 存在，长度: {len(content)}")
                                        print(f"      前100字符: {content[:100]}")
                                        
                                        # 尝试解析
                                        if '{' in content and 'papers' in content:
                                            print(f"      ⚠️ content包含JSON，尝试解析...")
                                            try:
                                                parsed = json.loads(content.strip())
                                                if 'papers' in parsed:
                                                    print(f"      ✅✅✅ 成功！找到 {len(parsed['papers'])} 篇论文")
                                            except Exception as e:
                                                print(f"      ❌ 解析失败: {e}")
                                
                                # 检查 message
                                if 'message' in choice:
                                    print(f"      ✅ 包含 message 字段")
                                    if 'content' in choice['message']:
                                        content = choice['message']['content']
                                        print(f"      ✅ message.content 存在，长度: {len(content)}")
                    
                    elif isinstance(value, str):
                        print(f"    字符串长度: {len(value)}")
                        if '{' in value and 'papers' in value:
                            print(f"    ⚠️ 可能包含JSON字符串，需要二次解析")
                            try:
                                parsed = json.loads(value)
                                if 'papers' in parsed:
                                    print(f"    ✅ 解析后找到 'papers'!")
                            except:
                                pass
        
        conn.close()
        
        print("\n" + "=" * 70)
        print("✅ 测试完成")
        
        return result
        
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == '__main__':
    # 测试用例
    test_cases = [
        "机器学习在医疗诊断中的应用",
        "深度学习",
        "自然语言处理的最新进展",
    ]
    
    print("\n🚀 开始API测试\n")
    print(f"API配置:")
    print(f"  主机: {API_CONFIG['host']}")
    print(f"  Flow ID: {API_CONFIG['flow_id']}")
    print(f"  端点: {API_CONFIG['endpoint']}")
    print("\n")
    
    for i, test_input in enumerate(test_cases, 1):
        print(f"\n\n{'#' * 70}")
        print(f"# 测试 {i}/{len(test_cases)}")
        print(f"{'#' * 70}\n")
        
        result = test_api(test_input)
        
        if i < len(test_cases):
            input("\n按回车继续下一个测试...")
    
    print("\n\n" + "=" * 70)
    print("🎉 所有测试完成！")
    print("=" * 70)

