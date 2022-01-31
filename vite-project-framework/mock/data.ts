import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/menu',
    timeout: 1000,
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: [{ title: '菜单1' }, { title: '菜单2' }, { title: '菜单3' }]
      };
    }
  },
  {
    url: '/api/res',
    response({ body }) {
      return {
        body
      };
    }
  },
  {
    url: '/api/text',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = '';
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          reqbody += chunk;
        });
        req.on('end', () => resolve(undefined));
      });
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.end(`hello, ${reqbody}`);
    }
  }
] as MockMethod[];
