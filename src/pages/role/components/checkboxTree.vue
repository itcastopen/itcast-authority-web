<template>
  <div class="menuCollapse">
    <template v-for="(treeData, index) in roleList">
      <div :key="treeData.id">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item
            title=""
            :name="index"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
          >
            <div slot="title">
              <span>
                <el-checkbox
                  v-model="treeData.checkbox"
                  :indeterminate="treeData.isIndeterminate"
                  @change="
                    handleCheckAllChange({ val: treeData, checked: $event })
                  "
                >
                  {{ treeData.name }}
                </el-checkbox>
              </span>
            </div>
            <div class="children-item">
              <div class="menuList">
                <div v-if="treeData.resources.length > 0">
                  <div>
                    <p class="treeLeft">
                      <el-checkbox
                        v-model="treeData.checkAll"
                        :indeterminate="treeData.isIndeterminateBtn"
                        @change="handleCheckAllChanges(treeData, $event)"
                      >
                        全选
                      </el-checkbox>
                    </p>
                    <ul
                      v-if="treeData.resources && treeData.resources.length"
                      class="treeRigth"
                    >
                      <li
                        v-for="childrenData in treeData.resources"
                        :key="childrenData.id"
                      >
                        <el-checkbox-group
                          v-model="checkedCities"
                          @change="
                            handleCheckBtnChange(
                              $event,
                              treeData,
                              childrenData.checkbox
                            )
                          "
                        >
                          <el-checkbox
                            :label="childrenData.id"
                            @change="handleCheck($event, childrenData.id)"
                          >
                            {{ childrenData.name }}
                          </el-checkbox>
                        </el-checkbox-group>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-else class="noData">暂时还没有按钮数据哦～</div>
              </div>
              <template>
                <checkbox-tree
                  :role-list="treeData.children"
                  :resource-id-list="resourceIdList"
                />
              </template>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>
  </div>
</template>

<script>
  const returnCheckTree = (data, checkArr = []) => {
    data.forEach(v => {
      if (v.checkbox || v.isIndeterminate) {
        !checkArr.includes(v.id) && checkArr.push(v.id)
      }

      if (v.children && v.children.length) {
        returnCheckTree(v.children, checkArr)
      }
    })

    return checkArr
  }

  const returnEditRoleTreeIds = (data, checkArr = []) => {
    data.forEach(v => {
      !checkArr.includes(v.id) && checkArr.push(v.id)

      if (v.children && v.children.length) {
        returnEditRoleTreeIds(v.children, checkArr)
      }
    })

    return checkArr
  }

  const fmtTreeData = data => {
    data.forEach(v => {
      v.checkbox = false
      v.isIndeterminate = false

      if (v.children && v.children.length > 0) {
        fmtTreeData(v.children)
      }
    })
    return data
  }

