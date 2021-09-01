<template>
  <div class="dashboard-container">
    <div class="main">
      <div class="userInfo">
        <div class="userL">
          <!-- <span class="userHead"></span> -->
          <span v-if="userInfo.avatar === ''" class="userHead"></span>
          <img v-else :src="userInfo.avatar">
        </div>
        <div class="userR">
          <h2>{{ userInfo.name }}</h2>
          <p>{{ userInfo.workDescribe }}</p>
          <p>上次登录时间：{{ userInfo.lastLoginTime }}</p>
        </div>
      </div>
      <div class="container">
        <div class="titIcon">项目介绍</div>
        <div class="introduce">
          权限系统，对于任何一个后台系统来讲，都是非常重要的。随着企业业务的扩展，不同业务系统权限控制方式不统一，导致开发面临系统重构、开发对接效率低、维护成本增加等问题。所以，我们需要一个通用的权限系统，它不仅安全性高、便于使用、界面美观，并且可以不侵入业务、支持高并发。权限管家系统，不仅能够解决企业开发中遇到的痛点和难点，也是小伙伴们学习技术源码、框架设计以及常用微服务架构等经典知识的平台和途径！
        </div>
        <div class="titIcon">技术亮点</div>
        <div class="lightInfo">
          <ul>
            <li><span></span>系统基于SpringCloud(Hoxton.SR3)  +SpringBoot(2.2.5.RELEASE) 的微服务框架，具备通用的用户管理、资源权限管理、网关统一鉴权、XSS防跨站攻击等多个模块，支持多业务系统、多服务并行开发，可以作为后端服务的开发脚手架；</li>
            <li><span></span>核心技术采用SpringBoot、Zuul、Nacos、Fegin、Ribbon、Hystrix、JWT Token、Mybatis Plus等主要框架和中间件；</li>
            <li>
              <span></span>采用mysql数据库进行数据持久化，使用redis缓存技术优化系统性能；
            </li>
            <li>
              <span></span>系统通过RESTful架构，实现对外提供服务；
            </li>
            <li><span></span>功能上支持操作权限和数据权限的授权，授权方式多样性，拥有多级授权和自定义授权；</li>
            <li><span></span>权限管理时，可通过系统配置来满足不同的需求；</li>
            <li><span></span>系统拥有导入、导出功能，部署方便。</li>
          </ul>
        </div>
        <div class="titIcon">使用说明</div>
        <div class="explain">
          <p>
            本项目使用Nacos集成注册中心和配置中心功能合二为一，Nacos是阿里巴巴开源的一款支持服务注册、发现、配置管理以及微服务管理的组件，用来取代以前常用的注册中心（zookeeper , eureka等），以及配置中心（spring cloud config等）。搭建好Nacos后导入配置信息，即可编译启动权限系统，具体使用方法参考"权限管家操作手册"。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUser } from '@/utils/cookies'
@Component({
  name: 'Dashboard'
})
export default class extends Vue {
  private userInfo = {}
  // 挂载结束
  mounted() {
    // 获取用户信息
    const users:any = getUser()
    this.userInfo = JSON.parse(users.toString())
  }
}
</script>

<style lang="scss">
.userInfo {
  padding: 3px 12px 12px;
  h2 {
    font-size: 14px;
    color: #303133;
    font-weight: normal;
    margin: 0 0 8px;
  }
  p {
    font-size: 12px;
    color: #606266;
    padding: 0;
    margin: 5px 0;
  }
  .userL {
    width: 44px;
    float: left;
    img{
      width: 44px;
      height: 44px;
      border-radius: 22px;
    }
    span {
      &.userHead {
        display: inline-block;
        width: 44px;
        height: 44px;
        border-radius: 23px;
      }
    }
  }
  .userR {
    margin-left: 55px;
    padding-top: 4px;
  }
}
.introduce {
  line-height: 32px;
  padding: 9px 14px 28px;
}
</style>
