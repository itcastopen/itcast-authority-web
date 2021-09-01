/* eslint-disable */
<template>
  <div
    class="tree-block"
    :draggable="!!isdraggable"
    @dragstart="dragstart($event)"
    @dragend="dragend($event)"
  >
    <div
      class="tree-row"
      :data-level="depth"
      :tree-id="model[custom_field.id]"
      :tree-p-id="model[custom_field.parentId]"
      :class="{ 'highlight-row': model.highlight}"
      :style="{ backgroundColor: model.backgroundColor }"
      @click="toggle(model,$event)"
    >
      <column
        v-for="(subItem, subIndex) in columns"
        :key="subIndex"
        :class="['align-' + subItem.align, 'colIndex' + subIndex]"
        :field="subItem.field"
        :width="subItem.width"
        :flex="subItem.flex"
        :border="border"
      >
        <span v-if="subItem.type === 'selection'">
          <space :depth="depth" />
          <span
            v-if="model[custom_field.lists] && model[custom_field.lists].length"
            class="zip-icon"
            :class="[
              model[custom_field.open] ? 'arrow-bottom' : 'arrow-right'
            ]"
          >
          </span>
          <span v-else class="zip-icon arrow-transparent"> </span>
          <span
            v-if="subItem.formatter"
            v-html="subItem.formatter(model)"
          ></span>
          <span v-else v-html="model[subItem.field]"></span>
        </span>
        <span v-else-if="subItem.type === 'action'">
          <span v-if="model.status!==undefined">
            <el-button
              v-for="(acItem, acIndex) in subItem.actions"
              :key="acIndex"
              class="action-item"
              type="text"
              size="small"
              :disabled="!model.status||model.parentStatus===false"
              @click.stop.prevent="acItem.onclick(model)"
            >
              <i :class="acItem.icon" v-html="acItem.formatter(model)"></i>
            </el-button>
          </span>
          <span v-if="model.isEnable!==undefined">
            <el-button
              v-for="(acItem, acIndex) in subItem.actions"
              :key="acIndex"
              class="action-item"
              type="text"
              size="small"
              :disabled="!model.isEnable||model.parentIsEnable===false"
              @click.stop.prevent="acItem.onclick(model)"
            >
              <i :class="acItem.icon" v-html="acItem.formatter(model)"></i>
            </el-button>
          </span>
        </span>
        <span v-else-if="subItem.type === 'switch'">
          <span v-for="(acItem, acIndex) in subItem.actions"
                :key="acIndex"
          >
            <span v-if="model.status!==undefined">
              <span v-if="model.parentStatus===false" class="actionSwitch disabledSwitch" @click="handleClick"></span>
              <div v-else @click.stop.prevent="acItem.onclick(model.status = !model.status, model)">
                <span class="actionSwitch" :class="{'actionSwitchOn': model.status}"></span>
              </div>
            </span>
            <span v-if="model.isEnable!==undefined">
              <span v-if="model.parentIsEnable===false" class="actionSwitch disabledSwitch" @click="handleClick"></span>
              <div v-else @click.stop.prevent="acItem.onclick(model.isEnable = !model.isEnable, model)">
                <span class="actionSwitch" :class="{'actionSwitchOn': model.isEnable}"></span>
              </div>
            </span>

          </span>
        </span>
        <span v-else>
          <span
            v-if="subItem.formatter"
            v-html="subItem.formatter(model)"
          ></span>
          <span v-else>{{ model[subItem.field] }}</span>
        </span>
      </column>
      <div class="hover-model" style="display: none">
        <div class="hover-block prev-block">
          <i class="el-icon-caret-top"></i>
        </div>
        <div class="hover-block center-block">
          <i class="el-icon-caret-right"></i>
        </div>
        <div class="hover-block next-block">
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
    </div>
    <div v-for="(item, index) in model[custom_field.lists]" :key="index">
      <row
        v-show="model[custom_field.open]"
        v-if="isFolder"
        :model="item"
        :columns="columns"
        :isdraggable="isdraggable"
        :border="border"
        :depth="depth * 1 + 1"
        :custom_field="custom_field"
        :on-check="onCheck"
        :is-contain-children="isContainChildren"
        @click.native="handleChild(item)"
      />
    </div>
  </div>
</template>
    <script>
