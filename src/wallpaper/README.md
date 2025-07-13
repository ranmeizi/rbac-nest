# Wallpaper Module

## 概述

这个模块提供了一个可扩展的壁纸转发系统，支持多种壁纸源的统一接口。目前支持360壁纸的全功能转发，后续可以轻松添加其他壁纸源。

## 功能特性

- ✅ 360壁纸完整API转发
- ✅ 可扩展的提供者架构
- ✅ 统一的响应格式
- ✅ 分页支持
- ✅ 搜索功能
- ✅ 热门搜索关键词
- ✅ 多提供者聚合
- ✅ 错误处理和日志记录

## API接口

### 1. 获取可用提供者

```
GET /wallpaper/providers
```

### 2. 获取壁纸分类

```
GET /wallpaper/categories?provider=360
```

### 3. 获取壁纸列表

```
GET /wallpaper/list?provider=360&cid=new&start=0&count=10
```

参数说明：
- `provider`: 壁纸提供者（默认360）
- `cid`: 分类ID（默认new）
- `start`: 起始位置（默认0）
- `count`: 返回数量（默认10）

### 4. 搜索壁纸

```
GET /wallpaper/search?provider=360&kw=搜索关键词&start=0&count=10
```

参数说明：
- `provider`: 壁纸提供者（默认360）
- `kw`: 搜索关键词（必填）
- `start`: 起始位置（默认0）
- `count`: 返回数量（默认10）

### 5. 获取热门搜索

```
GET /wallpaper/hot-search?provider=360
```

### 6. 聚合多个提供者

```
POST /wallpaper/aggregate
Content-Type: application/json

{
  "providers": ["360"],
  "cid": "new",
  "start": 0,
  "count": 10
}
```

### 7. 聚合搜索结果

```
POST /wallpaper/aggregate-search
Content-Type: application/json

{
  "keyword": "搜索关键词",
  "providers": ["360"],
  "start": 0,
  "count": 10
}
```

## 360壁纸兼容接口

为了保持与原360壁纸API的兼容性，提供了以下接口：

### 获取所有分类
```
GET /wallpaper/360/getAllCategories
```

### 获取指定分类的壁纸
```
GET /wallpaper/360/getAppsByCategory?cid=new&start=0&count=10
```

### 搜索壁纸
```
GET /wallpaper/360/search?kw=搜索关键词&start=0&count=10
```

### 获取热门搜索
```
GET /wallpaper/360/hotSearch
```

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

## 数据结构

### 壁纸信息 (WallpaperInfo)
```typescript
{
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbUrl?: string;
  downloadUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  provider: string;
}
```

### 壁纸分类 (WallpaperCategory)
```typescript
{
  id: string;
  name: string;
  description?: string;
  count?: number;
  thumbUrl?: string;
  provider: string;
}
```

### 热门搜索 (HotSearchItem)
```typescript
{
  keyword: string;
  rank: number;
  count?: number;
  provider: string;
}
```

## 如何添加新的壁纸提供者

1. 创建一个新的提供者类，实现 `IWallpaperProvider` 接口
2. 在 `WallpaperModule` 中注册新的提供者
3. 在 `WallpaperService` 中注册新的提供者

示例：
```typescript
// providers/my-wallpaper-provider.ts
@Injectable()
export class MyWallpaperProvider implements IWallpaperProvider {
  getProviderName(): string {
    return 'my-provider';
  }
  
  // 实现其他方法...
}

// wallpaper.module.ts
@Module({
  providers: [WallpaperService, Wallpaper360Provider, MyWallpaperProvider],
  // ...
})

// wallpaper.service.ts
constructor(
  private readonly wallpaper360Provider: Wallpaper360Provider,
  private readonly myWallpaperProvider: MyWallpaperProvider
) {
  this.registerProvider(this.wallpaper360Provider);
  this.registerProvider(this.myWallpaperProvider);
}
```

## 注意事项

1. 360壁纸API的稳定性依赖于原始服务
2. 建议在生产环境中添加缓存机制
3. 需要根据实际情况调整请求头和参数
4. 跨域问题需要在nginx或其他反向代理中解决

## 目录结构

```
src/wallpaper/
├── dto/                    # 数据传输对象
│   └── query-wallpaper.dto.ts
├── interfaces/             # 接口定义
│   └── wallpaper-provider.interface.ts
├── providers/              # 壁纸提供者实现
│   └── wallpaper-360.provider.ts
├── wallpaper.controller.ts # 控制器
├── wallpaper.service.ts    # 服务
├── wallpaper.module.ts     # 模块
└── README.md              # 说明文档
```