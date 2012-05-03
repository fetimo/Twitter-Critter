require 'sequel'
require 'mysql2'

db = Sequel.connect(:adapter=>'mysql2', :host=>'mysql.fetimo.com', :database=>'twittercritter', :user=>'fetimocom1', :password=>'iBMbSSIz', :timeout => 30)
		
critter = db[:critters]

max = critter.max(:id)

critter = critter.where('id = ?', max).first[:critter]

local_file = 'latest_critter.json'

File.open(local_file, 'w') do |f| 
	f.write(@critter)
end