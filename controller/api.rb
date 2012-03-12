class ApiController < Controller
	
	map '/api'
		
	layout do |path|
		if path === 'critters'
			:api
		end
	end
	
	def critters (username)
		response['Content-Type'] = 'application/json'
		
		username.delete!('@')
		
		if request.get? 
			DB.fetch('SELECT critter FROM critters WHERE name = ? LIMIT 1', username) do |row|
				@critter = row[:critter]
			end
		end
		
	#	if request.get? 
	 #  json = { 'data' => 'Service Two Data' }.to_json 
	 #elsif request.put? 
	 #  json = { 'result' => 'Service Two result' }.to_json 
	 #elsif request.delete?
		#log = Ramaze::Logger::RotatingInformer.new('./log')
		#log.info @critter.inspect
		
		@critter
	end
end