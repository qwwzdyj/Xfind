// 状态管理
const state = {
    papers: [],
    currentIndex: 0,
    savedPapers: [],
    isDragging: false,
    startX: 0,
    startY: 0,
    currentCard: null
};

// API配置
const API_URL = 'http://localhost:5000/api';

// DOM元素
const elements = {
    searchSection: document.getElementById('searchSection'),
    cardSection: document.getElementById('cardSection'),
    completionSection: document.getElementById('completionSection'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    researchInput: document.getElementById('researchInput'),
    searchBtn: document.getElementById('searchBtn'),
    cardsContainer: document.getElementById('cardsContainer'),
    progressFill: document.getElementById('progressFill'),
    savedCount: document.getElementById('savedCount'),
    discardBtn: document.getElementById('discardBtn'),
    saveBtn: document.getElementById('saveBtn'),
    finalCount: document.getElementById('finalCount'),
    savedPapersList: document.getElementById('savedPapersList'),
    newSearchBtn: document.getElementById('newSearchBtn'),
    viewSavedBtn: document.getElementById('viewSavedBtn')
};

// 初始化
function init() {
    // 搜索按钮点击
    elements.searchBtn.addEventListener('click', handleSearch);
    
    // 输入框回车
    elements.researchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // 建议标签点击
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            elements.researchInput.value = tag.textContent;
            handleSearch();
        });
    });
    
    // 动作按钮
    elements.discardBtn.addEventListener('click', () => handleCardAction('discard'));
    elements.saveBtn.addEventListener('click', () => handleCardAction('save'));
    
    // 完成界面按钮
    elements.newSearchBtn.addEventListener('click', resetToSearch);
    elements.viewSavedBtn.addEventListener('click', viewSavedPapers);
}

