@echo off
echo ========================================
echo  PaperSwipe - 论文推荐平台
echo ========================================
echo.

echo [1/2] 检查Python依赖...
pip install -r requirements.txt

echo.
echo [2/2] 启动后端服务...
echo 服务器将在 http://localhost:5000 启动
echo 请在浏览器中打开 index.html 文件
echo.
echo 按 Ctrl+C 可以停止服务器
echo ========================================
echo.

python backend.py

pause


