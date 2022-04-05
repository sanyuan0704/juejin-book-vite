const start = () => {
  let count = 0;
  setInterval(() => {
    postMessage(++count);
  }, 2000);
};

start();
