const routes = [].concat(
  require('../routes/static'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/index'),
  // require('../routes/map'),
  require('../routes/interactive-map')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
