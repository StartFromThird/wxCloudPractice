<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="playlist"
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
        label="封面" 
        width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" height="50" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌单名">
      </el-table-column>
      <el-table-column
        prop="copywriter"
        label="描述">
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
      <span>确定要删除该条歌单吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePL">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
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
    </el-dialog>
    
  </div>
</template>

<script>
import * as playlistApi from '@/api/playlist'
import scroll from '@/utils/scroll'
export default {
  props: {

  },
  data() {
    return {
      count: 40,
      playlist: [],
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
    scroll.start(this.getList)
  },
  watch: {

  },
  methods: {
    getList() {
      this.listLoading = true
      playlistApi.getList({
        start: this.playlist.length,
        count: this.count
      }).then(res => {
        this.listLoading = false
        this.playlist = this.playlist.concat(res.data)
        // 新加数据条数小于定义条数 滚动加载结束
        if (res.data.length < this.count) {
          scroll.end()
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    onDel(r) {
      this.delDialogVisible = true
      this.currentItem = r
    },
    deletePL() {
      let p = {
        'id': this.currentItem._id
      }
      playlistApi.del(p)
        .then(res => {
          this.delDialogVisible = false
          if (res.data && res.data.errcode === 0) {
            this.$message({
              message: '歌单删除成功',
              type: 'success'
            })
            this.playlist = []
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
      playlistApi.update(p)
        .then(res => {
          this.editDialogVisible = false
          if (res.data && res.data.errcode === 0) {
            this.$message({
              message: '歌单修改成功',
              type: 'success'
            })
            this.playlist = []
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
