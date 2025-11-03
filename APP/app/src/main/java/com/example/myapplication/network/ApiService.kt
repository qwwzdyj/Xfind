package com.example.myapplication.network

import com.example.myapplication.models.ApiResponse
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

interface ApiService {
    
    @Headers("Content-Type: application/json")
    @POST("/workflow/v1/chat/completions")
    suspend fun getChatCompletion(@Body request: ChatRequest): ApiResponse
    
    companion object {
        private const val BASE_URL = "https://xingchen-api.xf-yun.com/"
        
        // 从ApiConfig加载
        private val API_KEY = ApiConfig.API_KEY
        private val API_SECRET = ApiConfig.API_SECRET
        private val FLOW_ID = ApiConfig.FLOW_ID
        
        fun create(): ApiService {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }
            
            val client = OkHttpClient.Builder()
                .addInterceptor(logging)
                .addInterceptor { chain ->
                    val request = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer $API_KEY:$API_SECRET")
                        .addHeader("Accept", "text/event-stream")
                        .build()
                    chain.proceed(request)
                }
                .connectTimeout(120, TimeUnit.SECONDS)
                .readTimeout(120, TimeUnit.SECONDS)
                .writeTimeout(120, TimeUnit.SECONDS)
                .build()
            
            val gson = GsonBuilder()
                .setLenient()
                .create()
            
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build()
                .create(ApiService::class.java)
        }
        
        fun getFlowId() = FLOW_ID
    }
}

data class ChatRequest(
    val flow_id: String,
    val uid: String,
    val parameters: Map<String, String>,
    val ext: Map<String, String>,
    val stream: Boolean = false
)

