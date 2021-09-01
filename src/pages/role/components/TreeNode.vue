<template>
  <div class="menuCollapse">
    <div v-for="(item,index) in list" :key="index">
      <el-collapse v-model="activeName" accordion @change="hanleClick(item,index)">
        <el-collapse-item title="" :name="index" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading">
          <div slot="title">
            <span>
              <el-checkbox v-model="item.checkbox" :indeterminate="item.isIndeterminate" @change="handleCheckAllChange({ val: item, checked: $event })">
                {{ item.name }}
              </el-checkbox>
            </span>
          </div>

          <div class="children-item">
            <div class="menuList">
              <ul v-if="item.resources.length>0">
                <li v-for="val in item.resources" :key="val.id"><el-checkbox v-model="val.checkbox" @change="hanleClickBox(val)"><span :title="val.name">{{ ellipsis(val.name, 5) }}</span></el-checkbox></li>
              </ul>
              <div v-else class="noData">
                暂时还没有按钮数据哦～
              </div>
            </div>
            <template>
              <tree-list :list="item.children" :role="menuData" />
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ellipsis } from '@/utils'
// api接口
import { getmenuList } from '@/pages/menu/api/index'
@Component({
  name: 'tree-list'
})
export default class extends Vue {
  @Prop() private list!: []
  @Prop() private resourceId!:[]
  @Prop() private menuData!:[]
  private roleData = []
  private activeName= '1'
  private clientToken:any
  private checkedVal=[]
  private checkboxData = []
  private datas = []
  private role=[]
  private allCheckboxIds = [] as any
 @Watch('list', { deep: true })
 getMenuData(val:any) {
   this.role = val
 }
  @Watch('roleData', { immediate: true })
  getRoleData(val:any) {
    // 反选
    if (val.length > 0) {
      this.$store.state.menubtnList.forEach(async(obj:any) => {
        // if (obj.parendId === this.roledata.id) {
          val.forEach((ele:any) => {
            if (obj === ele.id) {
               ele.checkbox = true
            }
          })
        // }
      })
    }
  }
  // 功能
  // 获取按钮列表
  private async getmenList(id:string) {
    const resourceId = this.$store.state.menuData
    const { data } = await getmenuList({ menuId: id })
    this.roleData = data.data.records.map((obj: any) => ({ ...obj, checkbox: false }))
    // 反选
    if (resourceId.length > 0) {
      resourceId.forEach(async(obj:any) => {
        this.roleData.forEach((ele:any) => {
            if (obj === ele.id) {
               ele.checkbox = true
            }
          })
      })
    }
  }
  // ui
  // 获取按钮列表
  hanleClick(val:any) {

  }
  handleCheckAllChange(data:any) {
    let { val, checked } = data

    if (val.children.length > 0) {
      // 处理下级
      this.findChildren(val.children, checked)
    } else {
      // 处理本级
      val.children.forEach((v:any) => {
        v.checkbox = checked
      })
    }
    if (val.parentId !== -1) {
      // 处理上级
      this.findParent(this.list, val.parentId)
    }

    val.isIndeterminate = false
  }
  // 设置子级
  findChildren(list:any, checked:any) {
    list.forEach((child:any) => {
      child.checkbox = checked
      child.isIndeterminate = false
      if (child.children.length > 0) {
        this.findChildren(child.children, checked)
      }
    })
  }
  // 设置这一整条线
  findParent(list:any, parentId:any) {
    list.forEach((k:any) => {
      this.handleList(k, parentId)
    })
  }
  // 设置这一整条线具体方法
  handleList(child:any, parentId:any) {
    let parentCheckedLength = 0
    let parentIndeterminateLength = 0
    if (child.id === parentId) {
      child.children.forEach((children:any) => {
        if (children.isIndeterminate) {
          parentIndeterminateLength++
        } else if (children.checkbox) {
          parentCheckedLength++
        }
      })
      child.checkbox = parentCheckedLength === child.children.length
      child.isIndeterminate = (parentIndeterminateLength > 0 || parentCheckedLength > 0) && parentCheckedLength < child.children.length
      if (child.parentId !== -1) {
        this.findParent(this.list, child.parentId)
      }
    } else if (child.children.length > 0) {
      this.findParent(child.children, parentId)
    }
  }
  // 递归 根据不同的菜单id筛选获取详情已选择的选项
  async filterMenu(arr:any, id:string) {
    let arrRes = [] as any
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
      // node.checkbox = false
      if (node.id === id) {
        node.checkbox = true
        arrRes.push(node)
          // break
      } else {
        if (node.children) {
          this.filterMenu(node.children, id)
        }
          if (node.resources) {
          this.filterMenu(node.resources, id)
        }
        arrRes.push(node)
          /** */
      }
    }
    return arrRes
  }

  hanleClickBox(val:any) {
    this.$set(this.list, val.checkbox, [])
    this.$forceUpdate()
  }
  findChildrenresources(list:any, val:any) {
    list.forEach((child:any) => {
      if (child.id === val.id) {
        child.checkbox = val.checkbox
      }
    })
  }
  // 重新递归设置半选状态
  setTreeIndeterminateStatus(data:any) {
    data.forEach((v:any) => {
      let parentCheckedLength = 0
      let parentIndeterminateLength = 0
      v.children.forEach((children:any) => {
        if (children.isIndeterminate) {
          parentIndeterminateLength++
        } else if (children.checkbox) {
          parentCheckedLength++
        }
      })
      v.isIndeterminate = (parentIndeterminateLength > 0 || parentCheckedLength > 0) && parentCheckedLength < v.children.length

      if (v.children && v.children.length) {
        this.setTreeIndeterminateStatus(v.children)
      }
    })
  }
      // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
}
</script>

<style lang="scss"></style>
