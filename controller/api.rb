require 'twitter'
require 'yajl'

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
				@response = row[:critter]
			end
		end
				
		@response
	end
	
	def battle
		response['Content-Type'] = 'application/json'
		
		fight = DB[:battle_system]
		uid = request.params['uid']
		
		if request.get? 
			#get fight details of requested critter
			@response = fight.filter(:uid => uid.to_i).first
		elsif request.post?
			#start new fight
			opponent = request.params['opponent']
			weapon = request.params['weapon']						
			begin
				fight.insert(:uid => uid, :status => 'waiting', :opponent => opponent, :weapon => weapon)
								
				p = session[:access_token].params
								
				Twitter.configure do |config|
					config.consumer_key = 'DQicogvXxpbW7oleCfV3Q'
					config.consumer_secret = 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
					config.oauth_token = p[:oauth_token]
					config.oauth_token_secret = p[:oauth_token_secret]
				end
								
				begin
					opponent_name = Twitter.user(opponent.to_i).screen_name
				rescue
					@response = "Error: failed to set Twitter opponent name"
				end
								
				begin
					Twitter.update("@#{opponent_name} I'm battling my Critter against yours, go to http://crittr.me/critter/#{opponent_name} to retaliate!")
				rescue
					@response = "Error: failed to update Twitter status"
				end
			rescue
				#already battling, send message to user via flash
				@response = "Error: You are already in a battle"
			end
		elsif request.delete?
			#remove fight
			@response = fight.filter(:uid => uid).delete
		end
		
		@response = Yajl::Encoder.encode(@response)
	end
end