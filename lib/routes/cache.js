import apicache from 'apicache';

export default api => {

  api.get('/api/cache/index', (req, res) => {
    res.json(apicache.getIndex());
  });

  api.get('/api/cache/clear/:target?', (req, res) => {
    res.json(apicache.clear(req.params.target));
  });
};
