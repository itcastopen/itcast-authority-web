<template>
  <div ref="getHeight" class="app-container">
    <div class="operationData">
      <el-button v-if="$hasPermission('role:config')" type="primary" @click="handleSave(tabIndex)"> 保存 </el-button>
    </div>
    <el-tabs
      v-model="activeName"
      type="card"
      class="roleTab"
      @tab-click="handleClick"
    >
      <el-tab-pane label="菜单管理" name="first">
        <checkbox-tree
          ref="checkTreeRef"
          :role-list="menuData"
          :resource-id-list="menuListData.resourceIdList"
          @getMenuList="getMenuList"
        />
        <!-- <tree-list v-if="menuData.length>0" ref="checkTreeRef" :list="menuData" :role="menuData" :resource-id="menuListData.resourceIdList" /> -->
        <module-tip :data-table="menuData" :list-loading="listLoading" />
      </el-tab-pane>
      <el-tab-pane label="数据权限" name="second">
        <tree-data
          :orgdata="orgListData"
          :active-names="formdata !== null ? formdata.dsType.code : ''"
          :tipshow="tipShow"
          @getOrgList="getOrgList"
          @gettype="getdsType"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
// 组件
import TreeList from './TreeNode.vue'
import TreeData from './TreeData.vue'
import CheckboxTree from './checkboxTree.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// interface接口
import { RoleTableData } from '@/pages/role/interface/types'
import { MenuTableData } from '@/pages/menu/interface/types'
// api
import { editRole, setRole } from '@/pages/role/api/index'
import { getMenuResource, getmenuList } from '@/pages/menu/api/index'
@Component({
  name: 'RoleList',
  components: {
    TreeList,
    TreeData,
    'checkbox-tree': CheckboxTree,
    ModuleTip
  }
})
export default class extends Vue {
  // @Prop() private roledata!:any
  @Prop() private allroleid!: {}
  @Prop() private formdata!: {}
  private activeName = 'first'
  private dataTable: RoleTableData[] = []
  private menuData: MenuTableData[] = []
  private orgListData = [] as any
  private listLoading = true
  private tipShow = false
  private tabIndex = '0'
  private keys = ''
  private dsType = {
    code: 'CUSTOMIZE',
    val: 4
  } as any
  private menuListData = {
    roleId: '',
    menuIdList: [],
    resourceIdList: []
  } as any
  private dialog = {
    id: '',
    msg: '',
    isVisible: false,
    isEnable: false,
    title: ''
  }
  private allRoleId = []
  private ids = []
  @Watch('formdata')
  getRoleid(val: any) {
    if (val !== null) {
      this.menuListData.roleId = val.id
      this.orgListData = val.orgList
      this.getMenuList(val.id)
    }
  }
  @Watch('allroleid')
  getAllRoleid(val: any) {
    this.menuListData.menuIdList = val.menuIdList
    this.menuListData.resourceIdList = val.resourceIdList
  }

  created() {
  }

  /// // 功能函数 /////
  // 初始化树状数据
  formatTreeData(currentData: any) {
    currentData.forEach((k: any) => {
      this.fmtTreeData(k)
    })

    return currentData
  }
  fmtTreeData = (data: any) => {
    data.forEach((v: any) => {
      this.$set(v, 'checkbox', false)
      this.$set(v, 'isIndeterminate', false)

      if (v.children && v.children.length > 0) {
        this.fmtTreeData(v.children)
      }
      if (v.resources && v.resources.length > 0) {
        this.fmtTreeData(v.resources)
      }
    })
    return data
  }
  private async getMenuList(id: string) {
    this.listLoading = true
    const { data } = await getMenuResource({ id: id })
    this.menuData = await this.flatten(data.data)

    if (
      this.menuListData.menuIdList.length > 0 ||
      this.menuListData.resourceIdList.length > 0
    ) {
      this.menuListData.menuIdList.forEach(async(item: any) => {
        this.menuData = await this.filterMenu(this.menuData, item)
      })
      this.menuListData.resourceIdList.forEach(async(item: any) => {
        this.menuData = await this.filterMenu(this.menuData, item)
      })
    }
    this.setTreeIndeterminateStatus(this.menuData)

    this.$store.commit('updatedmenuDataCheckboxList', this.menuData)
    this.listLoading = false
  }

