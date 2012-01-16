require 'ramaze'
require 'sequel'
require 'mysql2'

DB = Sequel.connect('mysql2://fetimocom1:iBMbSSIz@mysql.fetimo.com/twittercritter')

# Make sure that Ramaze knows where you are
Ramaze.options.roots = [__DIR__]

# Initialize controllers and models
require __DIR__('model/init')
require __DIR__('controller/init')

# Setup database caching
Ramaze::Cache.options.names.push(:sequel)
Ramaze::Cache.options.sequel = Ramaze::Cache::Sequel.using(
	:connection => Sequel.mysql(
		:adapter  => 'mysql2',
		:host     => 'mysql.fetimo.com',
		:user     => 'fetimocom1',
		:password => 'iBMbSSIz',
		:database => 'twittercritter'
	)
)

# Setup memcache

Ramaze::Cache.options.session = Ramaze::Cache::MemCache.using(
  :compression => true
)