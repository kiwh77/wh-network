<template>
  <div id="app" v-loading="loading">
    <el-row type="flex" justify="space-between">
      <el-col :span="12" style="text-align: left">
        <el-button type="default" @click="onCancelRequest"
          >取消当前请求</el-button
        >
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="default" @click="queryList">刷新</el-button>
        <el-button type="default" @click="onUpload">上传</el-button>
        <el-button type="default" @click="onDownload">下载</el-button>
        <el-button type="primary" @click="onInsert">新增</el-button>
      </el-col>
    </el-row>
    <wh-table
      :data="users"
      :config="config"
      @onEvent="onEvent"
      @onTableEvent="onEvent"
    >
    </wh-table>

    <wh-form-dialog
      ref="dialog"
      :data="form.data"
      :config="form.config"
      @onEvent="onEvent"
    ></wh-form-dialog>
  </div>
</template>

<script>
import { WhTable } from '@wh/com-table';
import { WhFormDialog } from '@wh/com-form-dialog';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'App',
  components: { WhTable, WhFormDialog },
  data() {
    return {
      loading: false,
      selectedRows: [],
      form: {
        data: {},
        currCancel: null,
        config: {
          mode: 'edit',
          dialog: {
            title: '新增用户',
            width: '500px',
          },
          footer: {
            options: [
              {
                show: true,
                name: '确定',
                event: 'onCreateUser',
                button: { type: 'primary' },
              },
            ],
          },
          form: {
            inline: true,
            rules: {
              name: [{ required: true, message: '用户名不能为空' }],
              phone: [{ required: true, message: '手机号码不能为空' }],
              age: [{ required: true, message: '年龄不能为空' }],
            },
          },
          columns: [
            {
              show: true,
              label: '用户名',
              type: 'input',
              prop: 'name',
              props: {
                placeholder: '请输入用户名',
              },
            },
            {
              show: true,
              label: '手机号码',
              prop: 'phone',
              type: 'input',
              props: {
                placeholder: '请输入手机号码',
              },
            },
            {
              show: true,
              label: '年龄',
              prop: 'age',
              type: 'input',
              props: {
                placeholder: '请输入年龄',
              },
            },
          ],
        },
      },
      config: {
        columns: [
          {
            type: 'selection',
          },
          {
            label: 'ID',
            prop: 'id',
          },
          {
            label: '名称',
            prop: 'name',
          },
          {
            label: '手机号码',
            prop: 'phone',
          },
          {
            label: '年龄',
            prop: 'age',
          },
          {
            type: 'action',
            label: '操作',
            prop: 'action',
            props: {
              options: [
                { label: '编辑', event: 'updateUser' },
                { label: '删除', event: 'deleteUser' },
              ],
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['users']),
  },
  async mounted() {
    this.queryList();
  },
  methods: {
    ...mapActions(['FetchUsers']),
    async queryList() {
      await this.FetchUsers();
    },
    onInsert() {
      this.form.data = {};
      this.$refs.dialog.show();
    },
    async onCreateUser() {
      const form = this.$refs.dialog.getRef('form');
      const data = await form.validate();
      const res = await this.$http.dispatch(
        this.form.data.id ? 'UpdateUser' : 'CreateUser',
        this.form.data.id
          ? {
              params: data,
              path: { id: this.form.data.id },
            }
          : {
              params: data,
            }
      );
      if (res && res.success) {
        this.$refs.dialog.close();
        this.form.data = {};
        this.queryList();
      }
    },
    updateUser({ scope }) {
      this.form.data = { ...scope.row };
      this.$refs.dialog.show();
    },
    /**
     * 删除用户
     */
    async deleteUser({ scope }) {
      await this.$confirm('请确认是否删除？', {
        type: 'warning',
      });
      const res = await this.$http.dispatch('DeleteUser', {
        path: { id: scope.row.id },
        cancel: (c) => {
          this.currCancel = c;
        },
      });
      if (res && res.success) {
        this.$message.success(res.msg);
        this.queryList();
      }
    },
    /**
     * 取消请求
     */
    onCancelRequest() {
      if (this.currCancel) this.currCancel('任性点，取消了');
    },
    onUpload() {},
    onDownload() {},
    onEvent(args) {
      const { event, params } = args;
      this[event] && this[event](params);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
