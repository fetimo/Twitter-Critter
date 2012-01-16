#response.headers['Content-type'] = 'application/json'
require 'sequel'
require 'mysql2'

@db = Sequel.connect('mysql2://fetimocom1:iBMbSSIz@mysql.fetimo.com/twittercritter')
		
@critter = @db[:critters]

@max = @critter.max(:id)

@critter = @critter.where('id = ?', @max).first[:critter]

local_file = 'latest_critter.json'

File.open(local_file, 'w') do |f| 
	f.write(@critter)
end