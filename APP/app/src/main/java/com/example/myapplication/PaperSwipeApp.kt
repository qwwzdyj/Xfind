package com.example.myapplication

import android.app.Application
import android.content.Context

class PaperSwipeApp : Application() {
    companion object {
        lateinit

 var appContext: Context
            private set
    }

    override fun onCreate() {
        super.onCreate()
        appContext = applicationContext
    }
}