import column from './column.vue'
import space from './space.vue'
export default {
  name: 'Row',
  components: {
    column,
    space
  },
  props: [
    'model',
    'depth',
    'columns',
    'isdraggable',
    'border',
    'custom_field',
    'onCheck',
    'isContainChildren'
  ],
  data() {
    return {
      open: false,
      visibility: 'visible'
    }
  },
  computed: {
    isFolder() {
      return (
        this.model[this.custom_field.lists] &&
        this.model[this.custom_field.lists].length
      )
    }
  },
  methods: {
    handleChild(val) {
      this.$emit('handleClickRow', val)
       this.$emit('getList', val.id)
    },
    toggle(val, e) {
      let lists = this.$store.state.orgData
      this.setActive(lists, val)
      this.$emit('getList', val.id)
      this.$emit('handleClickRow', val)
      if (this.isFolder) {
        this.model[this.custom_field.open] = !this.model[this.custom_field.open]
        this.$forceUpdate()
      }
    },
    dragstart(e) {
      if (navigator.userAgent.indexOf('Firefox') >= 0) {
        // Firefox drag have a bug
        e.dataTransfer.setData('Text', this.id)
      }
      window.dragId = e.target.children[0].getAttribute('tree-id')
      window.dragPId = e.target.children[0].getAttribute('tree-p-id')
      window.dragParentNode = e.target
      e.target.style.opacity = 0.2
    },
    dragend(e) {
      e.target.style.opacity = 1
    },
    setAllCheckData(curList, flag) {
      const listKey = this.custom_field.lists
      for (let i = 0; i < curList.length; i++) {
        let item = curList[i]
        this.$set(item, 'checked', flag)
        if (item[listKey] && item[listKey].length) {
          this.setAllCheckData(item[listKey], flag)
        }
      }
    },
    onCheckboxClick(evt, model) {
      const list = model[this.custom_field.lists]
      // 判断是否有子节点，如有需递归处理
      if (list && this.isContainChildren) {
        this.setAllCheckData([model] || [], !!evt.target.checked)
      } else {
        this.$set(model, 'checked', !!evt.target.checked)
      }
      this.onCheck && this.onCheck()
    },
    handleClick() {
      this.$message.error('请先启用上级')
    },
    setActive(curList, flag) {
      for (let i = 0; i < curList.length; i++) {
        let item = curList[i]
        if (item.id === flag.id) {
          item.highlight = true
        } else {
          item.highlight = false
        }
        // this.$set(item, 'checked', flag)
        if (item.children && item.children.length) {
          this.setActive(item.children, flag)
        }
      }
    }
  }
}
</script>
  <style lang="scss">
.tree-block {
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
}
.tree-row {
  position: relative;
  display: flex;
  //   padding: 10px 10px;
  border-bottom: 1px solid #eee;
  line-height: 26px;
  &:hover {
    background: #ecf5ff;
  }
  &.highlight-row {
    background: #ecf5ff;
  }
  .align-left {
    text-align: left;
  }
  .align-right {
    text-align: right;
  }
  .align-center {
    text-align: center;
  }
}
.hover-model {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fbfcfd;
}
.hover-block {
  display: flex;
  opacity: 0.1;
  transition: opacity 0.5s;
  justify-content: center;
  align-items: center;
  i {
    color: #fff;
  }
}
.prev-block {
  height: 25%;
  // background: #a0c8f7;
}
.center-block {
  height: 50%;
  // background: #a0c8f7;
}
.next-block {
  height: 25%;
  // background: #a0c8f7;
}
.action-item {
  color: var(--current-color);
  cursor: pointer;
  i {
    font-style: normal;
  }
}
.zip-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  // background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAf0lEQVQ4T7XT0Q2AMAhF0dvNdALdSEdzBB3BDXQD85LGRNMCauS7nAKBxMdIhfwemIAtYpeAEeiANoLUgAGYI4gFqAMX8QAXiQBCNFDNRBVdIgpUkSfADjT3KqLACmg/XrWw5J+Li+VVYCZrMBbgJluA+tXA3Hv45ZgiR3i+OQBeSyYRPEyeUAAAAABJRU5ErkJggg==")
  //   no-repeat center;
  // background-size: cover;
border-right: 1px solid #909399;
border-bottom: 1px solid #909399;
transform: rotate(45deg);
content: '';
margin-top: -2px;
margin-right: 8px;
}
.arrow-transparent {
  visibility: hidden;
}
.arrow-right {
}
.arrow-bottom {
  margin-top:0;
  transform: rotate(225deg);
}
[draggable="true"] {
  -khtml-user-drag: element;
}
</style>
