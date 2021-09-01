<template>
  <div class="TitleLab" :style="styles">
    <span class="title">{{ title }}</span>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'TitleLab'
})
export default class extends Vue {
  @Prop({ default: '集团管理' }) private title!: string
  @Prop({ default: '' }) private styles!: any
}
</script>

<style lang="scss" scoped>
.TitleLab {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;

  .title {
    position: relative;
    padding-left: 20px;

    &::after {
      content: '';
      position: absolute;
      display: inline-block;
      width: 4px;
      height: 4px;
      background: #f00;
      left: 0;
      top: calc(50% - 5px);
    }

    &::before {
      content: '';
      position: absolute;
      display: inline-block;
      width: 4px;
      height: 4px;
      background: #f00;
      left: 0;
      top: calc(50% + 1px);
    }
  }
}
</style>
