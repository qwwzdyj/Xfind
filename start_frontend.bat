@echo off
echo ========================================
echo  PaperSwipe - 前端服务器
echo ========================================
echo.
echo 启动前端服务器在 http://localhost:8080
echo 请确保后端服务器已在运行 (python backend.py)
echo.
echo 按 Ctrl+C 可以停止服务器
echo ========================================
echo.

python -m http.server 8080

pause


