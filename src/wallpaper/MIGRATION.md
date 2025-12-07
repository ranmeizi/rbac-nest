# 壁纸接口迁移文档

## 迁移概述

本次迁移将前端直接调用的第三方壁纸API接口迁移到后端进行代理转发，提升了安全性和可维护性。

## 迁移内容

### 新增Provider

1. **UnsplashProvider** (`providers/unsplash.provider.ts`)
   - 代理 Unsplash API
   - 支持搜索壁纸、获取分类列表、热门关键词

2. **PexelsProvider** (`providers/pexels.provider.ts`)
   - 代理 Pexels API
   - 支持搜索壁纸、获取分类列表、热门关键词

3. **BingProvider** (`providers/bing.provider.ts`)
   - 代理 Bing 每日壁纸
   - 从GitHub爬取壁纸数据
   - 实现了1小时缓存机制

### 新增接口

#### Unsplash相关接口

- `GET /wallpaper/unsplash/categories` - 获取Unsplash分类列表
- `GET /wallpaper/unsplash/search` - 搜索Unsplash壁纸
  - 参数: `kw`, `start`, `count`

#### Pexels相关接口

- `GET /wallpaper/pexels/categories` - 获取Pexels分类列表
- `GET /wallpaper/pexels/search` - 搜索Pexels壁纸
  - 参数: `kw`, `start`, `count`

#### Bing相关接口

- `GET /wallpaper/bing/list` - 获取Bing壁纸列表
  - 参数: `start`, `count`

### 前端修改

1. **wallpaper-api.ts**
   - `getUnsplashWallpaper()` - 改为调用后端 `/wallpaper/unsplash/search`
   - `getPexelsWallpaper()` - 改为调用后端 `/wallpaper/pexels/search`
   - `getBingWallpaper()` - 改为调用后端 `/wallpaper/bing/list`
   - 移除了 `withUnsplashWallpaper` 和 `withPexelWallpaper` 工具函数

2. **config.ts**
   - 注释掉了所有壁纸相关的API Key配置
   - API Key现在统一在后端管理

## 技术亮点

### 1. 统一的Provider架构

所有Provider都实现了 `IWallpaperProvider` 接口，保证了：
- 统一的数据格式
- 统一的错误处理
- 统一的接口规范

### 2. 缓存机制

BingProvider实现了智能缓存：
- 缓存时间：1小时
- 缓存失败降级：即使过期也返回缓存数据
- 减少了对外部服务的依赖

### 3. 类型安全

- 前后端共享类型定义
- TypeScript严格类型检查
- 完整的接口文档

### 4. 安全性提升

- API Key不再暴露在前端代码中
- 统一的访问控制和日志记录
- 可以方便地添加限流、监控等中间件

## 依赖说明

后端新增依赖：
```json
{
  "dependencies": {
    "cheerio": "^1.0.0"  // 用于解析HTML
  },
  "devDependencies": {
    "@types/cheerio": "^0.22.0"
  }
}
```

## 测试建议

### 后端测试

1. **Unsplash接口测试**
```bash
# 获取分类
curl http://localhost:3000/wallpaper/unsplash/categories

# 搜索壁纸
curl "http://localhost:3000/wallpaper/unsplash/search?kw=nature&start=0&count=10"
```

2. **Pexels接口测试**
```bash
# 获取分类
curl http://localhost:3000/wallpaper/pexels/categories

# 搜索壁纸
curl "http://localhost:3000/wallpaper/pexels/search?kw=nature&start=0&count=10"
```

3. **Bing接口测试**
```bash
# 获取壁纸列表
curl "http://localhost:3000/wallpaper/bing/list?start=0&count=30"
```

### 前端测试

1. 在壁纸选择界面测试各个壁纸源
2. 验证图片能正常加载
3. 测试搜索功能
4. 验证分页功能

## 性能优化

### 后端

1. **BingProvider缓存**
   - 减少了对GitHub的请求频率
   - 提升了响应速度

2. **并发控制**
   - 可以添加请求队列
   - 可以添加请求限流

### 前端

1. **统一的数据格式**
   - 简化了数据处理逻辑
   - 减少了类型转换

2. **错误处理**
   - 统一的错误处理机制
   - 更好的用户体验

## 后续优化建议

1. **添加数据库缓存**
   - 将壁纸数据缓存到数据库
   - 定时更新机制

2. **添加CDN支持**
   - 壁纸图片上传到CDN
   - 提升加载速度

3. **添加监控和日志**
   - 记录API调用次数
   - 监控第三方服务状态
   - 性能分析

4. **添加更多Provider**
   - 支持更多壁纸源
   - 用户自定义壁纸源

5. **添加管理后台**
   - 壁纸审核功能
   - 热门壁纸推荐
   - 统计分析

## API Key管理

### 当前位置

所有API Key现在存储在后端Provider中：
- Unsplash: `providers/unsplash.provider.ts`
- Pexels: `providers/pexels.provider.ts`

### 建议改进

将API Key移到环境变量：

```env
# .env
UNSPLASH_ACCESS_KEY=your_key_here
PEXELS_ACCESS_KEY=your_key_here
```

然后在Provider中使用：
```typescript
constructor(private readonly configService: ConfigService) {
  this.accessKey = this.configService.get('UNSPLASH_ACCESS_KEY');
}
```

## 兼容性说明

- 前端接口调用方式与之前完全兼容
- 返回数据格式保持一致
- 不需要修改业务逻辑代码

## 回滚方案

如果需要回滚到直接调用模式：

1. 恢复 `config.ts` 中的API Key配置（取消注释）
2. 恢复 `wallpaper-api.ts` 中的原始实现
3. 不影响后端其他功能

## 总结

本次迁移成功将所有壁纸接口迁移到后端，实现了：

✅ 安全性提升 - API Key不再暴露
✅ 可维护性提升 - 统一的接口管理
✅ 可扩展性提升 - 方便添加新功能
✅ 性能优化 - 添加了缓存机制
✅ 代码质量 - 完整的类型定义和错误处理

迁移完成后，整个系统更加健壮和易于维护！

