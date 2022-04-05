import React, { useEffect } from 'react';
import { Button, DatePicker } from 'antd';
import { devDependencies } from '../../../package.json';
import axios from 'axios';
import styles from './index.module.scss';
import logo from '@/assets/imgs/vite.png?url';
// import Worker from './example.js?worker';
// import init from './fib.wasm';
import SvgIcon from '../SvgIcon';
// import { ReactComponent as ReactLogo } from '@assets/icons/logo.svg';

// export type FibFunc = (num: number) => number;
// wasm 引入
// init({}).then((exports) => {
//   const fibFunc = exports.fib as FibFunc;
//   console.log('Fib result: ', fibFunc(10));
// });

// Web Worker 引入
// const worker = new Worker();
// worker.addEventListener('message', (e) => {
//   console.log(e);
// });

const icons = import.meta.globEager('../../assets/icons/logo-*.svg');
const iconUrls = Object.values(icons).map((mod) => {
  const fileName = mod.default.split('/').pop();
  const [svgName] = fileName.split('.');
  return svgName;
});

export function Header() {
  useEffect(() => {
    // 测试 Mock 数据，数据源在根目录的 mock/data.ts 中
    const getData = async () => {
      const { data } = await axios.get('/api/menu');
      console.log(data);
    };
    const postOriginData = async () => {
      const { data } = await axios.post('/api/res', { title: '标题' });
      console.log(data);
    };
    const postRawData = async () => {
      const { data } = await axios.post('/api/text', { a: 111 });
      console.log(data);
    };
    const invokeMockRequest = async () => {
      await getData();
      await postOriginData();
      await postRawData();
    };
    invokeMockRequest();
  }, []);
  return (
    <div className={`p-20px text-center ${styles.header}`}>
      <h1 className="font-bold text-2xl mb-2">
        vite version: {devDependencies.vite}
      </h1>
      <img src={logo} className="m-auto mb-4" alt="" />
      <div>
        <div className="flex justify-center mt-2">
          {iconUrls.map((item) => (
            <SvgIcon name={item} key={item} width="50" height="50" />
          ))}
        </div>
        <DatePicker />
        <Button type="primary" className="ml-2">
          Primary Button
        </Button>
      </div>
    </div>
  );
}
