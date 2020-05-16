<template>
  <div>
    <div class="app-container">
      <el-button
        v-for="(one,index) in table_name_list"
        :key="index"
        v-on:click="handle_button(one.key)"
      >{{one.name}}</el-button>
    </div>
    <div class="app-container">
      <!-- <span>{{flag}}</span> -->
      <!-- <el-button v-on:click="query_res">查询结果:</el-button> -->
      <!-- <span>{{message}}</span> -->
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { baseInfofetchList } from "@/api/article";
import { Message } from "element-ui";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  name: "UploadExcel",
  components: { UploadExcelComponent },
  data() {
    return {
      table_name_list: [{ key: "base_info", name: "基本信息表" }],
      tableData: [],
      tableHeader: [],
      flag: "",
      res: ""
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["message"])
  },
  methods: {
    init() {
      baseInfofetchList({
        method_dict:{},
        code: 6,
        message: "上传excel初始化",
        data: {}
      }).then(response => {
        console.log(response.data);
        this.table_name_list = response.data.table_name_list;
      });
    },
    handle_button(key) {
      baseInfofetchList({
        method_dict:{table_name:key},
        code: 7,
        message: "上传excel",
        data: {tableData:this.tableData}
      }).then(response => {
        console.log(response.data);
        Message({
          message: "上传成功",
          type: "success",
        });
      });
    },
    upload_canteen_list_charge(event) {
      let data = this.tableData;
      let key = "上传充值清单";
      let flag = key + moment().format("YYYY-MM-DD HH:mm:ss");
      this.flag = flag;
      this.$store
        .dispatch("uploadexcel/upload_canteen_list_charge", {
          data: data,
          key: key,
          flag: flag
        })
        .then(() => {
          console.log("message---------------", message);
        })
        .catch(() => {});
    },
    upload_canteen_list_add_member(event) {
      let data = this.tableData;
      let key = "上传用餐人员清单";
      let flag = key + moment().format("YYYY-MM-DD HH:mm:ss");
      this.flag = flag;
      this.$store
        .dispatch("uploadexcel/upload_canteen_list_add_member", {
          data: data,
          key: key,
          flag: flag
        })
        .then(() => {})
        .catch(() => {});
    },
    query_res() {
      let data = [];
      let key = "查询结果";
      let flag = this.flag;
      this.$store
        .dispatch("uploadexcel/query_res", { data: data, key: key, flag: flag })
        .then(() => {
          console.log(this.$store.Getter("upload-excel/query_res"));
        })
        .catch(() => {});
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      console.log("tableData-------------", results);
      console.log("tableHeader-------------", header);
    }
  }
};
</script>
