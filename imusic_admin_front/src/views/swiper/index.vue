<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="swiper"
      border
      highlight-current-row>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
      type="index"
      width="50">
      </el-table-column>
      <el-table-column 
        label="图片预览">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" height="50" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="onDel(scope.row)" size="small">删除</el-button>
          <el-button @click="onEdit(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="delDialogVisible"
      width="30%">
      <span>确定要删除该条记录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePL">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="800">
      <el-form ref="currentItem" :model="currentItem" label-width="80px">
        <el-form-item label="歌单名称">
          <el-input v-model="currentItem.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentItem.copywriter"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPLCancel">取 消</el-button>
        <el-button type="primary" @click="editPL">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import * as swiperApi from '@/api/swiper'
export default {
  props: {

  },
  data() {
    return {
      swiper: [],
      listLoading: false,
      delDialogVisible: false,
      editDialogVisible: false,
      currentItem: {},
    };
  },
  computed: {

  },
  created() {
    this.getList()
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    getList() {
      this.listLoading = true
      swiperApi.getList().then(res => {
        this.listLoading = false
        this.swiper = res.data
      }).catch(() => {
        this.listLoading = false
      })
    },
    onDel(r) {
      this.delDialogVisible = true
      this.currentItem = r
    },
    deletePL() {
      swiperApi.del(this.currentItem)
        .then(res => {
          if (res.data.delDB && res.data.delDB.errcode === 0 && res.data.delST && res.data.delST.errcode === 0) {
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: JSON.stringify(res.data),
              type: 'error'
            })
          }
          this.delDialogVisible = false
        })
        .catch(err => {
          this.delDialogVisible = false
        })
    },
    onEdit(r) {
      this.currentItem = JSON.parse(JSON.stringify(r))
      this.editDialogVisible = true
    },
    editPLCancel() {
      this.currentItem = {}
      this.editDialogVisible = false
    },
    editPL() {
      let p = this.currentItem
      swiperApi.update(p)
        .then(res => {
          this.editDialogVisible = false
          if (res.data && res.data.errcode === 0) {
            this.$message({
              message: '歌单修改成功',
              type: 'success'
            })
            this.swiper = []
            this.currentItem = {}
            this.getList()
          } else {
            this.$message({
              message: JSON.stringify(res.data),
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.editDialogVisible = false
        })
    }
  },
  components: {

  },
};
</script>

<style scoped lang="scss">

</style>
