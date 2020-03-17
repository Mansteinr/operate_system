# operate_system

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

###项目概述
  1、技术vue+elementui+axios
  2、总体来说 前端做的东西较多

  #### git remote rm origin

  然后，再关联GitHub的远程库：git remote add github git@github.com:chloneda/demo.git
  然后，再关联码云的远程库：git remote add gitee git@gitee.com:chloneda/demo.git

  ### 查看远程库
    git remote -v查看远程库信息：


      gitee   git@gitee.com:chloneda/demo.git (fetch)
      gitee   git@gitee.com:chloneda/demo.git (push)
      github  git@github.com:chloneda/demo.git (fetch)
      github  git@github.com:chloneda/demo.git (push)

      可以看到两个远程库，说明配置生效了

  #### 上传代码

    git add .
    git commit -m "update"


  #### 提交到github

    git push github master

  #### 提交到github

    git push gitee master

  #### 更新代码

    # 从github拉取更新
    git pull github

    # 从gitee拉取更新
    git pull gitee