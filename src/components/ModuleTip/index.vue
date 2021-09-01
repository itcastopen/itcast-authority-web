<template>
  <div>
    <div v-if="dataTable === undefined||dataTable.length===0" class="blankBox">
      暂时还没有数据哦～
    </div>
    <!-- <div v-if="listLoading" class="loadBox">
      正在加载中…
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'tip'
})
export default class extends Vue {
  @Prop() private dataTable!:any
  @Prop() private listLoading!:boolean
}
</script>

<style lang="scss">
</style>
