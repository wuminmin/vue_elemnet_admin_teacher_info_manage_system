<template>
  <div class="app-container">
    <div
      class="filter-container"
      v-for="(filter_item,filter_index) in my_filter_list"
      :key="filter_index"
    >
      <el-input
        v-model="my_filter_list[filter_index].input_value0"
        :placeholder="filter_item.input_placeholder0"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="my_filter_list[filter_index].input_condition0"
        placeholder="条件"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option v-for="item in search_condition" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input
        v-model="my_filter_list[filter_index].input_value1"
        :placeholder="filter_item.input_placeholder1"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="my_filter_list[filter_index].input_condition1"
        placeholder="条件"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option v-for="item in search_condition" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input
        v-model="my_filter_list[filter_index].input_value2"
        :placeholder="filter_item.input_placeholder2"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="my_filter_list[filter_index].input_condition2"
        placeholder="条件"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option v-for="item in search_condition" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handle_create"
      >新增</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
      <!-- <el-button
        v-waves
        :loading="saveloadLoading"
        class="filter-item"
        type="danger"
        icon="el-icon-upload"
        @click="handle_import"
      >导入</el-button>-->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handle_update(row)">编辑</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handle_delete(row,$index)"
          >删除</el-button>
        </template>
      </el-table-column>

      <el-table-column
        v-for="table_column_item in my_table_header_list"
        :key="'table_column'+table_column_item.id"
        :label="table_column_item.name"
        width
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row[table_column_item.key] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="my_rules"
        :model="my_temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          v-for="(dialog_item,dialog_index) in my_table_header_list"
          :key="'dialog_'+dialog_index"
          :label="dialog_item.name"
          prop="title"
        >
          <el-input v-model="my_temp[dialog_item.key]" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" @click="create_data()">增加</el-button>
        <el-button v-if="dialogStatus==='update'" @click="update_data()">修改</el-button>
        <el-button v-if="dialogStatus==='delete'" @click="delete_data()">删除</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  baseInfofetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import { Message } from "element-ui";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "BaseTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      method_dict:{table_name:'基本信息'},
      my_filter_list: [],
      export_excel_header_name_list: [],
      export_excel_header_key_list: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      search_condition: ["等于", "大于", "小于", "包含", "不包含"],
      tableKey: 0,
      my_table_header_list: [],
      list: null,
      total: 0,
      listLoading: false,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      my_temp: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增"
      },
      dialogPvVisible: false,
      pvData: [],
      my_rules: {},
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    handle_delete(row, index) {
      this.my_temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "delete";
      this.dialogFormVisible = true;
    },
    delete_data(){
      baseInfofetchList({
        method_dict:this.method_dict,
        code: 4,
        message: "删除数据",
        data: { my_temp: this.my_temp },
      }).then(response => {
        this.dialogFormVisible = false;
        this.getList();
        console.log(response.data)
      });
    },
    reset_temp() {
      this.my_temp = {};
    },
    handle_create() {
      this.reset_temp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    create_data() {
      console.log("create_data", this.my_temp);
      baseInfofetchList({
        method_dict:this.method_dict,
        code: 3,
        message: "新增一行",
        data: { my_temp: this.my_temp }
      }).then(response => {
        this.dialogFormVisible = false;
        // console.log(response.data)
      });
    },
    handle_update(row) {
      console.log(row);
      this.my_temp = Object.assign({}, row); // copy obj
      // this.my_temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    update_data() {
      console.log("update_data", this.my_temp);
      baseInfofetchList({
        method_dict:this.method_dict,
        code: 5,
        message: "修改数据",
        data: { my_temp: this.my_temp }
      }).then(response => {
        this.dialogFormVisible = false;
        this.getList();
        console.log(response.data)
      });
    },
    init() {
      this.listLoading = true;
      baseInfofetchList({
        method_dict:this.method_dict,
        code: 1,
        message: "初始化基本信息表筛选条件",
        data: {}
      }).then(response => {
        this.my_filter_list = response.data.my_filter_list;
        this.my_table_header_list = response.data.my_table_header_list;
        this.export_excel_header_name_list =
          response.data.export_excel_header_name_list;
        this.export_excel_header_key_list =
          response.data.export_excel_header_key_list;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    getList() {
      this.listLoading = true;
      baseInfofetchList({
        method_dict:this.method_dict,
        code: 2,
        message: "查询基本信息表信息",
        data: { my_filter_list: this.my_filter_list }
      }).then(response => {
        this.list = response.data.my_table_list;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },

    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000
      });
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      console.log("handleDownload===", this.list);
      if (this.list == null || this.list == [] || this.list == "") {
        Message({
          message: "没有数据可下载!",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = this.export_excel_header_name_list;
          const filterVal = this.export_excel_header_key_list;
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "table-list"
          });
          this.downloadLoading = false;
        });
      }
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          return v[j];
          // if (j === "timestamp") {
          //   return parseTime(v[j]);
          // } else {
          //   return v[j];
          // }
        })
      );
    }
  }
};
</script>
