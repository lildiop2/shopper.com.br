const resolver = (handler) => (res, req, next) =>
  Promise.resolve(handler(res, req, next)).catch((error) => next(error));
export default resolver;
