export class SmartcontrolConfirmMessageModel {
  type: string; /* Default confirm color title green. If You want to color title red, please set to 'warning' */
  title: string;
  message: string;
  commentTitle: string;
  commentResult: string;
  btnConfirmName: string;
  btnConfirmShow: string; /* Default show. If You want to hidden, please set to 'hide' */
  btnRejectName: string;
  btnRejectShow: string; /* Default hide. If You want to hidden, please set to 'show' */
  btnCancelName: string;
  btnCancelShow: string; /* Default show. If You want to hidden, please set to 'hide' */
  commentShow: string; /* Default show. If You want to hidden, please set to 'hide' */
  requireComment: boolean; /* Default false. If You want to require, please set to true */
}
