"""
测试JSON解析 - 使用实际API返回的数据
"""

import json

# 你的Agent实际返回的数据
test_content = """{
"papers": [
{
"title": "Medicinal Boxes Recognition on a Deep Transfer Learning Augmented Reality Mobile Application",
"authors": "Danilo Avola, Luigi Cinque, Alessio Fagioli, Gian Luca Foresti, Marco Raoul Marini, Alessio Mecca, Daniele Pannone",
"abstract": "Introduces an augmented reality mobile application with a deep neural network to recognize medicines from their packages and provide relevant information to patients. Achieved 91.30% accuracy in experiments.",
"year": 2022,
"venue": "arXiv",
"tags": ["deep learning", "augmented reality", "medicine recognition"]
},
{
"title": "Identification of Traditional Medicinal Plant Leaves Using an effective Deep Learning model and Self-Curated Dataset",
"authors": "Deepjyoti Chetia, Sanjib Kr Kalita, Prof Partha Pratim Baruah, Debasish Dutta, Tanaz Akhter",
"abstract": "Proposes a custom CNN architecture for identifying medicinal plants, achieving up to 99.7% accuracy on test datasets. Aims to reduce reliance on human experts in plant identification.",
"year": 2025,
"venue": "arXiv",
"tags": ["convolutional neural networks", "plant identification", "Ayurveda"]
},
{
"title": "Using Convolutional Neural Networks for Determining Reticulocyte Percentage in Cats",
"authors": "Krunoslav Vinicki, Pierluigi Ferrari, Maja Belic, Romana Turk",
"abstract": "Demonstrates deep learning application in veterinary medicine, achieving 98.7% accuracy in feline reticulocyte counting using only 800 labeled images.",
"year": 2018,
"venue": "arXiv",
"tags": ["veterinary medicine", "medical imaging", "SSD model"]
},
{
"title": "Deep Learning for Epidemiologists: An Introduction to Neural Networks",
"authors": "Stylianos Serghiou, Kathryn Rough",
"abstract": "Provides an epidemiological perspective on deep learning fundamentals, covering CNN, RNN architectures and model evaluation methods for medical applications.",
"year": 2022,
"venue": "arXiv",
"tags": ["epidemiology", "neural networks", "medical AI"]
},
{
"title": "Clinical Decision Support System for Unani Medicine Practitioners",
"authors": "Haider Sultan, Hafiza Farwa Mahmood, Noor Fatima, Marriyam Nadeem, Talha Waheed",
"abstract": "Develops an AI-powered decision support system for Unani medicine diagnosis, incorporating Decision Trees and NLP to assist practitioners in remote treatment.",
"year": 2023,
"venue": "arXiv",
"tags": ["traditional medicine", "clinical decision support", "AI diagnostics"]
}
]
}"""

print("=" * 70)
print("测试JSON解析")
print("=" * 70)

# 测试1: 直接解析
print("\n【测试1】直接解析JSON:")
try:
    parsed = json.loads(test_content)
    if 'papers' in parsed:
        print(f"✅ 成功！找到 {len(parsed['papers'])} 篇论文")
        print(f"\n前3篇论文标题:")
        for i, paper in enumerate(parsed['papers'][:3], 1):
            print(f"  {i}. {paper['title']}")
    else:
        print("❌ 未找到 papers 字段")
except Exception as e:
    print(f"❌ 解析失败: {e}")

# 测试2: 模拟API响应格式
print("\n" + "=" * 70)
print("【测试2】模拟完整API响应:")

api_response = {
    "code": 0,
    "message": "Success",
    "choices": [{
        "delta": {
            "role": "assistant",
            "content": test_content
        }
    }]
}

print("模拟的API响应结构:")
print(f"  code: {api_response['code']}")
print(f"  choices: {len(api_response['choices'])} 个")
print(f"  content长度: {len(api_response['choices'][0]['delta']['content'])} 字符")

# 提取content
content = api_response['choices'][0]['delta']['content'].strip()

# 智能提取JSON
start = content.find('{')
if start != -1:
    brace_count = 0
    json_end = -1
    
    for i in range(start, len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                json_end = i + 1
                break
    
    if json_end != -1:
        json_str = content[start:json_end]
        print(f"\n✅ 智能提取JSON (长度: {len(json_str)})")
        
        try:
            parsed = json.loads(json_str)
            if 'papers' in parsed:
                print(f"✅ 解析成功！包含 {len(parsed['papers'])} 篇论文")
                
                print("\n📋 论文列表:")
                for i, paper in enumerate(parsed['papers'], 1):
                    print(f"\n{i}. {paper['title']}")
                    print(f"   作者: {paper['authors']}")
                    print(f"   年份: {paper.get('year', 'N/A')}")
                    print(f"   会议: {paper.get('venue', 'N/A')}")
                    if 'tags' in paper:
                        print(f"   标签: {', '.join(paper['tags'])}")
        except Exception as e:
            print(f"❌ 解析失败: {e}")

print("\n" + "=" * 70)
print("✅ 测试完成")
print("=" * 70)


