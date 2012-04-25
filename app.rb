require 'ramaze'
require 'sequel'
require 'mysql2'

DB = Sequel.connect('mysql2://fetimocom1:iBMbSSIz@mysql.fetimo.com/twittercritter')

Ramaze.options.mode = :dev
Ramaze.options.app.name = 'crittr.me'
Ramaze.options.session.key = 'crittr.me.sid'
Ramaze.options.session.expires = (Time.now + 60 * 60) #1 hour
Ramaze.options.session.ttl = 3600 #1 hour

# Make sure that Ramaze knows where you are
Ramaze.options.roots = [__DIR__]

# Initialize controllers and models
require __DIR__('model/init')
require __DIR__('controller/init')

# Setup memcache
#Ramaze::Cache.options.session = Ramaze::Cache::MemCache.using(
#	:compression => true,
#	:expires_in => 86400
#)
#Ramaze::Cache.options.view = Ramaze::Cache::MemCache.using(
#	:compression => true,
#	:expires_in => 86400
#)

# Setup database caching
#Ramaze::Cache.options.names.push(:sequel)
#Ramaze::Cache.options.sequel = Ramaze::Cache::Sequel.using(
#	:connection => Sequel.mysql(
#		:adapter  => 'mysql2',
#		:host     => 'mysql.fetimo.com',
#		:user     => 'fetimocom1',
#		:password => 'iBMbSSIz',
#		:database => 'twittercritter'
#	)
#)

#Rack::Mime::MIME_TYPES['.js'] = 'application/javascript'
#Rack::Mime::MIME_TYPES['.css'] = 'text/css'