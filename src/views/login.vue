<template>
  <div class="login">
    <div class="login-title">LOG IN</div>
    <div class="form-box" v-if="!showRegister">
      <el-form
        class="login-form"
        label-position="top"
        size="small"
        :inline-message="inlinemessage"
        :model="loginForm"
        :rules="loginRule"
        ref="loginForm"
        label-width="100px"
      >
        <el-form-item label="Mail" prop="email">
          <el-input
            type="text"
            v-model="loginForm.email"
            placeholder="please input a email"
          ></el-input>
        </el-form-item>
        <el-form-item label="PassWord" prop="password">
          <el-input
            type="password"
            @keypress.enter.native="submitForm('loginForm')"
            show-password
            v-model="loginForm.password"
            placeholder="Please input a password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            type="primary"
            @click="submitForm('loginForm')"
            >LogIn</el-button
          >
        </el-form-item>
        <div @click="register" style="text-align: right; cursor: pointer">
          go register
        </div>
      </el-form>
    </div>

    <div v-else class="form-box">
      <el-form
        class="login-form"
        style="background: #fff"
        size="small"
        :inline-message="inlinemessage"
        :model="registerForm"
        :rules="loginRule"
        ref="registerForm"
        label-width="60px"
      >
        <el-form-item label="name" prop="name">
          <el-input
            type="text"
            v-model="registerForm.name"
            placeholder="place input a name"
          ></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input
            type="text"
            v-model="registerForm.email"
            placeholder="please input a email"
          ></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
          &#32;&#32;
          <el-input
            type="password"
            show-password
            v-model="registerForm.password"
            placeholder="place input a password"
          ></el-input>
        </el-form-item>
        <el-form-item label="sex" prop="sex">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="1">male</el-radio>
            <el-radio :label="0">female</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="address" prop="address">
          <el-input
            type="text"
            v-model="registerForm.address"
            placeholder="place input a address"
          ></el-input>
        </el-form-item>
        <div>
          <el-button @click="showRegister=false">back</el-button>
          <el-button
            type="primary"
            @click="submitRForm('registerForm')"
            >Go register</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import wsmLoading from "../wsmLoading";
import jwt_decode from "jwt-decode";
export default {
  name: "login",
  data() {
    return {
      showRegister: false,
      inline: true,
      inlinemessage: false,
      registerForm: {
        email: "",
        password: "",
        name: "",
        sex: 0,
        address: "",
      },
      loginForm: {
        email: "",
        password: "",
      },
      loginRule: {
        name: [{ required: true, message: "Please input a name", trigger: "blur" }],
        email: [
          { required: true, message: "Please input a correct email", trigger: "blur" },
          {
            type: "email",
            message: "Please input a correct email",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "Password can't be null", trigger: "blur" },
          { min: 6, max: 20, message: "password length should between 6 and 20", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    register() {
      this.showRegister = true;
    },
    // 登录
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          wsmLoading.start("login,waiting...");
          this.$axios
            .post("/user/login", this.loginForm)
            .then((res) => {
              console.log(res);
              const result = res.result;
              localStorage.setItem("adminToken", result.token);

              const decoded = jwt_decode(result.token);
              console.log(decoded);
              // 存储vuex中
              this.$store.commit("SET_USER_INFO", decoded);
              this.$Message.success(`${decoded.name}successfully login`);
              wsmLoading.end();
              this.$router.push("/");
            })
            .catch((error) => {
              console.error(error);
              wsmLoading.end();
            });
        }
      });
    },
    submitRForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        this.$axios.post("/user/register", this.registerForm).then((res) => {
          console.log(res);
          this.$message.success("successfullt registered");
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  cursor: default;
  padding: 40px 0px;
  background-image: url(../assets/user_service-bg.jpg);
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;

  .login-title {
    width: 100%;
    height: 150px;
    line-height: 150px;
    text-align: center;
    font-size: 40px;
    color: aliceblue;
    font-family: "隶书";
  }

  // 表单
  .form-box {
    width: 100%;
    // min-width: 500px;

    .login-form {
      width: 300px;
      margin: 0px auto;
      background-color: rgba(255, 255, 255, 0.9);
      border: 1px solid #cdcdcd;
      padding: 10px 15px;
      border-radius: 5px;

      .login-btn {
        width: 100%;
        background: linear-gradient(to bottom, #03a9f4, #03a9f4);
        font-weight: 600;
      }
      .login-btn:hover {
        background-color: #03a9f4;
      }

      // 验证码区域
      .yzm {
        display: flex;
        align-content: center;
        input {
          width: 160px;
          height: 32px;
          outline: none;
          border: 1px solid #eee;
          padding: 2px 15px;
          border-radius: 5px;
          font-size: 12px;
        }
        ::-webkit-input-placeholder {
          color: #bbb;
        }
        img:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
