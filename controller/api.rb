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
		elsif request.delete?
			DB[:critters].filter(:uid => uid).delete
			@response = 'Critter has been deleted'
		end
		@response
	end
	
	def battle
		response['Content-Type'] = 'application/json'
		
		fight = DB[:battle_system]
		uid = request.params['uid']
		
		if request.get? 
			#get fight details of requested critter
			response = fight.filter(:uid => uid.to_i).first
			
		elsif request.post?
			opponent = request.params['opponent']
			
			p = session[:access_token].params
									
			Twitter.configure do |config|
				config.consumer_key = 'DQicogvXxpbW7oleCfV3Q'
				config.consumer_secret = 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
				config.oauth_token = p[:oauth_token]
				config.oauth_token_secret = p[:oauth_token_secret]
			end
			
			begin
				opponent_name = Twitter.user(opponent.to_i).screen_name
			rescue => e
				response = "Error: failed to set Twitter opponent name" 
				message = e.message
			end
			
			if request.params['approve_tweet'].to_i === 1
				response = "@#{opponent_name} I'm battling my Critter against yours, go to http://crittr.me/critter/#{opponent_name} to retaliate!"
				begin
					Twitter.update(response)
				rescue Twitter::Error => e
					response = "Error: " << e.message
				rescue => e
					response = "Error: failed to tweet from user"
					message = e.message
				end
			elsif request.params['update'].to_i === 1
				#update 
				weapon = request.params['weapon']
				response = fight.filter(:uid => uid).update(:status => 'ready', :weapon => weapon)
			
			elsif request.params['attribute'] and request.params['hash']
				
				you = fight.filter(:uid => uid).first
					
				if request.params['hash'].to_i === you[:start]
					
					attribute = request.params['attribute']
					opponent = you[:opponent]
					attrib = {}
					type = ''
					DB.fetch("SELECT #{attribute} FROM critters WHERE uid = ?", opponent) { |row| attrib = row }
					attrib.each { |key, value| type = value.to_s };
					
					#insert value into own critter						
					DB[:critters].filter(:uid => uid).update(attribute => type)
					you.update(:start => 0)
					critter = DB[:critters].filter(:uid => uid).select(:name, :arms, :eye_colour, :ears, :mouth, :legs, :face, :hands, :nose, :body_colour, :body, :body_type, :accessory, :uid).first					
					require 'yajl'
					critter = Yajl::Encoder.encode(critter)
					DB[:critters].filter(:uid => uid).update(:critter => critter)
					response = critter
				elsif request.params['friend']
					#send message to frind telling them that they've been hugged!
					
					
				else
					abort("Error: hash does not match")
				end
			
			else
				#start new fight
				weapon = request.params['weapon']
				
				begin
					check_opp = fight.filter(:uid => opponent).first
					
					if check_opp === nil
						
						time = Time.now.to_i
						
						fight.insert(:uid => uid, :status => 'ready', :opponent => opponent, :weapon => weapon, :start => time)
						fight.insert(:uid => opponent, :status => 'waiting', :opponent => uid, :start => time)
														
						response = "@#{opponent_name} I'm battling my Critter against yours, go to http://crittr.me/critter/#{opponent_name} to retaliate!"
					else 
						response = "Error: Opponent is already in a battle"
					end
				rescue => e
					#already battling, send message to user via flash
					response = "Error: You are already in a battle"
					message = e.message
				end
			end
		elsif request.delete?
			#remove fight
			#if opponent's opponent is you then delete their fight too to avoid broken fights
			begin
				you = fight.filter(:uid => uid).first
				opp = you[:opponent]
				DB.transaction do
					fight.where(:uid => opp).delete
					response = fight.filter(:uid => uid).delete
				end
			rescue => e
				response = "Error: Unable to hug"
				message = e.message
			end
		end
		
		message = {"response" => response, "detail" => message}
		@response = Yajl::Encoder.encode(message)
	end
end