  //  递归合并菜单和资源
  async flatten(arr: any) {
    let index = 0
    while (index < arr.length) {
      const obj = arr[index]
      obj.checkbox = false
      obj.isIndeterminate = false
      obj.children = obj.children ? await this.flatten(obj.children) : []
      index++
    }
    return arr
  }
  // 重新递归设置半选状态
  setTreeIndeterminateStatus(data: any) {
    data.forEach((v: any) => {
      let parentCheckedLength = 0
      let parentIndeterminateLength = 0
      // 菜单回选
      v.children.forEach((children: any) => {
        if (children.isIndeterminate) {
          parentIndeterminateLength++
        } else if (children.checkbox) {
          parentCheckedLength++
        }
      })
      // 按钮回选
      if (v.resources !== undefined && v.resources.length > 0) {
        v.resources.forEach((children: any) => {
          if (children.checkbox) {
            parentCheckedLength++
          }
        })
        v.checkAll = parentCheckedLength === v.resources.length
        v.isIndeterminateBtn =
          parentCheckedLength > 0 && parentCheckedLength < v.resources.length
      }

      v.isIndeterminate =
        (parentIndeterminateLength > 0 || parentCheckedLength > 0) &&
        parentCheckedLength < v.children.length

      if (v.children && v.children.length) {
        this.setTreeIndeterminateStatus(v.children)
      }
    })
  }

  // 递归 根据不同的菜单id筛选获取详情已选择的选项
  async filterMenu(arr: any, id: string) {
    let arrRes = [] as any
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
      node.checkedCities = []
      if (node.id === id) {
        node.checkedCities.push(id)
        node.checkbox = true
        // debugger
        arrRes.push(node)
        // break
      } else {
        if (node.resources) {
          this.filterMenu(node.resources, id)
          // debugger
        }
        if (node.children) {
          this.filterMenu(node.children, id)
        }

        arrRes.push(node)
        /** */
      }
    }
    return arrRes
  }
  // 递归 根据不同的菜单id筛选获取详情已选择的选项
  async filterMenuData(data: any) {
    let result = [] as any
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (item.checkbox || item.isIndeterminate) {
        result.push(item.id)
      }
      if (item.children.length > 0) {
        result = result.concat(await this.filterMenuData(item.children))
      }
    }
    return result
  }
  filterbtnData(data: any) {
    let btnResult = [] as any
    data.forEach(function getr(obj: any) {
      if (obj.checkbox) {
        btnResult = btnResult.concat(
          obj.resources
            .filter((num: any) => num.checkbox === true)
            .map((item: any) => item.id)
        )
      } else {
        btnResult = btnResult.concat(
          obj.resources
            .filter((num: any) => num.checkbox === true)
            .map((item: any) => item.id)
        )
      }
      if (obj.children.length > 0) obj.children.forEach(getr)
    })
    return Array.from(new Set(btnResult))
  }
  // 去重
  unique(arr: []) {
    return Array.from(new Set(arr))
  }
  // 保存
  private async handleSave(val: string) {
    // 选择菜单id
    let menuListData = await this.filterMenuData(this.menuData)
    let resourceIdData = this.$store.state.menubtnList
    if (val === '0') {
      const parent = {
        menuIdList: menuListData,
        resourceIdList: resourceIdData,
        roleId: (this.formdata as any).id
      }
      const { data } = await setRole(parent)
      if (data.isSuccess) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(data.msg)
      }
    } else {
      if (this.dsType.val === 4) {
        if (this.orgListData && this.orgListData.length === 0) {
          this.tipShow = true
          return false
        }
      } else {
        this.orgListData = []
      }
      const parent = {
        ...this.formdata,
        dsType: this.dsType,
        orgList: this.orgListData
      }
      const { data } = await editRole(parent)
      if (data.isSuccess) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(data.msg)
      }
      this.orgListData = []
    }

    this.$store.commit('updatedDataTreeId', (this.formdata as any).id)
    this.$forceUpdate()
    this.getMenuList((this.formdata as any).id)
    this.$emit('getlist')
  }
  /// // ui /////
  // 数据权限
  getOrgList(val: Array<string>) {
    this.orgListData = val
  }
  getdsType(val: Object) {
    this.dsType = val
  }
  handleClick(tab: any, event: any) {
    this.tabIndex = tab.index
  }
}
</script>

<style lang="scss" scoped></style>
