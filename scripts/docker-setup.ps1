# 确保脚本以管理员权限运行
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "use admin pls!"
    Break
}

# 设置Docker配置文件路径
$dockerConfigPath = "$env:ProgramData\Docker\config"
$daemonJsonPath = "$dockerConfigPath\daemon.json"
$sourceFile = "$PSScriptRoot\..\docker\daemon.json"

# 创建配置目录（如果不存在）
if (-not (Test-Path $dockerConfigPath)) {
    New-Item -ItemType Directory -Path $dockerConfigPath -Force
}

# 复制配置文件
Copy-Item -Path $sourceFile -Destination $daemonJsonPath -Force



Write-Host "Docker setup successed" -ForegroundColor Green