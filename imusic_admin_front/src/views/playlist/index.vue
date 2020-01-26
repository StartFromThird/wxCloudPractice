<template>
  <div class="app-container">

    <el-table
      v-loading="listLoading"
      :data="playlist"
      border
      highlight-current-row
    >
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
      listLoading: false
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

    },
    onEdit(r) {

    },
  },
  components: {

  },
};
</script>

<style scoped lang="scss">

</style>