// 处理搜索
async function handleSearch() {
    const topic = elements.researchInput.value.trim();
    
    if (!topic) {
        showNotification('请输入研究方向', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        console.log('🔍 发送请求到:', `${API_URL}/get-papers`);
        console.log('📋 研究方向:', topic);
        
        const response = await fetch(`${API_URL}/get-papers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ research_topic: topic })
        });
        
        console.log('📡 响应状态:', response.status);
        
        const data = await response.json();
        console.log('✅ 收到数据:', data);
        
        // 检查API错误
        if (data.error) {
            console.error('❌ API错误:', data.error);
            throw new Error(data.error);
        }
        
        if (!response.ok) {
            const errorMsg = data.message || data.error || '未知错误';
            console.error('❌ 请求失败:', errorMsg);
            throw new Error(`API请求失败 (${response.status}): ${errorMsg}`);
        }
        
        // 解析API返回的论文数据
        const papers = parsePapersFromResponse(data);
        
        if (papers && papers.length > 0) {
            state.papers = papers;
            state.currentIndex = 0;
            state.savedPapers = [];
            
            showSection('card');
            initializeCards();
        } else {
            showNotification('未找到相关论文，请尝试其他关键词', 'error');
            showLoading(false);
        }
        
    } catch (error) {
        console.error('❌ 完整错误信息:', error);
        
        // 更详细的错误提示
        let errorMessage = '获取论文失败';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = '⚠️ 无法连接到后端服务器\n\n请确认：\n1. 后端是否在运行？(python backend.py)\n2. 后端地址：http://localhost:5000\n3. 检查浏览器控制台的详细错误';
        } else if (error.message.includes('CORS')) {
            errorMessage = '⚠️ 跨域问题\n\n建议：使用 python -m http.server 8080 启动前端';
        } else {
            errorMessage = `❌ ${error.message}\n\n查看浏览器控制台获取详细信息`;
        }
        
        showNotification(errorMessage, 'error');
        showLoading(false);
    }
}

// 解析API响应中的论文数据
function parsePapersFromResponse(data) {
    console.log('🔧 开始解析响应数据...');
    
    try {
        let papers = [];
        
        // 格式1: 标准格式 {"papers": [...]}
        if (data && data.papers && Array.isArray(data.papers)) {
            console.log('✅ 检测到标准格式');
            papers = data.papers;
        }
        // 格式2: 直接是论文数组
        else if (Array.isArray(data)) {
            console.log('✅ 检测到数组格式');
            papers = data;
        }
        // 格式3: OpenAI格式 (后端应该已经处理了，但以防万一)
        else if (data.choices && data.choices[0]) {
            const choice = data.choices[0];
            let content = null;
            
            // 尝试从 delta 或 message 中获取 content
            if (choice.delta && choice.delta.content) {
                console.log('✅ 检测到OpenAI delta格式');
                content = choice.delta.content;
            } else if (choice.message && choice.message.content) {
                console.log('✅ 检测到OpenAI message格式');
                content = choice.message.content;
            }
            
            if (content) {
                papers = parseTextToPapers(content);
            }
        }
        // 其他格式
        else {
            console.log('⚠️ 未识别的格式，使用模拟数据');
            console.log('数据结构:', data);
            papers = generateMockPapers(5);
        }
        
        // 验证论文数据
        papers = papers.filter(paper => {
            const isValid = paper && paper.title && paper.authors && paper.abstract;
            if (!isValid) {
                console.warn('⚠️ 过滤掉无效论文:', paper);
            }
            return isValid;
        });
        
        if (papers.length === 0) {
            console.log('⚠️ 没有有效论文，使用模拟数据');
            papers = generateMockPapers(5);
        }
        
        console.log(`✨ 解析成功，共 ${papers.length} 篇论文`);
        papers.slice(0, 3).forEach((p, i) => {
            console.log(`   ${i+1}. ${p.title}`);
        });
        
        return papers.slice(0, 5); // 限制为5篇
        
    } catch (error) {
        console.error('❌ 解析论文数据失败:', error);
        console.log('📋 使用模拟数据');
        return generateMockPapers(5);
    }
}

// 从文本内容解析论文
function parseTextToPapers(text) {
    console.log('🔧 尝试从文本解析论文...');
    
    try {
        // 尝试从markdown代码块中提取JSON
        const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonBlockMatch) {
            const jsonStr = jsonBlockMatch[1];
            const parsed = JSON.parse(jsonStr);
            if (parsed.papers) {
                console.log('✅ 从JSON代码块解析成功');
                return parsed.papers;
            }
        }
        
        // 智能提取JSON对象
        const start = text.indexOf('{');
        if (start !== -1) {
            let braceCount = 0;
            let jsonEnd = -1;
            
            for (let i = start; i < text.length; i++) {
                if (text[i] === '{') {
                    braceCount++;
                } else if (text[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        jsonEnd = i + 1;
                        break;
                    }
                }
            }
            
            if (jsonEnd !== -1) {
                const jsonStr = text.substring(start, jsonEnd);
                console.log(`🔍 提取JSON对象 (长度: ${jsonStr.length})`);
                
                try {
                    const parsed = JSON.parse(jsonStr);
                    if (parsed.papers) {
                        console.log(`✅ 智能提取成功，找到 ${parsed.papers.length} 篇论文`);
                        return parsed.papers;
                    }
                } catch (e) {
                    console.warn('⚠️ 智能提取的JSON解析失败:', e.message);
                }
            }
        }
        
        // 尝试直接解析整个文本
        const parsed = JSON.parse(text);
        if (parsed.papers) {
            console.log('✅ 直接解析文本成功');
            return parsed.papers;
        }
        
    } catch (e) {
        console.warn('⚠️ 文本解析失败:', e.message);
    }
    
    console.log('📋 文本解析失败，使用模拟数据');
    return generateMockPapers(5);
}

// 生成模拟论文数据（用于测试）
function generateMockPapers(count) {
    const topics = [
        '深度学习', '自然语言处理', '计算机视觉', '强化学习', '迁移学习',
        '生成对抗网络', '注意力机制', '神经网络优化', '多模态学习', '联邦学习'
    ];
    
    const papers = [];
    for (let i = 0; i < count; i++) {
        papers.push({
            title: `${topics[i % topics.length]}的最新研究进展与应用`,
            authors: `张三, 李四, 王五 等`,
            abstract: `本文深入探讨了${topics[i % topics.length]}在实际应用中的关键技术和创新方法。通过大规模实验验证，我们提出的方法在多个基准数据集上取得了显著的性能提升。研究结果表明，该方法不仅在理论上具有创新性，而且在实际应用中展现出强大的泛化能力和鲁棒性。`,
            tags: [topics[i % topics.length], 'AI', '机器学习'],
            year: 2024,
            venue: 'NeurIPS 2024'
        });
    }
    return papers;
}

// 初始化卡片
function initializeCards() {
    elements.cardsContainer.innerHTML = '';
    updateProgress();
    
    // 创建所有卡片（反向顺序，最后一张在最上面）
    for (let i = state.papers.length - 1; i >= 0; i--) {
        const card = createCard(state.papers[i], i);
        elements.cardsContainer.appendChild(card);
        
        // 为当前卡片添加交互
        if (i === state.currentIndex) {
            state.currentCard = card;
            addCardInteraction(card);
        }
    }
    
    showLoading(false);
}

// 创建卡片
function createCard(paper, index) {
    const card = document.createElement('div');
    card.className = 'paper-card';
    card.dataset.index = index;
    
    // 设置卡片层级
    const zIndex = state.papers.length - index;
    const scale = 1 - (index - state.currentIndex) * 0.05;
    const translateY = (index - state.currentIndex) * 10;
    
    card.style.zIndex = zIndex;
    card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    
    card.innerHTML = `
        <div class="swipe-indicator like">喜欢</div>
        <div class="swipe-indicator nope">跳过</div>
        
        <div class="paper-number">论文 ${index + 1} / ${state.papers.length}</div>
        <h3 class="paper-title">${paper.title}</h3>
        
        <div class="paper-authors">
            <svg class="authors-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span>${paper.authors}</span>
        </div>
        
        <p class="paper-abstract">${paper.abstract}</p>
        
        <div class="paper-tags">
            ${paper.tags ? paper.tags.map(tag => `<span class="paper-tag">${tag}</span>`).join('') : ''}
            ${paper.year ? `<span class="paper-tag">${paper.year}</span>` : ''}
            ${paper.venue ? `<span class="paper-tag">${paper.venue}</span>` : ''}
        </div>
    `;
    
    return card;
}

// 添加卡片交互
function addCardInteraction(card) {
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let isDragging = false;
    
    const handleStart = (e) => {
        isDragging = true;
        card.classList.add('dragging');
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
    };
    
    const handleMove = (e) => {
        if (!isDragging) return;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        currentX = clientX - startX;
        currentY = clientY - startY;
        
        const rotation = currentX * 0.1;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
        
        // 显示指示器
        const likeIndicator = card.querySelector('.swipe-indicator.like');
        const nopeIndicator = card.querySelector('.swipe-indicator.nope');
        
        if (currentX > 50) {
            likeIndicator.style.opacity = Math.min(currentX / 100, 1);
            nopeIndicator.style.opacity = 0;
        } else if (currentX < -50) {
            nopeIndicator.style.opacity = Math.min(Math.abs(currentX) / 100, 1);
            likeIndicator.style.opacity = 0;
        } else {
            likeIndicator.style.opacity = 0;
            nopeIndicator.style.opacity = 0;
        }
    };
    
    const handleEnd = () => {
        if (!isDragging) return;
        
        isDragging = false;
        card.classList.remove('dragging');
        
        const threshold = 100;
        
        if (Math.abs(currentX) > threshold) {
            // 完成滑动
            const direction = currentX > 0 ? 'save' : 'discard';
            completeSwipe(card, direction);
        } else {
            // 重置卡片位置
            card.style.transform = '';
            card.querySelector('.swipe-indicator.like').style.opacity = 0;
            card.querySelector('.swipe-indicator.nope').style.opacity = 0;
        }
        
        currentX = 0;
        currentY = 0;
    };
    
    // 鼠标事件
    card.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // 触摸事件
    card.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
    
    // 保存清理函数
    card._cleanup = () => {
        card.removeEventListener('mousedown', handleStart);
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        card.removeEventListener('touchstart', handleStart);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    };
}

// 完成滑动
function completeSwipe(card, action) {
    const index = parseInt(card.dataset.index);
    const direction = action === 'save' ? 1 : -1;
    
    // 动画移出
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = `translateX(${direction * 800}px) rotate(${direction * 30}deg)`;
    
    // 如果是保存，添加到已保存列表
    if (action === 'save') {
        const paper = {
            ...state.papers[index],
            savedAt: new Date().toISOString() // 添加保存时间
        };
        state.savedPapers.push(paper);
        updateSavedCount();
        savePaperToLocalStorage(paper);
    }
    
    // 等待动画完成后移除卡片
    setTimeout(() => {
        if (card._cleanup) {
            card._cleanup();
        }
        card.remove();
        moveToNextCard();
    }, 500);
}

// 移动到下一张卡片
function moveToNextCard() {
    state.currentIndex++;
    
    if (state.currentIndex < state.papers.length) {
        // 还有更多卡片
        const nextCard = elements.cardsContainer.querySelector(`[data-index="${state.currentIndex}"]`);
        if (nextCard) {
            state.currentCard = nextCard;
            addCardInteraction(nextCard);
            
            // 更新卡片位置
            nextCard.style.transition = 'transform 0.3s ease';
            nextCard.style.transform = 'scale(1) translateY(0)';
        }
        updateProgress();
    } else {
        // 所有卡片已完成
        showCompletionScreen();
    }
}

// 处理按钮点击的卡片动作
function handleCardAction(action) {
    if (state.currentCard) {
        completeSwipe(state.currentCard, action);
    }
}

// 显示完成界面
async function showCompletionScreen() {
    updateProgress();
    
    // 显示保存的论文数量
    elements.finalCount.textContent = state.savedPapers.length;
    
    // 显示保存的论文列表
    if (state.savedPapers.length > 0) {
        elements.savedPapersList.innerHTML = state.savedPapers.map(paper => `
            <div class="saved-paper-item">
                <h4>${paper.title}</h4>
                <p>${paper.authors}</p>
            </div>
        `).join('');
        
        // 发送保存的论文到后端
        try {
            await fetch(`${API_URL}/save-selection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selected_papers: state.savedPapers })
            });
        } catch (error) {
            console.error('保存失败:', error);
        }
    } else {
        elements.savedPapersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">你没有保存任何论文</p>';
    }
    
    showSection('completion');
}

