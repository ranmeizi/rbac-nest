# RBAC-NEST

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

### 迁移

需要使用迁移时，使用迁移修改数据库，当然也有不需要的时候

- 创建迁移

```
pnpm migration:generate migrations/{migrate_name}
```

书写 up down 函数进行 迁移/回滚操作。使用 entity 生成 orm 会自动生成ddl语句

- 迁移 up
```
pnpm migration:run
```

- 回滚 down
```
pnpm typeorm migration:revert
```

### 生成语句

nest-cli 有很便利的生成 controller services 测试 一条龙的语句

https://nestjs.bootcss.com/cli/usages.html#nest-generate

### 实体

创建数据表操作实体

### typeorm 使用 typeorm 操作数据库

https://www.typeorm.org/


### 开发工具 apifox 

## 开发流程

1. 写 apifox 文档
2. 创建对应实体 / 创建对应数据表
3. orm 生成数据表 / 由数据表创建实体
4. 修改实体
5. nest gen res 
6. 实现接口
7. apifox 书写测试用例(可以当作简易前端用)

## 开发计划

1. Users
2. Roles
3. Permission
4. Authentication - jwt 守卫
5. Authorization

是否需要前端？ 或是 apifox 可以当作前端。

