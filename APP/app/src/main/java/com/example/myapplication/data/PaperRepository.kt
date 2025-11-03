package com.example.myapplication.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.example.myapplication.models.Paper
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "paper_swipe_prefs")

class PaperRepository(private val context: Context) {
    
    private val gson = Gson()
    private val SAVED_PAPERS_KEY = stringPreferencesKey("saved_papers")
    
    suspend fun savePapers(papers: List<Paper>) {
        context.dataStore.edit { preferences ->
            preferences[SAVED_PAPERS_KEY] = gson.toJson(papers)
        }
    }
    
    fun getSavedPapers(): Flow<List<Paper>> {
        return context.dataStore.data.map { preferences ->
            val json = preferences[SAVED_PAPERS_KEY] ?: "[]"
            try {
                val type = object : TypeToken<List<Paper>>() {}.type
                gson.fromJson(json, type)
            } catch (e: Exception) {
                emptyList()
            }
        }
    }
    
    suspend fun addPaper(paper: Paper) {
        context.dataStore.edit { preferences ->
            val json = preferences[SAVED_PAPERS_KEY] ?: "[]"
            val type = object : TypeToken<MutableList<Paper>>() {}.type
            val papers: MutableList<Paper> = try {
                gson.fromJson(json, type)
            } catch (e: Exception) {
                mutableListOf()
            }
            papers.add(paper)
            preferences[SAVED_PAPERS_KEY] = gson.toJson(papers)
        }
    }
    
    suspend fun deletePaper(paper: Paper) {
        context.dataStore.edit { preferences ->
            val json = preferences[SAVED_PAPERS_KEY] ?: "[]"
            val type = object : TypeToken<MutableList<Paper>>() {}.type
            val papers: MutableList<Paper> = try {
                gson.fromJson(json, type)
            } catch (e: Exception) {
                mutableListOf()
            }
            papers.removeAll { it.title == paper.title }
            preferences[SAVED_PAPERS_KEY] = gson.toJson(papers)
        }
    }
    
    suspend fun clearAll() {
        context.dataStore.edit { preferences ->
            preferences.remove(SAVED_PAPERS_KEY)
        }
    }
}

