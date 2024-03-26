import styles from './homepage.module.css';
import home from '../../home.jpg';
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className={styles['content']}>
      <div
        className={styles.backdrop}
        style={{
          backgroundImage: `url(${home})`,
        }}
      >
        <div className={styles.quotes}>
          <h2 className={styles.heading}>An appealing quote</h2>

          <p className={styles.subheading}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            quidem illo molestias id obcaecati temporibus ut, consequuntur unde
            impedit, dicta similique dignissimos voluptatibus. Aliquam quasi
            quia dolore excepturi explicabo perspiciatis.
          </p>

          <Link to="/gamehub">
            <div className={styles.action}>Discover games</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
