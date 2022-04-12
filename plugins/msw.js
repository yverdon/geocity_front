if (process.env.NODE_ENV === 'development' && process.env.MSW === 'enable') {
  const { worker } = require('@/mocks/browser')
  worker.start()
  worker.printHandlers()
}
