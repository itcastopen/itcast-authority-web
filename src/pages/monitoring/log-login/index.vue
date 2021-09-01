<template>
  <div ref="getHeight" class="app-container">
    <div class="main">
      <h2 class="crumbsTitle">登录日志</h2>
      <div class="container tabCon">
        <!-- 搜索框 -->
        <div class="conSearch">
          <div class="serchForm">
            <el-form ref="ruleForm" :inline="true" :model="searchData">
              <el-row :gutter="18">
                <el-col :span="5">
                  <el-form-item label="账号：" prop="account">
                    <el-input
                      v-model="searchData.account"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="地区：" prop="location">
                    <el-input
                      v-model="searchData.location"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="IP：" prop="requestIp">
                    <el-input
                      v-model="searchData.requestIp"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="登录时间：" class="timeLabel" prop="loginDate">
                    <el-date-picker
                      v-model="searchData.loginDate"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      clearable
                      @change="handleTime"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="textRight">
            <el-button type="primary" class="f-right" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="resetSearch"> 重置 </el-button>
          </div>
        </div>
        <div v-if="dataTable.length>0">
          <el-table
            ref="table"
            :data="dataTable"
            border
            fit
            stripe
            highlight-current-row
          >
            <el-table-column align="center" width="80" type="index" label="">
              <template slot="header">
                <span> | 序号 </span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 账号 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.account }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 姓名 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.userName }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center">
              <template slot="header">
                <span> | IP </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.requestIp }}</span>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot="header">
                <span> | 浏览器 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.browser }}</span>
              </template>
            </el-table-column>

            <el-table-column class-name="status-col">
              <template slot="header">
                <span> | 浏览器版本 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.browserVersion }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span>
                  | 操作系统
                </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.operatingSystem }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span>
                  | 地区
                </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.location }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span>
                  | 登录时间
                </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.loginDate }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 描述 </span>
              </template>
              <template slot-scope="{ row }">
                <span v-if="row.description.indexOf('登录成功') !== -1" class="baseFontCorle">{{ ellipsis(row.description, 10) }}</span>
                <span v-else class="delect">{{ ellipsis(row.description, 10) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="total > 0"
            :total="Number(total)"
            :page.sync="pages.current"
            :limit.sync="pages.size"
            @pagination="getList"
          />
          <!-- end -->
        </div>
        <module-tip :data-table="dataTable" :list-loading="listLoading" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { ellipsis } from '@/utils'
// interface接口
import {
  TableData
} from '@/pages/monitoring/interface/types'
// 组件
import Pagination from '@/components/Pagination/index.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// api
import { getList } from '@/pages/monitoring/api/index'
@Component({
  name: 'loginList',
  components: {
    Pagination,
    ModuleTip
  }
})
export default class extends Vue {
  private dataTable: TableData[]=[]
  private listLoading = true
  private total = ''
  private timeID?: number = undefined
  private searchData = {
    account: '',
    location: '',
    requestIp: '',
    startCreateTime: '',
    endCreateTime: '',
    loginDate: [],
    size: 10,
    current: 1
  } as any
  private pages={
    size: 10,
    current: 1
  } as any
  /// 生命周期
  created() {
    this.initData()
  }
  /// // 功能函数 /////
  // 获取地区数据
  initData() {
    this.getList()
  }
  // 获取数据
  private async getList() {
    this.listLoading = true
    const parent = {
      account: this.searchData.account,
      location: this.searchData.location,
      requestIp: this.searchData.requestIp,
      startCreateTime: this.searchData.startCreateTime,
      endCreateTime: this.searchData.endCreateTime,
      ...this.pages
    }
    const { data } = await getList(parent)
    if (data.isSuccess === true) {
      this.dataTable = data.data.records
      this.total = data.data.total
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.1)
  }
  // 搜索
  private handleSearch() {
    this.pages.current = 1
    this.getList()
  }
  /// // ui /////
  // 重置
  resetSearch() {
    (this.$refs.ruleForm as ElForm).resetFields()
    delete this.searchData.startCreateTime
    delete this.searchData.endCreateTime
    delete this.searchData.loginDate
    this.getList()
  }
  // 动态模糊搜索
  querySearchOwner(queryString: any, cb: any) {
    let restaurants = this.dataTable
    let results = queryString
      ? restaurants.filter(this.createStateFilter(queryString))
      : restaurants
    clearTimeout(this.timeID)
    this.timeID = window.setTimeout(() => {
      cb(
        results.map((item:any) => {
          return {
            value: item.location,
            id: item.id
          }
        })
      )
    }, 1000 * Math.random())
  }
  createStateFilter(queryString: any) {
    return (state:any) => {
      return (
        (state.location as any).toLowerCase().indexOf(queryString.toLowerCase()) >
        -1
      )
    }
  }
  // 获取开始时间和结束时间
  handleTime(val:any) {
    this.searchData.startCreateTime = val[0]
    this.searchData.endCreateTime = val[1]
  }
  // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
}
</script>

<style lang="scss" scoped>
</style>
