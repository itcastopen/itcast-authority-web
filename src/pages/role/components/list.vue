<template>
  <div class="container">
    <checkboxTree ref="checkTreeRef" :role-list="tableData" />
  </div>
</template>

<script>
import checkboxTree from './checkboxTree'
export default {
  name: 'Role',
  components: {
    checkboxTree
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableData = [
        {
          applicationModule: 'xxx',
          menuTreeList: [
            {
              id: 40000,
              parentId: -1,
              children: [
                {
                  id: 40005,
                  parentId: 40000,
                  children: [],
                  name: 'xxx',
                  label: 'xxx'
                },
                {
                  id: 40002,
                  parentId: 40000,
                  children: [
                    {
                      id: 40004,
                      parentId: 40002,
                      children: [
                        {
                          id: 40006,
                          parentId: 40004,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        },
                        {
                          id: 40007,
                          parentId: 40004,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        }
                      ],

                      name: 'xxx',

                      label: 'xxx'
                    },
                    {
                      id: 40003,
                      parentId: 40002,
                      children: [],

                      name: 'xxx',

                      label: 'xxx'
                    }
                  ],

                  name: 'xxx',

                  label: 'xxx'
                },
                {
                  id: 40001,
                  parentId: 40000,
                  children: [
                    {
                      id: 40012,
                      parentId: 40001,
                      children: [],

                      name: 'xxx',

                      label: 'xxx'
                    },
                    {
                      id: 40009,
                      parentId: 40001,
                      children: [
                        {
                          id: 40015,
                          parentId: 40009,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        },
                        {
                          id: 40017,
                          parentId: 40009,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        },
                        {
                          id: 40016,
                          parentId: 40009,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        }
                      ],

                      name: 'xxx',

                      label: 'xxx'
                    },
                    {
                      id: 40014,
                      parentId: 40001,
                      children: [
                        {
                          id: 40021,
                          parentId: 40014,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        },
                        {
                          id: 40020,
                          parentId: 40014,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        }
                      ],

                      name: 'xxx',

                      label: 'xxx'
                    },
                    {
                      id: 40011,
                      parentId: 40001,
                      children: [],

                      name: 'xxx',

                      label: 'xxx'
                    },
                    {
                      id: 40008,
                      parentId: 40001,
                      children: [],
                      icon: null,
                      name: 'xxx',

                      label: 'xxx'
                    },
                    {
                      id: 40013,
                      parentId: 40001,
                      children: [
                        {
                          id: 40018,
                          parentId: 40013,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        },
                        {
                          id: 40019,
                          parentId: 40013,
                          children: [],

                          name: 'xxx',

                          label: 'xxx'
                        }
                      ],

                      name: 'xxx',

                      label: 'xxx'
                    },
                    {
                      id: 40010,
                      parentId: 40001,
                      children: [],
                      name: 'xxx',
                      label: 'xxx'
                    }
                  ],
                  name: 'xxx',
                  label: 'xxx'
                }
              ],
              name: 'xxx',
              label: 'xxx'
            }
          ]
        }
      ]
      this.tableData = this.$refs.checkTreeRef.formatTreeData(this.tableData)
    }
  }
}
</script>
