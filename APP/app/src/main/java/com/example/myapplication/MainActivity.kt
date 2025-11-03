package com.example.myapplication

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.example.myapplication.data.PaperRepository
import com.example.myapplication.models.Paper
import com.example.myapplication.models.PapersResponse
import com.example.myapplication.network.ApiService
import com.example.myapplication.network.ChatRequest
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {
    
    private lateinit var webView: WebView
    private lateinit var apiService: ApiService
    private lateinit var repository: PaperRepository
    private val gson = Gson()
    
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        apiService = ApiService.create()
        repository = PaperRepository(this)
        
        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = true
            settings.useWideViewPort = true
            settings.loadWithOverviewMode = true
            
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()
            
            addJavascriptInterface(WebAppInterface(), "Android")
            
            loadUrl("file:///android_asset/index.html")
        }
        
        setContentView(webView)
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
    
    inner class WebAppInterface {
        
        @JavascriptInterface
        fun searchPapers(query: String) {
            Log.d("MainActivity", "搜索论文: $query")
            
            lifecycleScope.launch {
                try {
                    val request = ChatRequest(
                        flow_id = ApiService.getFlowId(),
                        uid = "android_user",
                        parameters = mapOf("AGENT_USER_INPUT" to query),
                        ext = mapOf("bot_id" to "paper_recommendation", "caller" to "android"),
                        stream = false
                    )
                    
                    val response = withContext(Dispatchers.IO) {
                        apiService.getChatCompletion(request)
                    }
                    
                    Log.d("MainActivity", "API响应: code=${response.code}")
                    
                    if (response.code == 0) {
                        val content = response.choices?.firstOrNull()?.delta?.content 
                            ?: response.choices?.firstOrNull()?.message?.content
                            ?: ""
                        
                        Log.d("MainActivity", "Content前100字符: ${content.take(100)}")
                        
                        // 提取JSON
                        val jsonContent = extractJson(content)
                        Log.d("MainActivity", "提取的JSON前200字符: ${jsonContent.take(200)}")
                        
                        if (jsonContent.isNotEmpty()) {
                            try {
                                val papersResponse = gson.fromJson(jsonContent, PapersResponse::class.java)
                                val papersJson = gson.toJson(papersResponse.papers)
                                
                                runOnUiThread {
                                    webView.evaluateJavascript("onPapersReceived('${papersJson.replace("'", "\\'")}')", null)
                                }
                            } catch (e: Exception) {
                                Log.e("MainActivity", "解析JSON失败", e)
                                showError("解析论文数据失败: ${e.message}")
                            }
                        } else {
                            showError("API返回内容为空")
                        }
                    } else {
                        showError("API错误: ${response.message}")
                    }
                    
                } catch (e: Exception) {
                    Log.e("MainActivity", "请求失败", e)
                    showError("请求失败: ${e.message}")
                }
            }
        }
        
        @JavascriptInterface
        fun savePapers(papersJson: String) {
            Log.d("MainActivity", "保存论文: ${papersJson.length} 字符")
            
            lifecycleScope.launch {
                try {
                    val papers: List<Paper> = gson.fromJson(papersJson, Array<Paper>::class.java).toList()
                    
                    // 添加到已保存列表
                    for (paper in papers) {
                        repository.addPaper(paper)
                    }
                    
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "已保存 ${papers.size} 篇论文", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Log.e("MainActivity", "保存失败", e)
                }
            }
        }
        
        @JavascriptInterface
        fun getSavedCount(): Int {
            var count = 0
            lifecycleScope.launch {
                try {
                    val papers = repository.getSavedPapers().first()
                    count = papers.size
                } catch (e: Exception) {
                    Log.e("MainActivity", "获取数量失败", e)
                }
            }
            return count
        }
        
        @JavascriptInterface
        fun openLibrary() {
            runOnUiThread {
                startActivity(Intent(this@MainActivity, LibraryActivity::class.java))
            }
        }
        
        private fun extractJson(content: String): String {
            val start = content.indexOf('{')
            if (start == -1) return ""
            
            var braceCount = 0
            var jsonEnd = -1
            
            for (i in start until content.length) {
                when (content[i]) {
                    '{' -> braceCount++
                    '}' -> {
                        braceCount--
                        if (braceCount == 0) {
                            jsonEnd = i + 1
                            break
                        }
                    }
                }
            }
            
            return if (jsonEnd != -1) {
                content.substring(start, jsonEnd)
            } else {
                ""
            }
        }
        
        private fun showError(message: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, message, Toast.LENGTH_LONG).show()
                webView.evaluateJavascript("document.getElementById('loading').classList.add('hidden')", null)
                webView.evaluateJavascript("document.getElementById('searchSection').classList.remove('hidden')", null)
            }
        }
    }
}