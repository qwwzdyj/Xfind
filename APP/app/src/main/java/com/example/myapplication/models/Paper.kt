package com.example.myapplication.models

import com.google.gson.annotations.SerializedName

data class Paper(
    @SerializedName("title")
    val title: String,
    
    @SerializedName("authors")
    val authors: String,
    
    @SerializedName("abstract")
    val abstract: String,
    
    @SerializedName("year")
    val year: Int? = null,
    
    @SerializedName("venue")
    val venue: String? = null,
    
    @SerializedName("tags")
    val tags: List<String>? = null,
    
    val savedAt: Long = System.currentTimeMillis()
)

data class PapersResponse(
    @SerializedName("papers")
    val papers: List<Paper>
)

data class ApiResponse(
    @SerializedName("code")
    val code: Int,
    
    @SerializedName("message")
    val message: String,
    
    @SerializedName("choices")
    val choices: List<Choice>? = null
)

data class Choice(
    @SerializedName("delta")
    val delta: Delta? = null,
    
    @SerializedName("message")
    val message: Delta? = null
)

data class Delta(
    @SerializedName("content")
    val content: String
)

