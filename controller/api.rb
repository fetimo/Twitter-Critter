require 'twitter'
require 'yajl'

class ApiController < Controller
	
	map '/api'
	
	helper :aspect
		
	layout do |path|
		if path === 'critters' || path === 'battle'
			:api
		end
	end
	
	before_all do
		DB.disconnect
		unless DB.test_connection
			DB.connect(
				:adapter=>'mysql2', 
				:host=>'mysql.fetimo.com', 
				:database=>'twittercritter', 
				:user=>'fetimocom1', 
				:password=>'iBMbSSIz' 
			)
		end
	end
	
	after_all do
		DB.disconnect
	end
	
	def critters (username)
		response['Content-Type'] = 'application/json'
		
		username.delete!('@')
		logger = Ramaze::Logger::RotatingInformer.new('./log')
		if request.get?
			
			begin
				critters = DB[:critters]
				critter = critters.filter(:name => username).first
				if request.params['mood']
					@response = critter[:sentiment]
					return Yajl::Encoder.encode(@response)
				else
					@response = critter[:critter]
				end				
			rescue => error
				logger.info "error in fetching critter api.rb:21"
				logger.debug critters
				logger.debug critter
				logger.error error.message
			end
		elsif request.post?
			unless request.cookies.empty?
				if request.params['invitee']
					invitee = request.params['invitee']
					invitee.delete!('@')
					
					critter_exist = 0
					begin
						DB[:critters].filter(:uid => username).each do |row|
							critter_exist += 1
						end
					rescue => e
						logger.info "checking critter exists api.rb:69"
						logger.info e.message
					end
					
					sleep 1.5 #allow for db to be queried
					
					if critter_exist === 0
					
						#check if invitee is a twitter user
						Twitter.configure do |config|
							config.consumer_key = 'DQicogvXxpbW7oleCfV3Q'
							config.consumer_secret = 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
							config.oauth_token = session[:access_token][:oauth_token]
							config.oauth_token_secret = session[:access_token][:oauth_token_secret]
						end
						
						begin
							Twitter.user(invitee)
							if username == invitee
								@response = 'Error: There\'s no sense in inviting yourself!'
							else
								Twitter.update("@#{invitee} join me on http://crittr.me/ :)")
								@response = "all ok"
							end
							
						rescue Twitter::Error::NotFound
							@response = "Error: Twitter user not found"
						rescue Twitter::Error
							@response = "Error: There was a problem with Twitter"
						rescue
							@response = "Error: There was an error"
						end
					else
						@response = "Error: This person is already on Critter"
					end
					
				else
					begin
						critters = DB[:critters]
						@response = critters.filter(:name => username).delete
					rescue => e
						logger.info "error in deleting critter api.rb:81"
						logger.debug critters
						logger.debug @response
						logger.error e.message
					end
					
					@default_critter = {
						#default values
						:name => 'Steve',
						:arms => 'short',
						:eye_colour => 'blue',
						:nose => 'none',
						:legs => 'short',
						:ears => 'none',
						:face => 'none',
						:hands => 'none',
						:mouth => 'plain',
						:accessory => 'none',
						:body => 'plain',
						:body_colour => 'orange',
						:body_type => 'simple',
						:critter => '',
						:uid => 0
					}
					
					require File.join(File.dirname(__FILE__), 'critter_algorithm')
					
					begin
						@data = Twitter.user_timeline(username).first.text
						user_info = Twitter.users(username)
						uid = user_info[0].id
					rescue
						#useful for if user 404s or Twitter offline
						redirect MainController.r(:critter, @user[:username])
					end
					
					generate = Critter.new(@data, username, @default_critter, uid)
					@response = generate.critter
				end
			end
		end
		@response 
	end
	
	def battle
		response['Content-Type'] = 'application/json'
		logger = Ramaze::Logger::RotatingInformer.new('./log')
		unless request.cookies.empty?
			fight = DB[:interactions]
			uid = request.params['uid']
			
			if request.get? 
				#get fight details of requested critter
				response = fight.filter(:uid => uid.to_i).first
				
			elsif request.post?
				opponent = request.params['opponent']
														
				Twitter.configure do |config|
					config.consumer_key = 'DQicogvXxpbW7oleCfV3Q'
					config.consumer_secret = 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6o'
					config.oauth_token = session[:access_token][:oauth_token]
					config.oauth_token_secret = session[:access_token][:oauth_token_secret]
				end
				
				begin
					if opponent 
						opponent_name = Twitter.user(opponent.to_i).screen_name
					end
				rescue => e
					response = "Error: failed to set Twitter opponent name :(" 
					message = e.message
				end
				
				if request.params['approve_tweet'].to_i === 1
					response = "@#{opponent_name} I'm battling my Critter against yours, go to http://crittr.me/critter/#{opponent_name} to retaliate!"
					begin
						Twitter.update(response)
					rescue Twitter::Error => e
						response = "Error: " << e.message
					rescue => e
						response = "Error: failed to tweet from user :("
						message = e.message
					end
				elsif request.params['victory_tweet']
					response = "My Critter won against @#{opponent_name} at http://crittr.me/ !"
					begin
						Twitter.update(response)
					rescue Twitter::Error => e
						response = "Error: " << e.message
					rescue => e
						response = "Error: failed to tweet from user :("
						message = e.message
					end
				elsif request.params['update'].to_i === 1
					#update 
					weapon = request.params['weapon']
					response = fight.filter(:uid => uid).update(:status => 'ready', :weapon => weapon)
				elsif request.params['stopFighting']
					begin
						DB.transaction do
							fight.where(:uid => opponent).update(:status => nil, :weapon => nil, :opponent => nil, :start => nil)
							fight.where(:uid => uid).update(:status => nil, :weapon => nil, :opponent => nil, :start => nil)
						end
						
						response = "Successfully stopped fighting"
					
					rescue => e
						response = "Error: Unable to stop fighting"
						logger.info response
						message = e.message
						logger.debug message
					end
				elsif request.params['updateStart']
					begin
						DB.transaction do
							fight.where(:uid => opponent).update(:start => Time.now)
							fight.where(:uid => uid).update(:start => Time.now)
						end
						
						response = "Successfully updated start time"
					rescue => e
						response = "Error: Unable to update start time"
						logger.info response
						message = e.message
						logger.debug message
					end	
				elsif request.params['attribute'] and request.params['hash']
					
					you = fight.filter(:uid => uid).first
						
					if Time.at(request.params['hash'].to_i) === you[:start] && request.params['attribute']
						
						attribute = request.params['attribute']
						opponent = you[:opponent]
						attrib = {}
						type = ''
						begin
							#update opponent's status to be lose
							fight.where(:uid => opponent).update(:status => 'lose')
							
							DB.fetch("SELECT #{attribute} FROM critters WHERE uid = ?", opponent) { |row| attrib = row }
							attrib.each { |key, value| type = value.to_s };
							
							#insert value into own critter						
							DB[:critters].filter(:uid => uid).update(attribute => type)
							you.update(:start => nil)
							critter = DB[:critters].filter(:uid => uid).select(:name, :arms, :eye_colour, :ears, :mouth, :legs, :face, :hands, :nose, :body_colour, :body, :body_type, :accessory, :uid).first					
							critter = Yajl::Encoder.encode(critter)
							DB[:critters].filter(:uid => uid).update(:critter => critter)
							fight.where(:uid => uid).update(:status => nil, :opponent => nil, :weapon => nil, :start => nil)
							response = critter
						rescue
							sleep 1
							retry
						end
					else
						response = abort("Error: hashes do not match >_<")
					end
				elsif request.params['friend']
					#send message to frind telling them that they've been hugged!
					uid = request.params['uid']
					begin
						username = Twitter.user(uid.to_i).screen_name
						friend = request.params['friend'].to_i
						
						critter_exist = 0
			
						fight.filter(:uid => friend).each do |row|
							critter_exist += 1
							if critter_exist === 1
								break
							end
						end
											
						if critter_exist === 0
							fight.insert(:uid => friend)
						end
						
						# this is really, really bad
						DB.run "UPDATE interactions SET hugged_by = CONCAT(COALESCE(hugged_by, ''), '#{username},') WHERE uid = #{friend}"
						
						response = "Successfully hugged!"
					rescue => e
						response = e.message
					end					
				else
					#start new fight
					weapon = request.params['weapon']
					begin
						check_opp = fight.filter(:uid => opponent).first
						check_you = fight.filter(:uid => uid).first
						
						#checks to see if you and/or your opponent already exists in the table
						#if not then it creates an entry with only the uid
						
						if check_opp === nil
							fight.insert(:uid => opponent)
							check_opp = fight.filter(:uid => opponent).first
						end
						
						if check_you === nil
							fight.insert(:uid => uid)
							check_you = fight.filter(:uid => uid).first
						end
						
						if check_opp[:opponent] === nil && check_you[:opponent] === nil
							
							time = Time.now
							
							critter_exist = 0
							
							fight.filter(:uid => uid).each do |row|
								critter_exist += 1
							end
							
							if critter_exist === 0
								fight.insert(:uid => uid, :status => 'ready', :opponent => opponent, :weapon => weapon, :start => time)
							else
								fight.where(:uid => uid).update(:status => 'ready', :opponent => opponent, :weapon => weapon, :start => time)
							end
							
							fight.where(:uid => opponent).update(:status => 'waiting', :opponent => uid, :start => time)
							
							response = "@#{opponent_name} I'm battling my Critter against yours, go to http://crittr.me/critter/#{opponent_name} to retaliate!"
						else 
							response = "Error: You or your opponent is already in a battle, you're not allowed more than one fight at a time - that's just mean!"
						end
					rescue => e
						#already battling, send message to user via flash
						response = "Error: You are already in a battle!"
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
						response = fight.where(:uid => uid).delete
					end
				rescue => e
					response = "Error: Unable to remove fight :("
					message = e.message
				end
				
			elsif request.patch?
				#update fight details
				begin
					you = fight.filter(:uid => uid).first
					opp = you[:opponent]
					DB.transaction do
						fight.where(:uid => opp).update(:status => nil, :weapon => nil, :opponent => nil, :start => nil, :ran_away => uid)
						fight.where(:uid => uid).update(:status => nil, :weapon => nil, :opponent => nil, :start => nil)
					end
					response = "Successfully updated"
				rescue => e
					response = "Error: Unable to run away :("
					message = e.message
				end
			end
			message = {"response" => response, "detail" => message}
			@response = Yajl::Encoder.encode(message)
		end
	end
end
