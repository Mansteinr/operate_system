<template>
   <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="敏感词：">
            <el-input v-model.trim="formInline.illegalWords" placeholder="多个以；隔开"></el-input>
          </el-form-item>
          <el-form-item class="card-query">
            <el-button type="success" @click="add" round>新增</el-button>
            <el-button type="primary" @click="onSubmit" round>查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
        <el-button type="primary" title="批量删除" @click="deleteMut" size="mini" icon="el-icon-delete"></el-button>
      </div>
      <div class="card-container">
        <el-table
          ref="multipleTable"
          :data="illegalWordsArr"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="敏感词">
            <template slot-scope="scope">{{ scope.row.illegalWord }}</template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="添加时间">
          </el-table-column>
           <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, illegalWordsArr)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {$http} from '../common/js/ajax'
import { showModal } from '../utils'
export default {
  data () {
    return {
      multipleSelection: [],
      formInline: {
        illegalWords: ''
      },
      illegalWordsArr: []
    }
  },
  mounted () {
    this.searchIllegalWords()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    onSubmit () {
      this.searchIllegalWords()
    },
    searchIllegalWords () {
      let url = '/msc/searchIllegalWords'
      $http(url, this.formInline).then((res) => {
        this.illegalWordsArr = []
        this.illegalWordsArr = JSON.parse(res.RESULT_DATA).rows
      })
    },
    add () {
      let url = '/msc/addIllegalWords'
      $http(url, this.formInline).then((res) => {
        if (res.RESULT === '0') {
          this.formInline.illegalWords = ''
          showModal(res.RESULT_MSG)
          this.searchIllegalWords()
        } else {
          showModal(res.RESULT_MSG, 'warning')
        }
      })
    },
    removeIllegalWords (opt) {
      let url = '/msc/removeIllegalWords'
      this.$confirm('确定删除该敏感词?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $http(url, opt).then((res) => {
          if (res.RESULT === '0') {
            showModal(res.RESULT_MSG)
            this.searchIllegalWords()
          } else {
            showModal(res.RESULT_MSG, 'warning')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 单个删除
    deleteRow (index, rows) {
      let opt = { ids: rows[index].id }
      this.removeIllegalWords(opt)
    },
    // 批量删除
    deleteMut () {
      if (!this.multipleSelection.length) {
        showModal('请选择删除的敏感词', 'warning')
        return
      }
      let ids = []
      this.multipleSelection.forEach(v => {
        ids.push(v.id)
      })
      this.removeIllegalWords({ ids: ids.join(',') })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
