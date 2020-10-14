'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async info() {
    const ctx = this.ctx;
    const userId = ctx.params.id;
    const user = await ctx.service.user.find(userId);
    ctx.body = user;
  }

  async register() {
    const ctx = this.ctx;
    const { id, username, password } = ctx.request.body;
    const VeriUser = await ctx.service.user.VeriUser(id);
    if (!VeriUser) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '学号错误！',
      };
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '验证成功,请登录！',
      };
      const row = {
        id,
        username,
        password, // any other fields u want to update
        // modifiedAt: this.app.mysql.literals.now, // `now()` on db server
      };
      const result = await this.app.mysql.update('student_test', row);// 更新 student_test 表中的记录

      // 判断更新成功
      const updateSuccess = result.affectedRows === 1;
      if (updateSuccess) { console.log('更新成功'); }
    }
    ctx.redirect('/../login');
  }

  async login() {
    const ctx = this.ctx;
    // ctx.logger.info('req body:: %j', ctx.request.body);
    const { username, password } = ctx.request.body;
    const user = await ctx.service.user.GetUser(username, password);
    if (!user) {
      ctx.body = {
        successFlag: 'N',
        errorMsg: '用户名或密码错误！',
      };
    } else {
      ctx.body = {
        successFlag: 'Y',
        errorMsg: '登录成功！',
      };
      console.log(ctx.body);
      // ctx.redirect('/../news');
    }

  }
}
module.exports = UserController;