export default {
  name: 'CheckboxTree',
  components: {
  },
  props: {
    roleList: {
      type: Array,
      default: () => []
    },
    resourceIdList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeName: '1',
      checkAll: false,
      checkedCities: [],
      isIndeterminate: false,
      cityOptions: []
    }
  },
  watch: {
    // 监听菜单按钮默认选中
    resourceIdList(val) {
      this.checkedCities = [...val]
    }
  },
  created() {
    // 将回调延迟到下次 DOM 更新循环之后执行按钮默认选中
    this.$nextTick(() => {
      this.checkedCities = this.resourceIdList
      this.$store.commit('updatedAllbtnMenuList', this.checkedCities)
    })
  },
  mounted() {},
  methods: {
    // 选择按钮
    handleCheckBtnChange(value, data, val) {
      let num = []
      value.forEach(obj => {
        data.resources.forEach(val => {
          if (obj === val.id) {
            num.push(obj)
          }
        })
      })
      let checkedCount = num.length
      data.checkAll = checkedCount === data.resources.length
      data.isIndeterminateBtn =
        checkedCount > 0 && checkedCount < data.resources.length
      this.$forceUpdate()
      this.$store.commit('updatedbtnMenuList', value)
    },
    handleCheck(val, id) {
      val === false && this.$store.commit('deletebtnMenuList', id)
    },
    // 全选、反选
    handleCheckAllChanges(val, e) {
      let cityOptions = []
      let checkedCities = []
      val.resources.forEach(obj => {
        if (e === false) {
          obj.checkbox = false
          checkedCities.push(obj.id)
        } else {
          checkedCities.push(obj.id)
        }
      })
      if (e === false) {
        let list = []
        list = this.$store.state.menubtnList.filter(item => {
            return checkedCities.indexOf(item) === -1
        })
        this.checkedCities = list
      } else {
        this.checkedCities = [
          ...new Set(this.checkedCities.concat(checkedCities).concat(this.$store.state.menubtnList))
        ]
      }
      this.$store.commit('updatedAllbtnMenuList', this.checkedCities)

      val.isIndeterminateBtn = false
      this.$forceUpdate()
    },
    handleCheckAllChange(data) {
      let { val, checked } = data
      if (val.children.length > 0) {
        // 处理下级
        this.findChildren(val.children, checked, val.parentId)
      } else {
        // 处理本级
        val.children.forEach(v => {
          v.checkbox = checked
        })
      }

      if (val.parentId !== -1) {
        // 处理上级
        this.findParent(this.$store.state.menuCheckboxList, val.parentId)
      }
      val.isIndeterminate = false
    },
    // 设置子级
    findChildren(list, checked) {
      list.forEach(child => {
        child.checkbox = checked
        child.isIndeterminate = false
        if (child.children.length > 0) {
          this.findChildren(child.children, checked)
        }
      })
    },
    // 设置这一整条线
    findParent(list, parentId) {
      list.forEach(k => {
        this.handleList(k, parentId)
      })
    },
    // 设置这一整条线具体方法
    handleList(child, parentId) {
      let parentCheckedLength = 0
      let parentIndeterminateLength = 0
      if (child.id === parentId) {
        child.children.forEach(children => {
          if (children.isIndeterminate) {
            parentIndeterminateLength++
          } else if (children.checkbox) {
            parentCheckedLength++
          }
        })

        child.checkbox = parentCheckedLength === child.children.length
        child.isIndeterminate =
          (parentIndeterminateLength > 0 || parentCheckedLength > 0) &&
          parentCheckedLength < child.children.length
        if (child.parentId !== -1) {
          this.findParent(this.$store.state.menuCheckboxList, child.parentId)
        }
      } else if (child.children.length > 0) {
        this.findParent(child.children, parentId)
      }
    },
    // 返回所有已选或权限的role
    returnAllCheckIds(currentData) {
      let roleIds = []
      currentData.forEach(k => {
        roleIds = [...returnCheckTree(k.menuTreeList), ...roleIds]
      })

      return roleIds.join(',')
    },
    // 编辑时回显权限数据
    refurbishTreeCheckStatus(checkData, allData) {
      let roleIds = []
      checkData.forEach(k => {
        roleIds = [...returnEditRoleTreeIds(k.menuTreeList), ...roleIds]
      })
      allData.forEach(k => {
        this.setTreeCheckStatus(k.menuTreeList, roleIds)
      })

      allData.forEach(k => {
        this.setTreeIndeterminateStatus(k.menuTreeList)
      })
    },
    // 初始化树状数据
    formatTreeData(currentData) {
      currentData.forEach(k => {
        fmtTreeData(k.menuTreeList)
      })

      return currentData
    },
    // 所有已选择的role全部设置为已选
    setTreeCheckStatus(data, roleIds = []) {
      data.forEach(v => {
        if (roleIds.includes(v.id)) {
          v.checkbox = true
        }

        if (v.children && v.children.length) {
          this.setTreeCheckStatus(v.children, roleIds)
        }
      })
    }
  }
}
</script>

<style scoped>
.check-group {
  margin: 0 -20px 15px -20px;
  padding: 10px 20px;
  background: rgb(242, 242, 242);
}
</style>
