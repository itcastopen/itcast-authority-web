<template>
  <div class="el-tree-select" :class="selectClass">
    <!-- 下拉文本 -->
    <el-select
      ref="select"
      v-model="labels"
      v-popover:popover
      v-bind="selectParams"
      :disabled="disabled"
      popper-class="select-option"
      :popper-append-to-body="false"
      :filterable="false"
      :multiple="selectParams.multiple"
      :title="labels"
      :style="styles"
      class="el-tree-select-input"
      @clear="selectClearFun"
      @focus="popoverShowFun"
    >
      <el-option :value="labels">
        <!-- 弹出框 -->
        <el-popover
          ref="popover"
          v-model="visible"
          :placement="placement"
          :popper-class="popperClass"
          :width="width"
          trigger="click"
        >
          <el-input
            v-model="keywords"
            class="selectInput"
            :placeholder="selectParams.placeholder"
            suffix-icon="el-icon-search"
          />
          <!-- <el-input
        v-model="keywords"
        class="selectInput"
        :placeholder="selectParams.placeholder"
        suffix-icon="el-icon-search"
        @change="searchFun"
      /> -->
          <el-scrollbar
            tag="div"
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list"
            class="is-empty"
          >
            <!-- 树列表 -->
            <el-tree
              v-show="data.length > 0"
              ref="tree"
              :check-strictly="checkStrictly"
              :default-expand-all="false"
              :accordion="true"
              :data="data"
              :node-key="propsValue"
              :draggable="false"
              :current-node-key="ids.length > 0 ? ids[0] : ''"
              :filter-node-method="filterFuntion"
              :render-content="treeRenderFun"
              @node-click="treeNodeClickFun"
            />
            <!-- 暂无数据 -->
            <div v-if="data.length === 0" class="no-data">暂无数据</div>
          </el-scrollbar>
        </el-popover>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { Tree as ElTree } from 'element-ui'
@Component({
  name: 'TreeSelect'
})
// @group api
export default class extends Vue {
  @Prop({
    default: () => {
      return ''
    }
  })
  private value!: ['', [], Number]

  @Prop({
    default: () => {
      return {}
    }
  })
  private styles!: {}

  @Prop({
    default: () => {
      return ''
    }
  })
  private selectClass!: string

  @Prop({
    default: () => {
      return ''
    }
  })
  private popoverClass!: string

  @Prop({
    default: () => {
      return false
    }
  })
  private disabled!: boolean

  @Prop({
    default: () => {
      return 'bottom'
    }
  })
  private placement!: string
  @Prop() private treeRenderFun!: Function

  @Prop({
    default: () => {
      return {
        clearable: true,
        disabled: false,
        placeholder: '请选择'
      }
    }
  })
  private selectParams!: {
    multiple: boolean
  }

