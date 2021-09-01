<template>
  <div v-if="flex" class="tree-column" :class="{border: border!== undefined}" :style="{ width: width + 'px', flex: flex}">
    <slot></slot>
  </div>
  <div v-else class="tree-column" :class="{border: border!== undefined}" :style="{ width: width + 'px'}">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'Column',
  props: {
    width: Number,
    field: String,
    label: String,
    flex: Number,
    border: String
  },
  data() {
      return {
          open: false
      }
  },
  mounted() {
  }
}
</script>
<style lang="scss">
  .tree-column{
    position: relative;
    padding: 12px 35px 13px;
    min-width: 60px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    &.border{
      // border-right: 1px solid #eee;
    }
  }
  .resize-line{
    position: absolute;
    top: 0;
    right: -3px;
    width:6px;
    height: 100%;
    cursor: col-resize;
  }
</style>
