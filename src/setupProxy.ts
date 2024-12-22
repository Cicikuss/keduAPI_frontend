import { Application } from 'express'; // Express'in tür tanımı
import { createProxyMiddleware } from 'http-proxy-middleware';

const setupProxy = (app: Application): void => {
  app.use(
    '/api',
    createProxyMiddleware({
    target: 'https://keduapi-1002036435905.europe-west3.run.app/upload',
      changeOrigin: true,
    })
  );
};

export default setupProxy;
