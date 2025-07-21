/** 全局安装(开发环境) */
import ElementPlus from 'element-plus/es';
import EleAdminPlus from '@hnjing/zxzy-admin-plus/es';
import 'element-plus/theme-chalk/src/index.scss';
import '@hnjing/zxzy-admin-plus/es/style/index.scss';
import 'cropperjs/dist/cropper.css';
import 'xgplayer/dist/index.min.css';
import { ElDialog } from 'element-plus';
import { EleImageViewer } from '@hnjing/zxzy-admin-plus';

const installer = {
  install(app) {
    app.use(ElementPlus);
    app.use(EleAdminPlus);
    /** 设置全局配置 */
    // 设置所有el-dialog默认点击空白不关闭
    ElDialog.props.closeOnClickModal.default = false;
    // ElButton.props.size.default = 'default'; // 设置所有el-button默认大小
    EleImageViewer.props.hideOnClickModal = {
      default: false,
      type: Boolean
    };
  }
};

export default installer;
