import styles from './chat-ui-lib.module.css';

/* eslint-disable-next-line */
export interface ChatUiLibProps {}

export function ChatUiLib(props: ChatUiLibProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ChatUiLib!</h1>
    </div>
  );
}

export default ChatUiLib;
