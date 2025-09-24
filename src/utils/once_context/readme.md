# OnceContext

这个module用来存放临时的上下文，例如一次性code，提供ttl过期销毁

1. set
    context 存放上下文
    ttl[可选] 期限
    uniqueId 唯一id 可能会出现重复set的情况，用uniqueId来识别

    返回 code
2. get
    使用 code 获取还在有效期内的 context
3. checkHasUnique
    一个场景可能设置一个 uniqueId 避免重复