package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.lifecycleScope
import com.example.myapplication.data.PaperRepository
import com.example.myapplication.models.Paper
import com.example.myapplication.ui.theme.MyApplicationTheme
import kotlinx.coroutines.launch

class LibraryActivity : ComponentActivity() {
    
    private lateinit var repository: PaperRepository
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        repository = PaperRepository(this)
        
        setContent {
            MyApplicationTheme {
                LibraryScreen(repository)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LibraryScreen(repository: PaperRepository) {
    val papers = remember { mutableStateOf<List<Paper>>(emptyList()) }
    val scope = rememberCoroutineScope()
    
    LaunchedEffect(Unit) {
        repository.getSavedPapers().collect { paperList ->
            papers.value = paperList
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("我的储存库") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF16213E),
                    titleContentColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        if (papers.value.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "还没有保存的论文\n开始探索吧！",
                    color = Color.White,
                    fontSize = 16.sp
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFF0F0F1E))
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(papers.value) { paper ->
                    PaperCard(
                        paper = paper,
                        onDelete = {
                            scope.launch {
                                repository.deletePaper(paper)
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun PaperCard(paper: Paper, onDelete: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF1A1A2E)
        )
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
        ) {
            Text(
                text = paper.title,
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = paper.authors,
                color = Color(0xFFA0A0B8),
                fontSize = 14.sp
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Text(
                text = paper.abstract,
                color = Color(0xFFA0A0B8),
                fontSize = 14.sp,
                lineHeight = 20.sp
            )
            
            if (paper.year != null || paper.venue != null) {
                Spacer(modifier = Modifier.height(12.dp))
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    paper.year?.let {
                        Text(
                            text = it.toString(),
                            color = Color(0xFF667EEA),
                            fontSize = 12.sp
                        )
                    }
                    paper.venue?.let {
                        Text(
                            text = it,
                            color = Color(0xFF667EEA),
                            fontSize = 12.sp
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Button(
                onClick = onDelete,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFF87171)
                )
            ) {
                Text("删除")
            }
        }
    }
}

