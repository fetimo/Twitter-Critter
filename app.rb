require 'ramaze'
require 'sequel'
require 'mysql2'

begin
	DB = Sequel.connect(
		:adapter=>'mysql2', 
		:host=>'mysql.fetimo.com', 
		:database=>'twittercritter', 
		:user=>'fetimocom1', 
		:password=>'iBMbSSIz', 
		:timeout => 60
	)
rescue
	DB.disconnect
	DB.connect(
		:adapter=>'mysql2', 
		:host=>'mysql.fetimo.com', 
		:database=>'twittercritter', 
		:user=>'fetimocom1', 
		:password=>'iBMbSSIz', 
		:timeout => 60
	)
	retry
end

Ramaze.options.mode = :live
Ramaze.options.app.name = 'crittr.me'
Ramaze.options.session.key = 'crittr.me.sid'
Ramaze.options.session.expires = (Time.now + 60 * 60) #1 hour
Ramaze.options.session.ttl = 3600 #1 hour

# Make sure that Ramaze knows where you are
Ramaze.options.roots = [__DIR__]

# Initialize controllers and models
require __DIR__('model/init')
require __DIR__('controller/init')

#Setup memcache
Ramaze::Cache.options.session = Ramaze::Cache::MemCache.using(
	:compress => true,
	:expires_in => 86400
)
Ramaze::Cache.options.view = Ramaze::Cache::MemCache.using(
	:compress => true,
	:expires_in => 86400
)
