import { sleep } from "../utils";

interface MessageSendProps {
  content: string;
  type: 'success' | 'error';
  duration?: number;
}

class Message extends null {
  static async send({ content, duration, type }: MessageSendProps) {
    const messageDiv = document.createElement('div');

    messageDiv.className = 'message message-animated-enter';
    switch (type) {
      case 'success':
        messageDiv.classList.add('message-success');
        break;
      
      case 'error':
        messageDiv.classList.add('message-error');
        break;
    }

    messageDiv.innerHTML = content;
    document.body.appendChild(messageDiv);

    await sleep(duration ?? 2000);
    messageDiv.classList.add('message-animated-leave');

    await sleep(500);
    document.body.removeChild(messageDiv);
  }
}

export default Message;