  @Prop({
    default: () => {
      return {
        clickParent: false,
        filterable: false,
        data: [],
        props: {
          children: 'children',
          label: 'label',
          code: 'code',
          value: 'flowId',
          disabled: 'disabled'
        }
      }
    }
  })
  private treeParams!: {
    data: any
    props: any
    clickParent: any
  }
  @Prop()
  private orgData!: {}
  @Prop() private orgName!: ''
  @Prop() private orgId!: ''
  @Prop() private userIds!: []
  private propsValue: string = 'flowId'
  private propsLabel: string = 'name'
  private propsCode: any // 可能有空的情况
  private propsDisabled: string = 'disabled'
  private propsChildren: string = 'children'
  private data = [] as any[]
  private keywords: string = ''
  private labels = '' as any // 存储名称，用于下拉框显示内容
  private ids = [] as any[] // 存储id
  private visible = false // popover v-model
  private width = 150
  private el: any = this.$refs
  private checkStrictly = false
  @Watch('ids')
  getIds(val: any) {
    if (val !== undefined) {
      this.$nextTick(() => {
        this.setSelectNodeFun(val)
      })
    }
  }
  @Watch('userIds')
  getuserIds(val: any) {
    this.labels = val
    if (this.selectParams.multiple) {
      this.labels = []
      this.ids = val
    } else {
      this.labels = ''
      this.ids = val instanceof Array ? val : [val]
    }
  }
  @Watch('value')
  getvalue(val: any) {
    if (this.ids !== val) {
      this.setMultipleFun()
      if (this.selectParams.multiple) {
        this.ids = [...val]
      } else {
        this.ids = val === '' ? [] : [val]
      }
    }
  }
  @Watch('keywords')
  getkeywords(value: any) {
    (this.$refs.tree as ElTree).filter(value)
  }
  @Watch('orgId')
  getorgName(value: any) {
    if (value !== '') {
      const { props, data } = this.treeParams
      if (data !== null) {
        // 不让选择父级
        // if (
        //   !(
        //     this.el.tree.getNode(value).data.children &&
        //     this.el.tree.getNode(value).data.children.length !== 0
        //   )
        // ) {
        //   this.labels = this.el.tree.getNode(value).data[ this.treeParams.props.label ]
        // }
        // 可以选择父级
        this.labels = this.el.tree.getNode(value).data[ this.treeParams.props.label ]
      }
    } else {
      this.labels = ''
    }
  }
  // @Watch('ogrId')
  // getorgId(val: any) {
  //   this.labels = val
  // }
  get popperClass() {
    let _c = 'el-tree-select-popper ' + this.popoverClass
    return this.disabled ? _c + ' disabled ' : _c
  }
  /// 生命周期
  created() {
    const { props, data } = this.treeParams
    this.setMultipleFun()
    this.propsValue = props.value
    this.propsLabel = props.label
    this.propsCode = props.code || null // 可能为空
    this.propsDisabled = props.disabled
    this.propsChildren = props.children
    this.data = data.length > 0 ? [...data] : []
    // this.getuserIds
    // this.treeDataUpdateFun(this.data)
  }
  mounted() {
    this.updateH()
  }
  // 根据类型判断单选，多选
  setMultipleFun() {
    let multiple = false
    if (this.value instanceof Array) {
      multiple = true
    }
    this.$set(this.selectParams, 'multiple', multiple)
  }
  //  根据id筛选当前树名称，以及选中树列表
  setSelectNodeFun(ids: any) {
    if (!this.el.tree) {
      throw new Error('找不到tree dom')
    }
    const { multiple } = this.selectParams
    // 长度为0，清空选择
    if (ids.length === 0 || this.data.length === 0) {
      this.labels = multiple ? [] : ''
      if (multiple) {
        this.el.tree.setCheckedKeys([])
      } else {
        this.el.tree.setCurrentKey(null)
      }
      return
    }
    if (multiple) {
      // element-ui bug. 如果是父子节点全选 el.setCheckedKeys([非全量id]);之后el.getCheckedNodes()还是全量
      this.el.tree.getCheckedNodes().forEach((item: any) => {
        this.el.tree.setChecked(item, false)
      })
      ids.forEach((id: any) => {
        this.el.tree.setChecked(id, true)
      })
      const nodes = this.el.tree.getCheckedNodes()
      if (this.propsCode) {
        // 如果有code   labels=code(name)
        this.labels =
          nodes.map((item: any) =>
            item[this.propsCode]
              ? item[this.propsLabel] + '(' + item[this.propsCode] + ')'
              : item[this.propsLabel]
          ) || []
      } else {
        this.labels =
          nodes.map((item: any) => {
            // if (!(item.children && item.children.length !== 0)) {
              return item[this.propsLabel]
            // }
          }) || []
      }
    } else {
      this.el.tree.setCurrentKey(ids[0])
      const node = this.el.tree.getCurrentNode()
      if (node) {
        if (this.propsCode) {
          // 如果有code   labels=code(name)
          this.labels = node[this.propsCode]
            ? node[this.propsLabel] + '(' + node[this.propsCode] + ')'
            : node[this.propsLabel]
        } else {
          this.labels = node[this.propsLabel]
        }
      } else {
        this.labels = ''
      }
    }
    this.updatePopoverLocationFun()
  }
  // 更新popover位置
  updatePopoverLocationFun() {
    // dom高度还没有更新，做一个延迟
    // const el:any = this.$refs
    setTimeout(() => {
      this.el.popover.updatePopper()
    }, 50)
  }
  // 树过滤
  filterFuntion(value: string, data: any, node: any) {
    if (!value) {
      return true
    }
    return data.label && data.label.indexOf(value) !== -1
  }
  // 树点击
  treeNodeClickFun(data: any, node: any, vm: any) {
    // this.$set(node,'checked',false)
    this.$emit('getValue', data.id)
    const { multiple } = this.selectParams
    const { clickParent } = this.treeParams
    const { propsValue, propsChildren, propsDisabled } = this
    if (data[propsDisabled]) {
      // 禁用
      return
    }
    if (node.checked) {
      const value = data[this.propsValue]
      this.ids = this.ids.filter(id => id !== value)
    } else {
      if (!multiple) {
        // 多选，不关闭，单选，判断是否允许点击父级关闭弹出框
        if (!clickParent) {
          const children = data[propsChildren]
          // 如果不允许点击父级,自身为末级，允许点击之后关闭
          if (!children || children.length === 0) {
            this.ids = [data[propsValue]]
            this.visible = false
          } else {
            // 不允许父级，阻止继续派发
            return false
          }
        } else {
          this.ids = [data[propsValue]]
          this.visible = false
        }
      } else {
        this.ids.push(data[propsValue])
      }
    }
    this.emitFun()
    // this.$emit('node-click', data, node, vm)
  }
  // 下拉框清空数据
  selectClearFun() {
    this.ids = []
    const { multiple } = this.selectParams
    // 下拉框清空，对外抛出``this.$emit('input', multiple ? [] : '');`
    this.$emit('input', multiple ? [] : '')
    // 下拉框清空，对外抛出``this.$emit('select-clear');`
    this.$emit('select-clear')
    this.updatePopoverLocationFun()
  }
  // 判断类型，抛出当前选中id
  emitFun() {
    const { multiple } = this.selectParams
    this.$emit(
      'input',
      multiple ? this.ids : this.ids.length > 0 ? this.ids[0] : ''
    )
    this.updatePopoverLocationFun()
  }
  // 更新宽度
  updateH() {
    this.$nextTick(() => {
      this.width = this.el.select.$el.getBoundingClientRect().width
    })
  }
  // 显示弹出框的时候容错，查看是否和el宽度一致
  popoverShowFun(val: any) {
    this.updateH()
  }
  treeDataUpdateFun(data: any) {
    this.data = data
    // 数据更新完成之后，判断是否回显内容
    if (data.length > 0) {
      setTimeout(() => {
        this.setSelectNodeFun(this.ids)
      }, 300)
    }
  }
  // filterFun(val: any) {
  //   ;(this.$refs.tree as ElTree).filter(val)
  // }
}
</script>
<style scoped>
.el-tree {
  color: #424250;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: 32px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #424250;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.selectInput {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
<style>
.el-tree-node.is-current > .el-tree-node__content {
  background: #ecf5ff;
}
.el-tree-node__expand-icon {
  color: #909399;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  padding-left: 4px;
  padding-right: 4px;
}
.el-tree-node__children .el-tree-node > .el-tree-node__content {
  padding-left: 14px !important;
}
</style>
