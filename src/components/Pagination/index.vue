<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { scrollTo } from '@/utils/scroll-to'

@Component({
  name: 'Pagination'
})
export default class extends Vue {
  @Prop({ required: true }) private total!: number
  @Prop({ default: 1 }) private page!: number
  @Prop({ default: 10 }) private limit!: number
  @Prop({ default: () => [10, 20, 30, 50] }) private pageSizes!: number[]
  @Prop({ default: 'total, prev, pager, next' }) //, sizes, jumper
  private layout!: string
  @Prop({ default: true }) private background!: boolean
  @Prop({ default: true }) private autoScroll!: boolean
  @Prop({ default: false }) private hidden!: boolean

  get currentPage() {
    return this.page
  }

  set currentPage(value) {
    this.$emit('update:page', value)
  }

  get pageSize() {
    return this.limit
  }

  set pageSize(value) {
    this.$emit('update:limit', value)
  }

  handleSizeChange(value: number) {
    this.$emit('pagination', { page: this.currentPage, limit: value })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
  }

  handleCurrentChange(value: number) {
    this.$emit('pagination', { page: value, limit: this.pageSize })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
  }
}
</script>

<style lang="scss">
.pagination-container {
  text-align: right;
  padding: 45px 0;
  .el-pagination {
    padding: 0;
    font-weight: normal;
    font-size: 14px;
    button {
      min-width: auto;
      padding: 0;
    }
  }
}
.el-pager li {
  line-height: 26px;
  &.active,
  &:hover {
    color: var(--current-color);
    cursor: pointer;
  }
}
.el-pagination .btn-prev,
.el-pagination .btn-next {
  color: #606266;
  &:hover {
    color: var(--current-color);
  }
}
</style>