// 切换显示区域
function showSection(section) {
    elements.searchSection.classList.add('hidden');
    elements.cardSection.classList.add('hidden');
    elements.completionSection.classList.add('hidden');
    
    switch (section) {
        case 'search':
            elements.searchSection.classList.remove('hidden');
            break;
        case 'card':
            elements.cardSection.classList.remove('hidden');
            break;
        case 'completion':
            elements.completionSection.classList.remove('hidden');
            break;
    }
}

// 更新进度条
function updateProgress() {
    const progress = (state.currentIndex / state.papers.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
}

// 更新已保存计数
function updateSavedCount() {
    elements.savedCount.textContent = state.savedPapers.length;
}

// 显示/隐藏加载动画
function showLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.remove('hidden');
    } else {
        elements.loadingOverlay.classList.add('hidden');
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建更好看的通知组件
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        padding: 20px 24px;
        background: ${type === 'error' ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-line;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                margin-left: 16px;
                opacity: 0.8;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 自动消失
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// 重置到搜索界面
function resetToSearch() {
    elements.researchInput.value = '';
    state.papers = [];
    state.currentIndex = 0;
    state.savedPapers = [];
    state.currentCard = null;
    updateSavedCount();
    showSection('search');
}

// 查看已保存的论文
function viewSavedPapers() {
    // 跳转到储存库页面
    window.location.href = 'library.html';
}

// 保存论文到localStorage
function savePaperToLocalStorage(paper) {
    try {
        let savedPapers = JSON.parse(localStorage.getItem('savedPapers') || '[]');
        
        // 检查是否已存在（避免重复）
        const exists = savedPapers.some(p => p.title === paper.title);
        if (!exists) {
            savedPapers.push(paper);
            localStorage.setItem('savedPapers', JSON.stringify(savedPapers));
            console.log('💾 论文已保存到储存库');
        }
    } catch (error) {
        console.error('保存到localStorage失败:', error);
    }
}

// 从localStorage加载已保存的论文数量
function loadSavedCount() {
    try {
        const savedPapers = JSON.parse(localStorage.getItem('savedPapers') || '[]');
        elements.savedCount.textContent = savedPapers.length;
    } catch (error) {
        console.error('加载储存库数量失败:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
    loadSavedCount(); // 加载储存库数量
});

