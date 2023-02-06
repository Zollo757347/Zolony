import Utils from "../classes/Utils";

class Message extends null {
  static async send({ content, duration, type }) {
    const messageDiv = document.createElement('div');

    messageDiv.className = 'message message-animated-enter';
    switch (type) {
      case 'success':
        messageDiv.classList.add('message-success');
        break;
      
      case 'error':
        messageDiv.classList.add('message-error');
        break;
      
      default: break;
    }

    messageDiv.innerHTML = content;
    document.body.appendChild(messageDiv);

    await Utils.Sleep(duration ?? 2000);
    messageDiv.classList.add('message-animated-leave');

    await Utils.Sleep(500);
    document.body.removeChild(messageDiv);
  }
}

export default Message;