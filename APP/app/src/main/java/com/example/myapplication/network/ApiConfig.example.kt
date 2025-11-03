package com.example.myapplication.network

/**
 * API配置示例文件
 * 
 * 使用步骤：
 * 1. 复制此文件为 ApiConfig.kt
 * 2. 将下面的占位符替换为你的真实API信息
 * 3. 不要提交 ApiConfig.kt 到Git
 */
object ApiConfig {
    // ⚠️ 请替换为你的真实API密钥
    const val API_KEY = "YOUR_API_KEY_HERE"
    
    // ⚠️ 请替换为你的真实API Secret
    const val API_SECRET = "YOUR_API_SECRET_HERE"
    
    // ⚠️ 请替换为你的真实Flow ID
    const val FLOW_ID = "YOUR_FLOW_ID_HERE"
    
    // API配置（通常不需要修改）
    const val BASE_URL = "https://xingchen-api.xf-yun.com/"
    const val TIMEOUT = 120L
    
    /**
     * 验证配置是否有效
     */
    fun isConfigured(): Boolean {
        return API_KEY != "YOUR_API_KEY_HERE" 
            && API_SECRET != "YOUR_API_SECRET_HERE"
            && FLOW_ID != "YOUR_FLOW_ID_HERE"
    }
}

