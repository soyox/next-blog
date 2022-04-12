import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

interface CountDownProps {
  time: number;
  onEnd?: () => void;
}
const CountDown: NextPage<CountDownProps> = (props) => {
  const { time, onEnd } = props;
  const [count, setCount] = useState(time);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => {
        if (count === 0) {
          onEnd && onEnd();
          clearInterval(interval);
          return count;
        }

        return count - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [onEnd, count]);
  return <div className={styles.countDown}>{count}</div>;
};

CountDown.defaultProps = {
  time: 60,
};

export default CountDown;
