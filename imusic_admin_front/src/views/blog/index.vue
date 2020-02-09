<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border highlight-current-row>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="userInfo.nickName" label="发布人"></el-table-column>
      <!-- <el-table-column 
        label="图片预览">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" height="50" />
        </template>
      </el-table-column>-->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="onDel(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定要删除该条记录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePL">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/blog";
import scroll from "@/utils/scroll";
export default {
  props: {},
  data() {
    return {
      list: [],
      count: 10,
      listLoading: false,
      delDialogVisible: false,
      editDialogVisible: false,
      currentItem: {},
      isshow: false
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  mounted() {
    scroll.start(this.getList);
  },
  watch: {},
  methods: {
    getList() {
      this.listLoading = true;
      let o = {
        start: this.list.length,
        count: this.count
      };
      api
        .getList(o)
        .then(res => {
          this.listLoading = false;
          this.list = this.list.concat(res.data);
          if (res.data.length < this.count) {
            scroll.end();
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    onDel(r) {
      this.delDialogVisible = true;
      this.currentItem = r;
    },
    deletePL() {
      api
        .del(this.currentItem._id)
        .then(res => {
          if (res.data.delDB && res.data.delDB.errcode === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.list = [];
            this.getList();
          } else {
            this.$message({
              message: JSON.stringify(res.data),
              type: "error"
            });
          }
          this.delDialogVisible = false;
        })
        .catch(err => {
          this.delDialogVisible = false;
        });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
