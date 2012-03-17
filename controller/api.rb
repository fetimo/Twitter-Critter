class ApiController < Controller
	
	map '/api'
		
	layout do |path|
		if path === 'critters' || path === 'battle'
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
				
		@critter
	end
	
	def battle
		fight = DB[:battle_system]
		
		if request.get? 
			#get fight details of requested critter
#			DB.fetch('SELECT critter FROM critters WHERE name = ? LIMIT 1', username) do |row|
#				@critter = row[:critter]
#			end
		elsif request.post?
			#start new fight
			
			uid = request.params['uid']
			opponent = request.params['opponent']
			weapon = request.params['weapon']						
			begin
				fight.insert(:uid => uid, :status => 'waiting', :opponent => opponent, :weapon => weapon)
			rescue
				#already battling, send message to user via flash
			end
		elsif request.put?
			#update fight details
			uid = request.params['uid']
			opponent = request.params['opponent']
			weapon = request.params['weapon']
			status = request.params['status']
			
			fight.filter(:uid => uid).update(:status => status, :opponent => opponent, :weapon => weapon)
		elsif request.delete?
			#remove fight
		end
	end
end